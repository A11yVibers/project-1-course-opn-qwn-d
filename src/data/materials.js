const urlModules = import.meta.glob('../../project-assets/materials/*', { query: '?url', eager: true })
const rawModules = import.meta.glob('../../project-assets/materials/*.md', { query: '?raw', eager: true })

const ASSET_PREFIX = '../../project-assets/'

export const MATERIAL_TYPES = {
  pdf: { label: 'PDF', icon: 'pdf' },
  video: { label: 'Video', icon: 'video' },
  youtube: { label: 'YouTube', icon: 'video' },
  md: { label: 'Markdown', icon: 'md' },
}

export function materialMeta(type) {
  return MATERIAL_TYPES[type] ?? { label: type ? type.toUpperCase() : 'Resource', icon: 'doc' }
}

export function youTubeId(url) {
  try {
    const u = new URL(url)
    if (u.hostname === 'youtu.be') return u.pathname.slice(1).split('/')[0] || null
    const v = u.searchParams.get('v')
    if (v) return v
    const m = u.pathname.match(/\/(embed|shorts|live)\/([\w-]+)/)
    return m ? m[2] : null
  } catch {
    return null
  }
}

export function youTubeEmbedUrl(url) {
  const id = youTubeId(url)
  return id ? `https://www.youtube-nocookie.com/embed/${id}` : null
}

export function resolveMaterial(row) {
  if (row.material_type === 'youtube') {
    const embedUrl = youTubeEmbedUrl(row.file_path)
    return { embedUrl, sourceUrl: embedUrl ? row.file_path : null, available: Boolean(embedUrl) }
  }
  const key = ASSET_PREFIX + row.file_path
  const url = urlModules[key]?.default ?? null
  const text = rawModules[key]?.default ?? null
  return { url, text, sourceUrl: url, available: Boolean(url || text) }
}
