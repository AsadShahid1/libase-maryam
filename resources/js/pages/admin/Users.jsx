import { useEffect, useState } from 'react'
import { getAdminUsers, createUser, updateUser, deleteUser, getAdminRoles } from '@/api'
import AdminLayout from '@/layouts/AdminLayout'

function UserModal({ roles, onClose, onSaved, editing }) {
  const [form, setForm] = useState(
    editing
      ? { name: editing.name, email: editing.email, role: editing.roles?.[0]?.name || 'user', password: '' }
      : { name: '', email: '', password: '', role: 'user' }
  )
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setErrors({})
    setLoading(true)
    try {
      if (editing) {
        const payload = { name: form.name, email: form.email, role: form.role }
        await updateUser(editing.id, payload)
      } else {
        await createUser(form)
      }
      onSaved()
    } catch (err) {
      setErrors(err.response?.data?.errors || { email: [err.response?.data?.message || 'Error'] })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <h2 className="modal-title">{editing ? 'Edit User' : 'Create User'}</h2>
        <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="form-group">
            <label className="form-label">Name</label>
            <input className="form-input" value={form.name}
              onChange={e => setForm(p => ({ ...p, name: e.target.value }))} required />
            {errors.name && <span className="form-error">{errors.name[0]}</span>}
          </div>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input className="form-input" type="email" value={form.email}
              onChange={e => setForm(p => ({ ...p, email: e.target.value }))} required />
            {errors.email && <span className="form-error">{errors.email[0]}</span>}
          </div>
          {!editing && (
            <div className="form-group">
              <label className="form-label">Password</label>
              <input className="form-input" type="password" value={form.password}
                onChange={e => setForm(p => ({ ...p, password: e.target.value }))} required />
            </div>
          )}
          <div className="form-group">
            <label className="form-label">Role</label>
            <select className="form-input" value={form.role}
              onChange={e => setForm(p => ({ ...p, role: e.target.value }))}>
              {roles.map(r => <option key={r.id} value={r.name}>{r.name}</option>)}
            </select>
          </div>
          <div className="modal-actions">
            <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Saving…' : editing ? 'Save changes' : 'Create user'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function AdminUsers({ initialUsers = null }) {
  const pageData = initialUsers || { data: [], meta: {} }
  const [users, setUsers] = useState(pageData.data || [])
  const [roles, setRoles] = useState([])
  const [meta, setMeta] = useState(pageData)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [modal, setModal] = useState(null) // null | 'create' | user object

  const load = () => {
    setLoading(true)
    Promise.all([getAdminUsers(page), getAdminRoles()])
      .then(([usersRes, rolesRes]) => {
        setUsers(usersRes.data.data)
        setMeta(usersRes.data)
        setRoles(rolesRes.data)
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [page])

  const handleDelete = async (id) => {
    if (!confirm('Delete this user?')) return
    await deleteUser(id)
    load()
  }

  const handleSaved = () => {
    setModal(null)
    load()
  }

  return (
    <>
      <div className="topbar">
        <div>
          <div className="topbar-title">Users</div>
          <div className="topbar-breadcrumb">Admin / Users</div>
        </div>
      </div>
      <div className="page-content">
        <div className="page-header">
          <h1>Manage Users</h1>
          <button className="btn btn-primary" onClick={() => setModal('create')}>
            + Add User
          </button>
        </div>

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}>
            <div className="spinner" />
          </div>
        ) : (
          <div className="card" style={{ padding: 0 }}>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr><th>#</th><th>Name</th><th>Email</th><th>Role</th><th>Joined</th><th>Actions</th></tr>
                </thead>
                <tbody>
                  {users.map((u, i) => (
                    <tr key={u.id}>
                      <td style={{ color: 'var(--text-muted)' }}>{(page - 1) * 10 + i + 1}</td>
                      <td style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{u.name}</td>
                      <td>{u.email}</td>
                      <td>
                        {u.roles?.map(r => (
                          <span key={r.id} className={`badge badge-${r.name}`}>{r.name}</span>
                        ))}
                      </td>
                      <td>{new Date(u.created_at).toLocaleDateString()}</td>
                      <td>
                        <div style={{ display: 'flex', gap: 8 }}>
                          <button className="btn btn-ghost btn-sm" onClick={() => setModal(u)}>Edit</button>
                          <button className="btn btn-danger btn-sm" onClick={() => handleDelete(u.id)}>Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {meta.last_page > 1 && (
              <div className="pagination">
                <button className="page-btn" disabled={page === 1} onClick={() => setPage(p => p - 1)}>←</button>
                {Array.from({ length: meta.last_page }, (_, i) => i + 1).map(p => (
                  <button key={p} className={`page-btn ${p === page ? 'active' : ''}`} onClick={() => setPage(p)}>{p}</button>
                ))}
                <button className="page-btn" disabled={page === meta.last_page} onClick={() => setPage(p => p + 1)}>→</button>
              </div>
            )}
          </div>
        )}
      </div>

      {modal && (
        <UserModal
          roles={roles}
          editing={modal === 'create' ? null : modal}
          onClose={() => setModal(null)}
          onSaved={handleSaved}
        />
      )}
    </>
  )
}

AdminUsers.layout = (page) => <AdminLayout>{page}</AdminLayout>

