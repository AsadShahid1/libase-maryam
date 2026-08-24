import { useState, useEffect } from 'react'
import { getShopProducts, getShopMetadata } from '@/api'
import { useCart } from '@/contexts/CartContext'
import { useOutletContext, useSearchParams, Link } from 'react-router-dom'

export default function Products() {
  const { addToCart } = useCart()
  const { categories } = useOutletContext()
  const [searchParams, setSearchParams] = useSearchParams()

  // Shop states
  const [products, setProducts] = useState([])
  const [brands, setBrands] = useState([])
  const [loading, setLoading] = useState(true)

  // Sidebar Filter Values
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '')
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'All')
  const [selectedBrand, setSelectedBrand] = useState('')
  const [selectedSize, setSelectedSize] = useState('')
  const [selectedColor, setSelectedColor] = useState('')
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')

  // Sync state from query parameters on mount or change
  useEffect(() => {
    setSelectedCategory(searchParams.get('category') || 'All')
    setSearchQuery(searchParams.get('search') || '')
  }, [searchParams])

  // Load products based on filter changes
  useEffect(() => {
    setLoading(true)
    const params = {
      search: searchQuery,
      category: selectedCategory !== 'All' ? selectedCategory : '',
      brand: selectedBrand,
      size: selectedSize,
      color: selectedColor,
      min_price: minPrice,
      max_price: maxPrice
    }
    getShopProducts(params)
      .then(res => setProducts(res.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [selectedCategory, selectedBrand, selectedSize, selectedColor, minPrice, maxPrice, searchQuery])

  const [allColors, setAllColors] = useState([])

  // Load brands metadata & unique colors list dynamically
  useEffect(() => {
    getShopMetadata()
      .then(res => setBrands(res.data.brands || []))
      .catch(console.error)

    getShopProducts()
      .then(res => {
        const colors = Array.from(new Set(
          res.data.flatMap(p => p.variants?.map(v => v.color) || [])
        )).filter(Boolean)
        setAllColors(colors)
      })
      .catch(console.error)
  }, [])

  const resetFilters = () => {
    setSearchQuery('')
    setSelectedCategory('All')
    setSelectedBrand('')
    setSelectedSize('')
    setSelectedColor('')
    setMinPrice('')
    setMaxPrice('')
    setSearchParams({})
  }

  return (
    <div className="responsive-container" style={{ maxWidth: 1240, margin: '0 auto' }}>
      <div className="products-grid">
        
        {/* ── Left Sidebar Filters ── */}
        <aside className="card" style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 24, border: '1px solid var(--border)', background: 'rgba(255,255,255,0.015)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)', paddingBottom: 12 }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>Filters</h3>
            <button style={{ background: 'none', border: 'none', color: '#d4af37', fontSize: '0.78rem', cursor: 'pointer', fontWeight: 600 }} onClick={resetFilters}>Clear All</button>
          </div>

          {/* Search query inside filters */}
          <div className="form-group">
            <label className="form-label" style={{ color: '#d4af37' }}>Search keyword</label>
            <input type="text" placeholder="Type to search..." className="form-input" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} style={{ padding: 8 }} />
          </div>

          {/* Category Filter */}
          <div className="form-group">
            <label className="form-label" style={{ color: '#d4af37' }}>Categories</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 8 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: '0.85rem' }}>
                <input type="radio" name="filter_cat" checked={selectedCategory === 'All'} onChange={() => { setSelectedCategory('All'); setSearchParams({}); }} style={{ accentColor: '#d4af37' }} />
                <span>All Categories</span>
              </label>
              {categories.map(cat => (
                <label key={cat.id} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: '0.85rem' }}>
                  <input type="radio" name="filter_cat" checked={selectedCategory === cat.slug} onChange={() => { setSelectedCategory(cat.slug); setSearchParams({ category: cat.slug }); }} style={{ accentColor: '#d4af37' }} />
                  <span>{cat.name}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Brand/Line Filter */}
          <div className="form-group">
            <label className="form-label" style={{ color: '#d4af37' }}>Collection Line</label>
            <select className="form-input" value={selectedBrand} onChange={e => setSelectedBrand(e.target.value)} style={{ padding: 8 }}>
              <option value="">All Lines</option>
              {brands.map(b => <option key={b.id} value={b.slug}>{b.name}</option>)}
            </select>
          </div>

          {/* Sizing Filter */}
          <div className="form-group">
            <label className="form-label" style={{ color: '#d4af37' }}>Size Selection</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6, marginTop: 6 }}>
              {['S', 'M', 'L', 'XL'].map(sz => (
                <button
                  key={sz}
                  onClick={() => setSelectedSize(selectedSize === sz ? '' : sz)}
                  style={{
                    padding: '6px 0', border: '1px solid var(--border)',
                    background: selectedSize === sz ? '#d4af37' : 'rgba(255,255,255,0.03)',
                    color: selectedSize === sz ? '#000' : 'var(--text-secondary)',
                    borderRadius: 4, cursor: 'pointer', fontWeight: 600, fontSize: '0.8rem',
                    transition: '0.2s'
                  }}
                >
                  {sz}
                </button>
              ))}
            </div>
          </div>

          {/* Color Filter */}
          <div className="form-group">
            <label className="form-label" style={{ color: '#d4af37' }}>Colors</label>
            <select className="form-input" value={selectedColor} onChange={e => setSelectedColor(e.target.value)} style={{ padding: 8 }}>
              <option value="">All Colors</option>
              {allColors.map(color => (
                <option key={color} value={color}>{color}</option>
              ))}
            </select>
          </div>

          {/* Price Range Filter */}
          <div className="form-group">
            <label className="form-label" style={{ color: '#d4af37' }}>Price Limit (PKR)</label>
            <div style={{ display: 'flex', gap: 8, marginTop: 6 }}>
              <input type="number" placeholder="Min" className="form-input" value={minPrice} onChange={e => setMinPrice(e.target.value)} style={{ padding: 6, fontSize: '0.8rem' }} />
              <input type="number" placeholder="Max" className="form-input" value={maxPrice} onChange={e => setMaxPrice(e.target.value)} style={{ padding: 6, fontSize: '0.8rem' }} />
            </div>
          </div>

        </aside>

        {/* ── Right Products Grid ── */}
        <section>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.75rem', fontWeight: 600, color: 'var(--text-primary)' }}>
              Boutique Catalog
            </h1>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Showing {products.length} products
            </span>
          </div>

          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}><div className="spinner" /></div>
          ) : products.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px 20px', color: 'var(--text-muted)' }}>
              <div style={{ fontSize: '3rem', marginBottom: 16 }}>👘</div>
              <p>No products match your active sidebar filters.</p>
            </div>
          ) : (
            <div className="boutique-grid" style={{ padding: 0 }}>
              {products.map(product => (
                <div key={product.id} className="product-card" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div className="product-image-container" style={{ border: '1px solid var(--border)' }}>
                    <Link to={`/product/${product.id}`} style={{ display: 'block', height: '100%', width: '100%' }}>
                      <img src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </Link>
                    <div className="product-card-overlay">
                      <button
                        className="btn btn-primary"
                        style={{ background: '#fff', color: '#000', width: '100%', fontWeight: 700 }}
                        onClick={() => addToCart(product)}
                        disabled={product.stock === 0}
                      >
                        {product.stock === 0 ? 'Out of Stock' : 'Add to Bag 👜'}
                      </button>
                    </div>
                  </div>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#d4af37', fontWeight: 700 }}>
                        {product.category?.name || product.category_id}
                      </span>
                      {product.stock === 0 && (
                        <span className="badge badge-danger" style={{ fontSize: '0.65rem' }}>Out of Stock</span>
                      )}
                    </div>
                    <h3 style={{ fontSize: '1.02rem', fontWeight: 600, margin: '8px 0', minHeight: 44, color: 'var(--text-primary)' }}>
                      <Link to={`/product/${product.id}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                        {product.name}
                      </Link>
                    </h3>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: 14, minHeight: 50 }}>
                      {product.description?.slice(0, 100)}...
                    </p>
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        {product.is_on_sale ? (
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <span style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)' }}>PKR {product.sale_price.toLocaleString()}</span>
                            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>PKR {product.price.toLocaleString()}</span>
                          </div>
                        ) : (
                          <span style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)' }}>PKR {product.price.toLocaleString()}</span>
                        )}
                      </div>
                      <button
                        className="btn btn-ghost btn-sm"
                        onClick={() => addToCart(product)}
                        disabled={product.stock === 0}
                        style={{ padding: '6px 12px', fontSize: '0.78rem' }}
                      >
                        Buy
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

      </div>
    </div>
  )
}
