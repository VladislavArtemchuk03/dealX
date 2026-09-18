import { useState, useMemo, useCallback } from 'react'
import { getAllListings } from '../store/listingsStore'

export function useListings() {
  const [category, setCategory] = useState(null)
  const [sort, setSort] = useState('new')
  // tick змушує повторно читати сховище після публікації оголошення
  const [tick, setTick] = useState(0)
  const refresh = useCallback(() => setTick(t => t + 1), [])

  const filtered = useMemo(() => {
    const all = getAllListings()
    let list = category ? all.filter(l => l.category === category) : all
    return [...list].sort((a, b) => {
      if (sort === 'price_asc') return a.price - b.price
      if (sort === 'price_desc') return b.price - a.price
      if (sort === 'popular') return b.views - a.views
      return b.id - a.id // найновіші
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category, sort, tick])

  const clearFilter = useCallback(() => setCategory(null), [])

  return { listings: filtered, category, setCategory, sort, setSort, clearFilter, refresh }
}
