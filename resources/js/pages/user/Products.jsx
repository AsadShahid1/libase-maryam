import { useState, useMemo } from 'react'
import { useCart } from '@/contexts/CartContext'
import { Link, router } from '@inertiajs/react'
import UserLayout from '@/layouts/UserLayout'
import productSilk from '@/assets/product_silk.jpg'

export default function Products({
  initialProducts = [],
  brands: initialBrands = [],
  categories: initialCategories = [],
  filters = {}
}) {
  const { addToCart } = useCart()

  const [products] = useState(initialProducts)
  const [categories] = useState(initialCategories)

  const [selectedCategory, setSelectedCategory] = useState(filters.category || 'All')
  const [maxPrice, setMaxPrice] = useState(100000)
  const [onlySale, setOnlySale] = useState(false)
  const [sortOption, setSortOption] = useState('featured')

  // Interactive filtering logic
  const filteredProducts = useMemo(() => {
    let list = [...products]

    // Category filter
    if (selectedCategory !== 'All') {
      list = list.filter(item => item.category?.slug === selectedCategory)
    }

    // Price slider filter
    list = list.filter(item => {
      const priceToCompare = item.sale_price || item.price || 0
      return priceToCompare <= maxPrice
    })

    // Sale filter
    if (onlySale) {
      list = list.filter(item => item.is_on_sale)
    }

    // Sort filter
    if (sortOption === 'low-high') {
      list.sort((a, b) => (a.sale_price || a.price) - (b.sale_price || b.price))
    } else if (sortOption === 'high-low') {
      list.sort((a, b) => (b.sale_price || b.price) - (a.sale_price || a.price))
    }

    return list
  }, [products, selectedCategory, maxPrice, onlySale, sortOption])

  const handleCategorySelect = (slug) => {
    setSelectedCategory(slug)
    router.get('/products', {
      category: slug !== 'All' ? slug : ''
    }, { preserveState: true })
  }

  const resetFilters = () => {
    setSelectedCategory('All')
    setMaxPrice(100000)
    setOnlySale(false)
    setSortOption('featured')
    router.get('/products', {}, { preserveState: true })
  }

  return (
    <div style={{ maxWidth: 1320, margin: '0 auto', padding: '40px 24px 100px' }}>

      {/* Catalog Header */}
      <div style={{ textAlign: 'center', marginBottom: 48 }}>
        <span className="eyebrow-badge">LIBAS-E-MARYAM CATALOG</span>
        <h1 className="font-display" style={{ fontSize: '2.8rem', marginTop: 10, marginBottom: 8 }}>
          Boutique Suits Collection
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
          Explore our hand-embellished festive ensembles, velvet ghararas, raw silks, and luxury printed cotton lawn.
        </p>
      </div>

      {/* Main Grid + Sidebar Filter Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 40 }}>

        {/* Left Interactive Sidebar Filter Panel */}
        <div style={{ backgroundColor: '#fff', border: '1px solid var(--border-color)', padding: 28, borderRadius: 'var(--radius-md)', height: 'fit-content' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, paddingBottom: 12, borderBottom: '1px solid var(--border-color)' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Filters
            </h3>
            <button onClick={resetFilters} style={{ background: 'none', border: 'none', color: 'var(--primary-sage)', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer' }}>
              Reset All
            </button>
          </div>

          {/* 1. Interactive Category Selection (Radio / List) */}
          <div style={{ marginBottom: 32 }}>
            <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 14, letterSpacing: '0.05em' }}>
              Categories
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', fontSize: '0.88rem', fontWeight: selectedCategory === 'All' ? 700 : 500 }}>
                <input
                  type="radio"
                  name="category"
                  checked={selectedCategory === 'All'}
                  onChange={() => handleCategorySelect('All')}
                />
                <span>All Collections ({products.length})</span>
              </label>

              {categories.map((cat) => (
                <label key={cat.id} style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', fontSize: '0.88rem', fontWeight: selectedCategory === cat.slug ? 700 : 500, color: selectedCategory === cat.slug ? 'var(--primary-sage)' : 'var(--text-primary)' }}>
                  <input
                    type="radio"
                    name="category"
                    checked={selectedCategory === cat.slug}
                    onChange={() => handleCategorySelect(cat.slug)}
                  />
                  <span>{cat.name}</span>
                </label>
              ))}
            </div>
          </div>

          {/* 2. Interactive Price Range Slider */}
          <div style={{ marginBottom: 32 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Max Price (PKR)
              </span>
              <span style={{ fontSize: '0.88rem', fontWeight: 800, color: 'var(--primary-sage)' }}>
                PKR {maxPrice.toLocaleString()}
              </span>
            </div>
            <input
              type="range"
              min={5000}
              max={100000}
              step={2500}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--primary-sage)', cursor: 'pointer' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 6 }}>
              <span>PKR 5,000</span>
              <span>PKR 100,000</span>
            </div>
          </div>

          {/* 3. Sale Items Only Checkbox */}
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', fontSize: '0.88rem', fontWeight: 600 }}>
              <input
                type="checkbox"
                checked={onlySale}
                onChange={(e) => setOnlySale(e.target.checked)}
              />
              <span>Show On-Sale Suits Only</span>
            </label>
          </div>
        </div>

        {/* Right Product Grid */}
        <div>
          {/* Top Bar: Count & Sort */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, paddingBottom: 16, borderBottom: '1px solid var(--border-color)' }}>
            <span style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
              Showing {filteredProducts.length} boutique suits
            </span>

            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="form-input"
              style={{ width: 'auto', padding: '6px 14px', fontSize: '0.85rem', borderRadius: 'var(--radius-pill)' }}
            >
              <option value="featured">Sort by: Featured</option>
              <option value="low-high">Price: Low to High</option>
              <option value="high-low">Price: High to Low</option>
            </select>
          </div>

          {/* Product Grid */}
          {filteredProducts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 0', backgroundColor: '#fff', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>👗</div>
              <h3 style={{ fontSize: '1.2rem', color: 'var(--text-primary)', marginBottom: 8 }}>No suits match your criteria</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: 16 }}>Try expanding your price range slider or clearing filters.</p>
              <button onClick={resetFilters} className="btn btn-outline btn-sm">Reset Filters</button>
            </div>
          ) : (
            <div className="boutique-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
              {filteredProducts.map((item) => (
                <div key={item.id} className="product-card">
                  <div className="product-image-container">
                    <Link href={`/product/${item.id}`}>
                      <img src={item.image || productSilk} alt={item.name} />
                    </Link>

                    {item.is_on_sale && (
                      <span className="badge badge-sale" style={{ position: 'absolute', top: 12, left: 12 }}>
                        SALE
                      </span>
                    )}

                    <div className="product-card-overlay">
                      <button
                        onClick={() => addToCart(item)}
                        className="btn btn-primary btn-full btn-sm"
                        style={{ borderRadius: 'var(--radius-pill)', fontWeight: 700 }}
                      >
                        Add to Cart 🛒
                      </button>
                    </div>
                  </div>

                  <div style={{ padding: '14px 4px 4px' }}>
                    <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--primary-sage)', textTransform: 'uppercase', marginBottom: 4 }}>
                      {item.category?.name || 'Suit Collection'}
                    </div>
                    <h3 style={{ fontSize: '0.98rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8 }}>
                      <Link href={`/product/${item.id}`}>{item.name}</Link>
                    </h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      {item.is_on_sale ? (
                        <>
                          <span style={{ fontSize: '1.05rem', fontWeight: 800 }}>PKR {item.sale_price?.toLocaleString()}</span>
                          <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>PKR {item.price?.toLocaleString()}</span>
                        </>
                      ) : (
                        <span style={{ fontSize: '1.05rem', fontWeight: 800 }}>PKR {item.price?.toLocaleString()}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

    </div>
  )
}

Products.layout = (page) => <UserLayout>{page}</UserLayout>
