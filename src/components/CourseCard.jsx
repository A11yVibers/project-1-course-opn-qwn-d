import { Calendar, Layers, ChevronRight, Sparkles } from 'lucide-react'
import SafeImage from './SafeImage'
import Avatar from './Avatar'
import { monogram } from './materialMeta'

export default function CourseCard({ course, onOpen, index = 0 }) {
  const open = () => onOpen(course.id)
  const onKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      open()
    }
  }

  return (
    <article
      className="card rise"
      style={{ animationDelay: `${Math.min(index, 10) * 45}ms` }}
      role="button"
      tabIndex={0}
      aria-label={`Open course ${course.name}`}
      onClick={open}
      onKeyDown={onKeyDown}
    >
      <div className="card-media">
        <SafeImage
          src={course.imageUrl}
          alt={course.name}
          className=""
          imgClassName=""
          monogram={monogram(course.name)}
        />
        <span className="card-code">{course.id}</span>
        <span className="card-weeks">
          <Calendar size={13} /> {course.numberOfWeeks} weeks
        </span>
        {course.materialCount > 0 && (
          <span className="card-resources">
            <Sparkles size={13} /> {course.materialCount} resources ready
          </span>
        )}
      </div>

      <div className="card-body">
        <h3 className="card-title">{course.name}</h3>
        <p className="card-desc">{course.shortDescription}</p>
        <div className="card-foot">
          <span className="instructor-mini">
            <Avatar src={course.instructor?.photoUrl} name={course.instructor?.name || ''} />
            <span className="nm">{course.instructor?.name || 'Faculty TBA'}</span>
          </span>
          <span className="card-cta">
            <Layers size={15} style={{ marginRight: 2 }} /> {course.numberOfClasses}
            <ChevronRight style={{ marginLeft: 6 }} />
          </span>
        </div>
      </div>
    </article>
  )
}
