import { motion } from 'framer-motion'

const sections = [
  {
    number: '1',
    title: 'About NexProjecto',
    content: [
      'NexProjecto Pvt. Ltd. is a freelance digital solutions company specializing in website development, custom software solutions, branding, logo design, UI/UX design, AI/ML projects, and other customized digital services.',
      'All projects are developed according to the specific requirements, goals, and preferences provided by the client.'
    ]
  },
  {
    number: '2',
    title: 'Project Scope and Requirements',
    content: [
      'The client shall provide complete project requirements, content, images, branding materials, login credentials, and any other necessary information before the project commencement date.',
      'The project scope, features, deliverables, timeline, and pricing will be finalized and documented before development begins.',
      'Any requirements, features, or services requested outside the approved scope shall be considered additional work and may result in revised timelines and additional charges.'
    ]
  },
  {
    number: '3',
    title: 'Payment Terms',
    content: [
      'A minimum advance payment of 50% of the total project value is mandatory before work begins.',
      'Domain registration, hosting services, premium themes, plugins, third-party tools, APIs, software licenses, and other external services are not included in the project cost unless explicitly mentioned in writing.',
      'All scheduled payments must be completed on or before the agreed due dates.',
      'NexProjecto reserves the right to suspend, pause, or terminate the project if payments are delayed or remain outstanding beyond the agreed payment schedule.',
      'Any delay in payment may result in corresponding delays to project timelines and delivery dates.'
    ]
  },
  {
    number: '4',
    title: 'Refund Policy',
    content: [
      'Advance payments are non-refundable once the project has commenced.',
      'In the event of project cancellation by the client after work has started, the client shall be responsible for payment of all work completed up to the cancellation date.',
      'Any third-party costs already incurred, including domain registration, hosting, software licenses, or paid services, are non-refundable.'
    ]
  },
  {
    number: '5',
    title: 'Revision and Change Policy',
    content: [
      'Project requirements, design preferences, and functionality must be finalized before development begins.',
      'The client is entitled to one final revision cycle after the initial project delivery.',
      'Any additional modifications, revisions, or feature requests beyond the agreed scope or approved revision cycle shall be charged at ₹300 per change or as mutually agreed in writing.',
      'Repeated or continuous changes may affect the project timeline and overall cost.'
    ]
  },
  {
    number: '6',
    title: 'Client Responsibilities',
    content: [
      'The client agrees to provide timely feedback, approvals, content, and required information throughout the project duration.',
      'Delays in communication, approvals, or content submission from the client may result in an extension of the project timeline.',
      'The client is solely responsible for ensuring that all content, images, trademarks, and materials provided to NexProjecto comply with applicable laws and do not infringe upon the rights of any third party.'
    ]
  },
  {
    number: '7',
    title: 'Project Delivery and Ownership',
    content: [
      'Final project files, source code, website access credentials, administrative accounts, and all agreed deliverables shall be transferred to the client only after full and final payment has been received.',
      'Until all outstanding payments have been cleared, NexProjecto shall retain full ownership and intellectual property rights over the project.',
      'NexProjecto reserves the right to disable access to development environments or withhold deliverables in cases of non-payment.'
    ]
  },
  {
    number: '8',
    title: 'Support and Communication',
    content: [
      'NexProjecto is committed to providing professional support and assistance throughout the project lifecycle.',
      'Our team is available 24×7 for communication and support requests. Response times may vary depending on request complexity, workload, and time zone differences; however, most inquiries will receive a response within 2–3 hours.',
      'Support after project completion shall be limited to the duration and scope specified in the agreement.',
      'Additional maintenance, updates, or support services beyond the agreed period may be subject to separate charges.'
    ]
  },
  {
    number: '9',
    title: 'Confidentiality',
    content: [
      'Both parties agree to maintain the confidentiality of all project-related information, business data, pricing, credentials, technical documentation, and proprietary materials shared during the engagement.',
      'Neither party shall disclose confidential information to any third party without prior written consent, except where required by law.'
    ]
  },
  {
    number: '10',
    title: 'Portfolio and Marketing Rights',
    content: [
      'Unless otherwise agreed in writing, NexProjecto reserves the right to showcase completed projects, designs, logos, and websites in its portfolio, social media channels, marketing materials, and case studies.',
      'Any confidential information belonging to the client shall not be disclosed.'
    ]
  },
  {
    number: '11',
    title: 'Limitation of Liability',
    content: [
      'NexProjecto shall not be held liable for any indirect, incidental, or consequential losses arising from delays caused by third-party service providers, hosting companies, payment gateways, domain registrars, or client-side actions.',
      'The maximum liability of NexProjecto under this agreement shall not exceed the total amount paid by the client for the project.'
    ]
  },
  {
    number: '12',
    title: 'Acceptance of Terms',
    content: [
      'By signing this agreement, both parties acknowledge that they have read, understood, and agreed to all terms and conditions stated herein.',
      'This agreement shall become effective from the date of execution and shall remain valid until all obligations of both parties have been fulfilled.'
    ]
  }
]

export default function TermsAndConditions() {
  return (
    <div style={{ minHeight: '100vh', paddingTop: '100px', paddingBottom: '5rem' }}>
      <div className="container" style={{ maxWidth: 860 }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{ textAlign: 'center', marginBottom: '3rem' }}
        >
          <span style={{
            background: 'rgba(139,92,246,0.15)',
            border: '1px solid rgba(139,92,246,0.4)',
            color: 'var(--primary-light)',
            padding: '0.4rem 1.2rem',
            borderRadius: '50px',
            fontSize: '0.85rem',
            fontWeight: '600',
            letterSpacing: '0.05em',
            display: 'inline-block',
            marginBottom: '1rem'
          }}>
            Legal
          </span>
          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: '900', marginBottom: '1rem' }}>
            Terms &amp; <span className="gradient-text">Conditions</span>
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1rem', lineHeight: '1.7', maxWidth: 600, margin: '0 auto' }}>
            Please read these terms carefully before engaging with NexProjecto Pvt. Ltd.
            By proceeding with our services, you agree to be bound by the following terms.
          </p>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.75rem' }}>
            Last updated: June 2026
          </p>
        </motion.div>

        {/* Sections */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {sections.map((section, i) => (
            <motion.div
              key={section.number}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05, duration: 0.4 }}
              className="glass-card"
              style={{ padding: '1.75rem 2rem' }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                <div style={{
                  minWidth: 36, height: 36,
                  background: 'var(--gradient)',
                  borderRadius: '8px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: '800', fontSize: '0.85rem', color: 'white',
                  flexShrink: 0, marginTop: '2px'
                }}>
                  {section.number}
                </div>
                <div>
                  <h3 style={{ fontWeight: '700', fontSize: '1.1rem', marginBottom: '0.85rem', color: 'white' }}>
                    {section.title}
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                    {section.content.map((para, j) => (
                      <p key={j} style={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: '1.75', margin: 0 }}>
                        {para}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Footer note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          style={{
            marginTop: '2.5rem',
            textAlign: 'center',
            padding: '1.5rem',
            background: 'rgba(139,92,246,0.08)',
            border: '1px solid rgba(139,92,246,0.25)',
            borderRadius: '14px'
          }}
        >
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.7' }}>
            For any questions regarding these terms, please contact us at{' '}
            <a href="mailto:nexprojecto109@gmail.com" style={{ color: 'var(--primary-light)', textDecoration: 'none' }}>
              nexprojecto109@gmail.com
            </a>{' '}
            or reach us on WhatsApp at{' '}
            <a href="https://wa.me/919106857650" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary-light)', textDecoration: 'none' }}>
              +91 91068 57650
            </a>
          </p>
        </motion.div>
      </div>
    </div>
  )
}
