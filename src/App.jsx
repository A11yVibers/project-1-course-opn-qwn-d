import { useCallback, useEffect, useState } from 'react'
import Header from './components/Header'
import Catalog from './components/Catalog'
import CoursePage from './components/CoursePage'
import { courses, instructors, getCourseById } from './data/catalog'

function parseHash(hash) {
  const path = (hash || '').replace(/^#/, '')
  const match = path.match(/^\/course\/([\w-]+)/)
  if (match) return { view: 'course', id: match[1] }
  return { view: 'catalog' }
}

export default function App() {
  const [route, setRoute] = useState(() => parseHash(window.location.hash))

  useEffect(() => {
    const onHashChange = () => setRoute(parseHash(window.location.hash))
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  const navigate = useCallback((path) => {
    if (window.location.hash === `#${path}`) setRoute(parseHash(path))
    else window.location.hash = path
  }, [])

  const course = route.view === 'course' ? getCourseById(route.id) : null

  return (
    <div className="app">
      <Header view={route.view} onNavigate={navigate} />
      <div className="view">
        {course ? (
          <CoursePage key={course.id} course={course} onBack={() => navigate('/')} />
        ) : (
          <Catalog courses={courses} instructors={instructors} onOpenCourse={(id) => navigate(`/course/${id}`)} />
        )}
      </div>
    </div>
  )
}
