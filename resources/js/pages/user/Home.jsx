import { useState } from 'react'
import { useCart } from '@/contexts/CartContext'
import { submitContactMessage } from '@/api'
import { Link, usePage } from '@inertiajs/react'
import UserLayout from '@/layouts/UserLayout'
import productSilk from '@/assets/product_silk.jpg'
import productLawn from '@/assets/product_lawn.jpg'
import productVelvet from '@/assets/product_velvet.jpg'
import dress1 from '@/assets/libasemaryam1.png'
import dress2 from '@/assets/libasemaryam2.png'
import dress3 from '@/assets/libasemmaryam.png'

export default function Home({
  initialProducts = [],
  banners: initialBanners = [],
  brands: initialBrands = [],
  categories: initialCategories = [],
  filters = {}
}) {
  const { addToCart } = useCart()
  const { settings = {} } = usePage().props

  const [products] = useState(initialProducts)
  const [categories] = useState(initialCategories)
  const [activeFaq, setActiveFaq] = useState(null)

  // Boutique dress image fallback list
  const boutiqueImages = [productVelvet, productSilk, productLawn, dress1, dress2, dress3]

  const categoryImageMap = {
    'velvet-festive': productVelvet,
    'luxury-silk': productSilk,
    'premium-lawn': productLawn,
    'chiffon-organza': dress1,
    'bridal-couture': dress2,
    'pret-wear': dress3
  }

  // Newsletter form
  const [newsletterEmail, setNewsletterEmail] = useState('')
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false)

  const handleNewsletterSubmit = (e) => {
    e.preventDefault()
    if (newsletterEmail) {
      setNewsletterSubscribed(true)
      setNewsletterEmail('')
    }
  }

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index)
  }

  const faqs = [
    {
      q: "What fabric quality is used in Libas-E-Maryam suits?",
      a: "We use 100% pure raw silks, plush micro-velvet, organic handloom weaves, and luxury printed cotton lawn, all hand-embellished with zardozi tilla threadwork."
    },
    {
      q: "Can I request custom stitching or bespoke sizing?",
      a: "Yes! We offer customized tailoring services ranging from XS to custom bridal measurements. Contact our boutique concierge team for custom fitting requests."
    },
    {
      q: "What is your delivery timeframe within Pakistan and globally?",
      a: "Unstitched suits are delivered within 2-3 business days across Pakistan. Stitched bespoke ensembles take 7-10 days. Express international shipping is available worldwide."
    },
    {
      q: "What payment options are accepted?",
      a: "We accept Cash on Delivery (COD), Direct Bank Transfer, Visa / MasterCard, EasyPaisa, and JazzCash."
    }
  ]

  return (
    <div>

      {/* ── 1. CINEMATIC HERO BANNER WITH BOUTIQUE DRESS SHOWCASE ── */}
      <section style={{ position: 'relative', width: '100%', minHeight: '84vh', display: 'flex', alignItems: 'center', backgroundColor: '#0C1A2E', overflow: 'hidden' }}>
        {/* Full-width Boutique Dress Hero Banner */}
        <div style={{ position: 'absolute', inset: 0, opacity: 0.88 }}>
          <img
            src={productVelvet}
            alt="Libas-E-Maryam Boutique Suits Showcase"
            style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 25%' }}
          />
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(90deg, rgba(12, 26, 46, 0.92) 0%, rgba(12, 26, 46, 0.60) 50%, rgba(12, 26, 46, 0.25) 100%)'
          }} />
        </div>

        {/* Content Box */}
        <div style={{ position: 'relative', zIndex: 10, maxWidth: 1320, width: '100%', margin: '0 auto', padding: '60px 24px' }}>
          <div style={{ maxWidth: 640 }}>
            <span className="eyebrow-badge" style={{ backgroundColor: 'rgba(230, 238, 248, 0.95)', color: '#1B365D', marginBottom: 20 }}>
              FESTIVE LUXURY EDIT 2026
            </span>
            <h1 className="font-display" style={{ fontSize: '3.6rem', color: '#FFFFFF', lineHeight: 1.12, marginBottom: 20, fontWeight: 700 }}>
              A Tradition of Unmatched Elegance.
            </h1>
            <p style={{ color: '#E2E8F0', fontSize: '1.15rem', lineHeight: 1.6, marginBottom: 32, fontWeight: 400 }}>
              Curated festive ensembles, velvet ghararas, raw silk anarkalis, and designer embroidered cotton lawn.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
              <Link href="/products" className="btn btn-primary btn-lg" style={{ borderRadius: 'var(--radius-pill)', fontWeight: 700 }}>
                Shop New Arrivals →
              </Link>
              <Link href="/categories" className="btn btn-outline btn-lg" style={{ color: '#fff', borderColor: '#ffffff', borderRadius: 'var(--radius-pill)', backdropFilter: 'blur(4px)' }}>
                Explore Collections
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. TRUST BADGES BAR ── */}
      <section style={{ backgroundColor: '#FFFFFF', borderBottom: '1px solid var(--border-color)', padding: '28px 24px' }}>
        <div style={{ maxWidth: 1320, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 24, textAlign: 'center' }}>
          
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
            <div style={{ fontSize: '1.8rem' }}>🚚</div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)' }}>Free Express Shipping</h4>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>Complimentary nationwide shipping on orders over PKR 10,000.</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
            <div style={{ fontSize: '1.8rem' }}>✨</div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)' }}>Bespoke Hand Tailoring</h4>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>Hand-embroidered zardozi and custom fitting options available.</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
            <div style={{ fontSize: '1.8rem' }}>🔒</div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)' }}>Safe & Easy Payment</h4>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>Cash on Delivery, Bank Transfer, EasyPaisa & JazzCash.</p>
          </div>

        </div>
      </section>

      {/* ── 3. FEATURED CATEGORIES (100% BOUTIQUE DRESS IMAGES ONLY) ── */}
      <section style={{ padding: '80px 24px', maxWidth: 1320, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 44 }}>
          <span className="eyebrow-badge">OUR COLLECTIONS</span>
          <h2 className="section-title" style={{ marginTop: 10 }}>Explore Boutique Categories</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>Select your preferred fabric edit and bespoke attire.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
          {categories.slice(0, 4).map((cat, idx) => {
            const catImage = (cat.image && !cat.image.includes('hero_reference'))
              ? cat.image
              : (categoryImageMap[cat.slug] || boutiqueImages[idx % boutiqueImages.length])

            return (
              <Link key={cat.id} href={`/products?category=${cat.slug}`} className="product-card" style={{ padding: 0, overflow: 'hidden', height: 380 }}>
                <div style={{ width: '100%', height: '100%', position: 'relative' }}>
                  <img src={catImage} alt={cat.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(180deg, rgba(0,0,0,0) 35%, rgba(12,26,46,0.88) 100%)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-end',
                    padding: 24
                  }}>
                    <h3 style={{ color: '#fff', fontSize: '1.35rem', fontWeight: 700, marginBottom: 4 }}>{cat.name}</h3>
                    <p style={{ color: '#E2E8F0', fontSize: '0.82rem', marginBottom: 12 }}>{cat.description}</p>
                    <span className="btn btn-outline btn-sm" style={{ color: '#fff', borderColor: '#fff', width: 'fit-content', borderRadius: 'var(--radius-pill)' }}>
                      Explore Category →
                    </span>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </section>

      {/* ── 4. NEW ARRIVALS PRODUCT GRID (100% BOUTIQUE DRESS IMAGES ONLY) ── */}
      <section style={{ padding: '80px 24px', backgroundColor: '#FFFFFF', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)' }}>
        <div style={{ maxWidth: 1320, margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 40 }}>
            <div>
              <span className="eyebrow-badge">NEW ARRIVALS</span>
              <h2 className="section-title" style={{ marginTop: 10 }}>Boutique Suits Showcase</h2>
            </div>
            <Link href="/products" className="btn btn-outline btn-sm" style={{ borderRadius: 'var(--radius-pill)' }}>
              View All Products →
            </Link>
          </div>

          <div className="boutique-grid">
            {products.map((item, idx) => {
              const productImage = (item.image && !item.image.includes('hero_reference'))
                ? item.image
                : boutiqueImages[idx % boutiqueImages.length]

              return (
                <div key={item.id} className="product-card">
                  <div className="product-image-container">
                    <Link href={`/product/${item.id}`}>
                      <img src={productImage} alt={item.name} />
                    </Link>

                    <button style={{ position: 'absolute', top: 12, right: 12, width: 32, height: 32, borderRadius: '50%', backgroundColor: '#fff', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-sm)' }}>
                      🤍
                    </button>

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

                  <div style={{ padding: '14px 4px 4px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                        <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--primary-sage)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                          {item.category?.name || 'Suit Collection'}
                        </span>
                        <div style={{ fontSize: '0.78rem', color: 'var(--accent-star)' }}>
                          ★★★★★ <span style={{ color: 'var(--text-muted)', fontSize: '0.72rem' }}>(4.9)</span>
                        </div>
                      </div>

                      <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8, lineHeight: 1.3 }}>
                        <Link href={`/product/${item.id}`}>{item.name}</Link>
                      </h3>
                    </div>

                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 6 }}>
                        {item.is_on_sale ? (
                          <>
                            <span style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)' }}>PKR {item.sale_price?.toLocaleString()}</span>
                            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>PKR {item.price?.toLocaleString()}</span>
                          </>
                        ) : (
                          <span style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)' }}>PKR {item.price?.toLocaleString()}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── 5. BRAND EDITORIAL ("OUR BOUTIQUE LEGACY") ── */}
      <section style={{ padding: '90px 24px', maxWidth: 1320, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 60, alignItems: 'center' }}>
          <div>
            <span className="eyebrow-badge" style={{ marginBottom: 16 }}>HERITAGE ARTISTRY</span>
            <h2 className="font-display" style={{ fontSize: '2.8rem', lineHeight: 1.2, marginBottom: 20 }}>
              The Story of Libas-E-Maryam
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.02rem', lineHeight: 1.8, marginBottom: 24 }}>
              Libas-E-Maryam brings you a heritage of traditional artistry. Specialized in high-end tailored lehengas, hand-worked velvet shawls, and premium embroidered cotton lawn, our mission is to create royal Eastern ensembles that reflect luxury and comfort.
            </p>
            <div style={{ display: 'flex', gap: 24, marginBottom: 32 }}>
              <div>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--primary-sage)' }}>100%</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Pure Fabrics</div>
              </div>
              <div>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--primary-sage)' }}>Hand Tilla</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Zari Needlework</div>
              </div>
            </div>
            <Link href="/about" className="btn btn-dark btn-lg" style={{ borderRadius: 'var(--radius-pill)' }}>
              Read Our Full Story →
            </Link>
          </div>

          <div style={{ position: 'relative' }}>
            <img
              src={dress1}
              alt="Libas-E-Maryam Boutique Suit Showcase"
              style={{ width: '100%', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-lg)', border: '1px solid var(--border-color)' }}
            />
          </div>
        </div>
      </section>

      {/* ── 6. FEATURED BOUTIQUE FABRICS SHOWCASE ── */}
      <section style={{ backgroundColor: 'var(--bg-subtle)', padding: '80px 24px', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)' }}>
        <div style={{ maxWidth: 1320, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <span className="eyebrow-badge">PREMIUM TEXTILES</span>
            <h2 className="section-title" style={{ marginTop: 10 }}>Hand-Embellished Boutique Fabrics</h2>
            <p style={{ color: 'var(--text-secondary)' }}>Fine raw silk, heavy micro-velvet, and designer cotton lawn.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 32 }}>
            <div className="product-card" style={{ padding: 0, overflow: 'hidden', height: 340 }}>
              <img src={dress2} alt="Royal Velvet Showcase" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <div style={{ position: 'absolute', bottom: 0, insetX: 0, padding: 24, background: 'linear-gradient(0deg, rgba(12,26,46,0.88) 0%, transparent 100%)', color: '#fff' }}>
                <h3 style={{ color: '#fff', fontSize: '1.2rem' }}>Royal Velvet Festive Edit</h3>
                <p style={{ fontSize: '0.82rem', color: '#E2E8F0' }}>Plush micro-velvet with gilded hand tilla embroidery.</p>
              </div>
            </div>

            <div className="product-card" style={{ padding: 0, overflow: 'hidden', height: 340 }}>
              <img src={dress3} alt="Luxury Raw Silk Showcase" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <div style={{ position: 'absolute', bottom: 0, insetX: 0, padding: 24, background: 'linear-gradient(0deg, rgba(12,26,46,0.88) 0%, transparent 100%)', color: '#fff' }}>
                <h3 style={{ color: '#fff', fontSize: '1.2rem' }}>Luxury Raw Silk Anarkali</h3>
                <p style={{ fontSize: '0.82rem', color: '#E2E8F0' }}>Bespoke flared silhouettes with organza dupattas.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 7. FREQUENTLY ASKED QUESTIONS ── */}
      <section style={{ backgroundColor: '#FFFFFF', padding: '80px 24px', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)' }}>
        <div style={{ maxWidth: 840, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <span className="eyebrow-badge">HELP & INQUIRIES</span>
            <h2 className="section-title" style={{ marginTop: 10 }}>Frequently Asked Questions</h2>
          </div>

          <div>
            {faqs.map((faq, idx) => (
              <div key={idx} className="faq-accordion-item">
                <div className="faq-header" onClick={() => toggleFaq(idx)}>
                  <span>{faq.q}</span>
                  <span style={{ fontSize: '1.2rem', color: 'var(--primary-sage)' }}>{activeFaq === idx ? '−' : '+'}</span>
                </div>
                {activeFaq === idx && (
                  <div className="faq-content">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 8. NEWSLETTER ── */}
      <section style={{ padding: '80px 24px', backgroundColor: 'var(--primary-sage-light)' }}>
        <div style={{ maxWidth: 640, margin: '0 auto', textAlign: 'center' }}>
          <span className="eyebrow-badge" style={{ backgroundColor: '#fff', color: 'var(--primary-sage-dark)' }}>EXCLUSIVE UPDATES</span>
          <h2 className="font-display" style={{ fontSize: '2.4rem', marginTop: 12, marginBottom: 12 }}>Stay in the Know</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: 28 }}>
            Be the first to discover new festive arrivals, private sales, and unstitched lawn drops.
          </p>

          {newsletterSubscribed ? (
            <div className="badge badge-new" style={{ padding: '12px 24px', fontSize: '0.9rem' }}>
              ✓ Thank you for subscribing! Check your email for your special discount.
            </div>
          ) : (
            <form onSubmit={handleNewsletterSubmit} style={{ display: 'flex', gap: 12, maxWidth: 500, margin: '0 auto' }}>
              <input
                type="email"
                placeholder="Enter your email address"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                className="form-input"
                style={{ borderRadius: 'var(--radius-pill)', padding: '14px 20px' }}
                required
              />
              <button type="submit" className="btn btn-dark" style={{ borderRadius: 'var(--radius-pill)', padding: '14px 28px' }}>
                Subscribe
              </button>
            </form>
          )}
        </div>
      </section>

    </div>
  )
}

Home.layout = (page) => <UserLayout>{page}</UserLayout>
