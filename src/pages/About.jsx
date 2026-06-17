import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { FiUsers, FiAward, FiCode, FiHeart, FiArrowRight } from 'react-icons/fi'
import { DB } from '../data/db'

const stats = [
  { icon: <FiCode />, label: 'Projects Available', value: () => DB.getProjects().length + '+' },
  { icon: <FiUsers />, label: 'Happy Students', value: () => '500+' },
  { icon: <FiAward />, label: 'Domains Covered', value: () => '6+' },
  { icon: <FiHeart />, label: 'Avg. Rating', value: () => '4.8 / 5' },
]

const values = [
  { title: 'Quality Source Code', desc: 'Every project is reviewed, well-documented, and built using current industry-standard tech stacks so you can learn from clean, working code.' },
  { title: '1-on-1 Consultation', desc: 'Stuck on setup, viva prep, or customizations? Book a session with our mentors and get personalized guidance.' },
  { title: 'Fast Delivery', desc: 'Get instant access to source code, documentation, and setup guides right after purchase — no waiting around.' },
  { title: 'Student-Friendly Pricing', desc: 'Final year projects shouldn\u2019t break the bank. Our pricing is designed to be affordable for students across India.' },
]

export default function About() {
  return (
    <div className="page-wrapper" style={{ padding: '2rem 0 4rem' }}>
      <div className="container">
        {/* Hero */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: '900', marginBottom: '1rem' }}>
            About <span className="gradient-text">NexProjecto</span>
          </h1>
          <p style={{ color: 'var(--text-muted)', maxWidth: 640, margin: '0 auto', lineHeight: '1.8' }}>
            NexProjecto helps engineering and college students find ready-to-use academic
            projects with complete source code, documentation, and expert consultation —
            so you can focus on learning and presenting with confidence.
          </p>
        </motion.div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1.25rem', marginBottom: '3.5rem' }}>
          {stats.map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.1 }}
              className="glass-card" style={{ padding: '1.5rem', textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', color: 'var(--primary-light)', marginBottom: '0.5rem' }}>{s.icon}</div>
              <div style={{ fontSize: '1.5rem', fontWeight: '800' }}>{s.value()}</div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{s.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Story */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2.5rem', alignItems: 'center', marginBottom: '3.5rem' }} className="about-grid">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <h2 style={{ fontSize: '1.6rem', fontWeight: '800', marginBottom: '1rem' }}>Our Story</h2>
            <p style={{ color: 'var(--text-muted)', lineHeight: '1.8', marginBottom: '1rem' }}>
              We started NexProjecto because too many students were stuck spending weeks
              hunting for project ideas, source code, and guidance for their final year
              submissions — often paying high prices for outdated or poorly documented work.
            </p>
            <p style={{ color: 'var(--text-muted)', lineHeight: '1.8' }}>
              Today, we curate and build modern, working projects across Web Development,
              Java, Python/ML, PHP and Mobile App domains, paired with affordable consultation
              so every student gets real support, not just a zip file.
            </p>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="glass-card" style={{ padding: '2rem' }}>
            <h3 style={{ fontWeight: '700', marginBottom: '1rem' }}>What you get with every project</h3>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', color: 'var(--text-muted)', fontSize: '0.95rem', paddingLeft: '1.2rem' }}>
              <li>Complete, working source code</li>
              <li>Database schema & setup guide</li>
              <li>Project documentation & PPT</li>
              <li>Free updates and support</li>
            </ul>
          </motion.div>
        </div>

        {/* Values */}
        <div className="section-title">
          <h2>Why Choose <span className="gradient-text">Us</span></h2>
          <p>The NexProjecto promise</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '3.5rem' }}>
          {values.map((v, i) => (
            <motion.div key={v.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
              className="glass-card" style={{ padding: '1.5rem' }}>
              <h3 style={{ fontWeight: '700', marginBottom: '0.5rem', color: 'white' }}>{v.title}</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.7' }}>{v.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="glass-card" style={{ padding: '2.5rem', textAlign: 'center' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '0.75rem' }}>Ready to get started?</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
            Browse our project catalog or book a consultation with our team.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/projects" className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
              Browse Projects <FiArrowRight />
            </Link>
            <Link to="/contact" className="btn-outline">Contact Us</Link>
          </div>
        </motion.div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .about-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  )
}
