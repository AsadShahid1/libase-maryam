import { useState } from 'react'
import { useCart } from '@/contexts/CartContext'
import { Link, usePage, router } from '@inertiajs/react'
import UserLayout from '@/layouts/UserLayout'

export default function Checkout() {
  const { cartItems, cartTotal, clearCart } = useCart()
  const { auth, settings = {} } = usePage().props
  const user = auth?.user

  const [form, setForm] = useState({
    email: user?.email || '',
    fullName: user?.name || '',
    phone: '0321-4676591',
    address: 'DHA Phase 5',
    city: 'Lahore',
    payment: 'cod'
  })

  const [isOrdered, setIsOrdered] = useState(false)
  const [orderId, setOrderId] = useState(null)
  const [loading, setLoading] = useState(false)

  // If user is not logged in, redirect or prompt for login
  if (!user) {
    return (
      <div style={{ padding: '90px 24px', maxWidth: 600, margin: '0 auto', textAlign: 'center' }}>
        <div style={{ fontSize: '3rem', marginBottom: 16 }}>🔑</div>
        <span className="badge badge-sale" style={{ padding: '6px 16px', marginBottom: 16 }}>LOGIN REQUIRED</span>
        <h1 className="font-display" style={{ fontSize: '2.2rem', marginTop: 12, marginBottom: 12 }}>
          Please Sign In to Checkout
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.98rem', marginBottom: 28 }}>
          You must be logged in to complete your purchase and track your boutique suit order.
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 16 }}>
          <Link href="/login" className="btn btn-dark btn-lg" style={{ borderRadius: 'var(--radius-pill)' }}>
            Sign In Now 🔑
          </Link>
          <Link href="/register" className="btn btn-outline btn-lg" style={{ borderRadius: 'var(--radius-pill)' }}>
            Create Account ✨
          </Link>
        </div>
      </div>
    )
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      const generatedId = 'MARYAM-' + Math.floor(100000 + Math.random() * 900000)
      setOrderId(generatedId)
      clearCart()
      setIsOrdered(true)
      setLoading(false)
    }, 1200)
  }

  if (isOrdered) {
    return (
      <div style={{ padding: '90px 24px', maxWidth: 640, margin: '0 auto', textAlign: 'center' }}>
        <div style={{ fontSize: '3.5rem', marginBottom: 16 }}>🎉</div>
        <span className="badge badge-new" style={{ padding: '6px 16px', marginBottom: 16 }}>ORDER CONFIRMED</span>
        <h1 className="font-display" style={{ fontSize: '2.4rem', marginTop: 12, marginBottom: 12 }}>
          Thank You For Your Order!
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.98rem', marginBottom: 20 }}>
          Your confirmation order number is <strong style={{ color: 'var(--primary-sage)' }}>#{orderId}</strong>. A receipt has been sent to your email ({user.email}).
        </p>
        <div style={{ backgroundColor: '#fff', border: '1px solid var(--border-color)', padding: 24, borderRadius: 'var(--radius-md)', marginBottom: 32, textAlign: 'left' }}>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: 8 }}>Estimated Delivery</div>
          <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>2–3 Business Days via Express Courier</div>
        </div>
        <Link href="/products" className="btn btn-primary btn-lg" style={{ borderRadius: 'var(--radius-pill)' }}>
          Continue Shopping →
        </Link>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 24px 100px' }}>
      <div style={{ marginBottom: 32 }}>
        <span className="eyebrow-badge">SECURE CHECKOUT</span>
        <h1 className="font-display" style={{ fontSize: '2.4rem', marginTop: 8 }}>Complete Your Order</h1>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 420px', gap: 48 }}>

        {/* Left Form Column */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>

          {/* Contact Information */}
          <div style={{ backgroundColor: '#fff', border: '1px solid var(--border-color)', padding: 28, borderRadius: 'var(--radius-md)' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: 20, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              1. Customer Details
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div>
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  required
                  className="form-input"
                  value={form.fullName}
                  onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                />
              </div>
              <div>
                <label className="form-label">Phone Number</label>
                <input
                  type="text"
                  required
                  className="form-input"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div style={{ backgroundColor: '#fff', border: '1px solid var(--border-color)', padding: 28, borderRadius: 'var(--radius-md)' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: 20, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              2. Delivery Address
            </h3>
            <div className="form-group" style={{ marginBottom: 16 }}>
              <label className="form-label">Street Address</label>
              <input
                type="text"
                required
                className="form-input"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div>
                <label className="form-label">City</label>
                <input
                  type="text"
                  required
                  className="form-input"
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                />
              </div>
              <div>
                <label className="form-label">Country</label>
                <input
                  type="text"
                  disabled
                  className="form-input"
                  value="Pakistan"
                />
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div style={{ backgroundColor: '#fff', border: '1px solid var(--border-color)', padding: 28, borderRadius: 'var(--radius-md)' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: 20, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              3. Payment Option (PKR)
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 14, border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', cursor: 'pointer' }}>
                <input type="radio" name="payment" value="cod" checked={form.payment === 'cod'} onChange={() => setForm({ ...form, payment: 'cod' })} />
                <span style={{ fontWeight: 600 }}>Cash on Delivery (COD)</span>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 14, border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', cursor: 'pointer' }}>
                <input type="radio" name="payment" value="bank" checked={form.payment === 'bank'} onChange={() => setForm({ ...form, payment: 'bank' })} />
                <span style={{ fontWeight: 600 }}>Direct Bank Transfer (HBL / Meezan)</span>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 14, border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', cursor: 'pointer' }}>
                <input type="radio" name="payment" value="mobile" checked={form.payment === 'mobile'} onChange={() => setForm({ ...form, payment: 'mobile' })} />
                <span style={{ fontWeight: 600 }}>EasyPaisa / JazzCash</span>
              </label>
            </div>

            <button type="submit" disabled={loading} className="btn btn-dark btn-full btn-lg" style={{ borderRadius: 'var(--radius-pill)', fontWeight: 700 }}>
              {loading ? 'Processing Order…' : `Place Order (PKR ${cartTotal.toLocaleString()}) 🔒`}
            </button>
          </div>

        </form>

        {/* Right Summary Column */}
        <div style={{ backgroundColor: '#fff', border: '1px solid var(--border-color)', padding: 28, borderRadius: 'var(--radius-md)', height: 'fit-content' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: 20, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Order Summary ({cartItems.length} items)
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 24 }}>
            {cartItems.map((item) => (
              <div key={item.cartLineId} style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
                <img src={item.image} alt={item.name} style={{ width: 60, height: 72, objectFit: 'cover', borderRadius: 'var(--radius-sm)' }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700 }}>{item.name}</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Qty: {item.quantity} • {item.selectedSize}</div>
                </div>
                <div style={{ fontSize: '0.9rem', fontWeight: 700 }}>PKR {(item.price * item.quantity).toLocaleString()}</div>
              </div>
            ))}
          </div>

          <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: 16, display: 'flex', flexDirection: 'column', gap: 8, fontSize: '0.9rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Subtotal</span><span>PKR {cartTotal.toLocaleString()}</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Shipping</span><span style={{ color: 'var(--primary-sage)', fontWeight: 700 }}>FREE</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: 8, paddingTop: 12, borderTop: '1px solid var(--border-color)' }}>
              <span>Total</span>
              <span style={{ color: 'var(--primary-sage)' }}>PKR {cartTotal.toLocaleString()}</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

Checkout.layout = (page) => <UserLayout>{page}</UserLayout>
