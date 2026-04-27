import React, { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import axios from 'axios'
import { useCart } from '../context/CartContext'

const CATEGORIES = ['All', 'Electronics', 'Clothing', 'Books', 'Furniture', 'Toys', 'Sports']

const StarRating = () => {
  const stars = Math.floor(Math.random() * 2) + 3
  return <span>{'★'.repeat(stars)}{'☆'.repeat(5 - stars)} <span style={{color:'#565959',fontSize:11}}>{Math.floor(Math.random()*3000+100)}</span></span>
}

const HomePage = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState('All')
  const [added, setAdded] = useState({})
  const { addToCart } = useCart()
  const location = useLocation()

  const searchQuery = new URLSearchParams(location.search).get('search') || ''

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true)
      try {
        // --- NEW WIRING ---
        // If there is a search query, attach ?keyword= to the URL!
        const endpoint = searchQuery ? `/api/products?keyword=${searchQuery}` : '/api/products';
        const { data } = await axios.get(endpoint)
        // ------------------
        setProducts(data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [searchQuery]) // <-- VERY IMPORTANT: Add searchQuery to this array so it refetches when the URL changes!

  const filtered = products.filter(p => {
    const matchCat = activeCategory === 'All' || p.category?.toLowerCase() === activeCategory.toLowerCase()
    const matchSearch = searchQuery
      ? p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.brand?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category?.toLowerCase().includes(searchQuery.toLowerCase())
      : true
    return matchCat && matchSearch
  })

  const handleAddToCart = (product) => {
    addToCart(product)
    setAdded(prev => ({ ...prev, [product._id]: true }))
    setTimeout(() => setAdded(prev => ({ ...prev, [product._id]: false })), 1500)
  }

  return (
    <>
      {/* Hero Banner */}
      {!searchQuery && (
        <div className="hero-banner">
          <h1>Welcome to <span>amazon</span>clone</h1>
          <p>Millions of products, delivered to your door.</p>
        </div>
      )}

      <div className="page-container">
        {/* Search feedback */}
        {searchQuery && (
          <div style={{ marginBottom: 12 }}>
            <p style={{ fontSize: 22 }}>
              {filtered.length} results for <strong>"{searchQuery}"</strong>
            </p>
          </div>
        )}

        {/* Category bar */}
        <div className="category-bar">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              className={`cat-btn ${activeCategory === cat ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Products header */}
        <div className="products-header">
          <h2>{searchQuery ? 'Search Results' : activeCategory === 'All' ? 'Featured Products' : activeCategory}</h2>
          <span className="products-count">{filtered.length} items</span>
        </div>

        {/* Loading */}
        {loading ? (
          <div className="loading-wrap">
            <div className="spinner" />
            <p className="loading-text">Loading products...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', background: 'white', borderRadius: 4 }}>
            <div style={{ fontSize: 48 }}>🔍</div>
            <h3 style={{ marginTop: 12 }}>No products found</h3>
            <p style={{ color: '#565959', marginTop: 8 }}>Try a different category or search term</p>
          </div>
        ) : (
          <div className="product-grid">
            {filtered.map((product) => (
              <div key={product._id} className="product-card">
                {product.countInStock <= 5 && product.countInStock > 0 && (
                  <span className="product-card-badge">Only {product.countInStock} left!</span>
                )}
                {product.countInStock === 0 && (
                  <span className="product-card-badge" style={{ background: '#565959' }}>Out of Stock</span>
                )}

                <Link to={`/product/${product._id}`}>
                  <div className="product-card-img-wrap">
                    <img src={product.image} alt={product.name}
                      onError={e => { e.target.src = 'https://via.placeholder.com/200x200?text=No+Image' }} />
                  </div>
                  <div className="product-card-name">{product.name}</div>
                </Link>

                <div className="product-card-stars"><StarRating /></div>

                <div className="product-card-price">
                  <span className="price-symbol">$</span>
                  <span className="price-whole">{Math.floor(product.price)}</span>
                  <span className="price-fraction">{(product.price % 1).toFixed(2).slice(1)}</span>
                </div>

                <div className="product-card-prime">
                  <span className="prime-badge">prime</span> FREE Delivery
                </div>

                <div className={`product-card-stock ${product.countInStock <= 5 ? 'low' : ''}`}>
                  {product.countInStock === 0 ? 'Out of Stock' : 'In Stock'}
                </div>

                <button
                  className="btn-add-cart"
                  disabled={product.countInStock === 0}
                  onClick={() => handleAddToCart(product)}
                  style={added[product._id] ? { background: '#a8d5b5', borderColor: '#a8d5b5' } : {}}
                >
                  {added[product._id] ? '✓ Added to Cart' : 'Add to Cart'}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  )
}

export default HomePage