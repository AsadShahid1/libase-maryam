import { useEffect, useState } from 'react'
import { getUserProfile, updateUserProfile } from '@/api'
import { useAuth } from '@/contexts/AuthContext'

export default function Profile() {
  const { login } = useAuth()
  const [form, setForm] = useState({ name: '', email: '' })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState(null)

  useEffect(() => {
    getUserProfile()
      .then(r => setForm({ name: r.data.name, email: r.data.email }))
      .finally(() => setLoading(false))
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage(null)
    setSaving(true)
    try {
      const { data } = await updateUserProfile(form)
      login(data.user)
      setMessage({ type: 'success', text: 'Profile updated successfully!' })
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Update failed' })
    } finally {
      setSaving(false)
    }
  }

  if (loading) return (
    <div style={{ padding: 60, display: 'flex', justifyContent: 'center' }}>
      <div className="spinner" />
    </div>
  )

  const initials = form.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()

  return (
    <div style={{ padding: 32, maxWidth: 620, margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 32 }}>
        <div style={{
          width: 72, height: 72, borderRadius: '50%',
          background: 'linear-gradient(135deg, var(--brand-500), #a78bfa)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '1.5rem', fontWeight: 700, color: '#fff',
          boxShadow: '0 4px 24px rgba(79,110,247,0.4)',
        }}>{initials}</div>
        <div>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 800 }}>{form.name}</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{form.email}</p>
        </div>
      </div>

      <div className="card">
        <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 24 }}>Edit Profile</h2>

        {message && (
          <div className={`alert alert-${message.type}`}>{message.text}</div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input className="form-input" value={form.name}
              onChange={e => setForm(p => ({ ...p, name: e.target.value }))} required />
          </div>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input className="form-input" type="email" value={form.email}
              onChange={e => setForm(p => ({ ...p, email: e.target.value }))} required />
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Saving…' : 'Save changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
