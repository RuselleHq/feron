'use client'

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react'

interface FavoritesContextValue {
  favorites: Set<string>
  toggle: (id: string) => void
  has: (id: string) => boolean
  count: number
}

const FavoritesContext = createContext<FavoritesContextValue>({
  favorites: new Set(),
  toggle: () => {},
  has: () => false,
  count: 0,
})

const KEY = 'metal:favorites:v1'

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<Set<string>>(new Set())

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(KEY) ?? '[]') as string[]
      setFavorites(new Set(saved))
    } catch {}
  }, [])

  const toggle = useCallback((id: string) => {
    setFavorites((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      try {
        localStorage.setItem(KEY, JSON.stringify([...next]))
      } catch {}
      return next
    })
  }, [])

  return (
    <FavoritesContext.Provider value={{ favorites, toggle, has: (id) => favorites.has(id), count: favorites.size }}>
      {children}
    </FavoritesContext.Provider>
  )
}

export function useFavorites() {
  return useContext(FavoritesContext)
}
