import { useEffect, useState } from 'react'
import {
  ArrowLeft, Calendar, Clock, GraduationCap, ScrollText,
  PanelLeftClose, PanelLeftOpen, Mail, ChevronRight, Info, Landmark, FileText,
} from 'lucide-react'
import SafeImage from './SafeImage'
import Avatar from './Avatar'
import MaterialViewer from './MaterialViewer'
import { getMaterialMeta, monogram } from './materialMeta'

function dateParts(iso) {
  if (!iso) return { dow: '', rest: '' }
  const [y, m, d] = iso.split('-').map((n) => parseInt(n, 10))
  const dt = new Date(Date.UTC(y, m - 1, d))
  return {
    dow: dt.toLocaleDateString('en-US', { weekday: 'short', timeZone: 'UTC' }),
    rest: dt.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' }),
  }
}

function MaterialRow({ material, active, onSelect }) {
  const meta = getMaterialMeta(material.kind)
  const Icon = meta.Icon
  return (
    <button
      type="button"
      className={`material-btn ${active ? 'active' : ''}`}
      onClick={() => onSelect(material)}
      aria-pressed={active}
    >
      <span className={`material-ico ${meta.ico}`}><Icon size={16} /></span>
      <span className="material-txt">
        <span className="mt">{material.title}</span>
        <span className="mtt">{meta.label}</span>
      </span>
      <span className="material-go"><ChevronRight size={16} /></span>
    </button>
  )
}

function SyllabusRow({ cls, weekStart, selectedId, onSelect }) {
  const { dow, rest } = dateParts(cls.date)
  return (
    <tr className={`syl-row ${weekStart ? 'week-start' : ''}`}>
      <td><span className="week-badge">{cls.weekNumber}</span></td>
      <td className="date-cell">
        <span className="dow">{dow}</span>
        {rest}
      </td>
      <td>
        <div className="class-title">{cls.name}</div>
        {cls.materials.length > 0 ? (
          <div className="materials">
            {cls.materials.map((m) => (
              <MaterialRow key={m.id} material={m} active={selectedId === m.id} onSelect={onSelect} />
            ))}
          </div>
        ) : (
          <div className="no-materials">
            <FileText size={15} /> Materials for this class are being prepared.
          </div>
        )}
      </td>
    </tr>
  )
}

export default function CoursePage({ course, onBack }) {
  const [selected, setSelected] = useState(null)
  const [collapsed, setCollapsed] = useState(false)

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') setSelected(null)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const instructor = course.instructor
  const totalMaterials = course.materialCount

  return (
    <div className="course">
      {/* Top bar */}
      <div className="course-topbar">
        <button className="back-btn" onClick={onBack}>
          <ArrowLeft size={17} /> <span>All courses</span>
        </button>
        <div className="topbar-title">
          <span className="kicker">
            <span className="dot" /> {course.id} · {course.numberOfWeeks} weeks
          </span>
          <h1>{course.name}</h1>
        </div>
        <div className="topbar-spacer" />
        <div className="topbar-meta">
          <span className="m"><Calendar size={16} /> {course.numberOfClasses} sessions</span>
          <span className="m"><Clock size={16} /> {course.numberOfWeeks} weeks</span>
          <span className="m"><GraduationCap size={16} /> {instructor?.name || 'Faculty'}</span>
        </div>
      </div>

      {/* Split layout */}
      <div className={`course-layout ${collapsed ? 'collapsed' : ''}`}>
        {/* Left pane */}
        <aside className="pane-left" aria-label="Course information and syllabus">
          <div className="pane-left-inner">
            <div className="pane-left-head">
              <span className="t"><ScrollText size={18} /> Course details</span>
              <button className="collapse-btn" onClick={() => setCollapsed(true)} title="Collapse panel">
                <PanelLeftClose size={16} /> <span className="lbl-hide-sm">Collapse</span>
              </button>
            </div>

            <div className="pane-left-body">
              <div className="info">
                <div className="cover-thumb">
                  <SafeImage src={course.imageUrl} alt={course.name} className="" imgClassName="" monogram={monogram(course.name)} glyph={<Landmark size={40} />} />
                  <span className="tagline">{course.id} · {course.numberOfWeeks}-week course</span>
                </div>

                {instructor && (
                  <div className="instructor-card">
                    <Avatar src={instructor.photoUrl} name={instructor.name} />
                    <div className="who">
                      <div className="role">Course instructor</div>
                      <div className="nm">{instructor.name}</div>
                      {instructor.email && (
                        <a className="em" href={`mailto:${instructor.email}`}>
                          <Mail size={13} /> {instructor.email}
                        </a>
                      )}
                    </div>
                  </div>
                )}

                <div className="stat-grid">
                  <div className="stat"><b>{course.numberOfWeeks}</b><span>Weeks</span></div>
                  <div className="stat"><b>{course.numberOfClasses}</b><span>Sessions</span></div>
                  <div className="stat"><b>{totalMaterials}</b><span>Resources</span></div>
                </div>

                <div className="desc-block">
                  <div className="desc-label">About this course</div>
                  <p className="desc-text">{course.longDescription}</p>
                </div>
              </div>

              <div className="syllabus">
                <div className="syllabus-head">
                  <h2>Syllabus</h2>
                  <span className="count">{course.classes.length} classes</span>
                </div>

                <table className="syl-table">
                  <thead>
                    <tr>
                      <th className="col-week">Week</th>
                      <th className="col-date">Date</th>
                      <th>Class content</th>
                    </tr>
                  </thead>
                  <tbody>
                    {course.classes.map((cls, idx) => (
                      <SyllabusRow
                        key={cls.id}
                        cls={cls}
                        weekStart={idx === 0 || course.classes[idx - 1].weekNumber !== cls.weekNumber}
                        selectedId={selected?.id}
                        onSelect={setSelected}
                      />
                    ))}
                  </tbody>
                </table>

                {totalMaterials === 0 && (
                  <div className="syl-note">
                    <Info size={16} />
                    <span>
                      Lecture decks, readings, and assignments for this course are being digitized.
                      Check back soon — the full syllabus schedule is shown above.
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Collapsed rail */}
          <div className="pane-left-rail">
            <button className="rail-btn" onClick={() => setCollapsed(false)} title="Expand panel" aria-label="Expand course panel">
              <PanelLeftOpen size={18} />
            </button>
            <span className="rail-dot" />
            <span className="rail-label">Syllabus</span>
          </div>
        </aside>

        {/* Right pane — persistent viewer */}
        <section className="pane-right" aria-label="Material viewer" aria-live="polite">
          <MaterialViewer course={course} material={selected} onClear={() => setSelected(null)} />
        </section>
      </div>
    </div>
  )
}
