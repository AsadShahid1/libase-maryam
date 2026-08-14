import { useState, useEffect } from 'react'
import { useCart } from '@/contexts/CartContext'
import { getShopProducts, submitContactMessage } from '@/api'
import { router, Link, usePage } from '@inertiajs/react'
import UserLayout from '@/layouts/UserLayout'
import productSilk from '@/assets/product_silk.jpg'
import productLawn from '@/assets/product_lawn.jpg'
import productVelvet from '@/assets/product_velvet.jpg'

export default function Home({ initialProducts = [], banners: initialBanners = [], brands: initialBrands = [], categories: initialCategories = [], filters = {} }) {
  const { addToCart } = useCart()
  const { settings } = usePage().props
  // Sync URL search/category from server-side filters prop
  const [searchParams] = useState(filters)
  
  // Products & Filtering State
  const [products, setProducts] = useState(initialProducts)
  const [brands, setBrands] = useState(initialBrands)
  const [banners, setBanners] = useState(initialBanners)
  const [loading, setLoading] = useState(false)
  
  // Advanced Filter values
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [selectedSize, setSelectedSize] = useState('')
  const [selectedColor, setSelectedColor] = useState('')
  const [selectedBrand, setSelectedBrand] = useState('')
  const [selectedCategory, setSelectedCategory] = useState(filters.category || 'All')
  const [showFilters, setShowFilters] = useState(false)
  
  // Banner Slide index
  const [currentSlide, setCurrentSlide] = useState(0)

  // Contact Form State
  const [contactForm, setContactForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [contactSuccess, setContactSuccess] = useState('')
  const [contactLoading, setContactLoading] = useState(false)

  // Fetch shop catalog based on filters
  const loadCatalog = () => {
    setLoading(true)
    const activeSearch = searchParams.get('search') || ''
    
    const params = {
      search: activeSearch,
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
  }

  const [allColors, setAllColors] = useState(() => {
    return Array.from(new Set(
      initialProducts.flatMap(p => p.variants?.map(v => v.color) || [])
    )).filter(Boolean)
  })

  // Load unique colors dynamically when filters change
  useEffect(() => {
    getShopProducts()
      .then(res => {
        const colors = Array.from(new Set(
          res.data.flatMap(p => p.variants?.map(v => v.color) || [])
        )).filter(Boolean)
        setAllColors(colors)
      })
      .catch(console.error)
  }, [])

  // Sync category state from filters prop
  useEffect(() => {
    if (filters.category) setSelectedCategory(filters.category)
  }, [filters.category])

  // Trigger catalog fetch whenever filter values change (client-side re-filter)
  useEffect(() => {
    loadCatalog()
  }, [selectedCategory, selectedBrand, selectedSize, selectedColor, minPrice, maxPrice])

  // Carousel slide timer
  useEffect(() => {
    if (banners.length === 0) return
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % banners.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [banners])

  // Contact Form Submit Handler
  const handleContactSubmit = async (e) => {
    e.preventDefault()
    setContactLoading(true)
    setContactSuccess('')
    try {
      const res = await submitContactMessage(contactForm)
      setContactSuccess(res.data.message)
      setContactForm({ name: '', email: '', subject: '', message: '' })
    } catch (err) {
      setContactSuccess('Error submitting message. Please check details.')
    } finally {
      setContactLoading(false)
    }
  }

  const resetFilters = () => {
    setMinPrice('')
    setMaxPrice('')
    setSelectedSize('')
    setSelectedColor('')
    setSelectedBrand('')
    setSelectedCategory('All')
    router.visit('/', { preserveState: false })
  }

  return (
    <div>
      {/* ── Dynamic Luxury Hero Carousel ── */}
      {banners.length > 0 && (
        <section className="boutique-hero" style={{ backgroundImage: `url(${banners[currentSlide].image})`, transition: 'background-image 0.8s ease' }}>
          <div className="boutique-hero-content">
            <span className="hero-badge" style={{ background: 'rgba(212, 175, 55, 0.12)', color: '#d4af37', borderColor: 'rgba(212, 175, 55, 0.25)' }}>
              👑 {banners[currentSlide].subtitle}
            </span>
            <h1 className="hero-title" style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 'clamp(2.4rem, 5.5vw, 4rem)', margin: '14px 0 24px' }}>
              {banners[currentSlide].title}
            </h1>
            <div style={{ display: 'flex', gap: 14, justifyContent: 'center' }}>
              <a href="#catalog" className="btn btn-primary" style={{ background: 'linear-gradient(135deg, #d4af37, #aa820a)', border: 'none', color: '#000', fontWeight: 700 }}>
                Explore Collection
              </a>
            </div>
          </div>
          {/* Slide Indicator Dots */}
          <div style={{ position: 'absolute', bottom: 30, display: 'flex', gap: 8, zIndex: 10 }}>
            {banners.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentSlide(i)}
                style={{
                  width: 10, height: 10, borderRadius: '50%', border: 'none',
                  background: currentSlide === i ? '#d4af37' : 'rgba(255,255,255,0.3)',
                  cursor: 'pointer'
                }}
              />
            ))}
          </div>
        </section>
      )}

      {/* ── Catalog Listing Section ── */}
      <section id="catalog" style={{ padding: '80px 40px', maxWidth: 1240, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2.4rem', fontWeight: 600 }}>
            Discover <span className="gold-accent">Elegance</span>
          </h2>
          <p style={{ color: 'var(--text-secondary)', marginTop: 8, fontSize: '0.95rem' }}>
            Traditional Eastern drapes crafted in luxurious silks, premium lawn, and royal festive velvets.
          </p>

          {/* Category Tabs */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 10, marginTop: 32, flexWrap: 'wrap' }}>
            <button
              onClick={() => { setSelectedCategory('All'); setSearchParams({}); }}
              className="btn"
              style={{
                padding: '8px 20px', borderRadius: 99, fontSize: '0.85rem',
                background: selectedCategory === 'All' ? 'linear-gradient(135deg, #d4af37, #aa820a)' : 'rgba(255,255,255,0.03)',
                color: selectedCategory === 'All' ? '#000' : 'var(--text-secondary)',
                border: selectedCategory === 'All' ? 'none' : '1px solid var(--border)',
                fontWeight: 600
              }}
            >
              All Items
            </button>
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => { setSelectedCategory(cat.slug); setSearchParams({ category: cat.slug }); }}
                className="btn"
                style={{
                  padding: '8px 20px', borderRadius: 99, fontSize: '0.85rem',
                  background: selectedCategory === cat.slug ? 'linear-gradient(135deg, #d4af37, #aa820a)' : 'rgba(255,255,255,0.03)',
                  color: selectedCategory === cat.slug ? '#000' : 'var(--text-secondary)',
                  border: selectedCategory === cat.slug ? 'none' : '1px solid var(--border)',
                  fontWeight: 600
                }}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Filters Toggle Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)', paddingBottom: 16, marginBottom: 28 }}>
          <button className="btn btn-ghost btn-sm" onClick={() => setShowFilters(!showFilters)} style={{ color: '#d4af37', borderColor: '#d4af37' }}>
            ⚙️ {showFilters ? 'Hide Filters' : 'Show Advanced Filters'}
          </button>
          {searchParams.get('search') && (
            <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              Showing results for "<strong>{searchParams.get('search')}</strong>"
            </span>
          )}
          {(selectedBrand || selectedSize || selectedColor || minPrice || maxPrice) && (
            <button className="btn btn-danger btn-sm" onClick={resetFilters}>Clear Filters ✕</button>
          )}
        </div>

        {/* Collapsible Advanced Filters Drawer/Panel */}
        {showFilters && (
          <div className="card" style={{ padding: 24, marginBottom: 32, background: 'rgba(255,255,255,0.015)', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 24 }}>
            {/* Price Filter */}
            <div className="form-group">
              <label className="form-label" style={{ color: '#d4af37' }}>Price range (PKR)</label>
              <div style={{ display: 'flex', gap: 10 }}>
                <input type="number" placeholder="Min" className="form-input" value={minPrice} onChange={e => setMinPrice(e.target.value)} style={{ padding: 6 }} />
                <input type="number" placeholder="Max" className="form-input" value={maxPrice} onChange={e => setMaxPrice(e.target.value)} style={{ padding: 6 }} />
              </div>
            </div>

            {/* Brand Filter */}
            <div className="form-group">
              <label className="form-label" style={{ color: '#d4af37' }}>Select Line</label>
              <select className="form-input" value={selectedBrand} onChange={e => setSelectedBrand(e.target.value)} style={{ padding: 6 }}>
                <option value="">All Brands</option>
                {brands.map(b => <option key={b.id} value={b.slug}>{b.name}</option>)}
              </select>
            </div>

            {/* Size Filter */}
            <div className="form-group">
              <label className="form-label" style={{ color: '#d4af37' }}>Size</label>
              <select className="form-input" value={selectedSize} onChange={e => setSelectedSize(e.target.value)} style={{ padding: 6 }}>
                <option value="">All Sizes</option>
                <option value="S">Small (S)</option>
                <option value="M">Medium (M)</option>
                <option value="L">Large (L)</option>
                <option value="XL">Extra Large (XL)</option>
              </select>
            </div>

            {/* Color Filter */}
            <div className="form-group">
              <label className="form-label" style={{ color: '#d4af37' }}>Color</label>
              <select className="form-input" value={selectedColor} onChange={e => setSelectedColor(e.target.value)} style={{ padding: 6 }}>
                <option value="">All Colors</option>
                {allColors.map(color => (
                  <option key={color} value={color}>{color}</option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* Catalog Product Grid */}
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}>
            <div className="spinner" />
          </div>
        ) : products.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 20px', color: 'var(--text-muted)' }}>
            <div style={{ fontSize: '3rem', marginBottom: 16 }}>👘</div>
            <p>No products match your current search/filters.</p>
          </div>
        ) : (
          <div className="boutique-grid">
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
                  
                  {/* Price display with sale tags */}
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

      {/* ── About Us Section (Dynamic Settings Content) ── */}
      <section id="about-section" style={{ padding: '90px 40px', background: 'rgba(255,255,255,0.01)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 60, alignItems: 'center' }}>
          <div>
            <span className="gold-accent" style={{ textTransform: 'uppercase', letterSpacing: '0.12em', fontSize: '0.78rem', fontWeight: 700 }}>Our Legacy</span>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2.5rem', fontWeight: 600, color: 'var(--text-primary)', margin: '12px 0 20px' }}>
              {settings.about_us_title || 'The Story of Libas-E-Maryam'}
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.8, marginBottom: 20 }}>
              {settings.about_us_content || 'Traditional Eastern attire crafted with luxury textiles and delicate hand-embellished zari thread works. We specialize in bespoke tailors, velvet festive collections, and luxury silks.'}
            </p>
          </div>
          <div>
            <img src={settings.about_us_image || productSilk} alt="About Us Banner" style={{ width: '100%', maxHeight: 480, objectFit: 'cover', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }} />
          </div>
        </div>
      </section>

      {/* ── Contact Us Section ── */}
      <section id="contact-section" style={{ padding: '90px 40px', maxWidth: 840, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <span className="gold-accent" style={{ textTransform: 'uppercase', letterSpacing: '0.12em', fontSize: '0.78rem', fontWeight: 700 }}>Inquiries</span>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2.4rem', fontWeight: 600, color: 'var(--text-primary)', marginTop: 10 }}>Contact Boutique</h2>
          <p style={{ color: 'var(--text-secondary)', marginTop: 8, fontSize: '0.92rem' }}>
            Have customized sizing requests or delivery queries? Fill in the form and we will get back to you!
          </p>
        </div>

        {contactSuccess && (
          <div className={`alert alert-${contactSuccess.includes('Error') ? 'error' : 'success'}`} style={{ marginBottom: 24 }}>
            {contactSuccess}
          </div>
        )}

        <form onSubmit={handleContactSubmit} className="card" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, padding: 32 }}>
          <div className="form-group">
            <label className="form-label">Your Name</label>
            <input type="text" className="form-input" value={contactForm.name} onChange={e => setContactForm(p => ({ ...p, name: e.target.value }))} required />
          </div>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input type="email" className="form-input" value={contactForm.email} onChange={e => setContactForm(p => ({ ...p, email: e.target.value }))} required />
          </div>
          <div className="form-group" style={{ gridColumn: 'span 2' }}>
            <label className="form-label">Subject</label>
            <input type="text" className="form-input" value={contactForm.subject} onChange={e => setContactForm(p => ({ ...p, subject: e.target.value }))} required />
          </div>
          <div className="form-group" style={{ gridColumn: 'span 2' }}>
            <label className="form-label">Your Message</label>
            <textarea className="form-input" style={{ minHeight: 120, fontFamily: 'inherit', resize: 'vertical' }} value={contactForm.message} onChange={e => setContactForm(p => ({ ...p, message: e.target.value }))} required />
          </div>
          <div style={{ gridColumn: 'span 2', display: 'flex', justifyContent: 'flex-end' }}>
            <button type="submit" className="btn btn-primary" style={{ background: 'linear-gradient(135deg, #d4af37, #aa820a)', border: 'none', color: '#000', fontWeight: 700 }} disabled={contactLoading}>
              {contactLoading ? 'Sending…' : 'Send message'}
            </button>
          </div>
        </form>
      </section>
    </div>
  )
}

Home.layout = (page) => <UserLayout>{page}</UserLayout>
