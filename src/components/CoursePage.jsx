import { useCallback, useEffect, useRef, useState } from 'react'
import SmartImage from './SmartImage.jsx'
import Syllabus from './Syllabus.jsx'
import MaterialViewer from './MaterialViewer.jsx'
import {
  IconArrowLeft,
  IconBookOpen,
  IconCalendar,
  IconChevronDown,
  IconChevronLeft,
  IconChevronRight,
  IconLayers,
  IconMail,
} from './Icons.jsx'
import { formatDateRange, termLabelFor } from '../lib/format.js'

export default function CoursePage({ course }) {
  const [collapsed, setCollapsed] = useState(false)
  const [activeMaterial, setActiveMaterial] = useState(null)
  const viewerRef = useRef(null)

  const openMaterial = useCallback((material) => {
    setActiveMaterial(material)
    if (typeof window !== 'undefined' && window.innerWidth <= 960) {
      requestAnimationFrame(() => {
        viewerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      })
    }
  }, [])

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === 'Escape') setActiveMaterial(null)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  const term = course.dateRange ? termLabelFor([course.dateRange.start]) : ''
  const range = course.dateRange
    ? formatDateRange(course.dateRange.start, course.dateRange.end)
    : ''

  return (
    <div className="course-page">
      <header className="course-topbar">
        <a className="back-link" href="#/">
          <IconArrowLeft size="1.1em" />
          <span>All courses</span>
        </a>
        <div className="topbar-title">
          <span className="chip chip-outline-dark">{course.id}</span>
          <h1>{course.name}</h1>
        </div>
        <div className="topbar-right">
          {course.instructor && (
            <span className="topbar-instructor">
              <SmartImage
                src={course.instructor.photoUrl}
                alt=""
                className="avatar avatar-sm"
                fallbackLabel=""
              />
              {course.instructor.name}
            </span>
          )}
          {term && <span className="chip chip-outline-dark">{term}</span>}
        </div>
      </header>

      <div className={`course-layout ${collapsed ? 'is-collapsed' : ''}`}>
        <aside
          id="course-info-pane"
          className="course-left"
          aria-label="Course information and syllabus"
        >
          <div className="course-left-inner">
            <div className="course-banner">
              <SmartImage
                src={course.imageUrl}
                alt={course.name}
                className="course-banner-img"
                fallbackLabel={course.id}
              />
              <div className="course-banner-shade" />
              <div className="course-banner-caption">
                {term && <span className="chip chip-gold">{term}</span>}
                <h2>{course.name}</h2>
              </div>
            </div>

            <div className="course-meta-grid">
              <div className="meta-cell">
                <IconCalendar size="1.15em" />
                <div>
                  <strong>{course.numberOfWeeks} weeks</strong>
                  {range && <span>{range}</span>}
                </div>
              </div>
              <div className="meta-cell">
                <IconBookOpen size="1.15em" />
                <div>
                  <strong>{course.numberOfClasses} classes</strong>
                  <span>{course.materialCount} materials posted</span>
                </div>
              </div>
              <div className="meta-cell">
                <IconLayers size="1.15em" />
                <div>
                  <strong>Seminar format</strong>
                  <span>Lectures, readings & assignments</span>
                </div>
              </div>
            </div>

            {course.instructor && (
              <div className="instructor-card">
                <SmartImage
                  src={course.instructor.photoUrl}
                  alt={`Portrait of ${course.instructor.name}`}
                  className="avatar avatar-lg"
                  fallbackLabel=""
                />
                <div className="instructor-info">
                  <small>Course instructor</small>
                  <strong>{course.instructor.name}</strong>
                  <a href={`mailto:${course.instructor.email}`}>
                    <IconMail size="0.95em" />
                    {course.instructor.email}
                  </a>
                </div>
              </div>
            )}

            <section className="course-about">
              <h3>About this course</h3>
              <p>{course.longDescription}</p>
            </section>

            <section className="course-syllabus">
              <div className="syllabus-heading">
                <h3>Syllabus</h3>
                <p>
                  {course.classes.length} classes · {course.numberOfWeeks} weeks
                  {term ? ` · ${term}` : ''}
                </p>
              </div>
              <Syllabus
                classes={course.classes}
                activeMaterialId={activeMaterial?.id ?? null}
                onOpenMaterial={openMaterial}
              />
            </section>
          </div>
        </aside>

        <button
          type="button"
          className="collapse-handle"
          onClick={() => setCollapsed((v) => !v)}
          aria-expanded={!collapsed}
          aria-controls="course-info-pane"
          aria-label={collapsed ? 'Show course info and syllabus' : 'Hide course info and syllabus'}
          title={collapsed ? 'Show course info and syllabus' : 'Hide course info and syllabus'}
        >
          {collapsed ? <IconChevronRight size="1.2em" /> : <IconChevronLeft size="1.2em" />}
          <span className="handle-label">
            {collapsed ? 'Show course info & syllabus' : 'Hide course info & syllabus'}
            <IconChevronDown size="1em" />
          </span>
        </button>

        <section className="course-viewer" aria-label="Material viewer" ref={viewerRef}>
          <MaterialViewer
            course={course}
            material={activeMaterial}
            onClear={() => setActiveMaterial(null)}
          />
        </section>
      </div>
    </div>
  )
}
