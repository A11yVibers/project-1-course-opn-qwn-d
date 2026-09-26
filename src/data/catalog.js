import Papa from 'papaparse'

// Source data lives in project-assets/ and is treated as immutable.
// We import the raw CSV text and the bundled material files, then derive
// the application model here instead of duplicating any of it in code.
import coursesCsv from '../../project-assets/history_courses.csv?raw'
import classesCsv from '../../project-assets/history_classes.csv?raw'
import instructorsCsv from '../../project-assets/history_instructors.csv?raw'
import materialsCsv from '../../project-assets/course_materials.csv?raw'

// Binary/media materials (pdf, mp4, ...) are bundled by Vite and exposed as URLs.
const materialUrlModules = import.meta.glob('../../project-assets/materials/*', {
  eager: true,
  query: '?url',
  import: 'default',
})

// Markdown materials are read as raw text so they can be rendered in-app.
const materialTextModules = import.meta.glob('../../project-assets/materials/*.md', {
  eager: true,
  query: '?raw',
  import: 'default',
})

const ASSET_PREFIX = '../../project-assets/'

function parseCsv(text) {
  // Normalize line endings first: the source files mix CRLF and LF, which
  // breaks delimiter auto-detection. Source data is immutable, so we fix it here.
  const normalized = String(text).replace(/\r\n?/g, '\n')
  const result = Papa.parse(normalized.trim(), { header: true, skipEmptyLines: true })
  return result.data
}

function toInt(value, fallback = 0) {
  const n = parseInt(value, 10)
  return Number.isFinite(n) ? n : fallback
}

function isExternal(path) {
  return /^https?:\/\//i.test(path || '')
}

// Convert a watch/youtu.be URL into an embeddable player URL.
export function youtubeEmbedUrl(url) {
  try {
    const u = new URL(url)
    const host = u.hostname.replace(/^www\./, '')
    let id = null
    if (host === 'youtu.be') {
      id = u.pathname.slice(1).split('/')[0]
    } else if (host.endsWith('youtube.com') || host.endsWith('youtube-nocookie.com')) {
      if (u.pathname === '/watch') id = u.searchParams.get('v')
      else if (u.pathname.startsWith('/embed/')) id = u.pathname.split('/')[2]
      else if (u.pathname.startsWith('/shorts/')) id = u.pathname.split('/')[2]
    }
    return id ? `https://www.youtube-nocookie.com/embed/${id}` : url
  } catch {
    return url
  }
}

// Resolve a materials row into a renderable resource without hardcoding file data.
function resolveMaterial(row) {
  const type = (row.material_type || '').toLowerCase()
  const filePath = (row.file_path || '').trim()
  const base = {
    id: row.material_id,
    order: toInt(row.display_order, 0),
    title: row.material_title,
    type,
    classId: row.class_id,
    courseId: row.course_id,
  }

  if (type === 'youtube' || isExternal(filePath)) {
    const external = isExternal(filePath)
    return {
      ...base,
      kind: external && type !== 'youtube' ? 'link' : 'youtube',
      url: type === 'youtube' ? youtubeEmbedUrl(filePath) : filePath,
      sourceUrl: filePath,
      external: true,
      available: Boolean(filePath),
    }
  }

  const assetKey = ASSET_PREFIX + filePath

  if (type === 'md' || type === 'markdown' || filePath.toLowerCase().endsWith('.md')) {
    const text = materialTextModules[assetKey]
    return {
      ...base,
      kind: 'md',
      text: typeof text === 'string' ? text : null,
      external: false,
      available: typeof text === 'string',
    }
  }

  const url = materialUrlModules[assetKey]
  return {
    ...base,
    kind: type === 'video' || filePath.toLowerCase().endsWith('.mp4') ? 'video' : type === 'pdf' ? 'pdf' : type || 'file',
    url,
    external: false,
    available: Boolean(url),
  }
}

const instructorRows = parseCsv(instructorsCsv)
const courseRows = parseCsv(coursesCsv)
const classRows = parseCsv(classesCsv)
const materialRows = parseCsv(materialsCsv)

export const instructors = instructorRows.map((row) => ({
  id: row.instructor_id,
  name: row.name,
  email: row.email,
  photoUrl: row.photo_url,
}))

const instructorById = new Map(instructors.map((i) => [i.id, i]))

// materials grouped by class, ordered by display_order
const materialsByClass = new Map()
for (const row of materialRows) {
  const material = resolveMaterial(row)
  if (!materialsByClass.has(row.class_id)) materialsByClass.set(row.class_id, [])
  materialsByClass.get(row.class_id).push(material)
}
for (const list of materialsByClass.values()) list.sort((a, b) => a.order - b.order)

// classes grouped by course, ordered by date then week
const classesByCourse = new Map()
for (const row of classRows) {
  if (!classesByCourse.has(row.course_id)) classesByCourse.set(row.course_id, [])
  classesByCourse.get(row.course_id).push({
    id: row.class_id,
    weekNumber: toInt(row.week_number, 0),
    date: row.date,
    name: row.class_name,
    materials: materialsByClass.get(row.class_id) || [],
  })
}
for (const list of classesByCourse.values()) {
  list.sort((a, b) => (a.date === b.date ? a.weekNumber - b.weekNumber : a.date < b.date ? -1 : 1))
}

export const courses = courseRows.map((row) => {
  const classes = classesByCourse.get(row.course_id) || []
  const instructor = instructorById.get(row.instructor_id) || null
  return {
    id: row.course_id,
    name: row.name,
    shortDescription: row.short_description,
    longDescription: row.long_description,
    numberOfClasses: toInt(row.number_of_classes, classes.length),
    numberOfWeeks: toInt(row.number_of_weeks, 0),
    instructorId: row.instructor_id,
    instructor,
    imageUrl: row.image_url,
    classes,
    materialCount: classes.reduce((sum, c) => sum + c.materials.length, 0),
  }
})

const courseById = new Map(courses.map((c) => [c.id, c]))

export function getCourseById(id) {
  return courseById.get(id) || null
}

export const catalogStats = {
  courseCount: courses.length,
  instructorCount: instructors.length,
  classCount: classRows.length,
  weekCount: courses.reduce((max, c) => Math.max(max, c.numberOfWeeks), 0),
}

export function formatDate(iso) {
  if (!iso) return ''
  const [y, m, d] = iso.split('-').map((n) => parseInt(n, 10))
  if (!y || !m || !d) return iso
  const date = new Date(Date.UTC(y, m - 1, d))
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  })
}
