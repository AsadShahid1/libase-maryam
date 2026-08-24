import { useState } from 'react'
import { useCart } from '@/contexts/CartContext'
import { Link } from '@inertiajs/react'
import UserLayout from '@/layouts/UserLayout'
import productSilk from '@/assets/product_silk.jpg'
import productLawn from '@/assets/product_lawn.jpg'
import productVelvet from '@/assets/product_velvet.jpg'
import dress1 from '@/assets/libasemaryam1.png'
import dress2 from '@/assets/libasemaryam2.png'

export default function ProductDetail({ product = {} }) {
  const { addToCart } = useCart()

  const [selectedColor, setSelectedColor] = useState('Deep Maroon')
  const [selectedSize, setSelectedSize] = useState('M')
  const [showSizeGuide, setShowSizeGuide] = useState(false)
  const [activeImageIndex, setActiveImageIndex] = useState(0)

  const galleryImages = [
    product.image || productVelvet,
    productSilk,
    dress1,
    dress2,
    productLawn
  ]

  const colorOptions = [
    { name: 'Deep Maroon', hex: '#6B1B26' },
    { name: 'Champagne Gold', hex: '#D4AF37' },
    { name: 'Emerald Green', hex: '#1B4D3E' },
    { name: 'Royal Crimson', hex: '#A31C29' },
    { name: 'Midnight Black', hex: '#191C19' }
  ]

  const sizeOptions = ['Unstitched', 'S', 'M', 'L', 'XL', 'Custom']

  const handleAdd = () => {
    addToCart(product, selectedSize, selectedColor)
  }

  return (
    <div style={{ maxWidth: 1320, margin: '0 auto', padding: '40px 24px 100px' }}>

      {/* Breadcrumb Navigation */}
      <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: 32, display: 'flex', gap: 8 }}>
        <Link href="/">Home</Link> / <Link href="/products">Boutique Suits</Link> / <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{product.name || 'Royal Velvet Gilded Festive Suit'}</span>
      </div>

      {/* Main Product Showcase */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 56, marginBottom: 80 }}>

        {/* Left: Multi-thumbnail Image Gallery */}
        <div>
          <div style={{ width: '100%', aspectRatio: '4 / 5', borderRadius: 'var(--radius-md)', overflow: 'hidden', backgroundColor: 'var(--bg-subtle)', marginBottom: 16, border: '1px solid var(--border-color)' }}>
            <img
              src={galleryImages[activeImageIndex]}
              alt={product.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>

          <div style={{ display: 'flex', gap: 12 }}>
            {galleryImages.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImageIndex(idx)}
                style={{
                  width: 80,
                  height: 96,
                  borderRadius: 'var(--radius-sm)',
                  overflow: 'hidden',
                  border: activeImageIndex === idx ? '2px solid var(--primary-sage)' : '1px solid var(--border-color)',
                  cursor: 'pointer',
                  padding: 0,
                  backgroundColor: 'var(--bg-subtle)'
                }}
              >
                <img src={img} alt={`Thumbnail ${idx}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </button>
            ))}
          </div>
        </div>

        {/* Right: Product Meta & Purchase Controls */}
        <div>
          <span className="eyebrow-badge" style={{ marginBottom: 12 }}>BOUTIQUE FESTIVE EDIT</span>
          
          <h1 className="font-display" style={{ fontSize: '2.4rem', fontWeight: 700, lineHeight: 1.25, marginBottom: 12 }}>
            {product.name || 'Royal Velvet Gilded Festive Suit'}
          </h1>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
            <div style={{ color: 'var(--accent-star)', fontSize: '1.1rem' }}>★★★★★</div>
            <span style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-primary)' }}>4.9</span>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>(2,839 Reviews)</span>
          </div>

          {/* PKR Pricing */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
            <span style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              PKR {product.sale_price ? product.sale_price.toLocaleString() : (product.price || 24500).toLocaleString()}
            </span>
            {product.is_on_sale && (
              <>
                <span style={{ fontSize: '1.2rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>
                  PKR {product.price?.toLocaleString() || '28,500'}
                </span>
                <span className="badge badge-sale" style={{ fontSize: '0.85rem', padding: '6px 12px' }}>
                  SALE
                </span>
              </>
            )}
          </div>

          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.7, marginBottom: 28 }}>
            {product.description || 'Heavy micro-velvet shirt embellished with hand-worked tilla zari embroidery along the neckline and sleeves, paired with jamawar trousers and a heavy embroidered velvet shawl.'}
          </p>

          {/* Color Swatches */}
          <div style={{ marginBottom: 28 }}>
            <div style={{ fontSize: '0.82rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>
              Color: <span style={{ color: 'var(--primary-sage)', fontWeight: 800 }}>{selectedColor}</span>
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              {colorOptions.map((c) => (
                <button
                  key={c.name}
                  onClick={() => setSelectedColor(c.name)}
                  className={`color-swatch-btn ${selectedColor === c.name ? 'active' : ''}`}
                  title={c.name}
                >
                  <span style={{ display: 'block', width: '100%', height: '100%', borderRadius: '50%', backgroundColor: c.hex, border: '1px solid rgba(0,0,0,0.1)' }} />
                </button>
              ))}
            </div>
          </div>

          {/* Size Selector */}
          <div style={{ marginBottom: 32 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <span style={{ fontSize: '0.82rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Select Size / Stitching
              </span>
              <button
                onClick={() => setShowSizeGuide(true)}
                style={{ background: 'none', border: 'none', color: 'var(--primary-sage)', fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer', textDecoration: 'underline' }}
              >
                View Size Guide 📏
              </button>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
              {sizeOptions.map((sz) => (
                <button
                  key={sz}
                  onClick={() => setSelectedSize(sz)}
                  className={`size-pill-btn ${selectedSize === sz ? 'active' : ''}`}
                >
                  {sz}
                </button>
              ))}
            </div>
          </div>

          {/* Add to Cart CTA Buttons */}
          <div style={{ display: 'flex', gap: 16, marginBottom: 32 }}>
            <button
              onClick={handleAdd}
              className="btn btn-dark btn-lg"
              style={{ flex: 2, borderRadius: 'var(--radius-pill)', fontWeight: 700 }}
            >
              Add to Cart 🛒
            </button>
            <button
              onClick={handleAdd}
              className="btn btn-outline btn-lg"
              style={{ flex: 1, borderRadius: 'var(--radius-pill)', fontWeight: 700 }}
            >
              Boutique Order 📍
            </button>
          </div>

          {/* Pair It With Grid */}
          <div style={{ marginTop: 40, paddingTop: 32, borderTop: '1px solid var(--border-color)' }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 16 }}>
              Complete the Outfit
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
              <div style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-color-light)', padding: 8, borderRadius: 'var(--radius-sm)' }}>
                <img src={productSilk} alt="Pair item 1" style={{ width: '100%', height: 110, objectFit: 'cover', borderRadius: 4, marginBottom: 8 }} />
                <div style={{ fontSize: '0.78rem', fontWeight: 600 }}>Pure Silk Anarkali</div>
                <div style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--primary-sage)' }}>PKR 32,000</div>
              </div>
              <div style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-color-light)', padding: 8, borderRadius: 'var(--radius-sm)' }}>
                <img src={dress1} alt="Pair item 2" style={{ width: '100%', height: 110, objectFit: 'cover', borderRadius: 4, marginBottom: 8 }} />
                <div style={{ fontSize: '0.78rem', fontWeight: 600 }}>Organza Peshwas</div>
                <div style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--primary-sage)' }}>PKR 29,500</div>
              </div>
              <div style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-color-light)', padding: 8, borderRadius: 'var(--radius-sm)' }}>
                <img src={productLawn} alt="Pair item 3" style={{ width: '100%', height: 110, objectFit: 'cover', borderRadius: 4, marginBottom: 8 }} />
                <div style={{ fontSize: '0.78rem', fontWeight: 600 }}>Designer Lawn Suit</div>
                <div style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--primary-sage)' }}>PKR 11,500</div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Size Guide Modal */}
      {showSizeGuide && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 3000, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div style={{ backgroundColor: '#fff', padding: 36, borderRadius: 'var(--radius-md)', maxWidth: 500, width: '100%', position: 'relative' }}>
            <h3 className="font-display" style={{ fontSize: '1.4rem', marginBottom: 16 }}>Libas-E-Maryam Size Chart</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', marginBottom: 20 }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border-color)', textAlign: 'left' }}>
                  <th style={{ padding: 8 }}>Size</th>
                  <th style={{ padding: 8 }}>Chest (in)</th>
                  <th style={{ padding: 8 }}>Length (in)</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid var(--border-color-light)' }}><td style={{ padding: 8 }}>S</td><td style={{ padding: 8 }}>36</td><td style={{ padding: 8 }}>42</td></tr>
                <tr style={{ borderBottom: '1px solid var(--border-color-light)' }}><td style={{ padding: 8 }}>M</td><td style={{ padding: 8 }}>39</td><td style={{ padding: 8 }}>44</td></tr>
                <tr style={{ borderBottom: '1px solid var(--border-color-light)' }}><td style={{ padding: 8 }}>L</td><td style={{ padding: 8 }}>43</td><td style={{ padding: 8 }}>46</td></tr>
                <tr style={{ borderBottom: '1px solid var(--border-color-light)' }}><td style={{ padding: 8 }}>XL</td><td style={{ padding: 8 }}>47</td><td style={{ padding: 8 }}>48</td></tr>
              </tbody>
            </table>
            <button onClick={() => setShowSizeGuide(false)} className="btn btn-dark btn-full btn-sm">Close Size Guide</button>
          </div>
        </div>
      )}

    </div>
  )
}

ProductDetail.layout = (page) => <UserLayout>{page}</UserLayout>
