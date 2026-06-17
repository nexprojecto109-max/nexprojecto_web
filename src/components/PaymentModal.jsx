import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiX, FiCopy, FiCheck } from 'react-icons/fi'
import { FaWhatsapp } from 'react-icons/fa'
import toast from 'react-hot-toast'
import { WHATSAPP_NUMBER_DISPLAY } from '../utils/emailService'

// ─────────────────────────────────────────────────────────────
// 🔧 PAYMENT CONFIG — change this to YOUR UPI ID
// ─────────────────────────────────────────────────────────────
const UPI_ID = 'nexprojecto@upi'     // <-- replace with your real UPI ID
const PAYEE_NAME = 'NexProjecto'

const WHATSAPP_NUMBER = '918104227377'

export default function PaymentModal({ project, onClose, onConfirm }) {
  const [step, setStep] = useState('pay') // 'pay' | 'confirm'
  const [phone, setPhone] = useState('')
  const [txnId, setTxnId] = useState('')
  const [copied, setCopied] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  // Build a standard UPI deep link — most UPI apps can scan/open this
  const upiLink = `upi://pay?pa=${UPI_ID}&pn=${encodeURIComponent(PAYEE_NAME)}&am=${project.price}&cu=INR&tn=${encodeURIComponent('Order: ' + project.title)}`

  // QR code generated via free public API (no key needed)
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=260x260&data=${encodeURIComponent(upiLink)}`

  const copyUpi = () => {
    navigator.clipboard.writeText(UPI_ID)
    setCopied(true)
    toast.success('UPI ID copied!')
    setTimeout(() => setCopied(false), 2000)
  }

  const handleSubmit = async () => {
    if (!phone.trim()) {
      toast.error('Please enter your WhatsApp number')
      return
    }
    if (!txnId.trim()) {
      toast.error('Please enter the UPI transaction / reference ID')
      return
    }

    // Open WhatsApp FIRST (synchronously, inside the click handler) so the
    // browser doesn't block the popup. Then save the order / send emails.
    const adminMsg =
      `🛒 New Order - NexProjecto\n` +
      `Project: ${project.title}\n` +
      `Amount: ₹${project.price}\n` +
      `My WhatsApp: ${phone.trim()}\n` +
      `UPI Txn ID: ${txnId.trim()}\n\n` +
      `I've completed the payment. Please verify and send the project files. Sending payment screenshot now.`

    const adminLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(adminMsg)}`
    window.open(adminLink, '_blank')

    setSubmitting(true)
    await onConfirm({ phone: phone.trim(), transactionId: txnId.trim() })
    setSubmitting(false)
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0, background: 'rgba(5,3,12,0.75)',
          backdropFilter: 'blur(6px)', zIndex: 3000,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '1rem'
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          onClick={e => e.stopPropagation()}
          className="glass-card"
          style={{
            width: '100%', maxWidth: 440, padding: '2rem',
            maxHeight: '90vh', overflowY: 'auto', position: 'relative'
          }}
        >
          <button
            onClick={onClose}
            style={{
              position: 'absolute', top: '1rem', right: '1rem',
              background: 'rgba(255,255,255,0.08)', border: 'none',
              borderRadius: '8px', width: 36, height: 36,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'var(--text-muted)', cursor: 'pointer', fontSize: '1.1rem'
            }}
          >
            <FiX />
          </button>

          {step === 'pay' && (
            <>
              <h2 style={{ fontWeight: '800', fontSize: '1.4rem', marginBottom: '0.25rem' }}>
                Complete Your Payment
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
                {project.title}
              </p>

              <div style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
                <div style={{ fontSize: '2.2rem', fontWeight: '900' }} className="gradient-text">
                  ₹{project.price}
                </div>
              </div>

              <div style={{
                background: 'white', borderRadius: '12px', padding: '1rem',
                display: 'flex', justifyContent: 'center', marginBottom: '1.25rem'
              }}>
                <img src={qrUrl} alt="UPI QR Code" style={{ width: 220, height: 220 }} />
              </div>

              <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1rem' }}>
                Scan this QR with any UPI app (GPay, PhonePe, Paytm) <br />or pay manually using the UPI ID below.
              </p>

              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.3)',
                borderRadius: '10px', padding: '0.75rem 1rem', marginBottom: '1.5rem'
              }}>
                <span style={{ fontWeight: '600', fontFamily: 'monospace' }}>{UPI_ID}</span>
                <button
                  onClick={copyUpi}
                  style={{
                    background: 'none', border: 'none', color: 'var(--primary-light)',
                    cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.85rem'
                  }}
                >
                  {copied ? <FiCheck /> : <FiCopy />} {copied ? 'Copied' : 'Copy'}
                </button>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                className="btn-primary"
                style={{ width: '100%', padding: '0.9rem' }}
                onClick={() => setStep('confirm')}
              >
                I've Made the Payment ✅
              </motion.button>
            </>
          )}

          {step === 'confirm' && (
            <>
              <h2 style={{ fontWeight: '800', fontSize: '1.4rem', marginBottom: '0.25rem' }}>
                Confirm Your Order
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
                Enter your details so we can send you the project files & support on WhatsApp.
              </p>

              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label>WhatsApp Number</label>
                <input
                  type="tel"
                  placeholder="e.g. 9876543210"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                />
              </div>

              <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                <label>UPI Transaction / Reference ID</label>
                <input
                  type="text"
                  placeholder="12-digit UPI Ref No."
                  value={txnId}
                  onChange={e => setTxnId(e.target.value)}
                />
              </div>

              <div style={{
                background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.2)',
                borderRadius: '10px', padding: '0.85rem 1rem', marginBottom: '1.5rem',
                fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.6'
              }}>
                After confirming, our team will verify your payment and send the complete
                <strong> project files, source code, documentation & setup help </strong>
                on your WhatsApp number. You'll also get a confirmation email.
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                className="btn-primary"
                style={{ width: '100%', padding: '0.9rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}
                onClick={handleSubmit}
                disabled={submitting}
              >
                <FaWhatsapp /> {submitting ? 'Submitting...' : 'Confirm & Send Details on WhatsApp'}
              </motion.button>

              <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.78rem', marginBottom: '0.5rem' }}>
                A WhatsApp tab will open with your order details — please also attach your payment screenshot there.
              </p>

              <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '0.5rem' }}>
                If WhatsApp doesn't open automatically, message us directly at {WHATSAPP_NUMBER_DISPLAY}
              </p>
            </>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
