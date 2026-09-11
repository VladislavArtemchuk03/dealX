import { useEffect, useState } from 'react'

export default function OptimizedImage({ src, alt, loading = 'lazy', fetchPriority, ...props }) {
  const [imageSrc, setImageSrc] = useState(src)

  useEffect(() => {
    setImageSrc(src)
  }, [src])

  return (
    <img
      {...props}
      src={imageSrc || '/placeholder.svg'}
      alt={alt}
      loading={loading}
      decoding="async"
      fetchPriority={fetchPriority}
      onError={() => setImageSrc('/placeholder.svg')}
    />
  )
}