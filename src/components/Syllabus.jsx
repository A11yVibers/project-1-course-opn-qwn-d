import { formatDateParts } from '../lib/format.js'
import { materialMeta } from './Icons.jsx'

function groupByWeek(classes) {
  const weeks = []
  for (const cls of classes) {
    const last = weeks[weeks.length - 1]
    if (last && last.week === cls.weekNumber) last.classes.push(cls)
    else weeks.push({ week: cls.weekNumber, classes: [cls] })
  }
  return weeks
}

export default function Syllabus({ classes, activeMaterialId, onOpenMaterial }) {
  const weeks = groupByWeek(classes)

  return (
    <table className="syllabus-table">
      <thead>
        <tr>
          <th scope="col" className="col-week">Week</th>
          <th scope="col" className="col-date">Date</th>
          <th scope="col" className="col-content">Class content</th>
        </tr>
      </thead>
      <tbody>
        {weeks.map((group) =>
          group.classes.map((cls, i) => {
            const parts = formatDateParts(cls.date)
            return (
              <tr key={cls.id}>
                {i === 0 && (
                  <td rowSpan={group.classes.length} className="week-cell">
                    <span className="week-badge" title={`Week ${group.week}`}>
                      {group.week}
                    </span>
                  </td>
                )}
                <td className="date-cell">
                  <span className="date-weekday">{parts.weekday}</span>
                  <span className="date-day">{parts.date}</span>
                </td>
                <td className="content-cell">
                  <div className="class-title">{cls.title}</div>
                  {cls.materials.length > 0 ? (
                    <ul className="material-list">
                      {cls.materials.map((m) => {
                        const meta = materialMeta(m.kind)
                        const selected = activeMaterialId === m.id
                        return (
                          <li key={m.id}>
                            <button
                              type="button"
                              className={`material-item ${selected ? 'is-active' : ''}`}
                              onClick={() => onOpenMaterial(m)}
                              aria-pressed={selected}
                              title={`View ${m.title}`}
                            >
                              <span className={`material-chip ${meta.chip}`}>
                                <meta.Icon size="1em" />
                              </span>
                              <span className="material-item-title">{m.title}</span>
                              <span className="material-item-type">{meta.label}</span>
                            </button>
                          </li>
                        )
                      })}
                    </ul>
                  ) : (
                    <p className="no-materials">No materials posted yet.</p>
                  )}
                </td>
              </tr>
            )
          }),
        )}
      </tbody>
    </table>
  )
}
