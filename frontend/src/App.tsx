import { useEffect, useState } from 'react'
import './index.css'

interface Product {
  id: number;
  name: string;
  description: string;
  price: string;
  image: string;
}

const CATEGORIES = ['Premium', 'Featured', 'New', 'Hot', 'Sale', 'Limited'];
const getCategoryForProduct = (id: number) => CATEGORIES[id % CATEGORIES.length];

function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notification, setNotification] = useState<{message: string, type: 'success' | 'error'} | null>(null);
  const [orderedIds, setOrderedIds] = useState<Set<number>>(new Set());
  const [loadingOrderId, setLoadingOrderId] = useState<number | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/products');
        if (!response.ok) throw new Error('Failed to fetch products');
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

  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3500);
  };

  const handleOrder = async (product: Product) => {
    if (loadingOrderId !== null) return;
    setLoadingOrderId(product.id);
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
        setOrderedIds(prev => new Set([...prev, product.id]));
        showNotification(`✅ ${product.name} berhasil dipesan!`, 'success');
      } else {
        throw new Error(data.message || 'Failed to place order');
      }
    } catch (err) {
      showNotification(err instanceof Error ? err.message : 'Gagal memesan produk', 'error');
    } finally {
      setLoadingOrderId(null);
    }
  };

  const formatPrice = (price: string) => {
    const num = parseFloat(price);
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(num);
  };

  return (
    <>
      {/* NAVBAR */}
      <nav className="navbar">
        <div className="logo">
          <div className="logo-icon">⚡</div>
          <span className="logo-text">ShopNow</span>
        </div>
        <div className="nav-actions">
          <div className="nav-badge">
            <span className="nav-dot"></span>
            API Connected
          </div>
          <div className="nav-badge">
            🛒 {orderedIds.size} Pesanan
          </div>
        </div>
      </nav>

      {/* NOTIFICATION */}
      {notification && (
        <div className={`notification animate-scale-in ${notification.type}`}>
          <span className="notification-icon">
            {notification.type === 'success' ? '✅' : '❌'}
          </span>
          {notification.message}
        </div>
      )}

      <div className="container">
        {/* HERO */}
        <section className="hero-section animate-fade-in">
          <div className="hero-badge">
            <span>🛍️</span> Koleksi Terbaik 2026
          </div>
          <h1 className="dashboard-title">
            Temukan Produk<br />Pilihan Terbaik
          </h1>
          <p className="dashboard-subtitle">
            Koleksi produk premium terhubung langsung ke Laravel API buatan sendiri.
            Belanja sekarang, pengiriman cepat!
          </p>
          {!loading && !error && (
            <div className="hero-stats animate-fade-in">
              <div className="stat-item">
                <span className="stat-value">{products.length}</span>
                <span className="stat-label">Produk</span>
              </div>
              <div className="stat-divider"></div>
              <div className="stat-item">
                <span className="stat-value">{orderedIds.size}</span>
                <span className="stat-label">Dipesan</span>
              </div>
              <div className="stat-divider"></div>
              <div className="stat-item">
                <span className="stat-value">100%</span>
                <span className="stat-label">Original</span>
              </div>
            </div>
          )}
        </section>

        {/* PRODUCTS */}
        <main>
          {loading ? (
            <div className="loading-container">
              <div className="spinner-wrapper">
                <div className="spinner-ring"></div>
                <div className="spinner-ring"></div>
                <div className="spinner-ring"></div>
              </div>
              <p className="loading-text">Memuat produk dari API...</p>
            </div>
          ) : error ? (
            <div className="error-message animate-scale-in">
              <span className="error-icon">🔌</span>
              <h3>Koneksi Gagal</h3>
              <p>{error}</p>
              <p className="error-hint">
                http://127.0.0.1:8000/api/products
              </p>
              <p style={{ marginTop: '0.75rem', fontSize: '0.8rem', color: '#94a3b8' }}>
                Pastikan server Laravel sudah berjalan
              </p>
            </div>
          ) : (
            <>
              <div className="section-header">
                <div className="section-title">
                  🏪 Semua Produk
                  <span className="section-count">{products.length} item</span>
                </div>
              </div>
              <div className="product-grid">
                {products.map((product, index) => (
                  <div
                    key={product.id}
                    className="product-card animate-fade-in"
                    style={{ animationDelay: `${index * 0.08}s` }}
                  >
                    {/* Image */}
                    <div className="product-image-container">
                      <img
                        src={product.image || `https://picsum.photos/seed/${product.id}/400/300`}
                        alt={product.name}
                        className="product-image"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = `https://picsum.photos/seed/${product.id + 10}/400/300`;
                        }}
                      />
                      <div className="product-image-overlay"></div>
                      <span className="product-category-badge">
                        {getCategoryForProduct(product.id)}
                      </span>
                      <button className="product-fav-btn" title="Tambah ke favorit">❤️</button>
                    </div>

                    {/* Body */}
                    <div className="product-body">
                      <h3 className="product-name">{product.name}</h3>
                      <p className="product-desc">{product.description}</p>
                    </div>

                    {/* Footer */}
                    <div className="product-footer">
                      <div className="price-block">
                        <span className="price-label">Harga</span>
                        <span className="product-price">{formatPrice(product.price)}</span>
                      </div>
                      <button
                        className="buy-btn"
                        onClick={() => handleOrder(product)}
                        disabled={loadingOrderId === product.id}
                        style={{
                          opacity: loadingOrderId !== null && loadingOrderId !== product.id ? 0.7 : 1,
                          background: orderedIds.has(product.id)
                            ? 'linear-gradient(135deg, #059669, #047857)'
                            : undefined,
                        }}
                      >
                        {loadingOrderId === product.id ? (
                          <>⏳ Memesan...</>
                        ) : orderedIds.has(product.id) ? (
                          <>✅ Dipesan</>
                        ) : (
                          <>
                            <span className="buy-btn-icon">🛒</span>
                            Pesan Sekarang
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </main>

        {/* FOOTER */}
        <footer className="site-footer">
          <div className="footer-left">
            <span>⚡</span>
            © 2026 ShopNow · All rights reserved
          </div>
          <div className="footer-right">
            <div className="footer-tech">⚛️ React + Vite</div>
            <div className="footer-tech">🔷 Laravel API</div>
          </div>
        </footer>
      </div>
    </>
  );
}

export default App;
