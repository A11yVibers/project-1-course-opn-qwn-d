import { useState } from 'react'
import { initials } from './materialMeta'

/**
 * Instructor avatar. Uses the remote photo_url from the data; if it fails to
 * load we fall back to a CSS monogram (no image files are created or stored).
 */
export default function Avatar({ src, name = '', className = 'avatar' }) {
  const [failed, setFailed] = useState(false)

  if (!src || failed) {
    return (
      <span className={`${className}-mono`} aria-hidden="true" title={name}>
        {initials(name)}
      </span>
    )
  }

  return (
    <img
      className={className}
      src={src}
      alt={name}
      loading="lazy"
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
    />
  )
}
