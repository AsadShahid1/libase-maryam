import { useEffect, useState } from 'react'
import { getAdminInquiries, toggleInquiryRead, deleteInquiry } from '@/api'
import AdminLayout from '@/layouts/AdminLayout'

export default function Contacts({ initialMessages = [] }) {
  const [inquiries, setInquiries] = useState(initialMessages)
  const [loading, setLoading] = useState(false)
  const [selectedMsg, setSelectedMsg] = useState(null)

  const loadInquiries = () => {
    setLoading(true)
    getAdminInquiries()
      .then(r => setInquiries(r.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }

  const handleToggleRead = async (id) => {
    await toggleInquiryRead(id)
    loadInquiries()
    if (selectedMsg && selectedMsg.id === id) {
      setSelectedMsg(p => ({ ...p, read_status: !p.read_status }))
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Delete this inquiry?')) {
      await deleteInquiry(id)
      setSelectedMsg(null)
      loadInquiries()
    }
  }

  return (
    <div>
      <div className="page-header">
        <h1>Customer Inquiries</h1>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: 40 }}><div className="spinner" /></div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.8fr', gap: 24, alignItems: 'start' }}>
          
          {/* List of Messages */}
          <div className="card" style={{ padding: 0, overflow: 'hidden', border: '1px solid var(--border)' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)' }}>Inbox</div>
            <div style={{ display: 'flex', flexDirection: 'column', maxHeight: '70vh', overflowY: 'auto' }}>
              {inquiries.length === 0 ? (
                <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>No messages found</div>
              ) : (
                inquiries.map(msg => (
                  <div
                    key={msg.id}
                    onClick={() => setSelectedMsg(msg)}
                    style={{
                      padding: '16px 20px', borderBottom: '1px solid rgba(0,0,0,0.03)',
                      cursor: 'pointer', background: selectedMsg?.id === msg.id ? 'rgba(212,175,55,0.04)' : 'none',
                      transition: 'background 0.2s', borderLeft: !msg.read_status ? '3px solid #d4af37' : '3px solid transparent'
                    }}
                    onMouseEnter={e => { if (selectedMsg?.id !== msg.id) e.currentTarget.style.background = 'rgba(0,0,0,0.01)'; }}
                    onMouseLeave={e => { if (selectedMsg?.id !== msg.id) e.currentTarget.style.background = 'none'; }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <span style={{ fontSize: '0.85rem', fontWeight: !msg.read_status ? 700 : 500, color: 'var(--text-primary)' }}>{msg.name}</span>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{new Date(msg.created_at).toLocaleDateString()}</span>
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: !msg.read_status ? 600 : 400 }}>{msg.subject || 'No Subject'}</div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Details / Message View Panel */}
          <div className="card" style={{ padding: 32, minHeight: '400px', display: 'flex', flexDirection: 'column', border: '1px solid var(--border)' }}>
            {selectedMsg ? (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: 16, marginBottom: 20 }}>
                    <div>
                      <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)' }}>{selectedMsg.subject || '(No Subject)'}</h2>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: 4 }}>
                        From: <strong>{selectedMsg.name}</strong> &lt;{selectedMsg.email}&gt;
                      </div>
                    </div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      Received: {new Date(selectedMsg.created_at).toLocaleString()}
                    </span>
                  </div>

                  <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>
                    {selectedMsg.message}
                  </p>
                </div>

                <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', borderTop: '1px solid var(--border)', paddingTop: 20, marginTop: 24 }}>
                  <button className="btn btn-ghost btn-sm" onClick={() => handleToggleRead(selectedMsg.id)}>
                    Mark as {selectedMsg.read_status ? 'Unread' : 'Read'}
                  </button>
                  <button className="btn btn-ghost btn-sm" style={{ color: 'var(--danger)', borderColor: 'rgba(239,68,68,0.2)' }} onClick={() => handleDelete(selectedMsg.id)}>
                    Delete Inquiry
                  </button>
                </div>
              </div>
            ) : (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                <span style={{ fontSize: '3rem', marginBottom: 12 }}>✉️</span>
                <p>Select a message from the inbox to read</p>
              </div>
            )}
          </div>

        </div>
      )}
    </div>
  )
}

Contacts.layout = (page) => <AdminLayout>{page}</AdminLayout>

