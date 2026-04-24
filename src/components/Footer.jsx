import { MapPin, Share2, Globe, Code2 } from 'lucide-react'

const footerLinks = {
  Product: [
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'Features',     href: '#features'     },
    { label: 'Pricing',      href: '#pricing'       },
    { label: 'Roadmap',      href: '#'              },
  ],
  Company: [
    { label: 'About',    href: '#about'   },
    { label: 'Blog',     href: '#'        },
    { label: 'Careers',  href: '#'        },
    { label: 'Contact',  href: '#contact' },
  ],
  Legal: [
    { label: 'Privacy Policy',   href: '#' },
    { label: 'Terms of Service', href: '#' },
    { label: 'Cookie Policy',    href: '#' },
  ],
}

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer
      id="footer"
      style={{ background: '#06091a', borderTop: '1px solid rgba(255,255,255,0.05)' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-10">

          {/* Brand / about column */}
          <div className="col-span-2">
            <a href="#" className="flex items-center gap-2 mb-4" id="footer-logo">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                   style={{ background: 'linear-gradient(135deg, #22c55e, #14b8a6)' }}>
                <MapPin className="w-4 h-4 text-white" />
              </div>
              <span className="font-display font-bold text-xl text-white">
                Need<span className="gradient-text">Map</span>
              </span>
            </a>
            <p className="text-slate-500 text-sm leading-relaxed max-w-xs mb-6">
              Smart Resource Allocation and Volunteer Coordination for NGOs.
              Built for the organizations doing the hardest work.
            </p>

            {/* Social links */}
            <div className="flex gap-3">
              {[
                { Icon: Share2,   label: 'Twitter',  href: '#', id: 'footer-twitter'  },
                { Icon: Globe,    label: 'LinkedIn', href: '#', id: 'footer-linkedin' },
                { Icon: Code2,    label: 'GitHub',   href: '#', id: 'footer-github'   },
              ].map(({ Icon, label, href, id }) => (
                <a
                  key={id}
                  id={id}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 rounded-lg flex items-center justify-center text-slate-500 hover:text-white transition-all duration-200"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(34,197,94,0.1)'; e.currentTarget.style.borderColor = 'rgba(34,197,94,0.3)' }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)' }}
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([group, links]) => (
            <div key={group}>
              <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-4">
                {group}
              </p>
              <ul className="flex flex-col gap-3">
                {links.map(link => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      id={`footer-${link.label.toLowerCase().replace(/\s+/g,'-')}`}
                      className="text-slate-500 hover:text-white text-sm transition-colors duration-200"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-14 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-600"
             style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <p>© {year} NeedMap. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Built with ♥ for social impact organizations worldwide
          </p>
        </div>
      </div>
    </footer>
  )
}
