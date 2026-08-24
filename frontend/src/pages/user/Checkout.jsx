import { useState, useEffect } from 'react'
import { useCart } from '@/contexts/CartContext'
import { getShopMetadata } from '@/api'
import { Link } from 'react-router-dom'

export default function Checkout() {
  const { cartItems, cartTotal, clearCart } = useCart()
  
  // Checkout Form State
  const [form, setForm] = useState({ name: '', phone: '', address: '', city: 'Lahore', note: '', payment: '' })
  const [settings, setSettings] = useState({})
  const [isOrdered, setIsOrdered] = useState(false)
  const [orderId, setOrderId] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    getShopMetadata()
      .then(res => {
        const s = res.data.settings || {}
        setSettings(s)
        
        // Auto-select first enabled payment method
        if (s.payment_cod_enabled === '1') setForm(p => ({ ...p, payment: 'cod' }))
        else if (s.payment_bank_enabled === '1') setForm(p => ({ ...p, payment: 'bank' }))
        else if (s.payment_easypaisa_enabled === '1') setForm(p => ({ ...p, payment: 'easypaisa' }))
        else if (s.payment_jazzcash_enabled === '1') setForm(p => ({ ...p, payment: 'jazzcash' }))
      })
      .catch(console.error)
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      const generatedId = 'LM-' + Math.floor(100000 + Math.random() * 900000)
      setOrderId(generatedId)
      clearCart()
      setIsOrdered(true)
      setLoading(false)
    }, 1500)
  }

  if (isOrdered) {
    return (
      <div style={{ padding: '80px 24px', maxWidth: 600, margin: '0 auto', textAlign: 'center' }}>
        <div style={{ fontSize: '4.5rem', marginBottom: 24 }}>✨</div>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2.5rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 12 }}>
          Order Confirmed!
        </h1>
        <p style={{ color: '#d4af37', fontWeight: 700, fontSize: '1.15rem', marginBottom: 20 }}>
          Your Order ID is: {orderId}
        </p>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 32 }}>
          Thank you for choosing <strong>{settings.company_name || 'Libas-E-Maryam'}</strong>. Our team will contact you on <strong>{form.phone}</strong> to confirm your size details and shipping schedules before dispatching your package.
        </p>
        <div style={{ display: 'flex', gap: 16, justifyContent: 'center' }}>
          <Link to="/" className="btn btn-primary" style={{ background: 'linear-gradient(135deg, #d4af37, #aa820a)', border: 'none', color: '#000' }}>
            Continue Shopping
          </Link>
          {settings.social_facebook && (
            <a
              href={settings.social_facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-ghost"
              style={{ color: '#1877f2', borderColor: 'rgba(24,119,242,0.3)' }}
            >
              Visit Support 🌐
            </a>
          )}
        </div>
      </div>
    )
  }

  // Check which payment methods are enabled
  const codEnabled = settings.payment_cod_enabled === '1'
  const bankEnabled = settings.payment_bank_enabled === '1'
  const easypaisaEnabled = settings.payment_easypaisa_enabled === '1'
  const jazzcashEnabled = settings.payment_jazzcash_enabled === '1'

  return (
    <div className="checkout-container" style={{ maxWidth: 1000, margin: '0 auto' }}>
      <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 32 }}>
        Checkout Details
      </h1>

      {cartItems.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 24px', background: 'var(--bg-card)', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
          <div style={{ fontSize: '3rem', marginBottom: 16 }}>👜</div>
          <h3>Your shopping bag is empty</h3>
          <p style={{ color: 'var(--text-muted)', marginTop: 8 }}>Please add items to your shopping bag to proceed to checkout.</p>
          <Link to="/" className="btn btn-primary" style={{ marginTop: 24 }}>Shop Collections</Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 32, alignItems: 'start' }}>
          
          {/* Shipping Form Card */}
          <div className="card" style={{ padding: 32 }}>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: 24, borderBottom: '1px solid var(--border)', paddingBottom: 12 }}>
              Delivery Information
            </h2>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input className="form-input" placeholder="e.g. Ayesha Khan" value={form.name}
                  onChange={e => setForm(p => ({ ...p, name: e.target.value }))} required />
              </div>
              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <input className="form-input" placeholder="e.g. +92 321-4676591" value={form.phone}
                  onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} required />
              </div>
              <div className="form-group">
                <label className="form-label">City</label>
                <select className="form-input" value={form.city}
                  onChange={e => setForm(p => ({ ...p, city: e.target.value }))}>
                  <option value="Lahore">Lahore</option>
                  <option value="Karachi">Karachi</option>
                  <option value="Islamabad">Islamabad</option>
                  <option value="Faisalabad">Faisalabad</option>
                  <option value="Multan">Multan</option>
                  <option value="Peshawar">Peshawar</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Shipping Address</label>
                <textarea className="form-input" style={{ minHeight: 90, fontFamily: 'inherit', resize: 'vertical' }}
                  placeholder="Street Address, Area/Sector, Block" value={form.address}
                  onChange={e => setForm(p => ({ ...p, address: e.target.value }))} required />
              </div>
              <div className="form-group">
                <label className="form-label">Order Note (Optional)</label>
                <input className="form-input" placeholder="e.g. Custom sizing request" value={form.note}
                  onChange={e => setForm(p => ({ ...p, note: e.target.value }))} />
              </div>

              {/* Dynamic Payment Gateways Toggles */}
              <div className="form-group" style={{ marginTop: 8 }}>
                <label className="form-label" style={{ marginBottom: 12 }}>Payment Option</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {codEnabled && (
                    <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
                      <input type="radio" name="payment" value="cod" checked={form.payment === 'cod'}
                        onChange={e => setForm(p => ({ ...p, payment: e.target.value }))}
                        style={{ accentColor: '#d4af37', width: 18, height: 18 }} />
                      <span style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>💵 Cash on Delivery (COD)</span>
                    </label>
                  )}
                  {bankEnabled && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
                        <input type="radio" name="payment" value="bank" checked={form.payment === 'bank'}
                          onChange={e => setForm(p => ({ ...p, payment: e.target.value }))}
                          style={{ accentColor: '#d4af37', width: 18, height: 18 }} />
                        <span style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>🏛️ Direct Bank Transfer</span>
                      </label>
                      {form.payment === 'bank' && settings.payment_bank_details && (
                        <div style={{ marginLeft: 28, fontSize: '0.78rem', color: 'var(--text-secondary)', background: 'var(--bg-card2)', padding: '10px 14px', borderRadius: 6, border: '1px solid var(--border)' }}>
                          {settings.payment_bank_details}
                        </div>
                      )}
                    </div>
                  )}
                  {easypaisaEnabled && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
                        <input type="radio" name="payment" value="easypaisa" checked={form.payment === 'easypaisa'}
                          onChange={e => setForm(p => ({ ...p, payment: e.target.value }))}
                          style={{ accentColor: '#d4af37', width: 18, height: 18 }} />
                        <span style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>📱 EasyPaisa Transfer</span>
                      </label>
                      {form.payment === 'easypaisa' && settings.payment_easypaisa_details && (
                        <div style={{ marginLeft: 28, fontSize: '0.78rem', color: 'var(--text-secondary)', background: 'var(--bg-card2)', padding: '10px 14px', borderRadius: 6, border: '1px solid var(--border)' }}>
                          {settings.payment_easypaisa_details}
                        </div>
                      )}
                    </div>
                  )}
                  {jazzcashEnabled && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
                        <input type="radio" name="payment" value="jazzcash" checked={form.payment === 'jazzcash'}
                          onChange={e => setForm(p => ({ ...p, payment: e.target.value }))}
                          style={{ accentColor: '#d4af37', width: 18, height: 18 }} />
                        <span style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>📱 JazzCash Transfer</span>
                      </label>
                      {form.payment === 'jazzcash' && settings.payment_jazzcash_details && (
                        <div style={{ marginLeft: 28, fontSize: '0.78rem', color: 'var(--text-secondary)', background: 'var(--bg-card2)', padding: '10px 14px', borderRadius: 6, border: '1px solid var(--border)' }}>
                          {settings.payment_jazzcash_details}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <button type="submit" className="btn btn-primary btn-full" style={{ background: 'linear-gradient(135deg, #d4af37, #aa820a)', border: 'none', color: '#000', marginTop: 12, fontWeight: 700 }} disabled={loading || !form.payment}>
                {loading ? 'Processing Order…' : `Confirm Order (PKR ${cartTotal.toLocaleString()})`}
              </button>
            </form>
          </div>

          {/* Bag Summary Card */}
          <div className="card" style={{ padding: 32, background: 'rgba(255,255,255,0.015)', border: '1px solid var(--border)' }}>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: 24, borderBottom: '1px solid var(--border)', paddingBottom: 12 }}>
              Order Summary
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 18, maxHeight: 360, overflowY: 'auto', marginBottom: 24, paddingRight: 4 }}>
              {cartItems.map(item => (
                <div key={item.id} style={{ display: 'flex', gap: 12, borderBottom: '1px solid rgba(255,255,255,0.03)', paddingBottom: 12 }}>
                  <img src={item.image} alt={item.name} style={{ width: 50, height: 65, objectFit: 'cover', borderRadius: 'var(--radius-sm)' }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>{item.name}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: 2 }}>
                      Size: {item.selectedSize} | Color: {item.selectedColor}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 2 }}>Qty: {item.quantity}</div>
                  </div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-primary)' }}>PKR {(item.price * item.quantity).toLocaleString()}</div>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, borderTop: '1px solid var(--border)', paddingTop: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                <span>Subtotal</span>
                <span>PKR {cartTotal.toLocaleString()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                <span>Delivery Charges</span>
                <span style={{ color: 'var(--success)' }}>Free</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 12, marginTop: 4 }}>
                <span>Total Amount</span>
                <span>PKR {cartTotal.toLocaleString()}</span>
              </div>
            </div>
          </div>

        </div>
      )}
    </div>
  )
}
