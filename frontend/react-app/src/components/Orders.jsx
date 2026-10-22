import { useEffect, useState } from 'react';
import { api } from '../api';
import './Orders.css';

export default function Orders({ user, onSignInClick }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const userId = user?.userId;

  useEffect(() => {
    if (!userId) { setLoading(false); return; }
    let cancelled = false;
    api.getOrders()
      .then((data) => { if (!cancelled) setOrders(Array.isArray(data) ? data : []); })
      .catch(() => { if (!cancelled) setError(true); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [userId]);

  if (loading) return <div className="loading">Loading orders...</div>;
  if (!user) {
    return (
      <div className="no-orders">
        Please <button className="link-btn" onClick={onSignInClick}>sign in</button> to view your orders.
      </div>
    );
  }
  if (error) return <div className="no-orders">Error loading orders</div>;

  return (
    <div className="orders">
      <h1>My Orders</h1>
      {!orders.length ? (
        <div className="no-orders">No orders yet</div>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <div key={order.id} className="order-card">
              <div className="order-header">
                <h3>Order #{order.id}</h3>
                <span className="status">{order.status}</span>
              </div>
              <p className="order-date">{new Date(order.created_at).toLocaleDateString()}</p>
              <div className="order-items">
                {(order.items ?? []).map((item, idx) => (
                  <div key={idx} className="order-item">
                    <span>{item.product_id}</span>
                    <span>Qty: {item.quantity}</span>
                    <span>${item.price}</span>
                  </div>
                ))}
              </div>
              <div className="order-total">
                <strong>Total: ${Number(order.total_amount).toFixed(2)}</strong>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}