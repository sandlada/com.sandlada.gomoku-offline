import { createI18n } from 'vue-i18n'
import en from './en.json'
import zhHans from './zh-Hans.json'
import zhHant from './zh-Hant.json'

export type AppLocale = 'en' | 'zh-Hant' | 'zh-Hans'

const saved = localStorage.getItem('gomoku:locale')
const initial: AppLocale = saved === 'zh-Hant' || saved === 'zh-Hans' || saved === 'en' ? saved : 'en'

document.documentElement.lang = initial

export const i18n = createI18n({
    legacy: false,
    locale: initial,
    fallbackLocale: 'en',
    messages: { en, 'zh-Hant': zhHant, 'zh-Hans': zhHans },
})

export const LOCALES: readonly { readonly code: AppLocale; readonly labelKey: string }[] = [
    { code: 'en', labelKey: 'lang.en' },
    { code: 'zh-Hant', labelKey: 'lang.zhHant' },
    { code: 'zh-Hans', labelKey: 'lang.zhHans' },
]
