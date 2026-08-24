import { usePage, Link } from '@inertiajs/react'
import UserLayout from '@/layouts/UserLayout'

export default function UserDashboard({ roles = [], permissions = [] }) {
  const { auth } = usePage().props
  const user = auth?.user

  return (
    <div style={{ padding: 32, maxWidth: 900, margin: '0 auto' }}>
      {/* Welcome banner */}
      <div className="dashboard-welcome" style={{ marginBottom: 28 }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)' }}>
          👋 Welcome back, {user?.name}!
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: 4 }}>
          Here's what's happening with your account.
        </p>
      </div>

      {/* Info cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20, marginBottom: 28 }}>
        <div className="card" style={{ padding: 20, border: '1px solid var(--border)' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>Your Roles</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {roles.map(r => (
              <span key={r} className={`badge badge-${r}`} style={{ fontSize: '0.72rem' }}>{r}</span>
            ))}
          </div>
        </div>

        <div className="card" style={{ padding: 20, border: '1px solid var(--border)' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>Your Permissions</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {permissions.length ? permissions.map(p => (
              <span key={p} style={{ padding: '2px 8px', borderRadius: 99, fontSize: '0.72rem', background: 'rgba(255,255,255,0.06)', color: 'var(--text-secondary)', border: '1px solid var(--border)' }}>{p}</span>
            )) : <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>No permissions</span>}
          </div>
        </div>

        <div className="card" style={{ padding: 20, border: '1px solid var(--border)' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>Account</div>
          <div style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: 4 }}>{user?.name}</div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{user?.email}</div>
        </div>
      </div>

      {/* Quick links */}
      <div className="card" style={{ padding: 20, border: '1px solid var(--border)' }}>
        <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: 16 }}>Quick actions</h3>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <Link href="/profile" className="btn btn-ghost" style={{ textDecoration: 'none' }}>✏️ Edit Profile</Link>
          {user?.is_admin && (
            <Link href="/admin" className="btn btn-primary" style={{ textDecoration: 'none' }}>🛡️ Admin Panel</Link>
          )}
        </div>
      </div>
    </div>
  )
}

UserDashboard.layout = (page) => <UserLayout>{page}</UserLayout>
