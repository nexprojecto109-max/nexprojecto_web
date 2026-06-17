import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiHome, FiArrowLeft } from 'react-icons/fi'

export default function NotFound() {
  return (
    <div className="page-wrapper" style={{ padding: '2rem 0 4rem', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh' }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 'clamp(4rem, 12vw, 8rem)', fontWeight: '900' }} className="gradient-text">404</div>
        <h1 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '0.75rem' }}>Page Not Found</h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', maxWidth: 400, margin: '0 auto 2rem' }}>
          The page you're looking for doesn't exist or may have been moved.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/" className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
            <FiHome /> Go Home
          </Link>
          <Link to="/projects" className="btn-outline" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
            <FiArrowLeft /> Browse Projects
          </Link>
        </div>
      </motion.div>
    </div>
  )
}
