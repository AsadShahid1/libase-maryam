import { useEffect, useState } from 'react'
import { getAdminBrands, createBrand, updateBrand, deleteBrand } from '@/api'

export default function Brands() {
  const [brands, setBrands] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState({ name: '', description: '' })
  const [editing, setEditing] = useState(null)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')

  const loadBrands = () => {
    setLoading(true)
    getAdminBrands()
      .then(r => setBrands(r.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    loadBrands()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      if (editing) {
        await updateBrand(editing.id, form)
      } else {
        await createBrand(form)
      }
      setModalOpen(false)
      setForm({ name: '', description: '' })
      setEditing(null)
      loadBrands()
    } catch (err) {
      setError(err.response?.data?.message || 'Action failed')
    }
  }

  const handleEdit = (brand) => {
    setEditing(brand)
    setForm({ name: brand.name, description: brand.description || '' })
    setModalOpen(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this brand?')) {
      await deleteBrand(id)
      loadBrands()
    }
  }

  const filteredBrands = brands.filter(b => 
    b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (b.description && b.description.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  return (
    <div>
      <div className="page-header">
        <h1>Boutique Brands & Lines</h1>
        <button className="btn btn-primary" onClick={() => { setForm({ name: '', description: '' }); setEditing(null); setModalOpen(true); }} style={{ background: '#d4af37', color: '#000', border: 'none', fontWeight: 700 }}>
          + Add New Line
        </button>
      </div>

      {/* Search Bar */}
      <div style={{ marginBottom: 20, maxWidth: 360 }}>
        <input
          type="text"
          placeholder="🔍 Search brand lines..."
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
                <th>Line Name</th>
                <th>Slug</th>
                <th>Description</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBrands.length === 0 ? (
                <tr>
                  <td colSpan="4" style={{ textAlign: 'center', padding: 24, color: 'var(--text-muted)' }}>No brand lines found.</td>
                </tr>
              ) : (
                filteredBrands.map(brand => (
                  <tr key={brand.id}>
                    <td><strong style={{ color: 'var(--text-primary)' }}>{brand.name}</strong></td>
                    <td><code>{brand.slug}</code></td>
                    <td>{brand.description || <span style={{ color: 'var(--text-muted)' }}>No description</span>}</td>
                    <td style={{ textAlign: 'right' }}>
                      <button className="btn btn-ghost btn-sm" onClick={() => handleEdit(brand)} style={{ marginRight: 8 }}>Edit</button>
                      <button className="btn btn-ghost btn-sm" onClick={() => handleDelete(brand.id)} style={{ color: 'var(--danger)' }}>Delete</button>
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
            <h2 className="modal-title">{editing ? 'Edit Line' : 'Add Brand Line'}</h2>
            {error && <div className="alert alert-error">{error}</div>}
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div className="form-group">
                <label className="form-label">Line Name</label>
                <input className="form-input" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} required />
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea className="form-input" value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} style={{ minHeight: 80 }} />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-ghost" onClick={() => setModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" style={{ background: '#d4af37', color: '#000', border: 'none' }}>Save Line</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
