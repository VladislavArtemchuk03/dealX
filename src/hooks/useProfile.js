import { useState, useCallback } from 'react'

const KEY = 'dealx_profile'

const DEFAULT_PROFILE = {
  name: 'Олександр',
  phone: '+38 (099) 123-45-67',
  email: 'oleksandr@email.com',
  location: 'Київ, Україна',
  avatar: 'https://i.pravatar.cc/150?img=32',
  since: 'березень 2018',
  rating: 4.8,
  reviews: 23,
  bio: '',
}

function load() {
  try { return { ...DEFAULT_PROFILE, ...JSON.parse(localStorage.getItem(KEY) || '{}') } } catch { return DEFAULT_PROFILE }
}

export function useProfile() {
  const [profile, setProfile] = useState(load)

  const updateProfile = useCallback((fields) => {
    setProfile(prev => {
      const next = { ...prev, ...fields }
      localStorage.setItem(KEY, JSON.stringify(next))
      return next
    })
  }, [])

  return { profile, updateProfile }
}
