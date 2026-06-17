import { Link } from 'react-router-dom'
import { FiMail, FiPhone, FiInstagram, FiTwitter, FiYoutube, FiGithub } from 'react-icons/fi'
import { motion } from 'framer-motion'

export default function Footer() {
  return (
    <footer style={{
      background: 'rgba(10, 7, 20, 0.95)',
      borderTop: '1px solid rgba(139,92,246,0.2)',
      padding: '4rem 0 2rem'
    }}>
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '2.5rem',
          marginBottom: '3rem'
        }}>
          {/* Brand */}
          <div>
            <div style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <img
                src="/logo.jfif"
                alt="NexProjecto Logo"
                style={{ width: 40, height: 40, borderRadius: '10px', objectFit: 'cover' }}
              />
              <div>
                <span style={{ fontFamily: "'Dancing Script', cursive", fontSize: '1.8rem', fontWeight: '700', color: 'white' }}>Nex</span>
                <span style={{ display: 'block', fontSize: '0.7rem', letterSpacing: '0.2em', color: 'var(--primary-light)', textTransform: 'uppercase' }}>PROJECTO</span>
              </div>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.7', maxWidth: 250 }}>
              Premium student projects, source code and expert consultation for all domains.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.25rem' }}>
              {[FiInstagram, FiTwitter, FiYoutube, FiGithub].map((Icon, i) => (
                <motion.a key={i} href="#" whileHover={{ scale: 1.2, color: 'var(--primary-light)' }}
                  style={{
                    width: 36, height: 36,
                    background: 'rgba(139,92,246,0.15)',
                    border: '1px solid rgba(139,92,246,0.3)',
                    borderRadius: '8px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'var(--text-muted)', fontSize: '1rem',
                    transition: 'all 0.3s'
                  }}>
                  <Icon />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Links */}
          {[
            { title: 'Quick Links', links: [['/', 'Home'], ['/projects', 'Projects'], ['/consultation', 'Consultation'], ['/about', 'About'], ['/contact', 'Contact']] },
            { title: 'Categories', links: [['#', 'Web Development'], ['#', 'Java / JSP'], ['#', 'Python / ML'], ['#', 'Mobile Apps'], ['#', 'PHP / MySQL']] },
          ].map(section => (
            <div key={section.title}>
              <h4 style={{ fontWeight: '700', marginBottom: '1rem', color: 'white' }}>{section.title}</h4>
              <ul style={{ listStyle: 'none' }}>
                {section.links.map(([href, label]) => (
                  <li key={label} style={{ marginBottom: '0.6rem' }}>
                    <Link to={href} style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.9rem', transition: 'color 0.2s' }}
                      onMouseEnter={e => e.target.style.color = 'var(--primary-light)'}
                      onMouseLeave={e => e.target.style.color = 'var(--text-muted)'}
                    >{label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact */}
          <div>
            <h4 style={{ fontWeight: '700', marginBottom: '1rem', color: 'white' }}>Contact</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {[
                { Icon: FiMail, text: 'nexprojecto109@gmail.com', href: 'mailto:nexprojecto109@gmail.com' },
                { Icon: FiPhone, text: '+91 81042 27377', href: 'https://wa.me/918104227377' }
              ].map(({ Icon, text, href }) => (
                <a key={text} href={href} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--text-muted)', fontSize: '0.9rem', textDecoration: 'none' }}>
                  <Icon style={{ color: 'var(--primary-light)', flexShrink: 0 }} />
                  {text}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div style={{
          borderTop: '1px solid rgba(139,92,246,0.15)',
          paddingTop: '1.5rem',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          flexWrap: 'wrap', gap: '1rem'
        }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            © 2026 NexProjecto. All rights reserved.
          </p>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            Made with 💜 for students
          </p>
        </div>
      </div>
    </footer>
  )
}
