import { FileText, Video, Play, ScrollText, Link2 } from 'lucide-react'

const META = {
  pdf: { label: 'PDF', short: 'Lecture / reading', Icon: FileText, ico: 'ico-pdf', badge: 'badge-pdf' },
  video: { label: 'Video', short: 'Recording', Icon: Video, ico: 'ico-video', badge: 'badge-video' },
  youtube: { label: 'YouTube', short: 'External video', Icon: Play, ico: 'ico-youtube', badge: 'badge-youtube' },
  md: { label: 'Document', short: 'Instructions', Icon: ScrollText, ico: 'ico-md', badge: 'badge-md' },
  link: { label: 'Link', short: 'Resource', Icon: Link2, ico: 'ico-link', badge: 'badge-link' },
}

const FALLBACK = { label: 'Resource', short: 'Material', Icon: FileText, ico: 'ico-link', badge: 'badge-neutral' }

export function getMaterialMeta(kind) {
  return META[kind] || FALLBACK
}

export function initials(name = '') {
  return name
    .replace(/^(Dr\.|Prof\.|Mr\.|Ms\.)\s*/i, '')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() || '')
    .join('')
}

export function monogram(title = '') {
  const words = title.replace(/[^A-Za-z0-9 ]/g, '').split(/\s+/).filter(Boolean)
  if (!words.length) return '—'
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase()
  return (words[0][0] + words[1][0]).toUpperCase()
}
