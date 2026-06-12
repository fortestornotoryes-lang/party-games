import {useEffect, useRef, useState} from 'react';
import type {Dispatch, SetStateAction} from 'react';

import {sessionService} from '../services/sessionService';


/**
 * Кодек для значений, которые нельзя сериализовать в JSON напрямую
 * (Set, Map и т.п.). save → JSON-представление, load → обратно.
 */
export interface PersistCodec<T> {
    save: (value: T) => unknown;
    load: (raw: unknown) => T;
}

/**
 * Drop-in замена useState с персистенцией в сессию игры (sessionService).
 *
 * При маунте значение восстанавливается из localStorage (если сессия есть),
 * при каждом изменении — сохраняется. Сессия очищается при старте новой
 * партии из Setup, поэтому восстановление срабатывает только после
 * перезагрузки страницы посреди игры.
 *
 * @param gameKey игра, к сессии которой привязано поле
 * @param field   уникальное в рамках игры имя поля
 * @param initial начальное значение (или ленивый инициализатор)
 * @param codec   опциональный кодек для несериализуемых типов
 */
export function usePersistedState<T>(
    gameKey: string,
    field: string,
    initial: T | (() => T),
    codec?: PersistCodec<T>
): [T, Dispatch<SetStateAction<T>>] {
    const [value, setValue] = useState<T>(() => {
        const raw = sessionService.getField(gameKey, field);
        if (raw !== undefined) {
            try {
                return codec ? codec.load(raw) : (raw as T);
            } catch {
                // битое значение — игнорируем, стартуем с initial
            }
        }
        return typeof initial === 'function' ? (initial as () => T)() : initial;
    });

    useEffect(() => {
        sessionService.saveField(gameKey, field, codec ? codec.save(value) : value);
        // codec намеренно не в deps: на колл-сайтах это инлайн-литерал
        // с неизменной семантикой, его включение вызывало бы запись на каждый рендер.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [gameKey, field, value]);

    return [value, setValue];
}

/**
 * Восстановление таймера после перезагрузки страницы.
 *
 * Сохраняет timeLeft в сессию на каждом тике; при маунте, если игра
 * была в «играющей» фазе (resumeRunning), перезапускает таймер
 * с сохранённого значения.
 */
export function usePersistedTimer(
    gameKey: string,
    field: string,
    timer: {timeLeft: number; start: () => void; reset: (newTime?: number) => void},
    resumeRunning: boolean
) {
    // Сохранённое значение читаем лениво при маунте — до того,
    // как save-эффект ниже перезапишет его свежим timeLeft.
    const [savedOnMount] = useState<unknown>(() => sessionService.getField(gameKey, field));

    const resumedRef = useRef(false);
    useEffect(() => {
        if (resumedRef.current) return;
        resumedRef.current = true;
        if (!resumeRunning) return;
        if (typeof savedOnMount === 'number' && savedOnMount > 0) timer.reset(savedOnMount);
        timer.start();
        // Только при маунте: восстановление отсчёта после перезагрузки.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        sessionService.saveField(gameKey, field, timer.timeLeft);
    }, [gameKey, field, timer.timeLeft]);
}
