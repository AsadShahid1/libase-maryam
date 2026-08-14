import { useEffect, useState } from 'react'
import { getUserDashboard } from '@/api'
import { useAuth } from '@/contexts/AuthContext'

export default function UserDashboard() {
  const { user } = useAuth()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getUserDashboard()
      .then(r => setData(r.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <div style={{ padding: 60, display: 'flex', justifyContent: 'center' }}>
      <div className="spinner" />
    </div>
  )

  return (
    <div style={{ padding: 32, maxWidth: 900, margin: '0 auto' }}>
      {/* Welcome banner */}
      <div className="dashboard-welcome">
        <h2>👋 {data?.message}</h2>
        <p>Here's what's happening with your account.</p>
      </div>

      {/* Info cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20, marginBottom: 28 }}>
        <div className="card">
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>Your Roles</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {data?.roles?.map(r => (
              <span key={r} className={`badge badge-${r}`}>{r}</span>
            ))}
          </div>
        </div>

        <div className="card">
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>Your Permissions</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {data?.permissions?.length ? data.permissions.map(p => (
              <span key={p} style={{ padding: '2px 8px', borderRadius: 99, fontSize: '0.72rem', background: 'rgba(255,255,255,0.06)', color: 'var(--text-secondary)', border: '1px solid var(--border)' }}>{p}</span>
            )) : <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>No permissions</span>}
          </div>
        </div>

        <div className="card">
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>Account</div>
          <div style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: 4 }}>{user?.name}</div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{user?.email}</div>
        </div>
      </div>

      {/* Quick links */}
      <div className="card">
        <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: 16 }}>Quick actions</h3>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <a href="/profile" className="btn btn-ghost">✏️ Edit Profile</a>
          {user?.roles?.includes('admin') && (
            <a href="/admin" className="btn btn-primary">🛡️ Admin Panel</a>
          )}
        </div>
      </div>
    </div>
  )
}
