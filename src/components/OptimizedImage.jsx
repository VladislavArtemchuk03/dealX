import { useEffect, useState } from 'react'

const placeholderSrc = `${import.meta.env.BASE_URL}placeholder.svg`

export default function OptimizedImage({ src, alt, loading = 'lazy', fetchPriority, ...props }) {
  const [imageSrc, setImageSrc] = useState(src)

  useEffect(() => {
    setImageSrc(src)
  }, [src])

  return (
    <img
      {...props}
      src={imageSrc || placeholderSrc}
      alt={alt}
      loading={loading}
      decoding="async"
      fetchPriority={fetchPriority}
      onError={() => setImageSrc(placeholderSrc)}
    />
  )
}