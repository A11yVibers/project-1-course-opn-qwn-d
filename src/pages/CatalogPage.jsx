import { useMemo, useState } from 'react'
import { courses, instructorList } from '../data/catalog.js'
import SmartImage from '../components/SmartImage.jsx'
import { IconSearch, IconClock, IconLayers, IconColumn } from '../components/icons.jsx'

function CourseCard({ course }) {
  return (
    <a className="course-card" href={`#/course/${course.courseId}`}>
      <div className="card-media">
        <SmartImage src={course.imageUrl} alt={course.name} className="card-img" />
        <span className="card-code">{course.courseId}</span>
        {course.materialCount > 0 && (
          <span className="card-flag">Materials available</span>
        )}
      </div>
      <div className="card-body">
        <h3>{course.name}</h3>
        <p>{course.shortDescription}</p>
      </div>
      <div className="card-foot">
        {course.instructor && (
          <span className="card-instructor">
            <SmartImage src={course.instructor.photoUrl} alt={course.instructor.name} className="avatar-xs" />
            {course.instructor.name}
          </span>
        )}
        <span className="card-stats">
          <span><IconLayers width={14} height={14} /> {course.numberOfClasses} classes</span>
          <span><IconClock width={14} height={14} /> {course.numberOfWeeks} weeks</span>
        </span>
      </div>
    </a>
  )
}

export default function CatalogPage() {
  const [query, setQuery] = useState('')
  const [instructor, setInstructor] = useState('all')
  const [weeks, setWeeks] = useState('all')

  const weekOptions = useMemo(
    () => [...new Set(courses.map((c) => c.numberOfWeeks))].sort((a, b) => a - b),
    []
  )

  const stats = useMemo(() => ({
    courses: courses.length,
    classes: courses.reduce((n, c) => n + c.numberOfClasses, 0),
    instructors: instructorList.length,
    weeks: Math.max(...courses.map((c) => c.numberOfWeeks), 0),
  }), [])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return courses.filter((c) => {
      if (instructor !== 'all' && c.instructor?.instructorId !== instructor) return false
      if (weeks !== 'all' && c.numberOfWeeks !== Number(weeks)) return false
      if (!q) return true
      return [c.courseId, c.name, c.shortDescription, c.longDescription, c.instructor?.name]
        .join(' ')
        .toLowerCase()
        .includes(q)
    })
  }, [query, instructor, weeks])

  return (
    <>
      <section className="hero">
        <div className="hero-inner">
          <p className="hero-kicker"><IconColumn width={16} height={16} /> A digital campus for the study of history</p>
          <h1>Twelve journeys through the past, from the Nile to the Silk Roads.</h1>
          <p className="hero-sub">
            Lecture-driven courses with full syllabi, primary-source readings, maps, and assignments —
            everything opens right inside the course workspace.
          </p>
          <div className="hero-stats">
            <div><strong>{stats.courses}</strong><span>courses</span></div>
            <div><strong>{stats.classes}</strong><span>classes</span></div>
            <div><strong>{stats.instructors}</strong><span>historians</span></div>
            <div><strong>3000 BCE – today</strong><span>time span</span></div>
          </div>
        </div>
      </section>

      <section className="catalog" id="catalog">
        <div className="catalog-head">
          <div>
            <h2>Course Catalog</h2>
            <p className="catalog-count">
              Showing <strong>{filtered.length}</strong> of {courses.length} courses
            </p>
          </div>
          <label className="search-box">
            <IconSearch width={17} height={17} />
            <input
              type="search"
              placeholder="Search courses, topics, or instructors…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Search courses"
            />
          </label>
        </div>

        <div className="filters">
          <div className="filter-group" role="group" aria-label="Filter by instructor">
            <span className="filter-label">Instructor</span>
            <div className="chip-row">
              <button
                className={`chip${instructor === 'all' ? ' active' : ''}`}
                onClick={() => setInstructor('all')}
              >
                All
              </button>
              {instructorList.map((ins) => (
                <button
                  key={ins.instructorId}
                  className={`chip${instructor === ins.instructorId ? ' active' : ''}`}
                  onClick={() => setInstructor(ins.instructorId)}
                >
                  <SmartImage src={ins.photoUrl} alt={ins.name} className="avatar-xs" />
                  {ins.name}
                </button>
              ))}
            </div>
          </div>
          <div className="filter-group" role="group" aria-label="Filter by length">
            <span className="filter-label">Length</span>
            <div className="chip-row">
              <button className={`chip${weeks === 'all' ? ' active' : ''}`} onClick={() => setWeeks('all')}>
                Any
              </button>
              {weekOptions.map((w) => (
                <button
                  key={w}
                  className={`chip${weeks === String(w) ? ' active' : ''}`}
                  onClick={() => setWeeks(String(w))}
                >
                  {w} weeks
                </button>
              ))}
            </div>
          </div>
        </div>

        {filtered.length > 0 ? (
          <div className="card-grid">
            {filtered.map((c) => (
              <CourseCard key={c.courseId} course={c} />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <h3>No courses match your search.</h3>
            <p>Try a different keyword, or clear the filters to see all {courses.length} courses.</p>
            <button
              className="btn"
              onClick={() => { setQuery(''); setInstructor('all'); setWeeks('all') }}
            >
              Clear filters
            </button>
          </div>
        )}
      </section>
    </>
  )
}
