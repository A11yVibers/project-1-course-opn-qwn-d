import { Compass, Library } from 'lucide-react'
import { catalogStats } from '../data/catalog'

function BrandMark() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 3c2.6 2.6 4 5.7 4 9s-1.4 6.4-4 9c-2.6-2.6-4-5.7-4-9s1.4-6.4 4-9Z" />
      <path d="M3.5 9h17M3.5 15h17" />
    </svg>
  )
}

export default function Header({ onNavigate, view }) {
  return (
    <header className="site-header">
      <button className="brand" onClick={() => onNavigate('/')} aria-label="Meridian — go to course catalog">
        <span className="brand-mark"><BrandMark /></span>
        <span className="brand-text">
          <span className="brand-name">Meridian</span>
          <span className="brand-tag">Digital History Academy</span>
        </span>
      </button>

      <div className="header-spacer" />

      <nav className="header-nav">
        <span className="header-stat">
          <b>{catalogStats.courseCount}</b> courses · <b>{catalogStats.instructorCount}</b> historians
        </span>
        <button className={`header-pill ${view === 'catalog' ? 'active' : ''}`} onClick={() => onNavigate('/')}>
          <Library size={16} /> Catalog
        </button>
      </nav>
    </header>
  )
}
