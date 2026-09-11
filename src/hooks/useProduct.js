import { useState, useCallback, useEffect } from 'react'
import { getAllListings } from '../store/listingsStore'
import { useFavorites } from './useFavorites'
import { useViewHistory } from './useViewHistory'

export function useProduct(id) {
  const item = getAllListings().find(l => l.id === Number(id)) || null
  const itemId = item?.id
  const { push } = useViewHistory()

  useEffect(() => {
    if (itemId) push(itemId)
  }, [itemId, push])
  const [activeImage, setActiveImage] = useState(0)
  const [showDelivery, setShowDelivery] = useState(false)
  const [showAllSpecs, setShowAllSpecs] = useState(false)
  const { isFavorite, toggleFavorite } = useFavorites()

  const prevImage = useCallback(() => {
    if (!item) return
    setActiveImage(i => (i - 1 + item.images.length) % item.images.length)
  }, [item])

  const nextImage = useCallback(() => {
    if (!item) return
    setActiveImage(i => (i + 1) % item.images.length)
  }, [item])

  const specs = item ? [
    { label: 'Стан', value: item.condition },
    ...(item.os ? [{ label: 'Операційна система', value: item.os }] : []),
    ...(item.screen ? [{ label: 'Діагональ екрану', value: item.screen }] : []),
    ...(item.storage ? [{ label: "Вбудована пам'ять", value: item.storage }] : []),
    ...(item.color ? [{ label: 'Колір', value: item.color }] : []),
    { label: 'Місцезнаходження', value: item.location },
  ] : []

  const visibleSpecs = showAllSpecs ? specs : specs.slice(0, 4)

  return {
    item,
    activeImage, setActiveImage, prevImage, nextImage,
    isLiked: item ? isFavorite(item.id) : false,
    toggleLike: (e) => item && toggleFavorite(item.id, e),
    showDelivery, setShowDelivery,
    showAllSpecs, setShowAllSpecs,
    specs, visibleSpecs,
  }
}
