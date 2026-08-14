import { useEffect, useState } from 'react'
import { getAdminRoles, createRole, updateRole, deleteRole } from '@/api'

const ALL_PERMISSIONS = [
  'manage-users', 'manage-roles', 'manage-permissions',
  'view-admin-dashboard', 'view-user-dashboard',
]

function RoleModal({ role, onClose, onSaved }) {
  const [name, setName] = useState(role?.name || '')
  const [permissions, setPermissions] = useState(role?.permissions?.map(p => p.name) || [])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const toggle = (perm) =>
    setPermissions(prev => prev.includes(perm) ? prev.filter(p => p !== perm) : [...prev, perm])

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      if (role) {
        await updateRole(role.id, { permissions })
      } else {
        await createRole({ name, permissions })
      }
      onSaved()
    } catch (err) {
      setError(err.response?.data?.message || 'Error saving role')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <h2 className="modal-title">{role ? `Edit "${role.name}"` : 'Create Role'}</h2>
        {error && <div className="alert alert-error">{error}</div>}
        <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {!role && (
            <div className="form-group">
              <label className="form-label">Role name</label>
              <input className="form-input" value={name}
                onChange={e => setName(e.target.value)} required placeholder="e.g. editor" />
            </div>
          )}
          <div className="form-group">
            <label className="form-label">Permissions</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 4 }}>
              {ALL_PERMISSIONS.map(perm => (
                <label key={perm} style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
                  <input type="checkbox" checked={permissions.includes(perm)}
                    onChange={() => toggle(perm)}
                    style={{ accentColor: 'var(--brand-500)', width: 16, height: 16 }} />
                  <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{perm}</span>
                </label>
              ))}
            </div>
          </div>
          <div className="modal-actions">
            <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Saving…' : role ? 'Save' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function AdminRoles() {
  const [roles, setRoles] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(null)

  const load = () => {
    setLoading(true)
    getAdminRoles().then(r => setRoles(r.data)).finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const handleDelete = async (role) => {
    if (!confirm(`Delete role "${role.name}"?`)) return
    await deleteRole(role.id)
    load()
  }

  return (
    <>
      <div className="topbar">
        <div>
          <div className="topbar-title">Roles & Permissions</div>
          <div className="topbar-breadcrumb">Admin / Roles</div>
        </div>
      </div>
      <div className="page-content">
        <div className="page-header">
          <h1>Manage Roles</h1>
          <button className="btn btn-primary" onClick={() => setModal('create')}>+ New Role</button>
        </div>

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}>
            <div className="spinner" />
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {roles.map(role => (
              <div key={role.id} className="card" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16 }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                    <span className={`badge badge-${role.name}`}>{role.name}</span>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      {role.permissions?.length ?? 0} permissions
                    </span>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {role.permissions?.map(p => (
                      <span key={p.id} style={{
                        padding: '2px 10px', borderRadius: 99, fontSize: '0.72rem',
                        background: 'rgba(255,255,255,0.06)', color: 'var(--text-secondary)',
                        border: '1px solid var(--border)',
                      }}>{p.name}</span>
                    ))}
                    {!role.permissions?.length && (
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>No permissions assigned</span>
                    )}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                  <button className="btn btn-ghost btn-sm" onClick={() => setModal(role)}>Edit</button>
                  <button className="btn btn-danger btn-sm" onClick={() => handleDelete(role)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {modal && (
        <RoleModal
          role={modal === 'create' ? null : modal}
          onClose={() => setModal(null)}
          onSaved={() => { setModal(null); load() }}
        />
      )}
    </>
  )
}
