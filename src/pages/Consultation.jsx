import { useState } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { addConsultationDoc } from '../firebase/firestoreService'
import toast from 'react-hot-toast'
import { FiMessageCircle, FiClock, FiVideo, FiPhone } from 'react-icons/fi'
import { trackEvent } from '../utils/analytics'

const plans = [
  { id: 'basic', name: 'Basic', price: 299, duration: '30 min', icon: <FiPhone />, features: ['Phone/WhatsApp call', 'Project guidance', 'Bug fixing', 'Q&A session'] },
  { id: 'pro', name: 'Pro', price: 499, duration: '60 min', icon: <FiVideo />, features: ['Video call (Zoom/Meet)', 'Code review', 'Feature implementation', 'PPT guidance', 'Follow-up support'] },
  { id: 'premium', name: 'Premium', price: 999, duration: '2 hours', icon: <FiMessageCircle />, features: ['Everything in Pro', 'Project completion', 'Viva preparation', 'Documentation help', 'Priority support 7 days'] },
]

export default function Consultation() {
  const { user } = useAuth()
  const [selectedPlan, setSelectedPlan] = useState('pro')
  const [form, setForm] = useState({ name: user?.name || '', email: user?.email || '', phone: '', college: '', topic: '', message: '', date: '' })
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      await addConsultationDoc({
        ...form,
        plan: selectedPlan,
        userId: user?.id || null,
        createdAt: new Date().toISOString(),
        status: 'pending'
      })
      trackEvent('consultation_submit', selectedPlan, { amount: plans.find(p => p.id === selectedPlan)?.price })
      setSubmitted(true)
      toast.success('Consultation booked! We\'ll contact you within 2 hours 🎉')
    } catch (err) {
      toast.error('Could not book consultation. Please try again.')
      console.error('[NexProjecto] consultation booking failed:', err)
    }
    setSubmitting(false)
  }

  return (
    <div className="page-wrapper" style={{ padding: '2rem 0 4rem' }}>
      <div className="container">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: '3rem', textAlign: 'center' }}>
          <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: '900', marginBottom: '0.5rem' }}>
            Book <span className="gradient-text">Consultation</span>
          </h1>
          <p style={{ color: 'var(--text-muted)', maxWidth: 500, margin: '0 auto' }}>
            Get expert help from our developers. We'll guide you through your project step by step.
          </p>
        </motion.div>

        {/* Plans */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem', marginBottom: '3rem' }}>
          {plans.map((plan, i) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              onClick={() => setSelectedPlan(plan.id)}
              className="glass-card"
              style={{
                padding: '1.75rem', cursor: 'pointer',
                border: selectedPlan === plan.id ? '2px solid var(--primary)' : '1px solid rgba(139,92,246,0.2)',
                boxShadow: selectedPlan === plan.id ? 'var(--glow)' : 'none',
                transform: selectedPlan === plan.id ? 'scale(1.02)' : 'scale(1)',
                transition: 'all 0.3s'
              }}
            >
              <div style={{
                width: 48, height: 48, background: 'var(--gradient)',
                borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.3rem', marginBottom: '1rem',
                boxShadow: selectedPlan === plan.id ? 'var(--glow)' : 'none'
              }}>{plan.icon}</div>
              <h3 style={{ fontWeight: '700', fontSize: '1.1rem', marginBottom: '0.25rem' }}>{plan.name}</h3>
              <div style={{ marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '1.6rem', fontWeight: '900' }} className="gradient-text">₹{plan.price}</span>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}> / {plan.duration}</span>
              </div>
              <ul style={{ listStyle: 'none', marginTop: '0.75rem' }}>
                {plan.features.map(f => (
                  <li key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.4rem', color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '0.4rem' }}>
                    <span style={{ color: '#10B981', flexShrink: 0 }}>✓</span> {f}
                  </li>
                ))}
              </ul>
              {selectedPlan === plan.id && (
                <div style={{
                  marginTop: '0.75rem', textAlign: 'center',
                  background: 'var(--gradient)', color: 'white',
                  borderRadius: '6px', padding: '0.3rem',
                  fontSize: '0.8rem', fontWeight: '600'
                }}>✓ Selected</div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Booking form */}
        {!submitted ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="glass-card" style={{ maxWidth: 640, margin: '0 auto', padding: '2.5rem' }}>
            <h2 style={{ fontWeight: '700', marginBottom: '1.5rem' }}>Book Your Session</h2>
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label>Your Name</label>
                  <input type="text" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Full name" />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input type="email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="your@email.com" />
                </div>
                <div className="form-group">
                  <label>Phone / WhatsApp</label>
                  <input type="tel" required value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="+91 9876543210" />
                </div>
                <div className="form-group">
                  <label>College Name</label>
                  <input type="text" required value={form.college} onChange={e => setForm({ ...form, college: e.target.value })} placeholder="Your college" />
                </div>
                <div className="form-group">
                  <label>Project Topic</label>
                  <input type="text" required value={form.topic} onChange={e => setForm({ ...form, topic: e.target.value })} placeholder="E.g. MERN Stack E-commerce" />
                </div>
                <div className="form-group">
                  <label>Preferred Date</label>
                  <input type="date" required value={form.date} onChange={e => setForm({ ...form, date: e.target.value })}
                    min={new Date().toISOString().split('T')[0]} />
                </div>
              </div>
              <div className="form-group">
                <label>Message (Optional)</label>
                <textarea rows={3} value={form.message} onChange={e => setForm({ ...form, message: e.target.value })}
                  placeholder="Describe your requirements..." />
              </div>
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                type="submit" className="btn-primary" disabled={submitting}
                style={{ width: '100%', padding: '0.9rem', fontSize: '1rem' }}>
                {submitting ? 'Booking...' : `Book ${plans.find(p => p.id === selectedPlan)?.name} Consultation — ₹${plans.find(p => p.id === selectedPlan)?.price}`}
              </motion.button>
            </form>
          </motion.div>
        ) : (
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            className="glass-card" style={{ maxWidth: 500, margin: '0 auto', padding: '3rem', textAlign: 'center' }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem', animation: 'bounce-in 0.6s ease-out' }}>🎉</div>
            <h2 style={{ fontWeight: '800', marginBottom: '0.75rem' }}>Booking Confirmed!</h2>
            <p style={{ color: 'var(--text-muted)', lineHeight: '1.7' }}>
              Thank you! We'll reach out to you within <strong style={{ color: 'var(--primary-light)' }}>2 hours</strong> on your phone/email to confirm the session.
            </p>
            <button className="btn-primary" style={{ marginTop: '1.5rem' }} onClick={() => setSubmitted(false)}>
              Book Another
            </button>
          </motion.div>
        )}
      </div>
    </div>
  )
}
