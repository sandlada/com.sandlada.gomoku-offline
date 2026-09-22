import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export type Locale = 'en' | 'zh-Hant' | 'zh-Hans'
export type Theme = 'light' | 'dark'

const LOCALE_KEY = 'gomoku:locale'
const THEME_KEY = 'gomoku:theme'

const readLocale = (): Locale => {
  const saved = localStorage.getItem(LOCALE_KEY)
  return saved === 'zh-Hant' || saved === 'zh-Hans' || saved === 'en' ? saved : 'en'
}

const readTheme = (): Theme => (localStorage.getItem(THEME_KEY) === 'dark' ? 'dark' : 'light')

export const initialTheme = (): Theme => readTheme()

/** Apply theme to <html>: preset.css renders dark mode under [dark]. */
export const applyTheme = (theme: Theme): void => {
  if (theme === 'dark') document.documentElement.setAttribute('dark', '')
  else document.documentElement.removeAttribute('dark')
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'dark' ? '#0e150f' : '#ffffff')
}

export const useSettingsStore = defineStore('settings', () => {
  const locale = ref<Locale>(readLocale())
  const theme = ref<Theme>(readTheme())

  const setLocale = (next: Locale): void => {
    locale.value = next
  }

  const setTheme = (next: Theme): void => {
    theme.value = next
  }

  watch(locale, (next) => {
    localStorage.setItem(LOCALE_KEY, next)
    document.documentElement.lang = next
  })

  watch(
    theme,
    (next) => {
      localStorage.setItem(THEME_KEY, next)
      applyTheme(next)
    },
    { immediate: false },
  )

  return { locale, theme, setLocale, setTheme }
})
