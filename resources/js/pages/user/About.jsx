import { Link } from '@inertiajs/react'
import UserLayout from '@/layouts/UserLayout'
import aboutVisionBanner from '@/assets/about_vision_mission.jpg'
import productSilk from '@/assets/product_silk.jpg'
import productVelvet from '@/assets/product_velvet.jpg'

export default function About() {
  return (
    <div style={{ maxWidth: 1320, margin: '0 auto', padding: '60px 24px 100px' }}>

      {/* Editorial Header */}
      <div style={{ textAlign: 'center', maxWidth: 800, margin: '0 auto 48px' }}>
        <span className="eyebrow-badge">THE STORY OF LIBAS-E-MARYAM</span>
        <h1 className="font-display" style={{ fontSize: '3.2rem', marginTop: 12, marginBottom: 20, lineHeight: 1.15 }}>
          Our Vision & Mission: A Legacy of Timeless Elegance.
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', lineHeight: 1.7 }}>
          Crafting heirlooms that celebrate our rich heritage for Libas-E-Maryam.
        </p>
      </div>

      {/* Hero Showcase Image (User Uploaded Vision & Mission Banner) */}
      <div style={{ width: '100%', borderRadius: 'var(--radius-lg)', overflow: 'hidden', marginBottom: 80, border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-lg)' }}>
        <img
          src={aboutVisionBanner}
          alt="Our Vision & Mission: A Legacy of Timeless Elegance - Libas-E-Maryam Bridal Couture"
          style={{ width: '100%', height: 'auto', display: 'block', objectFit: 'cover' }}
        />
      </div>

      {/* Vision & Mission Highlight Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 40, marginBottom: 80 }}>
        <div className="product-card" style={{ padding: 40, borderLeft: '4px solid var(--primary-sage)' }}>
          <span className="eyebrow-badge" style={{ marginBottom: 12 }}>OUR VISION</span>
          <h3 className="font-display" style={{ fontSize: '1.6rem', marginBottom: 14, color: 'var(--text-primary)' }}>
            Definitive Global Voice
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.02rem', lineHeight: 1.8 }}>
            To be the definitive global voice for Pakistani bridal artistry, crafting heirlooms that celebrate our rich heritage for Libas-E-Maryam.
          </p>
        </div>

        <div className="product-card" style={{ padding: 40, borderLeft: '4px solid var(--accent-gold-sage)' }}>
          <span className="eyebrow-badge" style={{ marginBottom: 12, backgroundColor: 'rgba(197, 160, 89, 0.15)', color: '#C5A059' }}>OUR MISSION</span>
          <h3 className="font-display" style={{ fontSize: '1.6rem', marginBottom: 14, color: 'var(--text-primary)' }}>
            Empowering Every Bride
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.02rem', lineHeight: 1.8 }}>
            To empower every bride to realize her dream with bespoke craftsmanship, uncompromising quality, and a deeply personalized experience, guided by the Libas-E-Maryam ethos.
          </p>
        </div>
      </div>

      {/* Founder Statement Section */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 60, alignItems: 'center', backgroundColor: '#fff', border: '1px solid var(--border-color)', padding: 48, borderRadius: 'var(--radius-xl)' }}>
        <div>
          <span className="eyebrow-badge" style={{ marginBottom: 12 }}>HERITAGE CRAFTSMANSHIP</span>
          <h2 className="font-display" style={{ fontSize: '2.2rem', marginBottom: 20 }}>
            "Attire should celebrate your heritage with graceful modern elegance."
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.98rem', lineHeight: 1.8, marginBottom: 24 }}>
            We created Libas-E-Maryam to provide discerning women with authentic luxury Pakistani suits, bridal lehengas, and festive velvet collections tailored to perfection.
          </p>
          <Link href="/products" className="btn btn-primary btn-lg" style={{ borderRadius: 'var(--radius-pill)' }}>
            Explore Festive Collection →
          </Link>
        </div>

        <div>
          <img src={productVelvet} alt="Libas-E-Maryam Craftsmanship" style={{ width: '100%', borderRadius: 'var(--radius-md)', objectFit: 'cover' }} />
        </div>
      </div>

    </div>
  )
}

About.layout = (page) => <UserLayout>{page}</UserLayout>
