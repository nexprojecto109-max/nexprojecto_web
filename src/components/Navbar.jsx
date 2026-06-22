import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { FiMenu, FiX, FiShoppingCart, FiUser, FiLogOut, FiSettings } from 'react-icons/fi'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => setMenuOpen(false), [location])

  const handleLogout = () => {
    logout()
    navigate('/')
    setDropdownOpen(false)
  }

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
        background: scrolled ? 'rgba(15, 10, 30, 0.95)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(139,92,246,0.2)' : 'none',
        transition: 'all 0.3s ease',
        padding: '1rem 0'
      }}
    >
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {/* Logo */}
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <motion.div
            whileHover={{ scale: 1.05 }}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <img
              src="/logo.jfif"
              alt="NexProjecto Logo"
              style={{
                width: 40, height: 40,
                borderRadius: '10px',
                objectFit: 'cover',
                boxShadow: 'var(--glow)'
              }}
            />
            <div>
              <span style={{
                fontFamily: "'Dancing Script', cursive",
                fontSize: '1.4rem', color: 'white', fontWeight: '700'
              }}>Nex</span>
              <span style={{
                fontSize: '0.7rem', letterSpacing: '0.15em',
                color: 'var(--primary-light)', fontWeight: '600',
                display: 'block', lineHeight: '1', textTransform: 'uppercase'
              }}>PROJECTO</span>
            </div>
          </motion.div>
        </Link>

        {/* Desktop Nav */}
        <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}
          className="desktop-nav">
          {[['/', 'Home'], ['/projects', 'Projects'], ['/consultation', 'Consultation'], ['/about', 'About'], ['/contact', 'Contact'], ['/terms', 'T&C']].map(([path, label]) => (
            <Link key={path} to={path} style={{
              color: location.pathname === path ? 'var(--primary-light)' : 'var(--text-muted)',
              textDecoration: 'none', fontWeight: '500', fontSize: '0.95rem',
              position: 'relative', transition: 'color 0.3s'
            }}>
              {label}
              {location.pathname === path && (
                <motion.div layoutId="nav-underline" style={{
                  position: 'absolute', bottom: -4, left: 0, right: 0,
                  height: 2, background: 'var(--gradient)', borderRadius: 1
                }} />
              )}
            </Link>
          ))}
        </div>

        {/* Right side */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {user ? (
            <div style={{ position: 'relative' }}>
              <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={() => setDropdownOpen(!dropdownOpen)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.5rem',
                  background: 'rgba(139,92,246,0.15)', border: '1px solid rgba(139,92,246,0.3)',
                  color: 'white', padding: '0.5rem 1rem', borderRadius: '50px',
                  cursor: 'pointer', fontFamily: 'Poppins', fontSize: '0.9rem'
                }}
              >
                <div style={{
                  width: 28, height: 28,
                  background: 'var(--gradient)',
                  borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.8rem', fontWeight: '700'
                }}>
                  {user.name[0].toUpperCase()}
                </div>
                <span style={{ maxWidth: 100, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {user.name}
                </span>
              </motion.button>

              <AnimatePresence>
                {dropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    style={{
                      position: 'absolute', top: '110%', right: 0,
                      background: 'var(--bg-card)',
                      border: '1px solid rgba(139,92,246,0.3)',
                      borderRadius: '12px', padding: '0.5rem',
                      minWidth: 180, zIndex: 100,
                      boxShadow: '0 20px 40px rgba(0,0,0,0.5)'
                    }}
                  >
                    {[
                      { icon: <FiUser />, label: 'Dashboard', path: user.role === 'admin' ? '/admin' : '/dashboard' },
                      ...(user.role === 'admin' ? [{ icon: <FiSettings />, label: 'Admin Panel', path: '/admin' }] : [])
                    ].map(item => (
                      <Link key={item.path} to={item.path}
                        onClick={() => setDropdownOpen(false)}
                        style={{
                          display: 'flex', alignItems: 'center', gap: '0.6rem',
                          padding: '0.6rem 0.8rem', color: 'var(--text-muted)',
                          textDecoration: 'none', borderRadius: '8px',
                          fontSize: '0.9rem', transition: 'all 0.2s'
                        }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(139,92,246,0.15)'; e.currentTarget.style.color = 'white' }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-muted)' }}
                      >
                        {item.icon} {item.label}
                      </Link>
                    ))}
                    <button onClick={handleLogout} style={{
                      display: 'flex', alignItems: 'center', gap: '0.6rem',
                      padding: '0.6rem 0.8rem', color: '#FCA5A5',
                      background: 'none', border: 'none', width: '100%',
                      cursor: 'pointer', borderRadius: '8px',
                      fontSize: '0.9rem', fontFamily: 'Poppins',
                      transition: 'all 0.2s'
                    }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.1)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <FiLogOut /> Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <>
              <Link to="/login">
                <button className="btn-outline" style={{ padding: '0.5rem 1.25rem', fontSize: '0.9rem' }}>
                  Login
                </button>
              </Link>
              <Link to="/register">
                <button className="btn-primary" style={{ padding: '0.5rem 1.25rem', fontSize: '0.9rem' }}>
                  Sign Up
                </button>
              </Link>
            </>
          )}

          {/* Mobile toggle */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            style={{
              background: 'none', border: 'none', color: 'white',
              fontSize: '1.5rem', cursor: 'pointer',
              display: 'none'
            }}
            className="mobile-toggle"
          >
            {menuOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            style={{
              background: 'rgba(15,10,30,0.98)',
              borderTop: '1px solid rgba(139,92,246,0.2)',
              overflow: 'hidden'
            }}
          >
            <div className="container" style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {[['/', 'Home'], ['/projects', 'Projects'], ['/consultation', 'Consultation'], ['/about', 'About'], ['/contact', 'Contact'], ['/terms', 'T&C']].map(([path, label]) => (
                <Link key={path} to={path} onClick={() => setMenuOpen(false)} style={{
                  color: 'var(--text-muted)', textDecoration: 'none',
                  padding: '0.6rem 0', fontWeight: '500'
                }}>{label}</Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-toggle { display: block !important; }
        }
      `}</style>
    </motion.nav>
  )
}
