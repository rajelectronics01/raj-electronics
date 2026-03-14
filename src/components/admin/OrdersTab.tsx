"use client";

import React, { useState, useEffect } from "react";
import "../../app/checkout/checkout.css"; // Reuse the extracted css styles

export default function OrdersTab() {
  const [orders, setOrders] = useState<any[]>([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  // Status Modal
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  const fetchOrders = async () => {
    setLoading(true);
    const res = await fetch("/api/admin/orders");
    const data = await res.json();
    if (data.success) {
      setOrders(data.orders);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (id: string, status: string) => {
    await fetch("/api/admin/orders", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId: id, status }),
    });
    setSelectedOrder(null);
    fetchOrders();
  };

  const filteredOrders = filter === "all" ? orders : orders.filter(o => o.status.toLowerCase() === filter);

  // Statistics
  const today = new Date().toISOString().split("T")[0];
  const todayOrders = orders.filter(o => o.time?.startsWith(today) || (new Date(o.time)).toISOString().split("T")[0] === today);
  const todaysRevenue = todayOrders.reduce((acc, curr) => acc + curr.amount, 0);
  const pendingOrders = orders.filter(o => o.status === "PENDING").length;
  
  const formatter = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 });

  return (
    <div className="wz-flow" style={{ background: "#f5f5f5", minHeight: "80vh", padding: "0 24px" }}>
      <div className="dlayout" style={{ maxWidth: "1200px", margin: "0 auto", padding: "28px 0" }}>
        <div className="dhead" style={{ marginBottom: "22px" }}>
          <div>
            <h1 style={{ fontSize: "20px", fontWeight: 700 }}>Orders Overview</h1>
          </div>
          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            <span className="badge b-green">● Live</span>
            <button className="btn btn-primary btn-sm" onClick={fetchOrders}>
              🔄 Refresh
            </button>
          </div>
        </div>

        <div className="sgrid">
          <div className="scard">
            <div className="slbl">Orders Today</div>
            <div className="sval">{todayOrders.length}</div>
          </div>
          <div className="scard">
            <div className="slbl">Revenue Today</div>
            <div className="sval">{formatter.format(todaysRevenue)}</div>
          </div>
          <div className="scard">
            <div className="slbl">Pending Delivery</div>
            <div className="sval">{pendingOrders}</div>
          </div>
          <div className="scard">
            <div className="slbl">Total Orders</div>
            <div className="sval">{orders.length}</div>
          </div>
        </div>

        <div className="dgrid">
          <div className="owrap">
            <div className="ohead">
              <h2>Recent Orders</h2>
              <div className="pills">
                <div className={`pill ${filter === "all" ? "active" : ""}`} onClick={() => setFilter("all")}>All</div>
                <div className={`pill ${filter === "pending" ? "active" : ""}`} onClick={() => setFilter("pending")}>Pending</div>
                <div className={`pill ${filter === "confirmed" ? "active" : ""}`} onClick={() => setFilter("confirmed")}>Confirmed</div>
                <div className={`pill ${filter === "delivered" ? "active" : ""}`} onClick={() => setFilter("delivered")}>Delivered</div>
              </div>
            </div>
            <div style={{ overflowX: "auto" }}>
              <table className="otbl">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Product</th>
                    <th>Amount</th>
                    <th>Payment</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map(o => (
                    <tr key={o.id}>
                      <td>
                        <span style={{ fontWeight: 700, color: "var(--blue)" }}>#{o.id.slice(0, 8)}</span>
                        <div style={{ fontSize: "11px", color: "var(--g400)" }}>{new Date(o.time).toLocaleString('en-IN')}</div>
                      </td>
                      <td>
                        <div className="ocust">{o.customer}</div>
                        <div className="oph">+91 {o.phone}</div>
                      </td>
                      <td style={{ fontSize: "13px", color: "var(--g700)" }}>{o.product}</td>
                      <td style={{ fontWeight: 700 }}>{formatter.format(o.amount)}</td>
                      <td>
                        <span className="badge b-gray">{o.payment}</span>
                      </td>
                      <td>
                        <span className={`badge ${o.status === 'DELIVERED' ? 'b-green' : 'b-orange'}`}>{o.status}</span>
                      </td>
                      <td>
                        <div className="abtns">
                          <button className="abtn vw" onClick={() => setSelectedOrder(o)}>View</button>
                          <button className="abtn wa" onClick={() => window.open(`https://wa.me/91${o.phone}?text=Hello! Your order #${o.id} is confirmed.`, '_blank')}>WhatsApp</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {loading && <tr><td colSpan={7} style={{textAlign: "center"}}>Loading...</td></tr>}
                </tbody>
              </table>
            </div>
          </div>

          <div className="npanel">
            <h2>📬 Notifications</h2>
            <div className="nlist">
              {orders.slice(0, 5).map(o => (
                <div className="nitem" key={"notif" + o.id}>
                  <div className="nrow">
                    <div className="ndot"></div>
                    <div>
                      <div className="ntitle">New Order #{o.id.slice(0,8)}</div>
                      <div className="nsub">{o.product} — {formatter.format(o.amount)}</div>
                      <div className="ntime">{new Date(o.time).toLocaleTimeString('en-IN')}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {selectedOrder && (
        <div className="movr open" onClick={(e) => { if(e.target === e.currentTarget) setSelectedOrder(null); }}>
          <div className="mbox">
            <button className="mclose" onClick={() => setSelectedOrder(null)}>✕</button>
            <div style={{ marginBottom: "14px" }}>
              <div style={{ fontSize: "17px", fontWeight: 700, color: "var(--g900)" }}>Order #{selectedOrder.id}</div>
            </div>
            <div className="divider"></div>
            <div style={{ display: "grid", gap: "9px", fontSize: "13.5px", lineHeight: 1.7 }}>
              <div><span style={{ color: "var(--g400)" }}>Customer:</span> <strong>{selectedOrder.customer}</strong></div>
              <div><span style={{ color: "var(--g400)" }}>Phone:</span> +91 {selectedOrder.phone}</div>
              <div><span style={{ color: "var(--g400)" }}>Product:</span> {selectedOrder.product}</div>
              <div><span style={{ color: "var(--g400)" }}>Amount:</span> <strong style={{ color: "var(--blue)" }}>{formatter.format(selectedOrder.amount)}</strong></div>
              <div><span style={{ color: "var(--g400)" }}>Payment:</span> {selectedOrder.payment}</div>
              <div><span style={{ color: "var(--g400)" }}>Address:</span> {selectedOrder.addr}</div>
              <div><span style={{ color: "var(--g400)" }}>Status:</span> <span className="badge b-blue">{selectedOrder.status}</span></div>
            </div>
            <div className="divider"></div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
              <button className="btn btn-outline btn-sm" style={{ width: "100%" }} onClick={() => updateStatus(selectedOrder.id, "CONFIRMED")}>✓ Mark Confirmed</button>
              <button className="btn btn-green btn-sm" style={{ width: "100%" }} onClick={() => updateStatus(selectedOrder.id, "DELIVERED")}>✓ Mark Delivered</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
