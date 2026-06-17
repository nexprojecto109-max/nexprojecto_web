import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { FiStar, FiDownload, FiArrowRight } from 'react-icons/fi'

export default function ProjectCard({ project, index = 0 }) {
  const discount = Math.round(((project.originalPrice - project.price) / project.originalPrice) * 100)

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -8 }}
      className="glass-card"
      style={{ overflow: 'hidden', cursor: 'pointer' }}
    >
      {/* Image */}
      <div style={{ position: 'relative', overflow: 'hidden', height: 180 }}>
        <img
          src={project.image}
          alt={project.title}
          style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s' }}
          onMouseEnter={e => e.target.style.transform = 'scale(1.1)'}
          onMouseLeave={e => e.target.style.transform = 'scale(1)'}
        />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to bottom, transparent 50%, rgba(15,10,30,0.9))'
        }} />
        <div style={{ position: 'absolute', top: 10, right: 10 }}>
          <span className="badge badge-purple">{project.category}</span>
        </div>
        {discount > 0 && (
          <div style={{
            position: 'absolute', top: 10, left: 10,
            background: 'linear-gradient(135deg, #10B981, #059669)',
            color: 'white', padding: '0.2rem 0.6rem',
            borderRadius: '6px', fontSize: '0.75rem', fontWeight: '700'
          }}>
            -{discount}% OFF
          </div>
        )}
      </div>

      {/* Content */}
      <div style={{ padding: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
          <span className={`badge ${project.level === 'Beginner' ? 'badge-green' : project.level === 'Advanced' ? 'badge-red' : 'badge-yellow'}`}>
            {project.level}
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#FCD34D', fontSize: '0.85rem' }}>
            <FiStar style={{ fill: '#FCD34D' }} />
            <span style={{ fontWeight: '600' }}>{project.rating}</span>
            <span style={{ color: 'var(--text-muted)' }}>({project.reviews})</span>
          </div>
        </div>

        <h3 style={{
          fontWeight: '700', fontSize: '1rem',
          marginBottom: '0.5rem', lineHeight: '1.4',
          color: 'white'
        }}>{project.title}</h3>

        <p style={{
          color: 'var(--text-muted)', fontSize: '0.82rem',
          lineHeight: '1.5', marginBottom: '0.75rem',
          display: '-webkit-box', WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical', overflow: 'hidden'
        }}>{project.description}</p>

        {/* Tech stack */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem', marginBottom: '1rem' }}>
          {project.techStack.slice(0, 3).map(tech => (
            <span key={tech} style={{
              background: 'rgba(139,92,246,0.1)',
              border: '1px solid rgba(139,92,246,0.2)',
              color: 'var(--primary-light)',
              padding: '0.15rem 0.5rem',
              borderRadius: '4px', fontSize: '0.72rem'
            }}>{tech}</span>
          ))}
          {project.techStack.length > 3 && (
            <span style={{ color: 'var(--text-muted)', fontSize: '0.72rem', padding: '0.15rem 0.3rem' }}>
              +{project.techStack.length - 3} more
            </span>
          )}
        </div>

        {/* Price + CTA */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <span style={{
              fontSize: '1.3rem', fontWeight: '800',
              background: 'var(--gradient)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
            }}>₹{project.price}</span>
            <span style={{
              marginLeft: '0.5rem', fontSize: '0.85rem',
              color: 'var(--text-muted)', textDecoration: 'line-through'
            }}>₹{project.originalPrice}</span>
          </div>
          <Link to={`/projects/${project.id}`}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-primary"
              style={{ padding: '0.5rem 1.2rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
            >
              View <FiArrowRight />
            </motion.button>
          </Link>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', marginTop: '0.6rem', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
          <FiDownload /> {project.downloads} downloads
        </div>
      </div>
    </motion.div>
  )
}
