"use client";

import { useEffect, useState } from 'react';

export default function BulkInquiriesTab() {
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchInquiries = async () => {
    try {
      const res = await fetch('/api/admin/bulk-inquiry');
      const data = await res.json();
      if (data.success) setInquiries(data.inquiries);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, []);

  const updateStatus = async (id: string, status: string) => {
    try {
      const res = await fetch('/api/admin/bulk-inquiry', {
        method: 'PATCH',
        body: JSON.stringify({ id, status }),
      });
      if (res.ok) fetchInquiries();
    } catch (err) { console.error(err); }
  };

  if (loading) return <div>Loading inquiries...</div>;

  return (
    <div>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '20px', color: '#1e3a8a' }}>
        🏢 B2B & Institutional Inquiries
      </h2>
      
      {inquiries.length === 0 ? (
        <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>No bulk inquiries yet.</div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '800px' }}>
            <thead>
              <tr style={{ textAlign: 'left', borderBottom: '2px solid #e2e8f0', color: '#475569' }}>
                <th style={{ padding: '12px' }}>Date</th>
                <th style={{ padding: '12px' }}>Organization</th>
                <th style={{ padding: '12px' }}>Contact</th>
                <th style={{ padding: '12px' }}>Requirement</th>
                <th style={{ padding: '12px' }}>Status</th>
                <th style={{ padding: '12px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {inquiries.map((inq) => (
                <tr key={inq.id} style={{ borderBottom: '1px solid #f1f5f9', fontSize: '0.9rem' }}>
                  <td style={{ padding: '12px' }}>{new Date(inq.createdAt).toLocaleDateString()}</td>
                  <td style={{ padding: '12px' }}>
                    <div style={{ fontWeight: 700 }}>{inq.organizationType}</div>
                    <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Verified Organization</div>
                  </td>
                  <td style={{ padding: '12px' }}>
                    <div style={{ fontWeight: 600 }}>{inq.name}</div>
                    <div style={{ color: '#2563eb', fontWeight: 700 }}>{inq.phone}</div>
                  </td>
                  <td style={{ padding: '12px', maxWidth: '300px' }}>
                    <div style={{ whiteSpace: 'pre-wrap' }}>{inq.description}</div>
                  </td>
                  <td style={{ padding: '12px' }}>
                    <span style={{ 
                      padding: '4px 10px', borderRadius: '99px', fontSize: '0.75rem', fontWeight: 700,
                      background: inq.status === 'NEW' ? '#fee2e2' : inq.status === 'CONTACTED' ? '#fef3c7' : '#dcfce7',
                      color: inq.status === 'NEW' ? '#991b1b' : inq.status === 'CONTACTED' ? '#92400e' : '#166534'
                    }}>
                      {inq.status}
                    </span>
                  </td>
                  <td style={{ padding: '12px' }}>
                    <select 
                      value={inq.status} 
                      onChange={(e) => updateStatus(inq.id, e.target.value)}
                      style={{ padding: '6px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.8rem' }}
                    >
                      <option value="NEW">Set NEW</option>
                      <option value="CONTACTED">Mark CONTACTED</option>
                      <option value="CLOSED">Mark CLOSED</option>
                      <option value="ARCHIVED">ARCHIVE</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
