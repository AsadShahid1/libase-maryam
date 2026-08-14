import { useEffect, useState } from 'react'
import { getAdminCategories, createCategory, updateCategory, deleteCategory } from '@/api'

export default function Categories() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState({ name: '', description: '', image: '' })
  const [editing, setEditing] = useState(null)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')

  const loadCategories = () => {
    setLoading(true)
    getAdminCategories()
      .then(r => setCategories(r.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    loadCategories()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      if (editing) {
        await updateCategory(editing.id, form)
      } else {
        await createCategory(form)
      }
      setModalOpen(false)
      setForm({ name: '', description: '', image: '' })
      setEditing(null)
      loadCategories()
    } catch (err) {
      setError(err.response?.data?.message || 'Action failed')
    }
  }

  const handleEdit = (category) => {
    setEditing(category)
    setForm({
      name: category.name,
      description: category.description || '',
      image: category.image || ''
    })
    setModalOpen(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      await deleteCategory(id)
      loadCategories()
    }
  }

  const filteredCategories = categories.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (c.description && c.description.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  return (
    <div>
      <div className="page-header">
        <h1>Boutique Categories</h1>
        <button className="btn btn-primary" onClick={() => { setForm({ name: '', description: '', image: '' }); setEditing(null); setModalOpen(true); }} style={{ background: '#d4af37', color: '#000', border: 'none', fontWeight: 700 }}>
          + Add Category
        </button>
      </div>

      {/* Search Bar */}
      <div style={{ marginBottom: 20, maxWidth: 360 }}>
        <input
          type="text"
          placeholder="🔍 Search categories..."
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
                <th>Category Name</th>
                <th>Slug</th>
                <th>Description</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCategories.length === 0 ? (
                <tr>
                  <td colSpan="4" style={{ textAlign: 'center', padding: 24, color: 'var(--text-muted)' }}>No categories found.</td>
                </tr>
              ) : (
                filteredCategories.map(category => (
                  <tr key={category.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <img src={category.image || '/assets/product_silk.jpg'} alt="" style={{ width: 36, height: 48, objectFit: 'cover', borderRadius: 4 }} />
                        <strong style={{ color: 'var(--text-primary)' }}>{category.name}</strong>
                      </div>
                    </td>
                    <td><code>{category.slug}</code></td>
                    <td>{category.description || <span style={{ color: 'var(--text-muted)' }}>No description</span>}</td>
                    <td style={{ textAlign: 'right' }}>
                      <button className="btn btn-ghost btn-sm" onClick={() => handleEdit(category)} style={{ marginRight: 8 }}>Edit</button>
                      <button className="btn btn-ghost btn-sm" onClick={() => handleDelete(category.id)} style={{ color: 'var(--danger)' }}>Delete</button>
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
            <h2 className="modal-title">{editing ? 'Edit Category' : 'Add Category'}</h2>
            {error && <div className="alert alert-error">{error}</div>}
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div className="form-group">
                <label className="form-label">Category Name</label>
                <input className="form-input" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} required />
              </div>
              <div className="form-group">
                <label className="form-label">Image URL / Path</label>
                <input className="form-input" placeholder="e.g. /assets/product_silk.jpg" value={form.image} onChange={e => setForm(p => ({ ...p, image: e.target.value }))} />
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea className="form-input" value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} style={{ minHeight: 80 }} />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-ghost" onClick={() => setModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" style={{ background: '#d4af37', color: '#000', border: 'none' }}>Save Category</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
