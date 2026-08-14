import { useEffect, useState } from 'react'
import { getAdminBanners, createBanner, updateBanner, deleteBanner } from '@/api'

export default function Banners() {
  const [banners, setBanners] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState({ title: '', subtitle: '', image: '', link: '', position: 'homepage' })
  const [editing, setEditing] = useState(null)
  const [error, setError] = useState('')

  const loadBanners = () => {
    setLoading(true)
    getAdminBanners()
      .then(r => setBanners(r.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    loadBanners()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      if (editing) {
        await updateBanner(editing.id, form)
      } else {
        await createBanner(form)
      }
      setModalOpen(false)
      setForm({ title: '', subtitle: '', image: '', link: '', position: 'homepage' })
      setEditing(null)
      loadBanners()
    } catch (err) {
      setError(err.response?.data?.message || 'Action failed')
    }
  }

  const handleEdit = (banner) => {
    setEditing(banner)
    setForm({
      title: banner.title,
      subtitle: banner.subtitle || '',
      image: banner.image,
      link: banner.link || '',
      position: banner.position || 'homepage'
    })
    setModalOpen(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this banner?')) {
      await deleteBanner(id)
      loadBanners()
    }
  }

  return (
    <div>
      <div className="page-header">
        <h1>Store Banners</h1>
        <button className="btn btn-primary" onClick={() => { setForm({ title: '', subtitle: '', image: '', link: '', position: 'homepage' }); setEditing(null); setModalOpen(true); }} style={{ background: '#d4af37', color: '#000', border: 'none', fontWeight: 700 }}>
          + Add New Banner
        </button>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: 40 }}><div className="spinner" /></div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 24 }}>
          {banners.map(banner => (
            <div key={banner.id} className="card" style={{ padding: 0, overflow: 'hidden', border: '1px solid var(--border)' }}>
              <img src={banner.image} alt={banner.title} style={{ width: '100%', height: 160, objectFit: 'cover' }} />
              <div style={{ padding: 20 }}>
                <span className="badge badge-primary" style={{ fontSize: '0.68rem', background: '#d4af37', color: '#000', marginBottom: 8, display: 'inline-block' }}>{banner.position}</span>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: '4px 0 6px', color: 'var(--text-primary)' }}>{banner.title}</h3>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', minHeight: 38 }}>{banner.subtitle || <span style={{ color: 'var(--text-muted)' }}>No subtitle</span>}</p>
                {banner.link && <div style={{ fontSize: '0.78rem', color: '#d4af37', marginBottom: 12 }}>Link: <code>{banner.link}</code></div>}
                <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', borderTop: '1px solid var(--border)', paddingTop: 14 }}>
                  <button className="btn btn-ghost btn-sm" onClick={() => handleEdit(banner)}>Edit</button>
                  <button className="btn btn-ghost btn-sm" onClick={() => handleDelete(banner.id)} style={{ color: 'var(--danger)' }}>Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {modalOpen && (
        <div className="modal-backdrop" onClick={() => setModalOpen(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2 className="modal-title">{editing ? 'Edit Banner' : 'Add Banner'}</h2>
            {error && <div className="alert alert-error">{error}</div>}
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div className="form-group">
                <label className="form-label">Banner Title</label>
                <input className="form-input" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} required />
              </div>
              <div className="form-group">
                <label className="form-label">Subtitle</label>
                <input className="form-input" value={form.subtitle} onChange={e => setForm(p => ({ ...p, subtitle: e.target.value }))} />
              </div>
              <div className="form-group">
                <label className="form-label">Image URL / Path</label>
                <input className="form-input" placeholder="e.g. /assets/product_silk.jpg" value={form.image} onChange={e => setForm(p => ({ ...p, image: e.target.value }))} required />
              </div>
              <div className="form-group">
                <label className="form-label">Redirect Link</label>
                <input className="form-input" placeholder="e.g. /?category=velvet-festive" value={form.link} onChange={e => setForm(p => ({ ...p, link: e.target.value }))} />
              </div>
              <div className="form-group">
                <label className="form-label">Position</label>
                <select className="form-input" value={form.position} onChange={e => setForm(p => ({ ...p, position: e.target.value }))}>
                  <option value="homepage">Homepage slider</option>
                  <option value="sidebar">Sidebar promo</option>
                </select>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-ghost" onClick={() => setModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" style={{ background: '#d4af37', color: '#000', border: 'none' }}>Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
