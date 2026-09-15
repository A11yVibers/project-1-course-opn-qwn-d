export function parseIsoDate(iso) {
  return new Date(`${iso}T00:00:00`)
}

const dayFmt = new Intl.DateTimeFormat('en-US', { weekday: 'short' })
const monthDayFmt = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' })
const monthDayYearFmt = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
})

export function formatDateParts(iso) {
  const d = parseIsoDate(iso)
  return { weekday: dayFmt.format(d), date: monthDayYearFmt.format(d) }
}

export function formatDateLong(iso) {
  return monthDayYearFmt.format(parseIsoDate(iso))
}

export function formatDateRange(startIso, endIso) {
  if (!startIso || !endIso) return ''
  const a = parseIsoDate(startIso)
  const b = parseIsoDate(endIso)
  if (startIso === endIso) return monthDayYearFmt.format(a)
  if (a.getFullYear() !== b.getFullYear()) {
    return `${monthDayYearFmt.format(a)} – ${monthDayYearFmt.format(b)}`
  }
  if (a.getMonth() === b.getMonth()) {
    return `${monthDayFmt.format(a)}–${b.getDate()}, ${b.getFullYear()}`
  }
  return `${monthDayFmt.format(a)} – ${monthDayYearFmt.format(b)}`
}

export function termLabelFor(isoDates) {
  if (!isoDates.length) return ''
  const sorted = [...isoDates].sort()
  const first = parseIsoDate(sorted[0])
  const month = first.getMonth() + 1
  let season = 'Term'
  if (month >= 3 && month <= 5) season = 'Spring'
  else if (month >= 6 && month <= 8) season = 'Summer'
  else if (month >= 9 && month <= 11) season = 'Fall'
  else season = 'Winter'
  return `${season} ${first.getFullYear()}`
}

export function youTubeEmbedUrl(url) {
  try {
    const u = new URL(url)
    let id = null
    if (u.hostname === 'youtu.be') {
      id = u.pathname.split('/').filter(Boolean)[0] ?? null
    } else if (/(^|\.)youtube(-nocookie)?\.com$/.test(u.hostname)) {
      id = u.searchParams.get('v')
      if (!id && u.pathname.startsWith('/embed/')) {
        id = u.pathname.split('/').filter(Boolean)[1] ?? null
      }
      if (!id && u.pathname.startsWith('/watch')) id = null
    }
    if (!id) return null
    return `https://www.youtube-nocookie.com/embed/${id}`
  } catch {
    return null
  }
}

export function initialsFrom(name) {
  const words = String(name ?? '')
    .replace(/[^A-Za-z0-9 ]/g, ' ')
    .split(/\s+/)
    .filter(Boolean)
  if (words.length === 0) return '?'
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase()
  return (words[0][0] + words[1][0]).toUpperCase()
}
