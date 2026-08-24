import { Link } from '@inertiajs/react'
import AdminLayout from '@/layouts/AdminLayout'

const StatCard = ({ label, value, emoji, color }) => (
  <div className="stat-card" style={{ '--stat-color': color, background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '24px', display: 'flex', flexDirection: 'column', gap: 6 }}>
    <div style={{ fontSize: '1.8rem' }}>{emoji}</div>
    <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)' }}>{value ?? '–'}</div>
    <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{label}</div>
  </div>
)

export default function AdminDashboard({ stats = {}, recent_users = [], recent_messages = [] }) {
  return (
    <>
      <div className="page-header" style={{ marginBottom: 28 }}>
        <div>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.8rem', color: 'var(--text-primary)' }}>Dashboard Overview</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', marginTop: 4 }}>LibaseMaryam Management Dashboard</p>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
        {/* Stats Grid */}
        <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20 }}>
          <StatCard label="Total Products" value={stats.total_products} emoji="👗" color="#d4af37" />
          <StatCard label="Brand Lines" value={stats.total_brands} emoji="🏷️" color="#4f6ef7" />
          <StatCard label="Categories" value={stats.total_categories} emoji="🗂️" color="#22c55e" />
          <StatCard label="Unread Messages" value={stats.unread_messages} emoji="✉️" color="#ef4444" />
          <StatCard label="Total Users" value={stats.total_users} emoji="👥" color="#a78bfa" />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: 32 }}>
          
          {/* Recent Messages */}
          <div className="card" style={{ padding: 24, border: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h2 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>Recent Inquiries</h2>
              <Link href="/admin/contacts" style={{ fontSize: '0.78rem', color: '#d4af37', textDecoration: 'none' }}>View Inbox →</Link>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {recent_messages.length === 0 ? (
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>No messages received recently.</p>
              ) : (
                recent_messages.map(msg => (
                  <div key={msg.id} style={{ padding: 12, background: 'rgba(0,0,0,0.01)', borderRadius: 8, border: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-primary)' }}>{msg.name}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: 2 }}>{msg.subject || 'No Subject'}</div>
                    </div>
                    <span className={`badge badge-${msg.read_status ? 'success' : 'danger'}`} style={{ fontSize: '0.65rem' }}>
                      {msg.read_status ? 'Read' : 'New'}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Staff list */}
          <div className="card" style={{ padding: 24, border: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h2 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>Active Staff & Admins</h2>
              <Link href="/admin/administration" style={{ fontSize: '0.78rem', color: '#d4af37', textDecoration: 'none' }}>Manage Staff →</Link>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {recent_users.map(u => (
                <div key={u.id} style={{ padding: 12, background: 'rgba(0,0,0,0.01)', borderRadius: 8, border: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-primary)' }}>{u.name}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 2 }}>{u.email}</div>
                  </div>
                  {u.roles?.map(r => (
                    <span key={r.id} className={`badge badge-${r.name}`} style={{ fontSize: '0.65rem', background: r.name === 'admin' ? 'rgba(212,175,55,0.1)' : 'rgba(0,0,0,0.03)', color: r.name === 'admin' ? '#aa820a' : 'var(--text-secondary)' }}>
                      {r.name === 'admin' ? 'Admin' : 'Staff'}
                    </span>
                  ))}
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </>
  )
}

AdminDashboard.layout = (page) => <AdminLayout>{page}</AdminLayout>
