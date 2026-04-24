import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Menu, X, MapPin } from 'lucide-react'

export default function Navbar() {
  const [scrolled, setScrolled]   = useState(false)
  const [menuOpen, setMenuOpen]   = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const navLinks = [
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'Features',     href: '#features'     },
    { label: 'About',        href: '#about'         },
    { label: 'Contact',      href: '#contact'       },
  ]

  return (
    <nav
      id="navbar"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-dark-900/90 backdrop-blur-xl border-b border-white/5 shadow-xl'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group" id="nav-logo">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                 style={{ background: 'linear-gradient(135deg, #22c55e, #14b8a6)' }}>
              <MapPin className="w-4 h-4 text-white" />
            </div>
            <span className="font-display font-bold text-xl text-white group-hover:text-brand-400 transition-colors">
              Need<span className="gradient-text">Map</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map(l => (
              <a key={l.label} href={l.href} className="nav-link" id={`nav-${l.label.toLowerCase().replace(/\s+/g,'-')}`}>
                {l.label}
              </a>
            ))}
          </div>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Link to="/auth" id="nav-login" className="nav-link px-4 py-2 rounded-lg hover:bg-white/5">
              Log In
            </Link>
            <Link to="/auth" id="nav-register" className="btn-primary text-sm px-5 py-2.5">
              Get Started Free
            </Link>
          </div>

          {/* Mobile menu toggle */}
          <button
            id="nav-mobile-toggle"
            className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden pb-4 border-t border-white/5 mt-2 animate-fade-up">
            {navLinks.map(l => (
              <a
                key={l.label}
                href={l.href}
                className="block py-3 text-slate-300 hover:text-white font-medium border-b border-white/5"
                onClick={() => setMenuOpen(false)}
              >
                {l.label}
              </a>
            ))}
            <div className="pt-4 flex flex-col gap-3">
              <Link to="/auth" className="text-center py-3 rounded-lg border border-white/10 text-slate-300 hover:text-white hover:bg-white/5 font-medium transition-all">
                Log In
              </Link>
              <Link to="/auth" className="btn-primary text-center justify-center">
                Get Started Free
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
