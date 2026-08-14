import { useState, useEffect } from 'react'
import { usePage, router } from '@inertiajs/react'
import UserLayout from '@/layouts/UserLayout'
import axios from 'axios'

export default function Profile() {
  const { auth } = usePage().props
  const user = auth?.user

  const [form, setForm] = useState({ name: '', email: '' })
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState(null)

  useEffect(() => {
    if (user) {
      setForm({ name: user.name || '', email: user.email || '' })
    }
  }, [user])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage(null)
    setSaving(true)
    try {
      await axios.put('/api/user/profile', form, { withCredentials: true })
      setMessage({ type: 'success', text: 'Profile updated successfully!' })
      router.reload({ only: ['auth'] })
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Update failed' })
    } finally {
      setSaving(false)
    }
  }

  const initials = form.name ? form.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() : '👤'

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

      <div className="card" style={{ padding: 24, border: '1px solid var(--border)' }}>
        <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 24 }}>Edit Profile</h2>

        {message && (
          <div className={`alert alert-${message.type}`} style={{ marginBottom: 16 }}>{message.text}</div>
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

Profile.layout = (page) => <UserLayout>{page}</UserLayout>
