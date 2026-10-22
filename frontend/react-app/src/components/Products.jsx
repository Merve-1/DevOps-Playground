import { useEffect, useState } from 'react';
import { api } from '../api';
import { useCart } from '../CartContext';
import { useFlashMessage } from '../hooks/useFlashMessage';
import './Products.css';

export default function Products({ user, onSignInClick }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [message, flash] = useFlashMessage();
  const { refreshCartCount } = useCart();

  useEffect(() => {
    let cancelled = false;
    api.getProducts()
      .then((data) => { if (!cancelled) setProducts(Array.isArray(data) ? data : []); })
      .catch(() => { if (!cancelled) setLoadError(true); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  const handleAddToCart = async (product) => {
    if (!user) return onSignInClick();
    try {
      await api.addToCart(product.product_id, 1, product.price);
      flash(`Added ${product.name} to cart!`);
      refreshCartCount();
    } catch {
      flash('Error adding to cart');
    }
  };

  if (loading) return <div className="loading">Loading products...</div>;
  if (loadError) return <div className="message">Error loading products</div>;

  return (
    <div className="products">
      {message && <div className="message">{message}</div>}
      <div className="product-grid">
        {products.map((p) => (
          <div key={p.product_id} className="product-card">
            <img src={p.image_url} alt={p.name} />
            <h3>{p.name}</h3>
            <p>{p.description}</p>
            <div className="product-footer">
              <span className="price">${p.price}</span>
              <span className="stock">Stock: {p.stock}</span>
            </div>
            <button onClick={() => handleAddToCart(p)}>Add to Cart</button>
          </div>
        ))}
      </div>
    </div>
  );
}