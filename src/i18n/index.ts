import React, {createContext, useCallback, useContext, useState} from 'react';

import {storageService} from '../services/storageService';

import {en} from './en';
import {ru} from './ru';
import type {Lang, Translations} from './types';


const TRANSLATIONS: Record<Lang, Translations> = {ru, en};

// ── Helpers ───────────────────────────────────────────────────────────────────

function resolve(obj: Record<string, unknown>, path: string): string {
    const value = path.split('.').reduce<unknown>((acc, key) => {
        if (acc !== null && typeof acc === 'object') {
            return (acc as Record<string, unknown>)[key];
        }
        return undefined;
    }, obj);
    return typeof value === 'string' ? value : path;
}

function interpolate(str: string, vars?: Record<string, string | number>): string {
    if (!vars) return str;
    return str.replace(/\{\{(\w+)\}\}/g, (_, key) => String(vars[key] ?? ''));
}

// ── Context ───────────────────────────────────────────────────────────────────

interface LanguageContextValue {
    lang: Lang;
    setLang: (lang: Lang) => void;
    t: (path: string, vars?: Record<string, string | number>) => string;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

// ── Provider ──────────────────────────────────────────────────────────────────

export function LanguageProvider({children}: { children: React.ReactNode }) {
    const [lang, setLangState] = useState<Lang>(() => {
        const saved = storageService.getSettings().language;
        return (saved === 'en' ? 'en' : 'ru');
    });

    const setLang = useCallback((next: Lang) => {
        setLangState(next);
        storageService.saveSettings({language: next});
    }, []);

    const t = useCallback(
        (path: string, vars?: Record<string, string | number>): string => {
            const translations = TRANSLATIONS[lang] as unknown as Record<string, unknown>;
            const str = resolve(translations, path);
            return interpolate(str, vars);
        },
        [lang]
    );

    return React.createElement(LanguageContext.Provider, {value: {lang, setLang, t}}, children);
}

// ── Hooks ─────────────────────────────────────────────────────────────────────

/** Полный доступ: t(), lang, setLang */
export function useLanguage(): LanguageContextValue {
    const ctx = useContext(LanguageContext);
    if (!ctx) throw new Error('useLanguage must be used inside <LanguageProvider>');
    return ctx;
}

/** Краткий алиас — только t() и lang для компонентов без смены языка */
export function useTranslation() {
    const {t, lang} = useLanguage();
    return {t, lang};
}
