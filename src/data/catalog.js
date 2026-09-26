import { csvToObjects } from '../lib/csv.js'
import { resolveMaterial } from './materials.js'
import coursesCsv from '../../project-assets/history_courses.csv?raw'
import classesCsv from '../../project-assets/history_classes.csv?raw'
import instructorsCsv from '../../project-assets/history_instructors.csv?raw'
import materialsCsv from '../../project-assets/course_materials.csv?raw'

const instructors = new Map(csvToObjects(instructorsCsv).map((r) => [r.instructor_id, {
  instructorId: r.instructor_id,
  name: r.name,
  email: r.email,
  photoUrl: r.photo_url,
}]))

const materialsByClass = new Map()
for (const r of csvToObjects(materialsCsv)) {
  const list = materialsByClass.get(r.class_id) ?? []
  list.push({
    materialId: r.material_id,
    title: r.material_title,
    type: r.material_type,
    order: Number(r.display_order) || 0,
    filePath: r.file_path,
    ...resolveMaterial(r),
  })
  materialsByClass.set(r.class_id, list)
}
for (const list of materialsByClass.values()) list.sort((a, b) => a.order - b.order)

const classesByCourse = new Map()
for (const r of csvToObjects(classesCsv)) {
  const list = classesByCourse.get(r.course_id) ?? []
  list.push({
    classId: r.class_id,
    weekNumber: Number(r.week_number),
    date: r.date,
    className: r.class_name,
    materials: materialsByClass.get(r.class_id) ?? [],
  })
  classesByCourse.set(r.course_id, list)
}

export const courses = csvToObjects(coursesCsv).map((r) => {
  const classes = classesByCourse.get(r.course_id) ?? []
  return {
    courseId: r.course_id,
    name: r.name,
    shortDescription: r.short_description,
    longDescription: r.long_description,
    numberOfClasses: Number(r.number_of_classes),
    numberOfWeeks: Number(r.number_of_weeks),
    imageUrl: r.image_url,
    instructor: instructors.get(r.instructor_id) ?? null,
    classes,
    materialCount: classes.reduce((n, c) => n + c.materials.length, 0),
  }
})

export const instructorList = [...instructors.values()]

export function getCourse(courseId) {
  return courses.find((c) => c.courseId === courseId) ?? null
}
