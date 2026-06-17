import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { FiArrowRight, FiStar, FiDownload, FiUsers } from 'react-icons/fi'

const particles = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  size: Math.random() * 6 + 2,
  left: Math.random() * 100,
  top: Math.random() * 100,
  delay: Math.random() * 6,
  duration: Math.random() * 4 + 4
}))

export default function HeroSection() {
  return (
    <section style={{
      minHeight: '100vh',
      display: 'flex', alignItems: 'center',
      position: 'relative', overflow: 'hidden',
      background: 'radial-gradient(ellipse at 60% 50%, rgba(139,92,246,0.15) 0%, transparent 70%), radial-gradient(ellipse at 20% 80%, rgba(217,70,239,0.1) 0%, transparent 60%)'
    }}>
      {/* Particles */}
      {particles.map(p => (
        <motion.div
          key={p.id}
          style={{
            position: 'absolute',
            width: p.size, height: p.size,
            left: `${p.left}%`, top: `${p.top}%`,
            borderRadius: '50%',
            background: p.id % 3 === 0 ? 'var(--primary)' : p.id % 3 === 1 ? 'var(--secondary)' : 'var(--accent)',
            opacity: 0.4
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.2, 0.6, 0.2],
            scale: [1, 1.5, 1]
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        />
      ))}

      {/* Glowing orbs */}
      <div style={{
        position: 'absolute', width: 500, height: 500,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(139,92,246,0.2) 0%, transparent 70%)',
        top: '-10%', right: '-5%',
        animation: 'pulse-glow 4s ease-in-out infinite'
      }} />
      <div style={{
        position: 'absolute', width: 300, height: 300,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(217,70,239,0.15) 0%, transparent 70%)',
        bottom: '10%', left: '-5%',
        animation: 'pulse-glow 6s ease-in-out infinite 2s'
      }} />

      <div className="container" style={{ position: 'relative', zIndex: 1, padding: '6rem 1.5rem 4rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}
          className="hero-grid">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span style={{
                display: 'inline-block',
                background: 'rgba(139,92,246,0.15)',
                border: '1px solid rgba(139,92,246,0.4)',
                color: 'var(--primary-light)',
                padding: '0.4rem 1.2rem',
                borderRadius: '50px',
                fontSize: '0.85rem',
                fontWeight: '600',
                marginBottom: '1.5rem',
                letterSpacing: '0.05em'
              }}>
                🚀 #1 Student Project Platform
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              style={{
                fontSize: 'clamp(2.2rem, 5vw, 3.5rem)',
                fontWeight: '900',
                lineHeight: '1.1',
                marginBottom: '1.5rem'
              }}
            >
              Launch Your<br />
              <span className="gradient-text">Dream Projects</span><br />
              With Confidence
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              style={{
                color: 'var(--text-muted)',
                fontSize: '1.05rem',
                lineHeight: '1.7',
                marginBottom: '2rem',
                maxWidth: 480
              }}
            >
              Get premium college projects, source code, and expert consultation for Web, Mobile, AI, Java, PHP & more.
              <strong style={{ color: 'var(--primary-light)' }}> 500+ students </strong> already trust us!
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}
            >
              <Link to="/projects">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn-primary"
                  style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1rem', padding: '0.85rem 2.5rem' }}
                >
                  Browse Projects <FiArrowRight />
                </motion.button>
              </Link>
              <Link to="/consultation">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn-outline"
                  style={{ fontSize: '1rem', padding: '0.85rem 2.5rem' }}
                >
                  Get Consultation
                </motion.button>
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              style={{ display: 'flex', gap: '2rem', marginTop: '2.5rem', flexWrap: 'wrap' }}
            >
              {[
                { icon: <FiDownload />, value: '500+', label: 'Projects' },
                { icon: <FiUsers />, value: '1K+', label: 'Students' },
                { icon: <FiStar />, value: '4.9★', label: 'Rating' }
              ].map((stat, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <div style={{
                    width: 36, height: 36,
                    background: 'rgba(139,92,246,0.2)',
                    borderRadius: '8px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'var(--primary-light)', fontSize: '0.9rem'
                  }}>{stat.icon}</div>
                  <div>
                    <div style={{ fontWeight: '700', fontSize: '1.1rem' }}>{stat.value}</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{stat.label}</div>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right: Floating cards */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            style={{ position: 'relative', height: 400 }}
            className="hero-visual"
          >
            {[
              { top: '5%', left: '10%', title: 'MERN Stack', tag: '₹1,499', delay: 0 },
              { top: '30%', right: '0%', title: 'AI Chatbot', tag: '₹999', delay: 0.5 },
              { bottom: '5%', left: '15%', title: 'React Native App', tag: '₹1,799', delay: 1 }
            ].map((card, i) => (
              <motion.div
                key={i}
                animate={{ y: [0, -15, 0] }}
                transition={{ duration: 4, delay: card.delay, repeat: Infinity, ease: 'easeInOut' }}
                className="glass-card"
                style={{
                  position: 'absolute',
                  padding: '1rem 1.5rem',
                  ...card,
                  minWidth: 180
                }}
              >
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>{card.title}</div>
                <div style={{ fontWeight: '700', fontSize: '1.1rem' }} className="gradient-text">{card.tag}</div>
              </motion.div>
            ))}

            {/* Center glow */}
            <div style={{
              position: 'absolute',
              top: '50%', left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 200, height: 200,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(139,92,246,0.3) 0%, transparent 70%)',
              animation: 'pulse-glow 3s ease-in-out infinite'
            }} />
          </motion.div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .hero-grid { grid-template-columns: 1fr !important; }
          .hero-visual { display: none; }
        }
      `}</style>
    </section>
  )
}
