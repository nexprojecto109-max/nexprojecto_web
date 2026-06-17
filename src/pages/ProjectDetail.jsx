import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { DB } from '../data/db'
import { useAuth } from '../context/AuthContext'
import { FiStar, FiDownload, FiCheck, FiArrowLeft } from 'react-icons/fi'
import toast from 'react-hot-toast'
import PaymentModal from '../components/PaymentModal'
import { sendOrderEmails } from '../utils/emailService'
import { trackEvent } from '../utils/analytics'
import ReviewSection from '../components/ReviewSection'

export default function ProjectDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user, purchaseProject } = useAuth()
  const project = DB.getProjects().find(p => p.id === id)
  const [showPayment, setShowPayment] = useState(false)

  useEffect(() => {
    if (project) trackEvent('project_view', project.title, { projectId: project.id })
  }, [project?.id])

  if (!project) return (
    <div style={{ textAlign: 'center', padding: '8rem 2rem' }}>
      <h2>Project not found</h2>
    </div>
  )

  const alreadyPurchased = user?.purchasedProjects?.includes(id)
  const discount = Math.round(((project.originalPrice - project.price) / project.originalPrice) * 100)

  const handleBuy = () => {
    trackEvent('buy_click', project.title, { projectId: project.id })
    if (!user) { toast.error('Please login first!'); navigate('/login'); return }
    if (alreadyPurchased) { navigate('/dashboard'); return }
    setShowPayment(true)
  }

  const handlePaymentConfirm = async ({ phone, transactionId }) => {
    const result = await purchaseProject(id, { phone, transactionId })
    if (!result) return
    const { order } = result

    trackEvent('order_placed', project.title, { projectId: project.id, amount: project.price })

    // Fire-and-forget order emails (admin + customer)
    sendOrderEmails({
      order,
      project,
      customer: { name: user.name, email: user.email, phone }
    })

    setShowPayment(false)
    toast.success('Order received! Files will be sent on WhatsApp soon 💜')
    navigate('/dashboard')
  }

  return (
    <div className="page-wrapper" style={{ padding: '2rem 0 4rem' }}>
      <div className="container">
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => navigate(-1)}
          style={{
            display: 'flex', alignItems: 'center', gap: '0.5rem',
            background: 'none', border: 'none', color: 'var(--text-muted)',
            cursor: 'pointer', fontSize: '0.95rem', marginBottom: '1.5rem',
            fontFamily: 'Poppins'
          }}
        >
          <FiArrowLeft /> Back to Projects
        </motion.button>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '2.5rem' }} className="detail-grid">
          {/* Left */}
          <div>
            <motion.img
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              src={project.image}
              alt={project.title}
              style={{ width: '100%', borderRadius: '16px', marginBottom: '1.5rem', maxHeight: 350, objectFit: 'cover' }}
            />

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                <span className="badge badge-purple">{project.category}</span>
                <span className={`badge ${project.level === 'Beginner' ? 'badge-green' : project.level === 'Advanced' ? 'badge-red' : 'badge-yellow'}`}>
                  {project.level}
                </span>
              </div>

              <h1 style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: '800', marginBottom: '1rem' }}>
                {project.title}
              </h1>

              <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#FCD34D' }}>
                  <FiStar style={{ fill: '#FCD34D' }} />
                  <strong>{project.rating}</strong>
                  <span style={{ color: 'var(--text-muted)' }}>({project.reviews} reviews)</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'var(--text-muted)' }}>
                  <FiDownload /> {project.downloads} downloads
                </div>
              </div>

              <p style={{ color: 'var(--text-muted)', lineHeight: '1.8', marginBottom: '2rem', fontSize: '0.95rem' }}>
                {project.description}
              </p>

              <h3 style={{ fontWeight: '700', marginBottom: '0.75rem' }}>Tech Stack</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '2rem' }}>
                {project.techStack.map(tech => (
                  <span key={tech} style={{
                    background: 'rgba(139,92,246,0.15)', border: '1px solid rgba(139,92,246,0.3)',
                    color: 'var(--primary-light)', padding: '0.3rem 0.8rem',
                    borderRadius: '6px', fontSize: '0.85rem', fontWeight: '500'
                  }}>{tech}</span>
                ))}
              </div>

              <h3 style={{ fontWeight: '700', marginBottom: '0.75rem' }}>What's Included</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                {['Complete Source Code', 'Database Schema', 'Project Documentation', 'Setup Guide', 'PPT Presentation', ...project.features].map(f => (
                  <div key={f} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                    <FiCheck style={{ color: '#10B981', flexShrink: 0 }} /> {f}
                  </div>
                ))}
              </div>

              <ReviewSection project={project} alreadyPurchased={alreadyPurchased} />
            </motion.div>
          </div>

          {/* Right: Purchase card */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="glass-card" style={{ padding: '2rem', position: 'sticky', top: '100px' }}>
              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ fontSize: '2rem', fontWeight: '900' }} className="gradient-text">
                  ₹{project.price}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.25rem' }}>
                  <span style={{ color: 'var(--text-muted)', textDecoration: 'line-through' }}>₹{project.originalPrice}</span>
                  <span style={{
                    background: '#10B981', color: 'white',
                    padding: '0.15rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: '700'
                  }}>{discount}% OFF</span>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                className="btn-primary"
                style={{ width: '100%', padding: '0.9rem', fontSize: '1rem', marginBottom: '0.75rem' }}
                onClick={handleBuy}
              >
                {alreadyPurchased ? '✅ View in Dashboard' : '🛒 Buy Now'}
              </motion.button>

              {!user && (
                <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  Login required to purchase
                </p>
              )}

              <div style={{ borderTop: '1px solid rgba(139,92,246,0.2)', paddingTop: '1.25rem', marginTop: '1.25rem' }}>
                {['Instant Download', '100% Refund Guarantee', 'Free Updates', 'Technical Support'].map(f => (
                  <div key={f} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.6rem', fontSize: '0.88rem', color: 'var(--text-muted)' }}>
                    <FiCheck style={{ color: '#10B981' }} /> {f}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .detail-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      {showPayment && (
        <PaymentModal
          project={project}
          onClose={() => setShowPayment(false)}
          onConfirm={handlePaymentConfirm}
        />
      )}
    </div>
  )
}
