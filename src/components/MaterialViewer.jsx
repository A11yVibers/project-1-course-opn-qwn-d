import { useMemo } from 'react'
import { marked } from 'marked'
import { X, ExternalLink, ImageIcon, MousePointerClick, Landmark, FileText } from 'lucide-react'
import SafeImage from './SafeImage'
import { getMaterialMeta, monogram } from './materialMeta'

marked.setOptions({ gfm: true, breaks: false })

function ViewerTopBar({ course, material, onClear }) {
  const meta = material ? getMaterialMeta(material.kind) : null
  const MetaIcon = meta?.Icon
  const openUrl = material ? material.sourceUrl || (material.external ? null : material.url) : null

  return (
    <div className="viewer-topbar">
      <div className="vt-main">
        <span className="vt-label">
          {material ? (
            <>
              <MousePointerClick size={13} /> Now viewing
            </>
          ) : (
            <>
              <ImageIcon size={13} /> Course cover
            </>
          )}
        </span>
        <span className="vt-title">{material ? material.title : course.name}</span>
      </div>

      <div className="viewer-badges">
        {material ? (
          <span className={`badge ${meta.badge}`}>
            <MetaIcon size={14} /> {meta.label}
          </span>
        ) : (
          <span className="badge badge-neutral">
            <ImageIcon size={14} /> Image
          </span>
        )}

        {openUrl && (
          <a className="vt-btn" href={openUrl} target="_blank" rel="noreferrer noopener" title="Open original source">
            <ExternalLink size={15} /> <span className="lbl-hide-sm">Open</span>
          </a>
        )}

        {material && (
          <button className="vt-btn accent" onClick={onClear} title="Back to course cover (Esc)">
            <X size={15} /> <span className="lbl-hide-sm">Cover</span>
          </button>
        )}
      </div>
    </div>
  )
}

function Cover({ course }) {
  return (
    <div className="cover fade-in">
      <SafeImage
        src={course.imageUrl}
        alt={course.name}
        className="cover-img-wrap"
        imgClassName="cover-img"
        monogram={monogram(course.name)}
        glyph={<Landmark />}
      />
      <div className="cover-scrim" />
      <div className="cover-hint">
        <MousePointerClick size={15} /> Select a resource from the syllabus
      </div>
      <div className="cover-caption">
        <span className="eyebrow">
          <Landmark size={15} /> {course.id} · Course cover
        </span>
        <h2>{course.name}</h2>
        <p>{course.longDescription}</p>
      </div>
    </div>
  )
}

function Unavailable({ material }) {
  const meta = getMaterialMeta(material?.kind)
  return (
    <div className="viewer-fallback">
      <div className="box">
        <FileText size={40} style={{ marginBottom: 12, opacity: .6 }} />
        <h3>Resource not available</h3>
        <p>
          “{material?.title}” could not be loaded in the viewer
          {meta?.label ? ` (${meta.label})` : ''}.
        </p>
      </div>
    </div>
  )
}

export default function MaterialViewer({ course, material, onClear }) {
  const html = useMemo(() => {
    if (material?.kind === 'md' && material.text) return marked.parse(material.text)
    return null
  }, [material])

  let stage
  if (!material) {
    stage = <Cover course={course} />
  } else if (material.kind === 'pdf') {
    stage = material.url ? (
      <div className="frame-wrap fade-in">
        <iframe className="viewer-frame" src={material.url} title={material.title} loading="lazy" />
      </div>
    ) : (
      <Unavailable material={material} />
    )
  } else if (material.kind === 'video') {
    stage = material.url ? (
      <div className="video-wrap fade-in">
        <video className="viewer-video" src={material.url} controls preload="metadata" playsInline>
          Your browser does not support embedded video.
        </video>
      </div>
    ) : (
      <Unavailable material={material} />
    )
  } else if (material.kind === 'youtube') {
    stage = material.url ? (
      <div className="frame-wrap fade-in">
        <iframe
          className="viewer-frame"
          src={material.url}
          title={material.title}
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>
    ) : (
      <Unavailable material={material} />
    )
  } else if (material.kind === 'md') {
    stage = html ? (
      <div className="doc-scroll fade-in">
        <article className="viewer-doc markdown-body" dangerouslySetInnerHTML={{ __html: html }} />
      </div>
    ) : (
      <Unavailable material={material} />
    )
  } else if (material.kind === 'link' && material.url) {
    stage = (
      <div className="viewer-fallback">
        <div className="box">
          <h3>{material.title}</h3>
          <p>This resource opens in a new tab.</p>
          <a className="btn btn-primary" href={material.url} target="_blank" rel="noreferrer noopener">
            <ExternalLink size={16} /> Open resource
          </a>
        </div>
      </div>
    )
  } else {
    stage = <Unavailable material={material} />
  }

  return (
    <div className="viewer">
      <ViewerTopBar course={course} material={material} onClear={onClear} />
      <div className="viewer-stage">{stage}</div>
    </div>
  )
}
