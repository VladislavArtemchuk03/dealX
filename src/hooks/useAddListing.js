import { useState, useCallback } from 'react'
import { getAllUserListings, saveUserListing, updateUserListing } from '../store/listingsStore'

const DRAFT_KEY = 'dealx_draft'
const MAX_PHOTO_SIZE = 2 * 1024 * 1024

const INITIAL_FORM = {
  title: '', category: '', subcategory: '', condition: 'Новий',
  description: '', photos: [],
  price: '', negotiable: false, location: 'Київ, Україна', delivery: '', payment: '',
}

const STEP_VALIDATORS = {
  1: (f) => Boolean(f.title && f.category && f.condition),
  2: (f) => Boolean(f.description && f.photos.length > 0),
  3: (f) => Boolean(f.price && f.location.trim()),
  4: () => true,
}

function isReadyToPublish(form) {
  return Object.values(STEP_VALIDATORS).every(validate => validate(form))
}

function listingToForm(listing) {
  return {
    ...INITIAL_FORM,
    ...listing,
    photos: listing.images || [],
    price: String(listing.price || ''),
  }
}

export function useAddListing(editId = null) {
  const [step, setStep] = useState(1)
  const [form, setForm] = useState(() => {
    const listing = editId ? getAllUserListings().find(item => item.id === editId) : null
    if (listing) return listingToForm(listing)
    try {
      const draft = localStorage.getItem(DRAFT_KEY)
      return draft ? JSON.parse(draft) : INITIAL_FORM
    } catch {
      return INITIAL_FORM
    }
  })

  const setField = useCallback((field, value) => {
    setForm(prev => ({ ...prev, [field]: value }))
  }, [])

  const canProceed = STEP_VALIDATORS[step]?.(form) ?? true

  const nextStep = useCallback(() => {
    if (canProceed && step < 4) setStep(s => s + 1)
  }, [canProceed, step])

  const prevStep = useCallback(() => {
    if (step > 1) setStep(s => s - 1)
  }, [step])

  const goToStep = useCallback((n) => {
    if (n < step) setStep(n)
  }, [step])

  const saveDraft = useCallback(() => {
    localStorage.setItem(DRAFT_KEY, JSON.stringify(form))
    return true
  }, [form])

  const publish = useCallback(() => {
    if (!isReadyToPublish(form)) return null
    if (editId) {
      updateUserListing(editId, {
        ...form,
        price: Number(form.price) || 0,
        images: form.photos,
      })
      localStorage.removeItem(DRAFT_KEY)
      setForm(INITIAL_FORM)
      setStep(1)
      return { id: editId }
    }
    const listing = saveUserListing(form)
    localStorage.removeItem(DRAFT_KEY)
    setForm(INITIAL_FORM)
    setStep(1)
    return listing
  }, [editId, form])

  const clearDraft = useCallback(() => {
    localStorage.removeItem(DRAFT_KEY)
    setForm(INITIAL_FORM)
    setStep(1)
  }, [])

  const addPhoto = useCallback((file) => {
    if (!file || !file.type.startsWith('image/') || file.size > MAX_PHOTO_SIZE) return
    const reader = new FileReader()
    reader.onload = () => {
      setForm(prev => prev.photos.length >= 10
        ? prev
        : { ...prev, photos: [...prev.photos, reader.result] })
    }
    reader.readAsDataURL(file)
  }, [])

  const removePhoto = useCallback((index) => {
    setForm(prev => ({ ...prev, photos: prev.photos.filter((_, i) => i !== index) }))
  }, [])

  const reorderPhotos = useCallback((from, to) => {
    setForm(prev => {
      const photos = [...prev.photos]
      const [moved] = photos.splice(from, 1)
      photos.splice(to, 0, moved)
      return { ...prev, photos }
    })
  }, [])

  return {
    step, nextStep, prevStep, goToStep,
    form, setField,
    canProceed,
    saveDraft, publish, clearDraft,
    addPhoto, removePhoto, reorderPhotos,
  }
}
