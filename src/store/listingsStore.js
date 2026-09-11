import { LISTINGS } from '../data/listings'

const STORE_KEY = 'dealx_listings'

export function getUserListings() {
  try {
    const stored = localStorage.getItem(STORE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

function setUserListings(list) {
  localStorage.setItem(STORE_KEY, JSON.stringify(list))
}

export function saveUserListing(form) {
  const existing = getUserListings()
  const newListing = {
    id: Date.now(),
    title: form.title,
    price: Number(form.price) || 0,
    negotiable: form.negotiable,
    location: form.location,
    condition: form.condition,
    category: form.category,
    subcategory: form.subcategory,
    description: form.description,
    images: form.photos.length > 0 ? form.photos : ['https://images.unsplash.com/photo-1560343090-f0409e92791a?w=400&h=400&fit=crop'],
    views: 0,
    likes: 0,
    seller: { name: 'Олександр', rating: 4.8, reviews: 23, since: 'березень 2018', avatar: 'https://i.pravatar.cc/150?img=32' },
    isUserListing: true,
    paused: false,
    createdAt: Date.now(),
  }
  setUserListings([newListing, ...existing])
  return newListing
}

export function updateUserListing(id, fields) {
  const list = getUserListings().map(l => l.id === id ? { ...l, ...fields } : l)
  setUserListings(list)
}

export function deleteUserListing(id) {
  setUserListings(getUserListings().filter(l => l.id !== id))
}

export function getAllListings() {
  // paused user listings are hidden from the public feed
  return [...getUserListings().filter(l => !l.paused), ...LISTINGS]
}

export function getAllUserListings() {
  return getUserListings()
}
