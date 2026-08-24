import { Link } from '@inertiajs/react'
import UserLayout from '@/layouts/UserLayout'
import productSilk from '@/assets/product_silk.jpg'

export default function Categories({ categories = [] }) {
  return (
    <div style={{ padding: '60px 24px 100px', maxWidth: 1320, margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: 48 }}>
        <span className="eyebrow-badge">LIBAS-E-MARYAM COLLECTIONS</span>
        <h1 className="font-display" style={{ fontSize: '2.8rem', marginTop: 10, marginBottom: 8 }}>
          Browse Boutique Categories
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
          Select your preferred fabric edit and hand-embellished boutique suit collections.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 32 }}>
        {categories.map(cat => (
          <Link
            key={cat.id}
            href={`/products?category=${cat.slug}`}
            className="product-card"
            style={{
              padding: 0,
              overflow: 'hidden',
              height: 420,
              textDecoration: 'none'
            }}
          >
            <div style={{ width: '100%', height: '100%', position: 'relative' }}>
              <img src={cat.image || productSilk} alt={cat.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(180deg, rgba(0,0,0,0) 30%, rgba(12,26,46,0.92) 100%)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                padding: 28
              }}>
                <span className="eyebrow-badge" style={{ backgroundColor: 'rgba(197, 160, 89, 0.95)', color: '#0C1A2E', width: 'fit-content', marginBottom: 8 }}>
                  BOUTIQUE EDIT
                </span>
                <h3 style={{ color: '#fff', fontSize: '1.45rem', fontWeight: 700, marginBottom: 6 }}>{cat.name}</h3>
                <p style={{ color: '#E2E8F0', fontSize: '0.85rem', marginBottom: 16, lineHeight: 1.5 }}>{cat.description}</p>
                <span className="btn btn-outline btn-sm" style={{ color: '#fff', borderColor: '#fff', width: 'fit-content', borderRadius: 'var(--radius-pill)' }}>
                  Explore Collection →
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

Categories.layout = (page) => <UserLayout>{page}</UserLayout>
