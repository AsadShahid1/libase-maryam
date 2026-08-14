import { Link } from '@inertiajs/react'
import UserLayout from '@/layouts/UserLayout'

export default function Categories({ categories = [] }) {
  return (
    <div style={{ padding: '60px 40px', maxWidth: 1200, margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: 48 }}>
        <span className="gold-accent" style={{ textTransform: 'uppercase', letterSpacing: '0.12em', fontSize: '0.78rem', fontWeight: 700 }}>Collections</span>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2.5rem', fontWeight: 600, color: 'var(--text-primary)', marginTop: 10 }}>
          Browse by Category
        </h1>
        <p style={{ color: 'var(--text-secondary)', marginTop: 8, fontSize: '0.95rem' }}>
          Select a category to view our customized hand-crafted collections.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 32 }}>
        {categories.map(cat => (
          <Link
            key={cat.id}
            href={`/products?category=${cat.slug}`}
            className="card"
            style={{
              padding: 0,
              overflow: 'hidden',
              border: '1px solid var(--border)',
              display: 'flex',
              flexDirection: 'column',
              transition: 'var(--transition)',
              cursor: 'pointer',
              textDecoration: 'none'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = '#d4af37'
              e.currentTarget.style.transform = 'translateY(-4px)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = 'var(--border)'
              e.currentTarget.style.transform = 'none'
            }}
          >
            <div style={{ height: 320, position: 'relative', overflow: 'hidden' }}>
              <img src={cat.image || '/assets/product_silk.jpg'} alt={cat.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <div style={{
                position: 'absolute', inset: 0,
                background: 'linear-gradient(to top, rgba(10,12,20,0.9) 0%, rgba(10,12,20,0.1) 100%)'
              }} />
              <div style={{ position: 'absolute', bottom: 20, left: 20 }}>
                <span className="gold-accent" style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700 }}>Libas-E-Maryam</span>
                <h3 style={{ fontSize: '1.25rem', fontFamily: "'Playfair Display', serif", color: '#fff', fontWeight: 600, marginTop: 4 }}>{cat.name}</h3>
              </div>
            </div>
            <div style={{ padding: 20, flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 16 }}>
                {cat.description || 'Premium hand-stitched traditional wear made from the highest quality fabrics.'}
              </p>
              <span style={{ fontSize: '0.82rem', color: '#d4af37', fontWeight: 700 }}>Explore Collection →</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

Categories.layout = (page) => <UserLayout>{page}</UserLayout>
