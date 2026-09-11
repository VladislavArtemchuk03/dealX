import { useState, useCallback } from 'react'
import { getAllListings } from '../store/listingsStore'

const KEY = 'dealx_viewed'
const MAX = 50

export function useViewHistory() {
  const [ids, setIds] = useState(() => {
    try { return JSON.parse(localStorage.getItem(KEY) || '[]') } catch { return [] }
  })

  const push = useCallback((id) => {
    setIds(prev => {
      const next = [id, ...prev.filter(x => x !== id)].slice(0, MAX)
      localStorage.setItem(KEY, JSON.stringify(next))
      return next
    })
  }, [])

  const clear = useCallback(() => {
    localStorage.removeItem(KEY)
    setIds([])
  }, [])

  const items = ids.map(id => getAllListings().find(l => l.id === id)).filter(Boolean)

  return { ids, items, push, clear }
}
