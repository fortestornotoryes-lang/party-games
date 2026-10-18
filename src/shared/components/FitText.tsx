import React, { useLayoutEffect, useRef } from 'react';

type FitTextTag = 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span' | 'div';

interface FitTextProps {
  children: React.ReactNode;
  as?: FitTextTag;
  /** Типографика (размер шрифта задаёт максимум — текст только уменьшается) */
  className?: string;
  style?: React.CSSProperties;
  /** Нижняя граница размера, px: ниже слово уже переносится по буквам */
  minFontSize?: number;
}

/** Запас, чтобы слово не упиралось в самый край блока (наклон italic, tracking) */
const FIT_RATIO = 0.96;
const DEFAULT_MIN_FONT_SIZE = 16;
const FIT_PASSES = 3;

const px = (value: string) => parseFloat(value) || 0;

/** Горизонтальные margin + border + padding элемента */
const horizontalExtras = (el: HTMLElement) => {
  const cs = getComputedStyle(el);
  return (
    px(cs.marginLeft) +
    px(cs.marginRight) +
    px(cs.borderLeftWidth) +
    px(cs.borderRightWidth) +
    px(cs.paddingLeft) +
    px(cs.paddingRight)
  );
};

/** Горизонтальные margin элемента */
const marginsOf = (el: HTMLElement) => {
  const cs = getComputedStyle(el);
  return px(cs.marginLeft) + px(cs.marginRight);
};

/**
 * Ширина, которую текст реально может занять на экране.
 *
 * Предки в flex-колонке с `items-center` растягиваются под самое длинное слово (min-content)
 * и вылезают за родителя, поэтому собственная ширина элемента ничего не говорит.
 * Поднимаемся по всей цепочке предков: каждый контейнер даёт предел «его внутренняя ширина
 * минус отступы всех блоков между ним и текстом», берём самый жёсткий.
 */
const availableWidth = (el: HTMLElement): number => {
  const elCs = getComputedStyle(el);
  let extras = px(elCs.marginLeft) + px(elCs.marginRight);
  // собственная ширина учитывается для flex-строк, где элемент делит место с соседями
  let limit = el.offsetWidth;
  for (let node = el.parentElement; node; node = node.parentElement) {
    const cs = getComputedStyle(node);
    // inline-предок не задаёт ширины — его содержимое живёт в ближайшем блочном контейнере
    if (cs.display === 'inline' || cs.display === 'contents') continue;
    const inner = node.clientWidth - px(cs.paddingLeft) - px(cs.paddingRight);
    limit = Math.min(limit, inner - extras);
    extras += horizontalExtras(node);
  }
  return limit;
};

/** Текст самого элемента: собственные текстовые узлы (вложенные элементы — глитч-слои и т.п. — не считаем) */
const ownText = (el: HTMLElement): string => {
  const own = Array.from(el.childNodes)
    .filter((node) => node.nodeType === Node.TEXT_NODE)
    .map((node) => node.textContent ?? '')
    .join('');
  return own.trim() ? own : (el.textContent ?? '');
};

/** Строка → куски, между которыми браузер может сделать перенос (пробелы, дефисы) */
const breakableParts = (text: string): string[] =>
  text.match(/[^\s\-‐‑–—]+[\s\-‐‑–—]*/g) ?? [];

/**
 * Ширина самого длинного слова (border-box элемента) при текущем размере шрифта.
 * Мерим скрытым «зондом» внутри элемента: он наследует шрифт, letter-spacing и text-transform,
 * и не зависит от раскладки (width/flex-basis самого элемента для замера не годятся).
 */
const longestWordWidth = (el: HTMLElement): number => {
  const probe = document.createElement('span');
  probe.style.cssText = 'position:absolute;visibility:hidden;white-space:nowrap;pointer-events:none';
  el.appendChild(probe);
  let widest = 0;
  for (const part of breakableParts(ownText(el))) {
    probe.textContent = part.trim();
    // offsetWidth, а не getBoundingClientRect: последний учитывает CSS-transform (анимация
    // появления scale 0.84 → 1) и занижает ширину, а доступное место мы меряем без transform
    widest = Math.max(widest, probe.offsetWidth);
  }
  el.removeChild(probe);
  return widest + (horizontalExtras(el) - marginsOf(el));
};

/**
 * Текст, который не вылезает за экран: если самое длинное слово шире доступного места,
 * размер шрифта уменьшается пропорционально. Короткие слова и фразы остаются в исходном
 * размере, многословные фразы переносятся по пробелам.
 *
 * Зачем: `overflow-wrap: break-word` не уменьшает min-content, поэтому в flex-колонке
 * с `items-center` блок растягивается под слово и обрезается с обеих сторон.
 */
export const FitText: React.FC<FitTextProps> = ({
  children,
  as: Tag = 'span',
  className,
  style,
  minFontSize = DEFAULT_MIN_FONT_SIZE,
}) => {
  const ref = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const fit = () => {
      el.style.fontSize = '';
      el.style.overflowWrap = '';
      let size = parseFloat(getComputedStyle(el).fontSize);
      for (let pass = 0; pass < FIT_PASSES; pass++) {
        const need = longestWordWidth(el);
        const avail = availableWidth(el);
        if (avail <= 0 || need <= avail) return;
        size = Math.max(minFontSize, (size * avail * FIT_RATIO) / need);
        el.style.fontSize = `${size}px`;
        if (size === minFontSize) break;
      }
      // дошли до минимума, а слово всё ещё шире — переносим по буквам
      if (longestWordWidth(el) > availableWidth(el)) el.style.overflowWrap = 'anywhere';
    };

    fit();
    // реагируем только на смену ширины: сама подгонка меняет высоту блока
    let lastWidth = el.parentElement?.clientWidth ?? 0;
    const observer = new ResizeObserver(() => {
      const width = el.parentElement?.clientWidth ?? 0;
      if (width === lastWidth) return;
      lastWidth = width;
      fit();
    });
    if (el.parentElement) observer.observe(el.parentElement);
    // Шрифты (Inter/Unbounded с Google Fonts) подгружаются уже после первой подгонки и меняют
    // ширину слова. `fonts.ready` к этому моменту может быть выполнен, поэтому слушаем loadingdone.
    void document.fonts.ready.then(() => {
      fit();
    });
    document.fonts.addEventListener('loadingdone', fit);
    // поворот экрана: родитель-«shrink-to-fit» может не сменить ширину, а места стало больше
    window.addEventListener('resize', fit);
    return () => {
      observer.disconnect();
      document.fonts.removeEventListener('loadingdone', fit);
      window.removeEventListener('resize', fit);
    };
  }, [children, className, minFontSize]);

  return React.createElement(
    Tag,
    { ref, style, className: `block max-w-full min-w-0 ${className ?? ''}` },
    children
  );
};
