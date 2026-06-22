import { motion } from 'framer-motion'
import { FaWhatsapp } from 'react-icons/fa'
import { trackEvent } from '../utils/analytics'

// 🔧 Change your WhatsApp number here (with country code, no + or spaces)
const WHATSAPP_NUMBER = '918104227377'
const DEFAULT_MESSAGE = `Hello and welcome to NexProjecto Pvt. Ltd. ✨
We appreciate your interest in our services.
At NexProjecto, we transform ideas into professional digital solutions through website development, branding, and customized project services.
Kindly share your project details, and we will guide you through the process.
We look forward to collaborating with you 💜`

export default function WhatsAppButton() {
  const link = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(DEFAULT_MESSAGE)}`

  return (
    <motion.a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => trackEvent('whatsapp_click', 'floating_button')}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 1, type: 'spring', stiffness: 200 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      aria-label="Chat with us on WhatsApp"
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        width: '58px',
        height: '58px',
        borderRadius: '50%',
        background: '#25D366',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 4px 20px rgba(37, 211, 102, 0.5)',
        zIndex: 2000,
        textDecoration: 'none'
      }}
    >
      <FaWhatsapp style={{ color: 'white', fontSize: '2rem' }} />
    </motion.a>
  )
}
