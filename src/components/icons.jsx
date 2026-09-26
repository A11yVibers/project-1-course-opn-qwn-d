const base = {
  width: 20,
  height: 20,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
}

export const IconSearch = (p) => (
  <svg {...base} {...p}><circle cx="11" cy="11" r="7" /><path d="m20 20-3.6-3.6" /></svg>
)
export const IconClose = (p) => (
  <svg {...base} {...p}><path d="M6 6l12 12M18 6L6 18" /></svg>
)
export const IconArrowLeft = (p) => (
  <svg {...base} {...p}><path d="M19 12H5" /><path d="m12 19-7-7 7-7" /></svg>
)
export const IconChevronLeft = (p) => (
  <svg {...base} {...p}><path d="m15 18-6-6 6-6" /></svg>
)
export const IconChevronRight = (p) => (
  <svg {...base} {...p}><path d="m9 18 6-6-6-6" /></svg>
)
export const IconExternal = (p) => (
  <svg {...base} {...p}><path d="M15 3h6v6" /><path d="M10 14 21 3" /><path d="M21 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5" /></svg>
)
export const IconCalendar = (p) => (
  <svg {...base} {...p}><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></svg>
)
export const IconClock = (p) => (
  <svg {...base} {...p}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>
)
export const IconLayers = (p) => (
  <svg {...base} {...p}><path d="m12 2 10 6-10 6L2 8z" /><path d="m2 16 10 6 10-6" /><path d="m2 12 10 6 10-6" /></svg>
)
export const IconPdf = (p) => (
  <svg {...base} {...p}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6" /><path d="M8 13h8M8 17h5" /></svg>
)
export const IconVideo = (p) => (
  <svg {...base} {...p}><rect x="2" y="5" width="14" height="14" rx="2" /><path d="m22 8-6 4 6 4z" /></svg>
)
export const IconMd = (p) => (
  <svg {...base} {...p}><rect x="2" y="5" width="20" height="14" rx="2" /><path d="M6 15v-6l3 3 3-3v6" /><path d="M16.5 9v6M14.5 13l2 2 2-2" /></svg>
)
export const IconDoc = (p) => (
  <svg {...base} {...p}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6" /></svg>
)
export const IconColumn = (p) => (
  <svg {...base} {...p}><path d="M4 21h16" /><path d="M5 21V8m4.5 13V8m5 13V8M19 21V8" /><path d="M3 8h18L12 2 3 8z" /></svg>
)
export const IconPanel = (p) => (
  <svg {...base} {...p}><rect x="3" y="4" width="18" height="16" rx="2" /><path d="M10 4v16" /></svg>
)

export function MaterialTypeIcon({ type, ...p }) {
  if (type === 'pdf') return <IconPdf {...p} />
  if (type === 'video' || type === 'youtube') return <IconVideo {...p} />
  if (type === 'md') return <IconMd {...p} />
  return <IconDoc {...p} />
}
