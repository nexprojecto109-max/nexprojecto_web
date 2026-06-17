import { useState } from 'react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { FiMail, FiPhone, FiMapPin, FiSend } from 'react-icons/fi'
import { addMessageDoc } from '../firebase/firestoreService'
import { useAuth } from '../context/AuthContext'
import { sendContactEmail, isEmailConfigured } from '../utils/emailService'
import { trackEvent } from '../utils/analytics'

const WHATSAPP_NUMBER = '918104227377'

export default function Contact() {
  const { user } = useAuth()
  const [form, setForm] = useState({ name: user?.name || '', email: user?.email || '', subject: '', message: '' })
  const [submitted, setSubmitted] = useState(false)
  const [sending, setSending] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSending(true)

    try {
      await addMessageDoc({
        ...form,
        userId: user?.id || null,
        date: new Date().toISOString(),
        status: 'new'
      })
    } catch (err) {
      console.error('[NexProjecto] Failed to save contact message:', err)
    }

    trackEvent('contact_submit', form.subject)

    if (!isEmailConfigured(['CONTACT_TEMPLATE_ID'])) {
      // EmailJS not set up — open WhatsApp immediately (within the click
      // gesture) so the popup isn't blocked.
      const waMsg =
        `📩 New Contact Message - NexProjecto\n` +
        `Name: ${form.name}\n` +
        `Email: ${form.email}\n` +
        `Subject: ${form.subject}\n\n` +
        `${form.message}`
      window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(waMsg)}`, '_blank')
      toast.success('Message saved! Opening WhatsApp to send it to us 💜')
      setSending(false)
      setSubmitted(true)
      return
    }

    const result = await sendContactEmail(form)
    if (result.success) {
      toast.success('Message sent! We\'ll get back to you soon 💜')
    } else {
      toast.error('Could not send email. Please try WhatsApp instead.')
    }

    setSending(false)
    setSubmitted(true)
  }

  const info = [
    { icon: <FiMail />, label: 'Email', value: 'nexprojecto109@gmail.com', href: 'mailto:nexprojecto109@gmail.com' },
    { icon: <FiPhone />, label: 'Phone / WhatsApp', value: '+91 81042 27377', href: 'https://wa.me/918104227377' },
    { icon: <FiMapPin />, label: 'Location', value: 'Ahmedabad, Gujarat, India' },
  ]

  return (
    <div className="page-wrapper" style={{ padding: '2rem 0 4rem' }}>
      <div className="container">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: '900', marginBottom: '1rem' }}>
            Get in <span className="gradient-text">Touch</span>
          </h1>
          <p style={{ color: 'var(--text-muted)', maxWidth: 600, margin: '0 auto' }}>
            Have a question about a project, an order, or need help choosing the right one? Send us a message.
          </p>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: '2rem' }} className="contact-grid">
          {/* Info */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {info.map(item => (
              <a
                key={item.label}
                href={item.href || undefined}
                target={item.href ? '_blank' : undefined}
                rel={item.href ? 'noopener noreferrer' : undefined}
                className="glass-card"
                style={{
                  padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem',
                  textDecoration: 'none', color: 'inherit', cursor: item.href ? 'pointer' : 'default'
                }}
              >
                <div style={{
                  width: 44, height: 44, borderRadius: '12px',
                  background: 'rgba(139,92,246,0.15)', color: 'var(--primary-light)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', flexShrink: 0
                }}>{item.icon}</div>
                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{item.label}</div>
                  <div style={{ fontWeight: '600' }}>{item.value}</div>
                </div>
              </a>
            ))}
            <div className="glass-card" style={{ padding: '1.25rem' }}>
              <h3 style={{ fontWeight: '700', marginBottom: '0.5rem' }}>Support Hours</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Mon – Sat: 10:00 AM – 8:00 PM IST</p>
            </div>
          </motion.div>

          {/* Form */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="glass-card" style={{ padding: '2rem' }}>
            {submitted ? (
              <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✅</div>
                <h3 style={{ fontWeight: '700', marginBottom: '0.5rem' }}>Message Sent!</h3>
                <p style={{ color: 'var(--text-muted)' }}>We'll get back to you within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem 1rem' }}>
                  <div className="form-group">
                    <label>Name</label>
                    <input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Your name" />
                  </div>
                  <div className="form-group">
                    <label>Email</label>
                    <input type="email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" />
                  </div>
                  <div className="form-group" style={{ gridColumn: '1/-1' }}>
                    <label>Subject</label>
                    <input required value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} placeholder="How can we help?" />
                  </div>
                  <div className="form-group" style={{ gridColumn: '1/-1' }}>
                    <label>Message</label>
                    <textarea required rows={5} value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} placeholder="Type your message..." />
                  </div>
                </div>
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" className="btn-primary" disabled={sending}
                  style={{ width: '100%', padding: '0.9rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                  <FiSend /> {sending ? 'Sending...' : 'Send Message'}
                </motion.button>
              </form>
            )}
          </motion.div>
        </div>
      </div>

      <style>{`
        @media (max-width: 800px) {
          .contact-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  )
}
