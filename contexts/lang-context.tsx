'use client'

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import type { Lang } from '@/types'
import { t, type Translations } from '@/lib/i18n'

interface LangContextValue {
  lang: Lang
  setLang: (lang: Lang) => void
  tr: Translations
}

const LangContext = createContext<LangContextValue>({
  lang: 'ru',
  setLang: () => {},
  tr: t('ru'),
})

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>('ru')

  useEffect(() => {
    try {
      const saved = localStorage.getItem('lang') as Lang | null
      if (saved === 'ru' || saved === 'kz') setLangState(saved)
    } catch {}
  }, [])

  function setLang(l: Lang) {
    setLangState(l)
    try {
      localStorage.setItem('lang', l)
    } catch {}
  }

  return (
    <LangContext.Provider value={{ lang, setLang, tr: t(lang) }}>
      {children}
    </LangContext.Provider>
  )
}

export function useLang() {
  return useContext(LangContext)
}
