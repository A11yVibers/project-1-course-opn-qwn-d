import { useMemo, useRef, useState } from 'react'
import { Search, X, SlidersHorizontal, Compass, ArrowRight, BookOpen, Users, Layers, Landmark } from 'lucide-react'
import CourseCard from './CourseCard'
import SafeImage from './SafeImage'
import Avatar from './Avatar'
import { catalogStats, getCourseById } from '../data/catalog'

const SORTS = [
  { id: 'featured', label: 'Featured' },
  { id: 'title', label: 'Title A–Z' },
  { id: 'weeks', label: 'Longest first' },
  { id: 'classes', label: 'Most sessions' },
]

function matches(course, q) {
  if (!q) return true
  const hay = [
    course.name,
    course.id,
    course.shortDescription,
    course.longDescription,
    course.instructor?.name,
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase()
  return q
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .every((token) => hay.includes(token))
}

export default function Catalog({ courses, instructors, onOpenCourse }) {
  const [query, setQuery] = useState('')
  const [instructor, setInstructor] = useState('all')
  const [sort, setSort] = useState('featured')
  const gridRef = useRef(null)

  const heroCourse = getCourseById('HIST111') || courses[0]

  const visible = useMemo(() => {
    let list = courses.filter((c) => matches(c, query.trim()))
    if (instructor !== 'all') list = list.filter((c) => c.instructorId === instructor)
    const sorted = [...list]
    if (sort === 'title') sorted.sort((a, b) => a.name.localeCompare(b.name))
    else if (sort === 'weeks') sorted.sort((a, b) => b.numberOfWeeks - a.numberOfWeeks || a.name.localeCompare(b.name))
    else if (sort === 'classes') sorted.sort((a, b) => b.numberOfClasses - a.numberOfClasses || a.name.localeCompare(b.name))
    return sorted
  }, [courses, query, instructor, sort])

  const filtersActive = query.trim() !== '' || instructor !== 'all'
  const scrollToGrid = () => gridRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  const clearAll = () => {
    setQuery('')
    setInstructor('all')
  }

  return (
    <div className="catalog">
      {/* Hero */}
      <section className="hero">
        <div className="hero-bg">
          <SafeImage src={heroCourse?.imageUrl} alt="" className="" imgClassName="" monogram="" glyph={<Landmark />} />
        </div>
        <div className="hero-inner">
          <span className="hero-eyebrow">
            <Compass size={15} /> Meridian · Digital History Academy
          </span>
          <h1 className="hero-title">
            Trace the arcs of the <em>human past</em>
          </h1>
          <p className="hero-sub">
            Twelve instructor-led courses spanning the ancient Nile to the global twentieth century.
            Stream lectures, open primary-source readings, and work through assignments — all in one
            place built for the study of history.
          </p>

          <div className="hero-stats">
            <div className="hero-stat">
              <b>{catalogStats.courseCount}</b>
              <span>Courses</span>
            </div>
            <div className="hero-stat">
              <b>{catalogStats.instructorCount}</b>
              <span>Historians</span>
            </div>
            <div className="hero-stat">
              <b>{catalogStats.classCount}</b>
              <span>Class sessions</span>
            </div>
          </div>

          <div className="hero-actions">
            <button className="btn btn-primary" onClick={() => heroCourse && onOpenCourse(heroCourse.id)}>
              <BookOpen size={17} /> Explore the Silk Roads
            </button>
            <button className="btn btn-dark" onClick={scrollToGrid}>
              Browse all courses <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </section>

      {/* Toolbar */}
      <div className="toolbar-wrap">
        <div className="toolbar">
          <div className="toolbar-top">
            <div className="search">
              <span className="search-icon"><Search size={19} /></span>
              <input
                className="search-input"
                type="search"
                value={query}
                placeholder="Search courses, eras, or historians…"
                aria-label="Search courses"
                onChange={(e) => setQuery(e.target.value)}
              />
              {query && (
                <button className="search-clear" onClick={() => setQuery('')} aria-label="Clear search">
                  <X size={18} />
                </button>
              )}
            </div>

            <div className="sort-wrap">
              <label htmlFor="sort"><SlidersHorizontal size={15} style={{ verticalAlign: -2, marginRight: 4 }} />Sort</label>
              <select id="sort" className="select" value={sort} onChange={(e) => setSort(e.target.value)}>
                {SORTS.map((s) => (
                  <option key={s.id} value={s.id}>{s.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="toolbar-bottom">
            <span className="filter-label"><Users size={15} /> Historian</span>
            <div className="chips">
              <button className={`chip all ${instructor === 'all' ? 'active' : ''}`} onClick={() => setInstructor('all')}>
                All
              </button>
              {instructors.map((ins) => (
                <button
                  key={ins.id}
                  className={`chip ${instructor === ins.id ? 'active' : ''}`}
                  onClick={() => setInstructor(ins.id)}
                  title={ins.name}
                >
                  <Avatar src={ins.photoUrl} name={ins.name} className="chip-avatar" />
                  {ins.name.replace(/^(Dr\.|Prof\.)\s*/, '')}
                </button>
              ))}
            </div>
            <span className="results-meta">
              Showing <b>{visible.length}</b> of {courses.length} courses
            </span>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="grid-section" ref={gridRef} id="catalog-grid">
        <div className="section-head">
          <h2>{filtersActive ? 'Matching courses' : 'The course catalog'}</h2>
          <span className="rule" />
          {filtersActive && (
            <button className="btn btn-ghost btn-sm" onClick={clearAll}>
              <X size={15} /> Clear filters
            </button>
          )}
        </div>

        {visible.length > 0 ? (
          <div className="grid">
            {visible.map((course, i) => (
              <CourseCard key={course.id} course={course} index={i} onOpen={onOpenCourse} />
            ))}
          </div>
        ) : (
          <div className="empty">
            <div className="empty-mark"><Search size={30} /></div>
            <h3>No courses found</h3>
            <p>Try a different era, keyword, or historian.</p>
            <button className="btn btn-primary" onClick={clearAll}>Reset search</button>
          </div>
        )}
      </div>

      <footer className="site-footer">
        <div className="footer-inner">
          <span className="brand-mini"><Compass size={18} /> Meridian</span>
          <span>A digital academy for the study of history.</span>
          <span className="sep" />
          <span>
            {catalogStats.courseCount} courses · {catalogStats.instructorCount} historians · {catalogStats.classCount} class sessions
          </span>
        </div>
      </footer>
    </div>
  )
}
