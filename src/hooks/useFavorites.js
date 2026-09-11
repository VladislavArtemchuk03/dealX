import { useState, useEffect } from 'react'

const STORAGE_KEY = 'dealx_favorites'

export function useFavorites() {
  const [favorites, setFavorites] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      return stored ? JSON.parse(stored) : {}
    } catch {
      return {}
    }
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites))
  }, [favorites])

  const toggleFavorite = (id, e) => {
    e?.stopPropagation()
    setFavorites(prev => ({ ...prev, [id]: !prev[id] }))
  }

  const isFavorite = (id) => Boolean(favorites[id])

  const favoriteIds = Object.keys(favorites).filter(id => favorites[id]).map(Number)

  return { favorites, toggleFavorite, isFavorite, favoriteIds }
}
