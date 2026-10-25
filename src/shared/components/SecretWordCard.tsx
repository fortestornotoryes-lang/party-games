import { Fingerprint } from 'lucide-react';
import { motion } from 'motion/react';
import React, { useState } from 'react';

import { FitText } from '@/shared/components/FitText';
import { PrimaryButton } from '@/shared/components/PrimaryButton';
import { Typography } from '@/shared/components/Typography';
import { useTranslation } from '@/shared/i18n';
import { NS } from '@/shared/i18n/keys';
import { rgba } from '@/shared/theme/colors';
import type { GameTheme } from '@/shared/types';

interface SecretWordCardProps {
  /** Чей секрет; без него — только подпись (имя уже есть на экране) */
  playerName?: string;
  /** Что показываем: «Твоё слово», «Секретная локация», «Секретная роль» */
  label: string;
  /** Главное — слово, локация или роль */
  word: string;
  /** Дополнительное (категория, роль, подсказка) — прячется вместе со словом */
  details?: React.ReactNode;
  accent: GameTheme;
  /** Подпись кнопки «дальше» — активна после первого просмотра */
  doneLabel: string;
  onDone: () => void;
}

const CARD_BG = 'linear-gradient(160deg, #1b1630 0%, #0d0a18 100%)';
const DISPLAY = 'font-black italic uppercase tracking-tighter';
const PEEK_FADE_S = 0.12;
const COVER_SLIDE_S = 0.18;

/**
 * Показ секрета после передачи телефона: слово видно, только пока палец на карточке.
 * Плашка одной ширины для любого слова не выдаёт его длину.
 * Все роли одной раздачи должны показываться этой карточкой: иначе по тому,
 * держит ли игрок палец, со стороны видно, у кого особая роль.
 */
export const SecretWordCard: React.FC<SecretWordCardProps> = ({
  playerName,
  label,
  word,
  details,
  accent,
  doneLabel,
  onDone,
}) => {
  const { t } = useTranslation();
  const [peeking, setPeeking] = useState(false);
  const [seen, setSeen] = useState(false);

  const show = () => {
    setPeeking(true);
    setSeen(true);
  };
  const hide = () => {
    setPeeking(false);
  };

  return (
    <div className="flex w-full flex-col gap-6">
      <button
        type="button"
        onPointerDown={show}
        onPointerUp={hide}
        onPointerLeave={hide}
        onPointerCancel={hide}
        onKeyDown={(e) => {
          if (e.key === ' ' || e.key === 'Enter') show();
        }}
        onKeyUp={hide}
        onBlur={hide}
        onContextMenu={(e) => {
          e.preventDefault();
        }}
        className="rounded-premium-2xl relative w-full touch-none overflow-hidden px-7 pt-9 pb-8 text-left select-none [-webkit-touch-callout:none] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
        style={{
          background: `radial-gradient(circle at 50% 0%, ${rgba(accent, 0.22)}, transparent 65%), ${CARD_BG}`,
          border: `1.5px solid ${rgba(accent, 0.4)}`,
          boxShadow: `0 0 70px ${rgba(accent, 0.18)}, var(--shadow-card), inset 0 1px 0 ${rgba(accent, 0.14)}`,
        }}
      >
        {/* Неоновая планка сверху */}
        <span
          aria-hidden
          className="absolute inset-x-10 top-0 h-[3px] rounded-b-full"
          style={{ background: rgba(accent, 1), boxShadow: `0 0 18px ${rgba(accent, 0.9)}` }}
        />
        <p
          className="text-label font-black tracking-[0.3em] uppercase"
          style={{ color: rgba(accent, 0.85) }}
        >
          {label}
        </p>
        {playerName && (
          <FitText
            as="p"
            minFontSize={14}
            className={`mt-1 text-3xl leading-none text-white/55 ${DISPLAY}`}
          >
            {playerName}
          </FitText>
        )}

        <div className="relative mt-7 flex min-h-28 items-center">
          <motion.div
            className="w-full"
            animate={{ opacity: peeking ? 1 : 0 }}
            transition={{ duration: PEEK_FADE_S }}
          >
            <FitText
              as="p"
              minFontSize={18}
              className={`text-[52px] leading-none text-white ${DISPLAY}`}
              style={{ textShadow: `0 0 32px ${rgba(accent, 0.7)}` }}
            >
              {word}
            </FitText>
          </motion.div>
          <motion.span
            aria-hidden
            className="rounded-premium-sm absolute inset-y-4 left-0 w-[80%] origin-left"
            style={{
              background: `repeating-linear-gradient(-45deg, ${rgba(accent, 0.24)} 0 6px, ${rgba(accent, 0.08)} 6px 12px)`,
              border: `1px solid ${rgba(accent, 0.35)}`,
            }}
            animate={{ scaleX: peeking ? 0 : 1 }}
            transition={{ duration: COVER_SLIDE_S, ease: 'easeOut' }}
          />
        </div>

        {details && (
          <motion.div
            className="mt-4"
            animate={{ opacity: peeking ? 1 : 0 }}
            transition={{ duration: PEEK_FADE_S }}
          >
            {details}
          </motion.div>
        )}

        <div className="mt-7 flex items-center gap-3">
          <span
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full"
            style={{ border: `1.5px solid ${rgba(accent, 0.45)}`, background: rgba(accent, 0.1) }}
          >
            <Fingerprint
              className={`h-6 w-6 ${peeking ? '' : 'animate-breathe'}`}
              style={{
                color: rgba(accent, 1),
                filter: `drop-shadow(0 0 8px ${rgba(accent, 0.7)})`,
              }}
            />
          </span>
          <Typography.Body size="sm" color="muted">
            {peeking ? t(`${NS.COMMON}.peekRelease`) : t(`${NS.COMMON}.peekHint`)}
          </Typography.Body>
        </div>
      </button>

      <PrimaryButton theme={accent} onClick={onDone} disabled={!seen}>
        {doneLabel}
      </PrimaryButton>
    </div>
  );
};

interface SecretDetailProps {
  label: string;
  value: string;
  accent: GameTheme;
}

/** Плашка «подпись — значение» для details карточки (роль, категория, локация) */
export const SecretDetail: React.FC<SecretDetailProps> = ({ label, value, accent }) => (
  <div
    className="rounded-premium-md px-4 py-3"
    style={{ background: rgba(accent, 0.1), border: `1px solid ${rgba(accent, 0.25)}` }}
  >
    <p
      className="text-tag mb-1 font-black tracking-[0.3em] uppercase"
      style={{ color: rgba(accent, 0.7) }}
    >
      {label}
    </p>
    <p className="text-lg leading-tight font-black wrap-anywhere text-white uppercase italic">
      {value}
    </p>
  </div>
);
