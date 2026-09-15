import { marked } from 'marked'
import SmartImage from './SmartImage.jsx'
import { IconExternal, IconImage, materialMeta } from './Icons.jsx'

marked.setOptions({ gfm: true, breaks: false })

function renderMarkdown(text) {
  return marked.parse(text ?? '')
}

export default function MaterialViewer({ course, material, onClear }) {
  const meta = material ? materialMeta(material.kind) : null
  const unavailable =
    material &&
    material.kind !== 'youtube' &&
    material.kind !== 'link' &&
    !material.url &&
    material.text == null

  return (
    <div className="viewer-shell">
      <header className="viewer-bar">
        {material ? (
          <>
            <div className="viewer-bar-title">
              <span className={`material-chip ${meta.chip}`}>
                <meta.Icon size="1.05em" />
              </span>
              <span className="viewer-bar-text">
                {material.classTitle && <small>{material.classTitle}</small>}
                <strong>{material.title}</strong>
              </span>
            </div>
            <div className="viewer-bar-actions">
              <span className="chip chip-dark">{meta.label}</span>
              {material.url && material.kind !== 'youtube' && (
                <a
                  className="viewer-icon-btn"
                  href={material.url}
                  target="_blank"
                  rel="noreferrer"
                  title="Open in new tab"
                  aria-label={`Open ${material.title} in a new tab`}
                >
                  <IconExternal size="1.05em" />
                </a>
              )}
              <button type="button" className="viewer-clear-btn" onClick={onClear}>
                <IconImage size="1.05em" />
                <span>Course image</span>
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="viewer-bar-title">
              <span className="material-chip chip-gold">
                <IconImage size="1.05em" />
              </span>
              <span className="viewer-bar-text">
                <small>Course overview</small>
                <strong>{course.name}</strong>
              </span>
            </div>
            <div className="viewer-bar-actions">
              <span className="chip chip-dark">Select a material from the syllabus</span>
            </div>
          </>
        )}
      </header>

      <div className="viewer-stage">
        {!material && (
          <figure className="viewer-figure">
            <SmartImage
              src={course.imageUrl}
              alt={course.name}
              className="viewer-figure-img"
              fallbackLabel={course.id}
              eager
            />
            <figcaption>
              {course.name} · {course.instructor ? `Taught by ${course.instructor.name}` : 'Course image'}
            </figcaption>
          </figure>
        )}

        {material?.kind === 'pdf' && material.url && (
          <iframe className="viewer-frame" src={material.url} title={material.title} />
        )}

        {material?.kind === 'video' && material.url && (
          <video className="viewer-video" src={material.url} controls preload="metadata">
            Your browser does not support embedded video.
          </video>
        )}

        {material?.kind === 'youtube' && material.embedUrl && (
          <div className="viewer-youtube">
            <iframe
              src={material.embedUrl}
              title={material.title}
              loading="lazy"
              allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
        )}

        {material?.kind === 'markdown' && material.text != null && (
          <article
            className="viewer-doc markdown-body"
            dangerouslySetInnerHTML={{ __html: renderMarkdown(material.text) }}
          />
        )}

        {material?.kind === 'link' && material.url && (
          <div className="viewer-missing">
            <p>This material opens in an external page.</p>
            <a className="btn btn-gold" href={material.url} target="_blank" rel="noreferrer">
              <IconExternal size="1.05em" /> Open {material.title}
            </a>
          </div>
        )}

        {material?.kind === 'file' && !unavailable && (
          <div className="viewer-missing">
            <p>{material.title}</p>
            {material.url && (
              <a className="btn btn-gold" href={material.url} target="_blank" rel="noreferrer">
                <IconExternal size="1.05em" /> Open resource
              </a>
            )}
          </div>
        )}

        {unavailable && (
          <div className="viewer-missing">
            <p>This material is referenced by the syllabus but its file is not available in this build.</p>
          </div>
        )}
      </div>
    </div>
  )
}
