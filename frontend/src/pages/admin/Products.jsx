import { useEffect, useState } from 'react'
import { getAdminProducts, getShopMetadata, createProduct, updateProduct, deleteProduct } from '@/api'

export default function Products() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [brands, setBrands] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')

  // Form states
  const [form, setForm] = useState({
    name: '', category_id: '', brand_id: '', description: '',
    price: '', sale_price: '', is_on_sale: false, image: '',
    variants: []
  })
  const [editing, setEditing] = useState(null)

  const loadData = () => {
    setLoading(true)
    Promise.all([getAdminProducts(), getShopMetadata()])
      .then(([prodRes, metaRes]) => {
        setProducts(prodRes.data)
        setCategories(metaRes.data.categories || [])
        setBrands(metaRes.data.brands || [])
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleAddVariant = () => {
    setForm(p => ({
      ...p,
      variants: [...p.variants, { size: 'M', color: 'Champagne Gold', stock: 5, sku: '' }]
    }))
  }

  const handleRemoveVariant = (index) => {
    setForm(p => ({
      ...p,
      variants: p.variants.filter((_, idx) => idx !== index)
    }))
  }

  const handleVariantChange = (index, field, value) => {
    setForm(p => {
      const updated = [...p.variants]
      updated[index] = { ...updated[index], [field]: value }
      return { ...p, variants: updated }
    })
  }

  const openAddModal = () => {
    setEditing(null)
    setForm({
      name: '',
      category_id: categories[0]?.id || '',
      brand_id: brands[0]?.id || '',
      description: '',
      price: '',
      sale_price: '',
      is_on_sale: false,
      image: '/assets/product_silk.jpg',
      variants: [{ size: 'M', color: 'Champagne Gold', stock: 5, sku: '' }]
    })
    setError('')
    setModalOpen(true)
  }

  const openEditModal = (prod) => {
    setEditing(prod)
    setForm({
      name: prod.name,
      category_id: prod.category_id,
      brand_id: prod.brand_id,
      description: prod.description || '',
      price: prod.price,
      sale_price: prod.sale_price || '',
      is_on_sale: prod.is_on_sale,
      image: prod.image,
      variants: prod.variants?.map(v => ({
        size: v.size,
        color: v.color,
        stock: v.stock,
        sku: v.sku || ''
      })) || []
    })
    setError('')
    setModalOpen(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      if (editing) {
        await updateProduct(editing.id, form)
      } else {
        await createProduct(form)
      }
      setModalOpen(false)
      loadData()
    } catch (err) {
      setError(err.response?.data?.message || 'Saving product failed')
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product and all its variants?')) {
      await deleteProduct(id)
      loadData()
    }
  }

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.description && p.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (p.variants && p.variants.some(v => v.sku && v.sku.toLowerCase().includes(searchTerm.toLowerCase())))
  )

  return (
    <div>
      <div className="page-header">
        <h1>Boutique Catalog Products</h1>
        <button className="btn btn-primary" onClick={openAddModal} style={{ background: '#d4af37', color: '#000', border: 'none', fontWeight: 700 }}>
          + Add New Product
        </button>
      </div>

      {/* Search Bar */}
      <div style={{ marginBottom: 20, maxWidth: 360 }}>
        <input
          type="text"
          placeholder="🔍 Search products or SKUs..."
          className="form-input"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          style={{ background: 'var(--bg-card)', color: 'var(--text-primary)', border: '1px solid var(--border)' }}
        />
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: 40 }}><div className="spinner" /></div>
      ) : (
        <div className="card" style={{ padding: 0, overflowX: 'auto' }}>
          <table className="table">
            <thead>
              <tr>
                <th>Product Details</th>
                <th>Price (PKR)</th>
                <th>Stock</th>
                <th>Category</th>
                <th>Brand Line</th>
                <th>Variants Count</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: 24, color: 'var(--text-muted)' }}>No products found.</td>
                </tr>
              ) : (
                filteredProducts.map(prod => (
                  <tr key={prod.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <img src={prod.image} alt="" style={{ width: 40, height: 52, objectFit: 'cover', borderRadius: 4 }} />
                        <div>
                          <strong style={{ color: 'var(--text-primary)' }}>{prod.name}</strong>
                          {prod.is_on_sale && <span className="badge badge-success" style={{ marginLeft: 6, fontSize: '0.68rem' }}>On Sale</span>}
                        </div>
                      </div>
                    </td>
                    <td>
                      {prod.is_on_sale ? (
                        <div>
                          <span style={{ color: 'var(--text-primary)', fontWeight: 700 }}>{prod.sale_price.toLocaleString()}</span>
                          <span style={{ textDecoration: 'line-through', color: 'var(--text-muted)', fontSize: '0.78rem', marginLeft: 6 }}>{prod.price.toLocaleString()}</span>
                        </div>
                      ) : (
                        <span>{prod.price.toLocaleString()}</span>
                      )}
                    </td>
                    <td>
                      <span style={{ fontWeight: 700, color: prod.stock > 5 ? 'var(--success)' : 'var(--danger)' }}>
                        {prod.stock} total
                      </span>
                    </td>
                    <td>{prod.category?.name || 'Uncategorized'}</td>
                    <td>{prod.brand?.name || 'Generic'}</td>
                    <td>{prod.variants?.length || 0} configurations</td>
                    <td style={{ textAlign: 'right' }}>
                      <button className="btn btn-ghost btn-sm" onClick={() => openEditModal(prod)} style={{ marginRight: 8 }}>Edit</button>
                      <button className="btn btn-ghost btn-sm" onClick={() => handleDelete(prod.id)} style={{ color: 'var(--danger)' }}>Delete</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal Dialog */}
      {modalOpen && (
        <div className="modal-backdrop" onClick={() => setModalOpen(false)}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 720, maxHeight: '90vh', overflowY: 'auto' }}>
            <h2 className="modal-title">{editing ? 'Edit Boutique Product' : 'Add Boutique Product'}</h2>
            {error && <div className="alert alert-error">{error}</div>}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div className="form-group">
                  <label className="form-label">Product Name</label>
                  <input className="form-input" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Image Asset URL</label>
                  <input className="form-input" value={form.image} onChange={e => setForm(p => ({ ...p, image: e.target.value }))} required />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select className="form-input" value={form.category_id} onChange={e => setForm(p => ({ ...p, category_id: e.target.value }))}>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Brand Line</label>
                  <select className="form-input" value={form.brand_id} onChange={e => setForm(p => ({ ...p, brand_id: e.target.value }))}>
                    {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea className="form-input" value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} style={{ minHeight: 70 }} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, alignItems: 'center' }}>
                <div className="form-group">
                  <label className="form-label">Retail Price (PKR)</label>
                  <input type="number" className="form-input" value={form.price} onChange={e => setForm(p => ({ ...p, price: e.target.value }))} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Sale Price (Optional)</label>
                  <input type="number" className="form-input" value={form.sale_price} onChange={e => setForm(p => ({ ...p, sale_price: e.target.value }))} />
                </div>
                <div className="form-group" style={{ display: 'flex', alignItems: 'center', marginTop: 24, gap: 8 }}>
                  <input type="checkbox" id="isOnSale" checked={form.is_on_sale} onChange={e => setForm(p => ({ ...p, is_on_sale: e.target.checked }))} style={{ width: 18, height: 18 }} />
                  <label htmlFor="isOnSale" style={{ fontSize: '0.85rem', cursor: 'pointer' }}>Apply Sale price</label>
                </div>
              </div>

              {/* Variants Section */}
              <div style={{ borderTop: '1px solid var(--border)', paddingTop: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#d4af37' }}>Product Variants & Stock</h3>
                  <button type="button" className="btn btn-ghost btn-sm" onClick={handleAddVariant}>+ Add Variant Configuration</button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {form.variants.map((v, index) => (
                    <div key={index} style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.5fr 1fr 1.5fr auto', gap: 10, alignItems: 'center', background: 'rgba(0,0,0,0.01)', padding: 10, borderRadius: 6, border: '1px solid var(--border)' }}>
                      <select className="form-input" value={v.size} onChange={e => handleVariantChange(index, 'size', e.target.value)} style={{ padding: 6 }}>
                        <option value="S">Small (S)</option>
                        <option value="M">Medium (M)</option>
                        <option value="L">Large (L)</option>
                        <option value="XL">Extra Large (XL)</option>
                      </select>
                      <input placeholder="Color" className="form-input" value={v.color} onChange={e => handleVariantChange(index, 'color', e.target.value)} required style={{ padding: 6 }} />
                      <input type="number" placeholder="Stock" className="form-input" value={v.stock} onChange={e => handleVariantChange(index, 'stock', e.target.value)} required style={{ padding: 6 }} />
                      <input placeholder="SKU (Auto)" className="form-input" value={v.sku} onChange={e => handleVariantChange(index, 'sku', e.target.value)} style={{ padding: 6 }} />
                      <button type="button" style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer', fontSize: '1.1rem' }} onClick={() => handleRemoveVariant(index)}>✕</button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn btn-ghost" onClick={() => setModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" style={{ background: '#d4af37', color: '#000', border: 'none' }}>Save Catalog Product</button>
              </div>

            </form>
          </div>
        </div>
      )}
    </div>
  )
}
