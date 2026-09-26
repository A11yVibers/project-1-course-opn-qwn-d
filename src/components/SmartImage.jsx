import { useEffect, useState } from 'react'
import { initials } from '../lib/format.js'

export default function SmartImage({ src, alt, className, fallbackClass = '' }) {
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    setFailed(false)
  }, [src])

  if (!src || failed) {
    return (
      <div className={`img-fallback ${className ?? ''} ${fallbackClass}`} role="img" aria-label={alt}>
        <span>{initials(alt) || 'CL'}</span>
      </div>
    )
  }
  return <img src={src} alt={alt} className={className} loading="lazy" onError={() => setFailed(true)} />
}
