import { useEffect, useState } from 'react'
import { getAdminSettings, updateAdminSettings } from '@/api'
import AdminLayout from '@/layouts/AdminLayout'

export default function Settings({ initialSettings = {} }) {
  const [form, setForm] = useState({
    company_name: '', company_tagline: '', company_logo: '',
    company_phone: '', company_email: '', company_address: '',
    social_facebook: '', social_instagram: '', social_whatsapp: '',
    about_us_title: '', about_us_content: '',
    payment_cod_enabled: '0', payment_bank_enabled: '0',
    payment_easypaisa_enabled: '0', payment_jazzcash_enabled: '0',
    payment_bank_details: '', payment_easypaisa_details: '', payment_jazzcash_details: ''
  })
  
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState('')
  const [activeTab, setActiveTab] = useState('company')

  useEffect(() => {
    if (initialSettings) {
      setForm(p => ({
        ...p,
        ...initialSettings
      }))
    }
  }, [initialSettings])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setSuccess('')
    try {
      const res = await updateAdminSettings(form)
      setForm(p => ({ ...p, ...res.data.settings }))
      setSuccess('Settings updated successfully!')
    } catch (err) {
      setSuccess('Failed to save settings.')
    } finally {
      setSaving(false)
    }
  }

  const handleCheckboxChange = (field) => {
    setForm(p => ({
      ...p,
      [field]: p[field] === '1' ? '0' : '1'
    }))
  }

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', padding: 40 }}><div className="spinner" /></div>

  return (
    <div style={{ maxWidth: 840 }}>
      <div className="page-header">
        <h1>Store Settings & Payments</h1>
      </div>

      {success && (
        <div className={`alert alert-${success.includes('Failed') ? 'error' : 'success'}`} style={{ marginBottom: 24 }}>
          {success}
        </div>
      )}

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 24, borderBottom: '1px solid var(--border)', paddingBottom: 12 }}>
        {['company', 'about', 'payments'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              background: activeTab === tab ? 'rgba(212,175,55,0.08)' : 'none',
              border: 'none',
              borderBottom: activeTab === tab ? '2px solid #d4af37' : '2px solid transparent',
              color: activeTab === tab ? '#fff' : 'var(--text-secondary)',
              padding: '8px 16px',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer',
              textTransform: 'capitalize'
            }}
          >
            {tab === 'company' ? 'Company Details' : tab === 'about' ? 'About Us Content' : 'Payment Gateways'}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="card" style={{ padding: 32 }}>
        {/* TAB 1: Company details */}
        {activeTab === 'company' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div className="form-group">
                <label className="form-label">Store / Company Name</label>
                <input className="form-input" value={form.company_name} onChange={e => setForm(p => ({ ...p, company_name: e.target.value }))} required />
              </div>
              <div className="form-group">
                <label className="form-label">Company Tagline</label>
                <input className="form-input" value={form.company_tagline} onChange={e => setForm(p => ({ ...p, company_tagline: e.target.value }))} />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <input className="form-input" value={form.company_phone} onChange={e => setForm(p => ({ ...p, company_phone: e.target.value }))} required />
              </div>
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input type="email" className="form-input" value={form.company_email} onChange={e => setForm(p => ({ ...p, company_email: e.target.value }))} required />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Logo Path / Asset URL</label>
              <input className="form-input" value={form.company_logo} onChange={e => setForm(p => ({ ...p, company_logo: e.target.value }))} />
            </div>

            <div className="form-group">
              <label className="form-label">Store Address</label>
              <textarea className="form-input" value={form.company_address} onChange={e => setForm(p => ({ ...p, company_address: e.target.value }))} style={{ minHeight: 60 }} required />
            </div>

            <h3 style={{ fontSize: '0.92rem', color: '#d4af37', borderBottom: '1px solid var(--border)', paddingBottom: 6, marginTop: 8 }}>Social Media Handles</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
              <div className="form-group">
                <label className="form-label">Facebook Page URL</label>
                <input type="url" className="form-input" value={form.social_facebook} onChange={e => setForm(p => ({ ...p, social_facebook: e.target.value }))} />
              </div>
              <div className="form-group">
                <label className="form-label">Instagram Link</label>
                <input type="url" className="form-input" value={form.social_instagram} onChange={e => setForm(p => ({ ...p, social_instagram: e.target.value }))} />
              </div>
              <div className="form-group">
                <label className="form-label">WhatsApp Contact Link</label>
                <input className="form-input" placeholder="e.g. https://wa.me/92..." value={form.social_whatsapp} onChange={e => setForm(p => ({ ...p, social_whatsapp: e.target.value }))} />
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: About us Content */}
        {activeTab === 'about' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div className="form-group">
              <label className="form-label">About Page Title</label>
              <input className="form-input" value={form.about_us_title} onChange={e => setForm(p => ({ ...p, about_us_title: e.target.value }))} required />
            </div>
            <div className="form-group">
              <label className="form-label">About Us Content</label>
              <textarea className="form-input" value={form.about_us_content} onChange={e => setForm(p => ({ ...p, about_us_content: e.target.value }))} style={{ minHeight: 200, fontFamily: 'inherit', lineHeight: 1.6 }} required />
            </div>
          </div>
        )}

        {/* TAB 3: Payment Options Configs */}
        {activeTab === 'payments' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <h3 style={{ fontSize: '0.95rem', color: '#d4af37', borderBottom: '1px solid var(--border)', paddingBottom: 6 }}>Checkout Payment Toggles</h3>
            
            {/* COD */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
                <input type="checkbox" checked={form.payment_cod_enabled === '1'} onChange={() => handleCheckboxChange('payment_cod_enabled')} style={{ width: 18, height: 18 }} />
                <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)' }}>Enable Cash on Delivery (COD)</span>
              </label>
            </div>

            {/* Direct Bank Transfer */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
                <input type="checkbox" checked={form.payment_bank_enabled === '1'} onChange={() => handleCheckboxChange('payment_bank_enabled')} style={{ width: 18, height: 18 }} />
                <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)' }}>Enable Direct Bank Transfer</span>
              </label>
              {form.payment_bank_enabled === '1' && (
                <div className="form-group" style={{ paddingLeft: 28 }}>
                  <label className="form-label">Bank Account details</label>
                  <textarea className="form-input" value={form.payment_bank_details} onChange={e => setForm(p => ({ ...p, payment_bank_details: e.target.value }))} placeholder="Bank Name, Account number, Branch details..." style={{ minHeight: 60 }} />
                </div>
              )}
            </div>

            {/* EasyPaisa Transfer */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
                <input type="checkbox" checked={form.payment_easypaisa_enabled === '1'} onChange={() => handleCheckboxChange('payment_easypaisa_enabled')} style={{ width: 18, height: 18 }} />
                <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)' }}>Enable EasyPaisa</span>
              </label>
              {form.payment_easypaisa_enabled === '1' && (
                <div className="form-group" style={{ paddingLeft: 28 }}>
                  <label className="form-label">EasyPaisa Account details</label>
                  <textarea className="form-input" value={form.payment_easypaisa_details} onChange={e => setForm(p => ({ ...p, payment_easypaisa_details: e.target.value }))} placeholder="EasyPaisa number, account name..." style={{ minHeight: 60 }} />
                </div>
              )}
            </div>

            {/* JazzCash Transfer */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
                <input type="checkbox" checked={form.payment_jazzcash_enabled === '1'} onChange={() => handleCheckboxChange('payment_jazzcash_enabled')} style={{ width: 18, height: 18 }} />
                <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)' }}>Enable JazzCash</span>
              </label>
              {form.payment_jazzcash_enabled === '1' && (
                <div className="form-group" style={{ paddingLeft: 28 }}>
                  <label className="form-label">JazzCash Account details</label>
                  <textarea className="form-input" value={form.payment_jazzcash_details} onChange={e => setForm(p => ({ ...p, payment_jazzcash_details: e.target.value }))} placeholder="JazzCash Till ID or phone number..." style={{ minHeight: 60 }} />
                </div>
              )}
            </div>
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid var(--border)', paddingTop: 20, marginTop: 24 }}>
          <button type="submit" className="btn btn-primary" style={{ background: '#d4af37', color: '#000', border: 'none', fontWeight: 700 }} disabled={saving}>
            {saving ? 'Saving Configurations…' : 'Save Settings'}
          </button>
        </div>
      </form>
    </div>
  )
}

Settings.layout = (page) => <AdminLayout>{page}</AdminLayout>

