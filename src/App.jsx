import { useEffect, useState } from 'react'
import CatalogPage from './pages/CatalogPage.jsx'
import CoursePage from './pages/CoursePage.jsx'
import { getCourse, courses } from './data/catalog.js'
import { IconColumn } from './components/icons.jsx'

function parseHash() {
  const parts = window.location.hash.replace(/^#\/?/, '').split('/').filter(Boolean)
  if (parts[0] === 'course' && parts[1]) {
    const materialId = parts[2] === 'material' && parts[3] ? decodeURIComponent(parts[3]) : null
    return { view: 'course', courseId: decodeURIComponent(parts[1]), materialId }
  }
  return { view: 'catalog', courseId: null, materialId: null }
}

export default function App() {
  const [route, setRoute] = useState(parseHash)

  useEffect(() => {
    const onChange = () => setRoute(parseHash())
    window.addEventListener('hashchange', onChange)
    return () => window.removeEventListener('hashchange', onChange)
  }, [])

  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [route.view, route.courseId])

  const course = route.view === 'course' ? getCourse(route.courseId) : null

  return (
    <div className="app">
      <header className="topbar">
        <a className="brand" href="#/" aria-label="Clio Academy home">
          <span className="brand-mark"><IconColumn width={20} height={20} /></span>
          <span className="brand-text">Clio <em>Academy</em></span>
        </a>
        <nav className="topnav" aria-label="Main">
          <a href="#/" className={route.view === 'catalog' ? 'active' : ''}>Catalog</a>
          {route.view === 'course' && course && (
            <span className="crumb">
              <span aria-hidden="true">/</span>
              <a href={`#/course/${course.courseId}`} className="active">{course.courseId}</a>
            </span>
          )}
        </nav>
        <span className="topbar-note">{courses.length} history courses</span>
      </header>

      <main>
        {route.view === 'catalog' && <CatalogPage />}
        {route.view === 'course' && (
          <CoursePage courseId={route.courseId} course={course} materialId={route.materialId} />
        )}
      </main>

      <footer className="site-footer">
        <p>
          <strong>Clio Academy</strong> — an online learning environment devoted entirely to history.
        </p>
        <p className="footer-note">
          Course, class, instructor, and material data loaded from the supplied project datasets.
          Course imagery via Wikimedia Commons.
        </p>
      </footer>
    </div>
  )
}
