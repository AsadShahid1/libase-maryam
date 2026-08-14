import { useState } from 'react'
import { usePage } from '@inertiajs/react'
import { submitContactMessage } from '@/api'
import UserLayout from '@/layouts/UserLayout'

export default function Contact() {
  const { settings = {} } = usePage().props
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setSuccess('')
    try {
      const res = await submitContactMessage(form)
      setSuccess(res.data.message || 'Thank you! Your message has been sent successfully.')
      setForm({ name: '', email: '', subject: '', message: '' })
    } catch (err) {
      setSuccess('Failed to submit message. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ padding: '60px 20px', background: 'var(--bg-light)', minHeight: 'calc(100vh - 74px)' }}>
      <div style={{ maxWidth: 1000, margin: '0 auto' }}>
        
        {/* Page Header */}
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <span style={{ fontSize: '0.8rem', color: '#b89028', textTransform: 'uppercase', letterSpacing: '0.15em', fontWeight: 700 }}>Get In Touch</span>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2.5rem', marginTop: 8, color: 'var(--text-primary)' }}>
            Contact Our Boutique
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: 6 }}>
            Have questions about our collections, sizing, or custom tailoring orders? Reach out to us.
          </p>
          <div style={{ width: 60, height: 2, background: '#d4af37', margin: '20px auto 0' }} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1.9fr', gap: 40 }}>
          
          {/* Left Column: Contact Details Cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            
            {/* Address Card */}
            <div className="card" style={{ padding: 24, border: '1px solid var(--border)' }}>
              <div style={{ fontSize: '1.5rem', marginBottom: 12 }}>📍</div>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: 6 }}>Boutique Address</h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                {settings.company_address || 'DHA Phase 5, Lahore.'}
              </p>
            </div>

            {/* Phone Card */}
            <div className="card" style={{ padding: 24, border: '1px solid var(--border)' }}>
              <div style={{ fontSize: '1.5rem', marginBottom: 12 }}>📞</div>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: 6 }}>Phone & WhatsApp</h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                {settings.company_phone || '0321-4676591'}
              </p>
            </div>

            {/* Email Card */}
            <div className="card" style={{ padding: 24, border: '1px solid var(--border)' }}>
              <div style={{ fontSize: '1.5rem', marginBottom: 12 }}>✉️</div>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: 6 }}>Email Inquiries</h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                {settings.company_email || 'info@libasemaryam.com'}
              </p>
            </div>

          </div>

          {/* Right Column: Contact Inquiry Form */}
          <div className="card" style={{ padding: 36, border: '1px solid var(--border)', background: '#ffffff' }}>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.4rem', color: 'var(--text-primary)', marginBottom: 20 }}>
              Send Inquiry Message
            </h2>

            {success && (
              <div className={`alert alert-${success.includes('Failed') ? 'error' : 'success'}`} style={{ marginBottom: 20 }}>
                {success}
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div className="form-group">
                  <label className="form-label" style={{ color: 'var(--text-secondary)' }}>Your Name</label>
                  <input
                    type="text"
                    className="form-input"
                    value={form.name}
                    onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                    required
                    style={{ background: 'rgba(0,0,0,0.01)', border: '1px solid var(--border)' }}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" style={{ color: 'var(--text-secondary)' }}>Email Address</label>
                  <input
                    type="email"
                    className="form-input"
                    value={form.email}
                    onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                    required
                    style={{ background: 'rgba(0,0,0,0.01)', border: '1px solid var(--border)' }}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" style={{ color: 'var(--text-secondary)' }}>Subject / Topic</label>
                <input
                  type="text"
                  className="form-input"
                  value={form.subject}
                  onChange={e => setForm(p => ({ ...p, subject: e.target.value }))}
                  required
                  placeholder="e.g. Sizing query, custom order status..."
                  style={{ background: 'rgba(0,0,0,0.01)', border: '1px solid var(--border)' }}
                />
              </div>

              <div className="form-group">
                <label className="form-label" style={{ color: 'var(--text-secondary)' }}>Message / Query Details</label>
                <textarea
                  className="form-input"
                  value={form.message}
                  onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
                  required
                  rows="6"
                  placeholder="Describe your inquiry in detail..."
                  style={{ background: 'rgba(0,0,0,0.01)', border: '1px solid var(--border)', minHeight: 120 }}
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                style={{ background: 'linear-gradient(135deg, #d4af37, #aa820a)', border: 'none', color: '#000', fontWeight: 700, padding: '12px 24px', alignSelf: 'flex-start' }}
                disabled={loading}
              >
                {loading ? 'Sending Query…' : 'Submit Inquiry'}
              </button>

            </form>
          </div>

        </div>

      </div>
    </div>
  )
}

Contact.layout = (page) => <UserLayout>{page}</UserLayout>

