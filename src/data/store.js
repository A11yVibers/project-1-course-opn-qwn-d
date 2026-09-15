import coursesCsv from '../../project-assets/history_courses.csv?raw'
import classesCsv from '../../project-assets/history_classes.csv?raw'
import instructorsCsv from '../../project-assets/history_instructors.csv?raw'
import materialsCsv from '../../project-assets/course_materials.csv?raw'
import { csvToObjects } from '../lib/csv.js'
import { termLabelFor, youTubeEmbedUrl } from '../lib/format.js'

const urlModules = import.meta.glob(
  ['../../project-assets/materials/*', '!../../project-assets/materials/*.md'],
  { eager: true, query: '?url', import: 'default' },
)
const textModules = import.meta.glob('../../project-assets/materials/*.md', {
  eager: true,
  query: '?raw',
  import: 'default',
})

const MARKER = 'project-assets/'
const stripPrefix = (key) => key.slice(key.indexOf(MARKER) + MARKER.length)
const materialUrls = Object.fromEntries(
  Object.entries(urlModules).map(([k, v]) => [stripPrefix(k), v]),
)
const materialTexts = Object.fromEntries(
  Object.entries(textModules).map(([k, v]) => [stripPrefix(k), v]),
)

function resolveMaterial(row) {
  const type = row.material_type.toLowerCase()
  const filePath = row.file_path
  const material = {
    id: row.material_id,
    courseId: row.course_id,
    classId: row.class_id,
    order: Number(row.display_order) || 0,
    title: row.material_title,
    type,
    filePath,
    kind: 'file',
    url: null,
    text: null,
  }
  if (type === 'youtube' || /^https?:\/\//i.test(filePath)) {
    const embed = youTubeEmbedUrl(filePath)
    material.kind = embed ? 'youtube' : 'link'
    material.url = filePath
    material.embedUrl = embed
  } else if (type === 'md' || type === 'markdown') {
    material.kind = 'markdown'
    material.text = materialTexts[filePath] ?? null
    material.url = materialUrls[filePath] ?? null
  } else if (type === 'pdf') {
    material.kind = 'pdf'
    material.url = materialUrls[filePath] ?? null
  } else if (['video', 'mp4'].includes(type)) {
    material.kind = 'video'
    material.url = materialUrls[filePath] ?? null
  } else {
    material.kind = 'file'
    material.url = materialUrls[filePath] ?? null
    material.text = materialTexts[filePath] ?? null
  }
  return material
}

const instructorById = new Map(
  csvToObjects(instructorsCsv).map((r) => [
    r.instructor_id,
    {
      id: r.instructor_id,
      name: r.name,
      email: r.email,
      photoUrl: r.photo_url,
    },
  ]),
)

const materials = csvToObjects(materialsCsv)
  .map(resolveMaterial)
  .sort((a, b) => a.order - b.order || a.id.localeCompare(b.id))

const materialsByClass = new Map()
for (const m of materials) {
  if (!materialsByClass.has(m.classId)) materialsByClass.set(m.classId, [])
  materialsByClass.get(m.classId).push(m)
}

const classes = csvToObjects(classesCsv).map((r) => ({
  id: r.class_id,
  courseId: r.course_id,
  weekNumber: Number(r.week_number),
  date: r.date,
  title: r.class_name,
  materials: materialsByClass.get(r.class_id) ?? [],
}))

for (const m of materials) {
  const cls = classes.find((c) => c.id === m.classId)
  m.classTitle = cls ? cls.title : ''
}

const classesByCourse = new Map()
for (const c of classes) {
  if (!classesByCourse.has(c.courseId)) classesByCourse.set(c.courseId, [])
  classesByCourse.get(c.courseId).push(c)
}

export const courses = csvToObjects(coursesCsv).map((r) => {
  const courseClasses = classesByCourse.get(r.course_id) ?? []
  return {
    id: r.course_id,
    name: r.name,
    shortDescription: r.short_description,
    longDescription: r.long_description,
    numberOfClasses: Number(r.number_of_classes) || courseClasses.length,
    numberOfWeeks: Number(r.number_of_weeks),
    imageUrl: r.image_url,
    instructor: instructorById.get(r.instructor_id) ?? null,
    classes: courseClasses,
    materialCount: courseClasses.reduce((n, c) => n + c.materials.length, 0),
    dateRange:
      courseClasses.length > 0
        ? {
            start: courseClasses[0].date,
            end: courseClasses[courseClasses.length - 1].date,
          }
        : null,
  }
})

export const instructors = courses
  .map((c) => c.instructor)
  .filter((v, i, arr) => v && arr.findIndex((x) => x.id === v.id) === i)

export const stats = {
  courseCount: courses.length,
  classCount: classes.length,
  instructorCount: instructors.length,
  materialCount: materials.length,
  term: termLabelFor(classes.map((c) => c.date).filter(Boolean)),
}

export function getCourse(courseId) {
  return courses.find((c) => c.id === courseId) ?? null
}
