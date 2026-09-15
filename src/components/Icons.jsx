const Svg = ({ children, size, ...rest }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    width={size ?? '1em'}
    height={size ?? '1em'}
    aria-hidden="true"
    focusable="false"
    {...rest}
  >
    {children}
  </svg>
)

export const IconSearch = (p) => (
  <Svg {...p}>
    <circle cx="11" cy="11" r="7" />
    <path d="m20.5 20.5-4-4" />
  </Svg>
)

export const IconArrowLeft = (p) => (
  <Svg {...p}>
    <path d="M19 12H5" />
    <path d="m11 6-6 6 6 6" />
  </Svg>
)

export const IconChevronLeft = (p) => (
  <Svg {...p}>
    <path d="m14 6-6 6 6 6" />
  </Svg>
)

export const IconChevronRight = (p) => (
  <Svg {...p}>
    <path d="m10 6 6 6-6 6" />
  </Svg>
)

export const IconChevronDown = (p) => (
  <Svg {...p}>
    <path d="m6 9 6 6 6-6" />
  </Svg>
)

export const IconX = (p) => (
  <Svg {...p}>
    <path d="M6 6l12 12M18 6L6 18" />
  </Svg>
)

export const IconCalendar = (p) => (
  <Svg {...p}>
    <rect x="3.5" y="5" width="17" height="15.5" rx="2.5" />
    <path d="M8 3v4M16 3v4M3.5 10h17" />
  </Svg>
)

export const IconBookOpen = (p) => (
  <Svg {...p}>
    <path d="M12 6.5C10.5 5 8.5 4.3 5.5 4.3c-.9 0-1.5.1-2 .3v13.6c.5-.2 1.1-.3 2-.3 3 0 5 .7 6.5 2.2 1.5-1.5 3.5-2.2 6.5-2.2.9 0 1.5.1 2 .3V4.6c-.5-.2-1.1-.3-2-.3-3 0-5 .7-6.5 2.2Z" />
    <path d="M12 6.5v13.6" />
  </Svg>
)

export const IconClock = (p) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 7v5l3.2 2" />
  </Svg>
)

export const IconMail = (p) => (
  <Svg {...p}>
    <rect x="3" y="5.5" width="18" height="13" rx="2" />
    <path d="m4 7 8 6 8-6" />
  </Svg>
)

export const IconFilePdf = (p) => (
  <Svg {...p}>
    <path d="M13.5 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8.5L13.5 3Z" />
    <path d="M13.5 3v5.5H19" />
    <path d="M9 17v-4.5h1.4a1.3 1.3 0 0 1 0 2.6H9m4.5 1.9v-4.5h1.2a1.6 1.6 0 0 1 1.6 1.6v1.3a1.6 1.6 0 0 1-1.6 1.6h-1.2Z" />
  </Svg>
)

export const IconVideo = (p) => (
  <Svg {...p}>
    <rect x="3" y="6" width="13" height="12" rx="2.5" />
    <path d="m16 10.5 5-3v9l-5-3" />
  </Svg>
)

export const IconYouTube = (p) => (
  <Svg {...p}>
    <rect x="2.5" y="5.5" width="19" height="13" rx="4" />
    <path d="m10.5 9.5 5 2.5-5 2.5v-5Z" />
  </Svg>
)

export const IconMarkdown = (p) => (
  <Svg {...p}>
    <rect x="2.5" y="5.5" width="19" height="13" rx="2.5" />
    <path d="M6 15.5v-7l2.8 3.4L11.6 8.5v7" />
    <path d="M15.5 9.5v4.2m0 0 2.2-2.4m-2.2 2.4-2.2-2.4" />
  </Svg>
)

export const IconFile = (p) => (
  <Svg {...p}>
    <path d="M13.5 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8.5L13.5 3Z" />
    <path d="M13.5 3v5.5H19" />
    <path d="M9 13h6M9 16.5h4" />
  </Svg>
)

export const IconLink = (p) => (
  <Svg {...p}>
    <path d="M14 4h6v6" />
    <path d="M20 4 10 14" />
    <path d="M18 14.5V19a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 4 19V8a1.5 1.5 0 0 1 1.5-1.5H10" />
  </Svg>
)

export const IconExternal = (p) => (
  <Svg {...p}>
    <path d="M14 4h6v6" />
    <path d="M20 4 11 13" />
    <path d="M18 14.5V19a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 4 19V8a1.5 1.5 0 0 1 1.5-1.5H10" />
  </Svg>
)

export const IconImage = (p) => (
  <Svg {...p}>
    <rect x="3.5" y="4.5" width="17" height="15" rx="2.5" />
    <circle cx="9" cy="10" r="1.6" />
    <path d="m4.5 17 4.7-4.7a1.5 1.5 0 0 1 2.1 0L16 17" />
    <path d="m14 14 1.6-1.6a1.5 1.5 0 0 1 2.1 0l1.8 1.8" />
  </Svg>
)

export const IconCompass = (p) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="m15.5 8.5-2 5-5 2 2-5 5-2Z" />
  </Svg>
)

export const IconLayers = (p) => (
  <Svg {...p}>
    <path d="m12 3 9 5-9 5-9-5 9-5Z" />
    <path d="m3.5 12.5 8.5 4.7 8.5-4.7" />
    <path d="m3.5 16.8 8.5 4.7 8.5-4.7" />
  </Svg>
)

export const IconPanelLeft = (p) => (
  <Svg {...p}>
    <rect x="3.5" y="4.5" width="17" height="15" rx="2.5" />
    <path d="M10 4.5v15" />
  </Svg>
)

export const IconQuote = (p) => (
  <Svg {...p}>
    <path d="M9 7c-2.5 1-4 3.2-4 6v4h5v-5H7c0-2 .7-3.4 2.7-4.2L9 7Zm9 0c-2.5 1-4 3.2-4 6v4h5v-5h-3c0-2 .7-3.4 2.7-4.2L18 7Z" />
  </Svg>
)

export const MATERIAL_KIND_META = {
  pdf: { label: 'PDF', Icon: IconFilePdf, chip: 'chip-pdf' },
  video: { label: 'Video', Icon: IconVideo, chip: 'chip-video' },
  youtube: { label: 'YouTube', Icon: IconYouTube, chip: 'chip-youtube' },
  markdown: { label: 'Markdown', Icon: IconMarkdown, chip: 'chip-md' },
  link: { label: 'Link', Icon: IconLink, chip: 'chip-file' },
  file: { label: 'Resource', Icon: IconFile, chip: 'chip-file' },
}

export function materialMeta(kind) {
  return MATERIAL_KIND_META[kind] ?? MATERIAL_KIND_META.file
}
