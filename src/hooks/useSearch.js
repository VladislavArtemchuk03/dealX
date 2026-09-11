import { useState, useMemo, useCallback } from 'react'
import { getAllListings } from '../store/listingsStore'

export function useSearch(initialQuery = '') {
  const [query, setQuery] = useState(initialQuery)
  const [sort, setSort] = useState('new')
  const [priceMin, setPriceMin] = useState('')
  const [priceMax, setPriceMax] = useState('')
  const [conditionFilter, setConditionFilter] = useState('')

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    let list = getAllListings().filter(l => {
      const matchesQuery = !q || l.title.toLowerCase().includes(q) || l.category.toLowerCase().includes(q) || l.location.toLowerCase().includes(q)
      const matchesMin = !priceMin || l.price >= Number(priceMin)
      const matchesMax = !priceMax || l.price <= Number(priceMax)
      const matchesCondition = !conditionFilter || l.condition === conditionFilter
      return matchesQuery && matchesMin && matchesMax && matchesCondition
    })
    return [...list].sort((a, b) => {
      if (sort === 'price_asc') return a.price - b.price
      if (sort === 'price_desc') return b.price - a.price
      if (sort === 'popular') return b.views - a.views
      return b.id - a.id
    })
  }, [query, sort, priceMin, priceMax, conditionFilter])

  const clearFilters = useCallback(() => {
    setPriceMin('')
    setPriceMax('')
    setConditionFilter('')
    setSort('new')
  }, [])

  const hasActiveFilters = Boolean(priceMin || priceMax || conditionFilter || sort !== 'new')

  return {
    query, setQuery,
    sort, setSort,
    priceMin, setPriceMin,
    priceMax, setPriceMax,
    conditionFilter, setConditionFilter,
    results,
    clearFilters,
    hasActiveFilters,
  }
}
