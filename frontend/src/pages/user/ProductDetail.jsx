import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { getShopProduct } from '@/api'
import { useCart } from '@/contexts/CartContext'

// Fallback lookup images to populate multiple lookbook details
const LOOKBOOK_IMAGES = [
  '/assets/product_silk.jpg',
  '/assets/product_velvet.jpg',
  '/assets/product_lawn.jpg'
]

export default function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addToCart } = useCart()

  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Selected state options
  const [selectedSize, setSelectedSize] = useState('')
  const [selectedColor, setSelectedColor] = useState('')
  const [quantity, setQuantity] = useState(1)

  // Carousel & Zoom gallery states
  const [activeImage, setActiveImage] = useState('')
  const [galleryImages, setGalleryImages] = useState([])
  const [zoomStyle, setZoomStyle] = useState({ transform: 'scale(1)', transformOrigin: 'center' })
  const [isHovered, setIsHovered] = useState(false)

  // Cart Success Notice
  const [showCartNotice, setShowCartNotice] = useState(false)

  useEffect(() => {
    setLoading(true)
    setError('')
    getShopProduct(id)
      .then(res => {
        const prod = res.data
        setProduct(prod)
        setActiveImage(prod.image)

        // Populate multiple lookbook images
        const extraImages = LOOKBOOK_IMAGES.filter(img => img !== prod.image).slice(0, 3)
        setGalleryImages([prod.image, ...extraImages])

        // Parse unique variants if available to auto-select initial values
        if (prod.variants && prod.variants.length > 0) {
          const colors = [...new Set(prod.variants.map(v => v.color).filter(Boolean))]
          const sizes = [...new Set(prod.variants.map(v => v.size).filter(Boolean))]
          if (colors.length > 0) setSelectedColor(colors[0])
          if (sizes.length > 0) setSelectedSize(sizes[0])
        } else {
          setSelectedSize('M')
          setSelectedColor('Champagne Gold')
        }
      })
      .catch(err => {
        console.error(err)
        setError('Unable to load product information. Please return to home.')
      })
      .finally(() => {
        setLoading(false)
      })
  }, [id])

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <div className="spinner" />
      </div>
    )
  }

  if (error || !product) {
    return (
      <div style={{ padding: '80px 20px', textAlign: 'center', background: 'var(--bg-light)', minHeight: '60vh' }}>
        <div style={{ fontSize: '3rem', marginBottom: 16 }}>⚠️</div>
        <h3 style={{ color: 'var(--text-primary)' }}>{error || 'Product Not Found'}</h3>
        <Link to="/" className="btn btn-primary" style={{ marginTop: 20 }}>Back to Homepage</Link>
      </div>
    )
  }

  // Extract list of all unique variant colors & sizes
  const availableColors = product.variants ? [...new Set(product.variants.map(v => v.color).filter(Boolean))] : ['Champagne Gold']
  const availableSizes = product.variants ? [...new Set(product.variants.map(v => v.size).filter(Boolean))] : ['S', 'M', 'L', 'XL']

  // Find exact matching variant to verify stock
  const matchedVariant = product.variants?.find(
    v => v.color === selectedColor && v.size === selectedSize
  )

  // Use variant stock if available, else fallback to master product stock
  const currentStock = matchedVariant ? matchedVariant.stock : product.stock
  const isOutOfStock = currentStock <= 0

  // Interactive Hover Zoom Logic
  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - left) / width) * 100
    const y = ((e.clientY - top) / height) * 100
    setZoomStyle({
      transform: 'scale(1.8)',
      transformOrigin: `${x}% ${y}%`
    })
  }

  const handleMouseEnter = () => {
    setIsHovered(true)
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    setZoomStyle({ transform: 'scale(1)', transformOrigin: 'center' })
  }

  // Add to Bag action handler
  const handleAddToBag = () => {
    if (isOutOfStock) return

    // Add selected quantity of items
    for (let i = 0; i < quantity; i++) {
      addToCart(product, selectedSize, selectedColor)
    }

    setShowCartNotice(true)
    setTimeout(() => {
      setShowCartNotice(false)
    }, 3000)
  }

  return (
    <div className="responsive-container" style={{ background: 'var(--bg-light)', minHeight: 'calc(100vh - 74px)' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        
        {/* Breadcrumb Navigation */}
        <div style={{ marginBottom: 30, fontSize: '0.82rem', color: 'var(--text-muted)' }}>
          <Link to="/" style={{ color: 'var(--text-muted)' }}>Home</Link> &nbsp;/&nbsp;&nbsp;
          <Link to="/products" style={{ color: 'var(--text-muted)' }}>Products</Link> &nbsp;/&nbsp;&nbsp;
          <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{product.name}</span>
        </div>

        <div className="product-detail-grid">
          
          {/* ── Left Column: Lookbook Gallery & Zoom Frame ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            
            {/* Active Image Container with Zoom effect */}
            <div
              style={{
                width: '100%',
                height: 520,
                overflow: 'hidden',
                position: 'relative',
                borderRadius: 'var(--radius)',
                border: '1px solid var(--border)',
                background: '#fff',
                cursor: 'zoom-in',
                boxShadow: 'var(--shadow)'
              }}
              onMouseMove={handleMouseMove}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <img
                src={activeImage}
                alt={product.name}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  transition: isHovered ? 'none' : 'transform 0.35s ease-out',
                  ...zoomStyle
                }}
              />
              <div style={{
                position: 'absolute', bottom: 16, right: 16,
                background: 'rgba(0,0,0,0.6)', color: '#fff',
                fontSize: '0.75rem', padding: '6px 12px',
                borderRadius: 20, pointerEvents: 'none', letterSpacing: '0.05em'
              }}>
                🔍 Hover to zoom fabric
              </div>
            </div>

            {/* Gallery Thumbnails List */}
            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-start', overflowX: 'auto', paddingBottom: 4 }}>
              {galleryImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(img)}
                  style={{
                    width: 90,
                    height: 110,
                    padding: 0,
                    border: activeImage === img ? '2px solid #d4af37' : '1px solid var(--border)',
                    borderRadius: 'var(--radius-sm)',
                    background: '#fff',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    opacity: activeImage === img ? 1 : 0.65,
                    transition: 'all 0.2s'
                  }}
                >
                  <img src={img} alt={`Thumbnail ${idx}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </button>
              ))}
            </div>

          </div>

          {/* ── Right Column: Product Detail Attributes ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            
            {/* Category / Brand metadata */}
            <div>
              <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.12em', color: '#b89028', fontWeight: 700 }}>
                {product.category?.name || 'Traditional Collection'}
              </span>
              <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2.4rem', color: 'var(--text-primary)', marginTop: 8, marginBottom: 12 }}>
                {product.name}
              </h1>

              {/* Elegant Review Stars */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.85rem' }}>
                <span style={{ color: '#d4af37', letterSpacing: 2 }}>★★★★★</span>
                <span style={{ color: 'var(--text-secondary)' }}>(4.9/5 verified customer review)</span>
              </div>
            </div>

            {/* Price section */}
            <div style={{ borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', padding: '16px 0' }}>
              {product.is_on_sale ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <span style={{ fontSize: '1.8rem', fontWeight: 800, color: '#c0392b' }}>
                    PKR {parseFloat(product.sale_price).toLocaleString()}
                  </span>
                  <span style={{ textDecoration: 'line-through', color: 'var(--text-muted)', fontSize: '1.2rem' }}>
                    PKR {parseFloat(product.price).toLocaleString()}
                  </span>
                  <span style={{ background: '#c0392b', color: '#fff', fontSize: '0.72rem', fontWeight: 700, padding: '4px 8px', borderRadius: 4, textTransform: 'uppercase' }}>
                    Sale Offer 🛍️
                  </span>
                </div>
              ) : (
                <span style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  PKR {parseFloat(product.price).toLocaleString()}
                </span>
              )}
            </div>

            {/* Description Paragraph */}
            <div>
              <h4 style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>Boutique Story & Details</h4>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.7, whiteSpace: 'pre-line' }}>
                {product.description || 'No description available for this premium piece.'}
              </p>
            </div>

            {/* ── Variant Selectors ── */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              
              {/* Color Select Option */}
              <div>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)', display: 'block', marginBottom: 10 }}>
                  Select Color: <strong style={{ color: '#b89028' }}>{selectedColor}</strong>
                </span>
                <div style={{ display: 'flex', gap: 10 }}>
                  {availableColors.map(color => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      style={{
                        padding: '6px 16px',
                        fontSize: '0.8rem',
                        background: selectedColor === color ? 'var(--text-primary)' : '#fff',
                        color: selectedColor === color ? '#fff' : 'var(--text-primary)',
                        border: selectedColor === color ? '1px solid var(--text-primary)' : '1px solid var(--border)',
                        borderRadius: 20,
                        cursor: 'pointer',
                        fontWeight: 600,
                        transition: 'all 0.2s'
                      }}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>

              {/* Size Select Option */}
              <div>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)', display: 'block', marginBottom: 10 }}>
                  Select Size: <strong style={{ color: '#b89028' }}>{selectedSize}</strong>
                </span>
                <div style={{ display: 'flex', gap: 10 }}>
                  {availableSizes.map(size => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      style={{
                        width: 44,
                        height: 44,
                        fontSize: '0.82rem',
                        background: selectedSize === size ? '#d4af37' : '#fff',
                        color: selectedSize === size ? '#000' : 'var(--text-primary)',
                        border: selectedSize === size ? '2px solid #d4af37' : '1px solid var(--border)',
                        borderRadius: '50%',
                        cursor: 'pointer',
                        fontWeight: 700,
                        transition: 'all 0.2s'
                      }}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Interactive Availability Indicator */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.88rem' }}>
                <span style={{ fontSize: '1rem' }}>📦</span>
                {isOutOfStock ? (
                  <span style={{ color: 'var(--danger)', fontWeight: 700 }}>Out of Stock - Currently Unavailable</span>
                ) : currentStock <= 5 ? (
                  <span style={{ color: '#c0392b', fontWeight: 700 }}>
                    Hurry! Only {currentStock} left in stock for selected configuration
                  </span>
                ) : (
                  <span style={{ color: 'var(--success)', fontWeight: 700 }}>
                    In Stock (Available to order)
                  </span>
                )}
              </div>

            </div>

            {/* ── Cart Action Panel ── */}
            <div style={{ borderTop: '1px solid var(--border)', paddingTop: 24, marginTop: 10 }}>
              
              {showCartNotice && (
                <div className="alert alert-success" style={{ marginBottom: 16, fontSize: '0.82rem' }}>
                  👜 Added {quantity} item(s) to your bag successfully!
                </div>
              )}

              <div style={{ display: 'flex', gap: 16 }}>
                
                {/* Quantity Control */}
                <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--border)', borderRadius: 'var(--radius)', background: '#fff' }}>
                  <button
                    disabled={quantity <= 1 || isOutOfStock}
                    onClick={() => setQuantity(q => q - 1)}
                    style={{ background: 'none', border: 'none', width: 44, height: 44, cursor: 'pointer', fontSize: '1.2rem', fontWeight: 600 }}
                  >
                    −
                  </button>
                  <span style={{ width: 40, textAlign: 'center', fontSize: '0.92rem', fontWeight: 700 }}>{quantity}</span>
                  <button
                    disabled={isOutOfStock || quantity >= currentStock}
                    onClick={() => setQuantity(q => q + 1)}
                    style={{ background: 'none', border: 'none', width: 44, height: 44, cursor: 'pointer', fontSize: '1.2rem', fontWeight: 600 }}
                  >
                    +
                  </button>
                </div>

                {/* Add to Cart button */}
                <button
                  onClick={handleAddToBag}
                  className="btn btn-primary"
                  disabled={isOutOfStock}
                  style={{
                    flex: 1,
                    background: isOutOfStock ? 'var(--border)' : 'linear-gradient(135deg, #d4af37, #aa820a)',
                    border: 'none',
                    color: isOutOfStock ? 'var(--text-muted)' : '#000',
                    fontWeight: 700,
                    padding: '12px 24px',
                    fontSize: '1rem',
                    boxShadow: 'var(--shadow)'
                  }}
                >
                  {isOutOfStock ? 'Sold Out' : 'Add to Bag 👜'}
                </button>

              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  )
}
