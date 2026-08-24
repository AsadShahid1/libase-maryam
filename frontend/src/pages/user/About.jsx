import { useOutletContext } from 'react-router-dom'
import logoFallback from '@/assets/logo.jpg'

export default function About() {
  const { settings } = useOutletContext()

  const aboutTitle = settings.about_us_title || 'The Story of Libas-E-Maryam'
  const aboutContent = settings.about_us_content || 'Traditional Eastern attire crafted with luxury textiles and delicate hand-embellished zari thread works. Libas-E-Maryam brings you a heritage of traditional artistry. Specialized in high-end tailored lehengas, hand-worked velvet shawls, and premium embroidered cotton lawn, our mission is to create royal Eastern ensembles that reflect luxury and comfort.'
  const aboutImage = settings.about_us_image || '/assets/product_silk.jpg'
  const companyName = settings.company_name || 'Libas-E-Maryam'

  return (
    <div className="responsive-container" style={{ background: 'var(--bg-light)', minHeight: 'calc(100vh - 74px)' }}>
      <div style={{ maxWidth: 960, margin: '0 auto' }}>
        
        {/* Page Header */}
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <span style={{ fontSize: '0.8rem', color: '#b89028', textTransform: 'uppercase', letterSpacing: '0.15em', fontWeight: 700 }}>About Our Boutique</span>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2.5rem', marginTop: 8, color: 'var(--text-primary)' }}>
            {aboutTitle}
          </h1>
          <div style={{ width: 60, height: 2, background: '#d4af37', margin: '20px auto 0' }} />
        </div>

        {/* Brand Story Presentation */}
        <div className="about-grid">
          
          {/* Image Container with Elegant Border */}
          <div style={{ position: 'relative' }}>
            <div style={{
              position: 'absolute', top: -12, left: -12, right: 12, bottom: 12,
              border: '2px solid rgba(212, 175, 55, 0.25)', borderRadius: 'var(--radius)',
              zIndex: 1
            }} />
            <img
              src={aboutImage}
              alt="Boutique Lookbook"
              style={{
                width: '100%', height: 420, objectFit: 'cover',
                borderRadius: 'var(--radius)', position: 'relative', zIndex: 2,
                boxShadow: 'var(--shadow)'
              }}
            />
          </div>

          {/* Story Text */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.6rem', color: '#b89028' }}>
              Crafting Heritage Since Day One
            </h2>
            <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.8, whiteSpace: 'pre-line' }}>
              {aboutContent}
            </p>
            <div style={{ borderTop: '1px solid var(--border)', paddingTop: 20, marginTop: 10, display: 'flex', alignItems: 'center', gap: 14 }}>
              <img src={settings.company_logo || logoFallback} alt="Medallion" style={{ width: 44, height: 44, borderRadius: '50%', border: '1px solid #d4af37' }} />
              <div>
                <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)' }}>{companyName}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Established Traditional Tailoring</div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  )
}
