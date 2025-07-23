import React, { useEffect, useState } from 'react';
// Use idb-keyval for IndexedDB (install with npm if needed)
import { get, set, del, update, keys } from 'idb-keyval';

// TODO: Sync orders with backend in the future

const ORDERS_KEY = 'orders';

const fetchOrders = async () => {
  const orders = await get(ORDERS_KEY);
  return orders || [];
};

const Orders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders().then(setOrders);
  }, []);

  const statusDescriptions = {
    'Order Confirmed': 'Your order has been received and is being prepared for dispatch.',
    'In Transit to Sorting Hub': 'Your package is on its way to the nearest regional sorting facility.',
    'Sorted & En Route to Destination': 'Your package has been sorted and is now heading toward your local delivery center.',
    'Out for Delivery': 'A delivery agent has your package and is on the way to your address.',
    'Delivered & Verified': 'Your package has been delivered and the delivery was confirmed successfully.'
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: `
        radial-gradient(circle at 15% 85%, rgba(0, 140, 140, 0.6) 0%, transparent 40%),
        radial-gradient(circle at 85% 15%, rgba(25, 59, 112, 0.7) 0%, transparent 45%),
        radial-gradient(circle at 45% 60%, rgba(0, 140, 140, 0.4) 0%, transparent 35%),
        radial-gradient(circle at 70% 80%, rgba(25, 59, 112, 0.5) 0%, transparent 30%),
        linear-gradient(135deg, rgba(0, 140, 140, 0.2) 0%, rgba(25, 59, 112, 0.3) 50%, rgba(26, 35, 50, 1) 100%)
      `,
      padding: '2rem',
      fontFamily: 'Inter, sans-serif',
      paddingTop: '7rem'
    }}>
      <h1 style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '2rem', textAlign: 'center', color: '#eeeeee' }}>Your Orders</h1>
      {orders.length === 0 ? (
        <div style={{ textAlign: 'center', color: '#555', fontSize: 20 }}>No orders yet.</div>
      ) : (
        orders.map((order, idx) => (
          <div key={order.id || idx} style={{ background: 'var(--color-mid, #1e293b)', borderRadius: 16, boxShadow: '0 2px 12px #0001', marginBottom: 32, padding: 24, maxWidth: 900, margin: '0 auto 2rem auto', border: '1px solid #e5e7eb' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid #e5e7eb', paddingBottom: 16, marginBottom: 16 }}>
              <div style={{ display: 'flex', gap: 48 }}>
                <div>
                  <div style={{ color: '#bbb', fontSize: 13, fontWeight: 500 }}>ORDER PLACED</div>
                  <div style={{ fontWeight: 600, fontSize: 16, color: '#fff' }}>{order.placedDate}</div>
                </div>
                <div>
                  <div style={{ color: '#bbb', fontSize: 13, fontWeight: 500 }}>TOTAL</div>
                  <div style={{ fontWeight: 600, fontSize: 16, color: '#fff' }}>${order.total?.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</div>
                </div>
                <div>
                  <div style={{ color: '#bbb', fontSize: 13, fontWeight: 500 }}>SHIP TO</div>
                  <div style={{ fontWeight: 600, fontSize: 16, color: '#60a5fa', cursor: 'pointer' }}>{order.shippingName}</div>
                </div>
                <div>
                  <div style={{ color: '#bbb', fontSize: 13, fontWeight: 500 }}>ORDER #</div>
                  <div style={{ fontWeight: 600, fontSize: 16, color: '#e066a7' }}>{order.orderNumber}</div>
                </div>
                <button style={{ background: 'rgba(255, 225, 50, 0.8)', color: '#222', fontWeight: 700, border: 'none', borderRadius: 24, padding: '0.6rem 1.5rem', fontSize: 16, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, marginLeft: 'auto' }}>
                  <span role="img" aria-label="repeat">🔄</span> Buy it again
                </button>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 20, color: '#fff', marginBottom: 4 }}>{order.status}</div>
                <div style={{ color: '#b0b8c1', marginBottom: 8 }}>{statusDescriptions[order.status] || ''}</div>
                <a href="#" style={{ color: '#60a5fa', fontWeight: 500, fontSize: 18, textDecoration: 'underline', marginBottom: 4, display: 'inline-block' }}>{order.items?.map(item => item.name).join(', ')}</a>
                <div style={{ color: '#ff6f91', fontWeight: 500, marginBottom: 8 }}>Price: ${order.items?.reduce((t, i) => t + (i.price || 0), 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</div>
                <div style={{ color: '#bbb', fontSize: 14, marginBottom: 8 }}>Return window closed on {order.returnClosedDate}</div>
                <div style={{ display: 'flex', gap: 12, marginBottom: 8 }}>
                </div>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Orders; 