import { useEffect, useState } from 'react'
import { getAdminStaff, createStaffMember, updateStaffMember, deleteStaffMember } from '@/api'

export default function Administration() {
  const [staff, setStaff] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'user' })
  const [editing, setEditing] = useState(null)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')

  const loadStaff = () => {
    setLoading(true)
    getAdminStaff()
      .then(r => setStaff(r.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    loadStaff()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      if (editing) {
        await updateStaffMember(editing.id, form)
      } else {
        await createStaffMember(form)
      }
      setModalOpen(false)
      setForm({ name: '', email: '', password: '', role: 'user' })
      setEditing(null)
      loadStaff()
    } catch (err) {
      setError(err.response?.data?.message || 'Action failed')
    }
  }

  const handleEdit = (member) => {
    setEditing(member)
    setForm({
      name: member.name,
      email: member.email,
      password: '',
      role: member.roles?.[0]?.name || 'user'
    })
    setModalOpen(true)
  }

  const handleDelete = async (member) => {
    if (window.confirm(`Are you sure you want to delete administrative user ${member.name}?`)) {
      try {
        await deleteStaffMember(member.id)
        loadStaff()
      } catch (err) {
        alert(err.response?.data?.message || 'Delete failed')
      }
    }
  }

  const filteredStaff = staff.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div>
      <div className="page-header">
        <h1>Boutique Administration & Staff</h1>
        <button className="btn btn-primary" onClick={() => { setForm({ name: '', email: '', password: '', role: 'user' }); setEditing(null); setModalOpen(true); }} style={{ background: '#d4af37', color: '#000', border: 'none', fontWeight: 700 }}>
          + Add Staff Account
        </button>
      </div>

      {/* Search Bar */}
      <div style={{ marginBottom: 20, maxWidth: 360 }}>
        <input
          type="text"
          placeholder="🔍 Search staff members..."
          className="form-input"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          style={{ background: 'var(--bg-card)', color: 'var(--text-primary)', border: '1px solid var(--border)' }}
        />
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: 40 }}><div className="spinner" /></div>
      ) : (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email Address</th>
                <th>Role Designation</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStaff.length === 0 ? (
                <tr>
                  <td colSpan="4" style={{ textAlign: 'center', padding: 24, color: 'var(--text-muted)' }}>No staff accounts found.</td>
                </tr>
              ) : (
                filteredStaff.map(member => (
                  <tr key={member.id}>
                    <td><strong style={{ color: 'var(--text-primary)' }}>{member.name}</strong></td>
                    <td><code>{member.email}</code></td>
                    <td>
                      <span className={`badge badge-${member.roles?.[0]?.name === 'admin' ? 'primary' : 'success'}`} style={{
                        background: member.roles?.[0]?.name === 'admin' ? '#d4af37' : 'rgba(0,0,0,0.03)',
                        color: member.roles?.[0]?.name === 'admin' ? '#000' : 'var(--text-secondary)'
                      }}>
                        {member.roles?.[0]?.name === 'admin' ? '🛡️ Super Admin' : '👤 Boutique Staff'}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button className="btn btn-ghost btn-sm" onClick={() => handleEdit(member)} style={{ marginRight: 8 }}>Edit</button>
                      <button className="btn btn-ghost btn-sm" onClick={() => handleDelete(member)} style={{ color: 'var(--danger)' }}>Delete</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {modalOpen && (
        <div className="modal-backdrop" onClick={() => setModalOpen(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2 className="modal-title">{editing ? 'Edit Staff Credentials' : 'Add Staff Account'}</h2>
            {error && <div className="alert alert-error">{error}</div>}
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input className="form-input" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} required />
              </div>
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input type="email" className="form-input" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} required />
              </div>
              <div className="form-group">
                <label className="form-label">Password {editing && '(leave blank to keep current)'}</label>
                <input type="password" className="form-input" value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))} required={!editing} />
              </div>
              <div className="form-group">
                <label className="form-label">Role Level</label>
                <select className="form-input" value={form.role} onChange={e => setForm(p => ({ ...p, role: e.target.value }))}>
                  <option value="user">Boutique Staff Member</option>
                  <option value="admin">Super Administrator</option>
                </select>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-ghost" onClick={() => setModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" style={{ background: '#d4af37', color: '#000', border: 'none' }}>Save Account</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
