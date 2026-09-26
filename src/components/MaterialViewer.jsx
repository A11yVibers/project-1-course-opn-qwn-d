import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import SmartImage from './SmartImage.jsx'
import { materialMeta } from '../data/materials.js'
import { formatDateShort } from '../lib/format.js'
import { MaterialTypeIcon, IconClose, IconExternal, IconLayers } from './icons.jsx'

export default function MaterialViewer({ course, selection, onClear }) {
  if (!selection) {
    return (
      <div className="viewer viewer-default">
        <SmartImage
          src={course.imageUrl}
          alt={course.name}
          className="viewer-cover"
        />
        <div className="viewer-cover-overlay" />
        <div className="viewer-cover-caption">
          <span className="viewer-cover-kicker">
            <IconLayers width={14} height={14} /> {course.courseId} · Now viewing
          </span>
          <h2>{course.name}</h2>
          <p>Course image — Wikimedia Commons</p>
        </div>
        <div className="viewer-cover-hint">
          Select any material in the syllabus to open it here without leaving the course.
        </div>
      </div>
    )
  }

  const { material, classItem } = selection
  const meta = materialMeta(material.type)

  return (
    <div className="viewer viewer-material">
      <div className="viewer-head">
        <div className="viewer-head-text">
          <span className="viewer-context">
            <MaterialTypeIcon type={material.type} width={14} height={14} />
            Week {classItem.weekNumber} · {formatDateShort(classItem.date)} · {meta.label}
          </span>
          <h2 title={material.title}>{material.title}</h2>
        </div>
        <div className="viewer-head-actions">
          {material.sourceUrl && (
            <a
              className="viewer-action"
              href={material.sourceUrl}
              target="_blank"
              rel="noreferrer"
              title="Open original in a new tab"
            >
              <IconExternal width={16} height={16} />
            </a>
          )}
          <button className="viewer-action" onClick={onClear} title="Back to course image" aria-label="Back to course image">
            <IconClose width={16} height={16} />
          </button>
        </div>
      </div>

      <div className="viewer-body">
        {!material.available && (
          <div className="viewer-unavailable">
            <p>This material is not available in the viewer yet.</p>
            <code>{material.filePath}</code>
          </div>
        )}

        {material.available && material.type === 'pdf' && (
          <iframe className="viewer-frame" src={material.url} title={material.title} />
        )}

        {material.available && material.type === 'video' && (
          <div className="viewer-video-wrap">
            <video controls preload="metadata" src={material.url} aria-label={material.title} />
          </div>
        )}

        {material.available && material.type === 'youtube' && (
          <div className="viewer-yt-wrap">
            <iframe
              src={material.embedUrl}
              title={material.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
        )}

        {material.available && material.type === 'md' && (
          <div className="viewer-md-scroll">
            <article className="markdown-body">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {material.text ?? `# ${material.title}`}
              </ReactMarkdown>
            </article>
          </div>
        )}
      </div>
    </div>
  )
}
