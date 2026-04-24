import { useEffect, useState } from 'react'
import './index.css'

interface Product {
  id: number;
  name: string;
  description: string;
  price: string;
  image: string;
}

function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notification, setNotification] = useState<{message: string, type: 'success' | 'error'} | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/products');
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        const data = await response.json();
        setProducts(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleOrder = async (product: Product) => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          product_id: product.id,
          quantity: 1,
          total_price: product.price
        })
      });

      const data = await response.json();

      if (response.ok) {
        setNotification({ message: `Success! ${product.name} has been ordered.`, type: 'success' });
      } else {
        throw new Error(data.message || 'Failed to place order');
      }
    } catch (err) {
      setNotification({ message: err instanceof Error ? err.message : 'Error placing order', type: 'error' });
    } finally {
      // Auto-hide notification after 3 seconds
      setTimeout(() => setNotification(null), 3000);
    }
  };

  return (
    <div className="container">
      <header className="animate-fade-in">
        <div className="logo">AURA LUXE</div>
        <nav>
          <button className="buy-btn" style={{ background: 'transparent', border: '1px solid var(--glass-border)' }}>
            Collections
          </button>
        </nav>
      </header>

      {notification && (
        <div className={`notification ${notification.type} animate-fade-in`}>
          {notification.message}
        </div>
      )}

      <main>
        <section className="hero-section animate-fade-in">
          <h1 className="dashboard-title">Elite Tech Collection</h1>
          <p className="dashboard-subtitle">
            Curated selection of future-ready hardware and lifestyle accessories.
            <br />
            Connected directly to our custom Laravel API.
          </p>
        </section>

        {loading ? (
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Syncing with neural network...</p>
          </div>
        ) : error ? (
          <div className="error-message">
            <h3>Connection Error</h3>
            <p>{error}</p>
            <p style={{ marginTop: '1rem', fontSize: '0.85rem' }}>
              Make sure your Laravel server is running at http://127.0.0.1:8000
            </p>
          </div>
        ) : (
          <div className="product-grid">
            {products.map((product, index) => (
              <div 
                key={product.id} 
                className="product-card animate-fade-in" 
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="product-image-container">
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="product-image" 
                  />
                </div>
                <div className="product-info">
                  <h3>{product.name}</h3>
                  <p>{product.description}</p>
                </div>
                <div className="product-footer">
                  <div className="product-price">
                    ${parseFloat(product.price).toLocaleString()}
                  </div>
                  <button 
                    className="buy-btn"
                    onClick={() => handleOrder(product)}
                  >
                    Order Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <footer style={{ marginTop: '5rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem', paddingBottom: '2rem' }}>
        <p>&copy; 2026 Aura Luxe. Built with React + Laravel.</p>
      </footer>
    </div>
  )
}

export default App
