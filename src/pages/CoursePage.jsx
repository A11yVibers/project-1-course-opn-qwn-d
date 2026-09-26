import { useMemo, useState } from 'react'
import { formatDateLong } from '../lib/format.js'
import { materialMeta } from '../data/materials.js'
import MaterialViewer from '../components/MaterialViewer.jsx'
import SmartImage from '../components/SmartImage.jsx'
import {
  IconArrowLeft,
  IconPanel,
  IconChevronLeft,
  IconChevronRight,
  IconLayers,
  IconClock,
  IconCalendar,
  MaterialTypeIcon,
} from '../components/icons.jsx'

function MaterialButton({ material, active, onSelect }) {
  const meta = materialMeta(material.type)
  return (
    <button
      type="button"
      className={`material-item${active ? ' active' : ''}${material.available ? '' : ' disabled'}`}
      onClick={onSelect}
      aria-pressed={active}
      title={material.available ? `View: ${material.title}` : `${material.title} (not available yet)`}
    >
      <span className="material-icon">
        <MaterialTypeIcon type={material.type} width={15} height={15} />
      </span>
      <span className="material-title">{material.title}</span>
      <span className="material-type">{meta.label}</span>
    </button>
  )
}

export default function CoursePage({ courseId, course, materialId }) {
  const [collapsed, setCollapsed] = useState(false)

  const selection = useMemo(() => {
    if (!course || !materialId) return null
    for (const classItem of course.classes) {
      const material = classItem.materials.find((m) => m.materialId === materialId && m.available)
      if (material) return { material, classItem }
    }
    return null
  }, [course, materialId])

  if (!course) {
    return (
      <div className="not-found">
        <h1>Course not found</h1>
        <p>No course with id “{courseId}” exists in the catalog.</p>
        <a className="btn" href="#/"><IconArrowLeft width={16} height={16} /> Back to catalog</a>
      </div>
    )
  }

  const selectMaterial = (material) => {
    if (!material.available) return
    window.location.hash = `#/course/${course.courseId}/material/${material.materialId}`
  }

  const clearSelection = () => {
    window.location.hash = `#/course/${course.courseId}`
  }

  return (
    <div className="course-page">
      <header className="course-hero">
        <div className="course-hero-inner">
          <a className="back-link" href="#/">
            <IconArrowLeft width={16} height={16} /> All courses
          </a>
          <div className="course-hero-main">
            <div className="course-hero-text">
              <span className="course-code">{course.courseId}</span>
              <h1>{course.name}</h1>
              <p className="course-hero-sub">{course.shortDescription}</p>
              <div className="course-meta-row">
                <span className="meta-pill"><IconLayers width={14} height={14} /> {course.numberOfClasses} classes</span>
                <span className="meta-pill"><IconClock width={14} height={14} /> {course.numberOfWeeks} weeks</span>
                <span className="meta-pill"><IconCalendar width={14} height={14} /> {course.materialCount} materials posted</span>
              </div>
            </div>
            {course.instructor && (
              <div className="instructor-card">
                <SmartImage src={course.instructor.photoUrl} alt={course.instructor.name} className="avatar-lg" />
                <div>
                  <span className="instructor-role">Instructor</span>
                  <strong>{course.instructor.name}</strong>
                  <a href={`mailto:${course.instructor.email}`}>{course.instructor.email}</a>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className={`course-layout${collapsed ? ' collapsed' : ''}`}>
        <aside className="left-pane" aria-label="Course information and syllabus">
          <button
            type="button"
            className="collapse-toggle"
            onClick={() => setCollapsed((v) => !v)}
            aria-expanded={!collapsed}
            title={collapsed ? 'Expand course panel' : 'Collapse course panel'}
          >
            {collapsed ? <IconChevronRight width={18} height={18} /> : <IconChevronLeft width={18} height={18} />}
            <span className="collapse-label">
              {collapsed ? <span className="rail-label"><IconPanel width={15} height={15} /> Course info &amp; syllabus</span> : 'Collapse panel'}
            </span>
          </button>

          {!collapsed && (
            <div className="left-scroll">
              <section className="info-card">
                <h2>About this course</h2>
                <p>{course.longDescription}</p>
              </section>

              <section className="syllabus">
                <div className="syllabus-head">
                  <h2>Syllabus</h2>
                  <span className="syllabus-note">Click a material to open it in the viewer →</span>
                </div>
                <table className="syllabus-table">
                  <thead>
                    <tr>
                      <th className="col-week">Week</th>
                      <th className="col-date">Date</th>
                      <th className="col-content">Class Content</th>
                    </tr>
                  </thead>
                  <tbody>
                    {course.classes.map((cl) => (
                      <tr key={cl.classId}>
                        <td className="week-cell">
                          <span className="week-chip">Week {cl.weekNumber}</span>
                        </td>
                        <td className="date-cell">{formatDateLong(cl.date)}</td>
                        <td className="content-cell">
                          <div className="class-title">{cl.className}</div>
                          {cl.materials.length > 0 ? (
                            <ul className="material-list">
                              {cl.materials.map((m) => (
                                <li key={m.materialId}>
                                  <MaterialButton
                                    material={m}
                                    active={selection?.material.materialId === m.materialId}
                                    onSelect={() => selectMaterial(m)}
                                  />
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <p className="no-materials">Materials for this class will be posted before the session.</p>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </section>
            </div>
          )}
        </aside>

        <section className="viewer-pane" aria-label="Material viewer">
          <MaterialViewer
            course={course}
            selection={selection}
            onClear={clearSelection}
          />
        </section>
      </div>
    </div>
  )
}
