import { useEffect } from 'react'
import { useHashRoute } from './hooks/useHashRoute.js'
import { getCourse } from './data/store.js'
import CatalogPage from './components/CatalogPage.jsx'
import CoursePage from './components/CoursePage.jsx'

export default function App() {
  const route = useHashRoute()
  const course = route.view === 'course' ? getCourse(route.courseId) : null

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [route.view, route.courseId])

  if (route.view === 'course' && course) {
    return <CoursePage key={course.id} course={course} />
  }
  return <CatalogPage />
}
