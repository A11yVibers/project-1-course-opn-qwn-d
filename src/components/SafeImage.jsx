import { useState } from 'react'

/**
 * Renders a remote image and degrades to a CSS-only placeholder if the URL
 * fails or is still loading. We never create or embed image files, so the
 * fallback is pure CSS/SVG plus an optional text monogram.
 */
export default function SafeImage({
  src,
  alt = '',
  className = '',
  monogram = '',
  glyph = null,
  imgClassName = '',
}) {
  const [status, setStatus] = useState(src ? 'loading' : 'error')

  if (!src || status === 'error') {
    return (
      <div className={`img-fallback ${className}`} role="img" aria-label={alt || 'Image unavailable'}>
        {glyph ? (
          <span className="glyph">{glyph}</span>
        ) : (
          <span className="mono">{monogram || '—'}</span>
        )}
      </div>
    )
  }

  return (
    <>
      {status === 'loading' && (
        <div className={`img-fallback ${className}`} aria-hidden="true">
          <span className="mono">{monogram || ''}</span>
        </div>
      )}
      <img
        src={src}
        alt={alt}
        className={imgClassName}
        loading="lazy"
        referrerPolicy="no-referrer"
        style={status === 'loading' ? { position: 'absolute', opacity: 0 } : undefined}
        onLoad={() => setStatus('loaded')}
        onError={() => setStatus('error')}
      />
    </>
  )
}
