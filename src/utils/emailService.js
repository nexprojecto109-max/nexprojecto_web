// ─────────────────────────────────────────────────────────────
// EMAIL SERVICE (using EmailJS - https://www.emailjs.com)
// ─────────────────────────────────────────────────────────────
// EmailJS lets you send emails directly from frontend JS (no backend needed).
// FREE plan: 200 emails/month — perfect for a student project store.
//
// 🔧 SETUP STEPS (one-time, takes ~5 minutes):
// 1. Go to https://www.emailjs.com and create a free account.
// 2. Add an Email Service (Gmail) → connect nexprojecto109@gmail.com
//    -> copy the "Service ID"
// 3. Create TWO Email Templates (Email Templates section):
//
//    TEMPLATE A: "Order Notification to Admin"
//      To Email      : nexprojecto109@gmail.com
//      Subject       : New Order: {{project_title}} - {{customer_name}}
//      Body (example):
//        New purchase request received!
//
//        Project   : {{project_title}}
//        Amount    : ₹{{amount}}
//        Customer  : {{customer_name}}
//        Email     : {{customer_email}}
//        Phone     : {{customer_phone}}
//        UPI Txn ID: {{transaction_id}}
//        Order ID  : {{order_id}}
//        Date      : {{order_date}}
//
//      -> copy this template's "Template ID" → ADMIN_TEMPLATE_ID
//
//    TEMPLATE B: "Order Confirmation to Customer"
//      To Email      : {{customer_email}}
//      Subject       : Your NexProjecto Order - {{project_title}}
//      Body (example):
//        Hi {{customer_name}},
//
//        Thank you for purchasing "{{project_title}}" (₹{{amount}}) from
//        NexProjecto!
//
//        We have received your payment confirmation (Txn ID: {{transaction_id}}).
//        Our team will verify it and send you the COMPLETE PROJECT FILES,
//        SOURCE CODE, DOCUMENTATION, and SETUP GUIDE directly on WhatsApp
//        at the number you provided ({{customer_phone}}) within a few hours.
//
//        We will also help you with the project setup and demo on a
//        WhatsApp call if needed.
//
//        For any questions, contact us at:
//        Email   : nexprojecto109@gmail.com
//        WhatsApp: +91 81042 27377
//
//        Order ID: {{order_id}}
//
//        Thanks for choosing NexProjecto!
//
//      -> copy this template's "Template ID" → USER_TEMPLATE_ID
//
// 4. Go to Account → General → copy your "Public Key" → PUBLIC_KEY
//
// 5. Paste all 4 values below. Done! Emails will now be sent automatically
//    whenever a user completes a purchase.
// ─────────────────────────────────────────────────────────────

// ─────────────────────────────────────────────────────────────
//    TEMPLATE C: "Contact Form Message" (for the Contact Us page)
//      To Email      : nexprojecto109@gmail.com
//      Reply To      : {{reply_to}}
//      Subject       : New Contact Message: {{subject}}
//      Body (example):
//        New message from website contact form!
//
//        Name    : {{from_name}}
//        Email   : {{from_email}}
//        Subject : {{subject}}
//
//        Message:
//        {{message}}
//
//      -> copy this template's "Template ID" → CONTACT_TEMPLATE_ID
// ─────────────────────────────────────────────────────────────

import emailjs from '@emailjs/browser'

export const EMAILJS_CONFIG = {
  SERVICE_ID: 'service_km3h4iq',       // e.g. 'service_abc1234'
  ADMIN_TEMPLATE_ID: 'YOUR_ADMIN_TEMPLATE_ID', // e.g. 'template_admin01'
  USER_TEMPLATE_ID: 'YOUR_USER_TEMPLATE_ID',   // e.g. 'template_user01'
  CONTACT_TEMPLATE_ID: 'template_ef1foaf', // e.g. 'template_contact01'
  PUBLIC_KEY: 'gLnyXdJ0CUF_4VGdw',        // e.g. 'AbCdEfGhIjKlMnOp'
}

export const ADMIN_EMAIL = 'nexprojecto109@gmail.com'
export const WHATSAPP_NUMBER_DISPLAY = '+91 81042 27377'

/**
 * Returns true once SERVICE_ID, PUBLIC_KEY and (at least) the relevant
 * template IDs have been filled in.
 */
export function isEmailConfigured(requiredKeys = ['ADMIN_TEMPLATE_ID', 'USER_TEMPLATE_ID']) {
  if (EMAILJS_CONFIG.SERVICE_ID === 'YOUR_SERVICE_ID') return false
  if (EMAILJS_CONFIG.PUBLIC_KEY === 'YOUR_PUBLIC_KEY') return false
  return requiredKeys.every(key => EMAILJS_CONFIG[key] && !EMAILJS_CONFIG[key].startsWith('YOUR_'))
}

/**
 * Sends two emails after a successful order:
 *  1. Notification to the NexProjecto admin email
 *  2. Confirmation to the customer
 *
 * Returns { success: boolean, error?: any }
 */
export async function sendOrderEmails({ order, project, customer }) {
  const isConfigured = isEmailConfigured(['ADMIN_TEMPLATE_ID', 'USER_TEMPLATE_ID'])

  const templateParams = {
    project_title: project.title,
    amount: project.price,
    customer_name: customer.name,
    customer_email: customer.email,
    customer_phone: customer.phone || 'Not provided',
    transaction_id: order.transactionId || 'Not provided',
    order_id: order.id,
    order_date: new Date(order.date).toLocaleString('en-IN'),
  }

  if (!isConfigured) {
    // EmailJS not configured yet — skip silently so the app doesn't crash.
    console.warn(
      '[NexProjecto] EmailJS is not configured yet. ' +
      'Add your Service ID, Template IDs and Public Key in src/utils/emailService.js ' +
      'to enable automatic order emails.'
    )
    return { success: false, error: 'EmailJS not configured' }
  }

  try {
    // Email to admin
    await emailjs.send(
      EMAILJS_CONFIG.SERVICE_ID,
      EMAILJS_CONFIG.ADMIN_TEMPLATE_ID,
      { ...templateParams, to_email: ADMIN_EMAIL },
      EMAILJS_CONFIG.PUBLIC_KEY
    )

    // Confirmation email to customer
    await emailjs.send(
      EMAILJS_CONFIG.SERVICE_ID,
      EMAILJS_CONFIG.USER_TEMPLATE_ID,
      { ...templateParams, to_email: customer.email },
      EMAILJS_CONFIG.PUBLIC_KEY
    )

    return { success: true }
  } catch (error) {
    console.error('[NexProjecto] Failed to send order emails:', error)
    return { success: false, error }
  }
}

/**
 * Sends the Contact Us form message to the NexProjecto admin email.
 * Returns { success: boolean, error?: any }
 */
export async function sendContactEmail({ name, email, subject, message }) {
  const isConfigured = isEmailConfigured(['CONTACT_TEMPLATE_ID'])

  if (!isConfigured) {
    console.warn(
      '[NexProjecto] EmailJS is not configured yet. ' +
      'Add your Service ID, Public Key and CONTACT_TEMPLATE_ID in src/utils/emailService.js ' +
      'to enable contact form emails.'
    )
    return { success: false, error: 'EmailJS not configured' }
  }

  try {
    await emailjs.send(
      EMAILJS_CONFIG.SERVICE_ID,
      EMAILJS_CONFIG.CONTACT_TEMPLATE_ID,
      {
        name,                 // {{name}} - sender's name
        email,                // {{email}} - sender's email (used for Reply To)
        title: subject,       // {{title}} - used in Subject line
        message,              // {{message}} - the message body
        time: new Date().toLocaleString('en-IN'), // {{time}}
      },
      EMAILJS_CONFIG.PUBLIC_KEY
    )
    return { success: true }
  } catch (error) {
    console.error('[NexProjecto] Failed to send contact email:', error)
    return { success: false, error }
  }
}
