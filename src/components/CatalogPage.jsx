import { useMemo, useState } from 'react'
import SmartImage from './SmartImage.jsx'
import {
  IconBookOpen,
  IconCalendar,
  IconChevronRight,
  IconCompass,
  IconSearch,
} from './Icons.jsx'
import { courses, instructors, stats, getCourse } from '../data/store.js'
import { formatDateRange } from '../lib/format.js'

const FEATURED_COURSE_ID = 'HIST111'

const SORTS = {
  title: 'Title A–Z',
  short: 'Duration: short to long',
  long: 'Duration: long to short',
  classes: 'Most classes first',
}

function CourseCard({ course }) {
  return (
    <a className="course-card" href={`#/course/${course.id}`}>
      <div className="course-card-media">
        <SmartImage
          src={course.imageUrl}
          alt={course.name}
          className="course-card-img"
          fallbackLabel={course.id}
        />
        <span className="chip chip-code">{course.id}</span>
      </div>
      <div className="course-card-body">
        <h3>{course.name}</h3>
        <p>{course.shortDescription}</p>
        <div className="course-card-meta">
          <span>
            <IconCalendar size="1em" /> {course.numberOfWeeks} weeks
          </span>
          <span>
            <IconBookOpen size="1em" /> {course.numberOfClasses} classes
          </span>
        </div>
        {course.instructor && (
          <div className="course-card-instructor">
            <SmartImage
              src={course.instructor.photoUrl}
              alt=""
              className="avatar avatar-sm"
              fallbackLabel=""
            />
            <span>{course.instructor.name}</span>
          </div>
        )}
      </div>
    </a>
  )
}

function FeaturedSpotlight({ course }) {
  const range = course.dateRange
    ? formatDateRange(course.dateRange.start, course.dateRange.end)
    : ''
  return (
    <section className="spotlight" aria-label="Featured course">
      <a className="spotlight-media" href={`#/course/${course.id}`} tabIndex={-1} aria-hidden="true">
        <SmartImage
          src={course.imageUrl}
          alt={course.name}
          className="spotlight-img"
          fallbackLabel={course.id}
          eager
        />
      </a>
      <div className="spotlight-body">
        <span className="eyebrow eyebrow-gold">
          <IconCompass size="1em" /> Featured course · Fully available now
        </span>
        <h2>{course.name}</h2>
        <p>{course.shortDescription}</p>
        <div className="spotlight-meta">
          <span>
            <IconCalendar size="1em" /> {course.numberOfWeeks} weeks
          </span>
          <span>
            <IconBookOpen size="1em" /> {course.numberOfClasses} classes
          </span>
          {range && <span>{range}</span>}
          {course.instructor && <span>with {course.instructor.name}</span>}
        </div>
        <a className="btn btn-gold" href={`#/course/${course.id}`}>
          Open course <IconChevronRight size="1.05em" />
        </a>
      </div>
    </section>
  )
}

export default function CatalogPage() {
  const [query, setQuery] = useState('')
  const [instructorId, setInstructorId] = useState('all')
  const [sort, setSort] = useState('title')

  const featured = getCourse(FEATURED_COURSE_ID)

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    const filtered = courses.filter((c) => {
      if (instructorId !== 'all' && c.instructor?.id !== instructorId) return false
      if (!q) return true
      return [c.name, c.shortDescription, c.longDescription, c.id, c.instructor?.name]
        .filter(Boolean)
        .some((s) => s.toLowerCase().includes(q))
    })
    const sorted = [...filtered]
    if (sort === 'title') sorted.sort((a, b) => a.name.localeCompare(b.name))
    if (sort === 'short') sorted.sort((a, b) => a.numberOfWeeks - b.numberOfWeeks)
    if (sort === 'long') sorted.sort((a, b) => b.numberOfWeeks - a.numberOfWeeks)
    if (sort === 'classes') sorted.sort((a, b) => b.numberOfClasses - a.numberOfClasses)
    return sorted
  }, [query, instructorId, sort])

  const filtersActive = query.trim() !== '' || instructorId !== 'all'

  return (
    <div className="catalog-page">
      <header className="site-header">
        <a className="brand" href="#/">
          <span className="brand-mark" aria-hidden="true">C</span>
          <span className="brand-text">
            <strong>Clio Academy</strong>
            <small>An online school devoted entirely to history</small>
          </span>
        </a>
        <div className="header-right">
          {stats.term && <span className="chip chip-outline">{stats.term} term</span>}
          <a className="header-link" href="#catalog">
            Browse catalog
          </a>
        </div>
      </header>

      <main>
        <section className="hero">
          <div className="hero-inner">
            <div className="hero-copy">
              <span className="eyebrow">
                <IconCompass size="1em" /> {stats.courseCount} seminar-style courses · one subject,
                deeply taught
              </span>
              <h1>
                Every course a journey
                <br />
                through the human past.
              </h1>
              <p className="lede">
                From the banks of the Nile to the caravan routes of the Silk Roads, study history
                with full syllabi, recorded lectures, primary-source readings, and hands-on
                assignments — guided by faculty who live in the archives.
              </p>
              <div className="hero-stats">
                <div>
                  <strong>{stats.courseCount}</strong>
                  <span>Courses</span>
                </div>
                <div>
                  <strong>{stats.classCount}</strong>
                  <span>Classes</span>
                </div>
                <div>
                  <strong>{stats.instructorCount}</strong>
                  <span>Faculty</span>
                </div>
                <div>
                  <strong>{stats.materialCount}</strong>
                  <span>Materials online</span>
                </div>
              </div>
            </div>
          </div>
          {featured && <FeaturedSpotlight course={featured} />}
        </section>

        <section className="catalog" id="catalog">
          <div className="catalog-head">
            <h2>Course catalog</h2>
            <p>Search and filter all {stats.courseCount} history courses.</p>
          </div>

          <div className="toolbar" role="search">
            <label className="search-field">
              <IconSearch size="1.1em" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search courses, topics, or instructors…"
                aria-label="Search courses"
              />
            </label>
            <select
              className="select-field"
              value={instructorId}
              onChange={(e) => setInstructorId(e.target.value)}
              aria-label="Filter by instructor"
            >
              <option value="all">All instructors</option>
              {instructors.map((ins) => (
                <option key={ins.id} value={ins.id}>
                  {ins.name}
                </option>
              ))}
            </select>
            <select
              className="select-field"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              aria-label="Sort courses"
            >
              {Object.entries(SORTS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          <p className="result-count" aria-live="polite">
            Showing {results.length} of {courses.length} courses
            {filtersActive && (
              <button
                type="button"
                className="link-btn"
                onClick={() => {
                  setQuery('')
                  setInstructorId('all')
                }}
              >
                Clear filters
              </button>
            )}
          </p>

          {results.length > 0 ? (
            <div className="course-grid">
              {results.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <h3>No courses match your search.</h3>
              <p>Try a different keyword, or clear the filters to see the full catalog.</p>
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => {
                  setQuery('')
                  setInstructorId('all')
                }}
              >
                Clear filters
              </button>
            </div>
          )}
        </section>
      </main>

      <footer className="site-footer">
        <div className="footer-inner">
          <div className="footer-brand">
            <span className="brand-mark" aria-hidden="true">C</span>
            <span>
              <strong>Clio Academy</strong>
              <small>Study the past. Understand the present.</small>
            </span>
          </div>
          <p>
            Course imagery via Wikimedia Commons · Faculty portraits via randomuser.me ·{' '}
            {stats.term} term
          </p>
        </div>
      </footer>
    </div>
  )
}
