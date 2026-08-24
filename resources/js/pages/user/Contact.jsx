import { useState } from 'react'
import { submitContactMessage } from '@/api'
import UserLayout from '@/layouts/UserLayout'

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setLoading(true)
    submitContactMessage(form)
      .then(() => {
        setSuccess('Thank you! Your message has been sent to our boutique concierge team.')
        setForm({ name: '', email: '', subject: '', message: '' })
      })
      .catch(() => setSuccess('Error submitting message. Please try again.'))
      .finally(() => setLoading(false))
  }

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '60px 24px 100px' }}>

      <div style={{ textAlign: 'center', marginBottom: 48 }}>
        <span className="eyebrow-badge">BOUTIQUE CONCIERGE</span>
        <h1 className="font-display" style={{ fontSize: '2.8rem', marginTop: 10, marginBottom: 12 }}>
          Contact Our Team
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.98rem' }}>
          Have sizing inquiries, custom tailoring requests, or delivery queries? Fill in the form below.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 48 }}>

        {/* Contact Form */}
        <div style={{ backgroundColor: '#fff', border: '1px solid var(--border-color)', padding: 36, borderRadius: 'var(--radius-lg)' }}>
          {success && (
            <div className="badge badge-new" style={{ padding: '12px 16px', width: '100%', marginBottom: 20, fontSize: '0.85rem' }}>
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div>
              <label className="form-label">Your Name</label>
              <input
                type="text"
                required
                className="form-input"
                placeholder="Full name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>

            <div>
              <label className="form-label">Email Address</label>
              <input
                type="email"
                required
                className="form-input"
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>

            <div>
              <label className="form-label">Subject</label>
              <input
                type="text"
                required
                className="form-input"
                placeholder="Sizing inquiry / Bespoke order"
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
              />
            </div>

            <div>
              <label className="form-label">Message</label>
              <textarea
                required
                rows={5}
                className="form-input"
                placeholder="How can we assist you today?"
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
              />
            </div>

            <button type="submit" disabled={loading} className="btn btn-dark btn-full btn-lg" style={{ borderRadius: 'var(--radius-pill)', fontWeight: 700 }}>
              {loading ? 'Sending Message…' : 'Send Message →'}
            </button>
          </form>
        </div>

        {/* Boutique Details Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div style={{ backgroundColor: '#fff', border: '1px solid var(--border-color)', padding: 28, borderRadius: 'var(--radius-lg)' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 16 }}>Flagship Boutique</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.7, marginBottom: 16 }}>
              📍 740 Madison Avenue<br />
              New York, NY 10065
            </p>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              📞 Concierge: +1 (800) 555-8920<br />
              ✉️ Email: concierge@aesthetica.com
            </div>
          </div>

          <div style={{ backgroundColor: 'var(--primary-sage-light)', padding: 28, borderRadius: 'var(--radius-lg)' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--primary-sage-dark)', marginBottom: 8 }}>
              Concierge Hours
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: 1.7 }}>
              Monday – Friday: 9:00 AM – 7:00 PM EST<br />
              Saturday: 10:00 AM – 5:00 PM EST<br />
              Sunday: Closed
            </p>
          </div>
        </div>

      </div>

    </div>
  )
}

Contact.layout = (page) => <UserLayout>{page}</UserLayout>
