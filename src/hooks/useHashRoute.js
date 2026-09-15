import { useEffect, useState } from 'react'

export function parseHash(hash) {
  const clean = String(hash ?? '').replace(/^#\/?/, '')
  const parts = clean.split('/').filter(Boolean)
  if (parts[0] === 'course' && parts[1]) {
    return { view: 'course', courseId: decodeURIComponent(parts[1]) }
  }
  return { view: 'catalog' }
}

export function useHashRoute() {
  const [route, setRoute] = useState(() => parseHash(window.location.hash))
  useEffect(() => {
    const onChange = () => setRoute(parseHash(window.location.hash))
    window.addEventListener('hashchange', onChange)
    return () => window.removeEventListener('hashchange', onChange)
  }, [])
  return route
}
