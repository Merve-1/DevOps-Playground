import { useCallback, useEffect, useState } from 'react';
import { api } from '../api';
import { useCart } from '../CartContext';
import { useFlashMessage } from '../hooks/useFlashMessage';
import './Cart.css';

export default function Cart({ user, onSignInClick }) {
  const [cart, setCart] = useState(null);
  const [names, setNames] = useState({});
  const [loading, setLoading] = useState(true);
  const [placing, setPlacing] = useState(false);
  const [message, flash] = useFlashMessage();
  const { refreshCartCount } = useCart();
  const userId = user?.userId;

  const loadCart = useCallback(async () => {
    try {
      const [cartData, products] = await Promise.all([api.getCart(), api.getProducts()]);
      setCart(cartData);
      setNames(Object.fromEntries(products.map((p) => [p.product_id, p.name])));
    } catch {
      flash('Error loading cart');
    } finally {
      setLoading(false);
    }
  }, [flash]);

  useEffect(() => {
    if (userId) loadCart();
    else setLoading(false);
  }, [userId, loadCart]);

  const handleRemove = async (productId) => {
    try {
      await api.removeFromCart(productId);
      flash('Item removed');
      await loadCart();
      refreshCartCount();
    } catch {
      flash('Error removing item');
    }
  };

  const handleCheckout = async () => {
    if (!cart?.items?.length) return flash('Cart is empty');
    setPlacing(true);
    try {
      await api.createOrder();
      flash('Order placed successfully!');
      await loadCart();
      refreshCartCount();
    } catch {
      flash('Error placing order');
    } finally {
      setPlacing(false);
    }
  };

  const total = (cart?.items ?? []).reduce((sum, i) => sum + i.price * i.quantity, 0);

  if (loading) return <div className="loading">Loading cart...</div>;
  if (!user) {
    return (
      <div className="empty-cart">
        Please <button className="link-btn" onClick={onSignInClick}>sign in</button> to view your cart.
      </div>
    );
  }

  return (
    <div className="cart">
      <h1>Shopping Cart</h1>
      {message && <div className="message">{message}</div>}

      {!cart?.items?.length ? (
        <div className="empty-cart">Your cart is empty</div>
      ) : (
        <>
          <div className="cart-items">
            {cart.items.map((item) => (
              <div key={item.product_id} className="cart-item">
                <div className="item-info">
                  <h3>{names[item.product_id] ?? `Product: ${item.product_id}`}</h3>
                  <p>Quantity: {item.quantity}</p>
                  <p className="price">${item.price} each</p>
                </div>
                <div className="item-actions">
                  <p className="subtotal">${(item.price * item.quantity).toFixed(2)}</p>
                  <button onClick={() => handleRemove(item.product_id)}>Remove</button>
                </div>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <h2>Total: ${total.toFixed(2)}</h2>
            <button className="checkout-btn" onClick={handleCheckout} disabled={placing}>
              {placing ? 'Placing order...' : 'Place Order'}
            </button>
          </div>
        </>
      )}
    </div>
  );
}