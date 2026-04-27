import React, { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'

const ProductDetailPage = () => {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const { addToCart } = useCart()
  const { userInfo, getAuthHeader } = useAuth()
  const navigate = useNavigate()

  const isSeller = userInfo?.role === 'seller'
  const isAdmin = userInfo?.role === 'admin'
  const isOwner = userInfo && product && (product.user === userInfo._id || isAdmin)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await axios.get(`/api/products/${id}`)
        setProduct(data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchProduct()
  }, [id])

  const handleAddToCart = () => {
    addToCart(product, qty)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  const handleDelete = async () => {
    if (!window.confirm('Delete this product?')) return
    setDeleting(true)
    try {
      await axios.delete(`/api/products/${id}`, { headers: getAuthHeader() })
      navigate('/')
    } catch (err) {
      alert(err.response?.data?.message || 'Delete failed')
      setDeleting(false)
    }
  }

  if (loading) return (
    <div className="page-container loading-wrap">
      <div className="spinner" /><p className="loading-text">Loading product...</p>
    </div>
  )
  if (!product) return (
    <div className="page-container"><div className="alert alert-error">Product not found.</div></div>
  )

  return (
    <div className="page-container">
      <div className="breadcrumb">
        <Link to="/">Home</Link> › {product.category} › <span style={{ color: '#333' }}>{product.name}</span>
      </div>

      <div className="product-detail-layout">
        {/* Image */}
        <div className="product-detail-img">
          <img src={product.image} alt={product.name}
            onError={e => { e.target.src = 'https://via.placeholder.com/400x400?text=No+Image' }} />
        </div>

        {/* Info */}
        <div className="product-detail-info">
          <div className="detail-brand">Visit the {product.brand} Store</div>
          <h1 className="detail-title">{product.name}</h1>
          <div style={{ color: '#FFA41C', marginBottom: 8 }}>★★★★☆ <span style={{ color: '#007185', fontSize: 13 }}>2,451 ratings</span></div>
          <hr className="detail-divider" />
          <div className="detail-price-big">
            <span style={{ fontSize: 16, verticalAlign: 'super' }}>$</span>
            {product.price.toFixed(2)}
          </div>
          <div style={{ color: '#007185', fontSize: 13, marginBottom: 8 }}>✓ FREE Returns | FREE Delivery over $100</div>
          <hr className="detail-divider" />
          <div className="detail-category">Category: <strong>{product.category}</strong></div>
          <p className="detail-desc">{product.description}</p>

          {/* Seller / Admin controls */}
          {(isSeller || isAdmin) && isOwner && (
            <div style={{ marginTop: 20, display: 'flex', gap: 10 }}>
              <button className="btn-secondary"
                onClick={() => navigate(`/edit-product/${product._id}`)}>
                ✏️ Edit Product
              </button>
              <button className="btn-danger" disabled={deleting}
                onClick={handleDelete}>
                {deleting ? 'Deleting...' : '🗑 Delete'}
              </button>
            </div>
          )}
          {isAdmin && !isOwner && (
            <div style={{ marginTop: 20, display: 'flex', gap: 10 }}>
              <button className="btn-secondary"
                onClick={() => navigate(`/edit-product/${product._id}`)}>
                ✏️ Admin Edit
              </button>
              <button className="btn-danger" disabled={deleting} onClick={handleDelete}>
                {deleting ? 'Deleting...' : '🗑 Admin Delete'}
              </button>
            </div>
          )}
        </div>

        {/* Buy Box */}
        <div className="product-detail-buy">
          <div className="buy-box-price">${product.price.toFixed(2)}</div>
          <div className="buy-box-shipping">✓ FREE Delivery</div>
          {product.countInStock > 0 ? (
            <>
              <div className="buy-box-stock instock">In Stock.</div>
              <div style={{ marginBottom: 12 }}>
                <label style={{ fontSize: 13, display: 'block', marginBottom: 4 }}>Qty:</label>
                <select className="qty-select" value={qty}
                  onChange={e => setQty(Number(e.target.value))}>
                  {[...Array(Math.min(product.countInStock, 10)).keys()].map(x => (
                    <option key={x + 1} value={x + 1}>{x + 1}</option>
                  ))}
                </select>
              </div>
              <button className="btn-amazon" style={{ marginBottom: 8 }} onClick={handleAddToCart}>
                {added ? '✓ Added to Cart!' : 'Add to Cart'}
              </button>
              <button className="btn-buy-now" onClick={() => { addToCart(product, qty); navigate('/cart') }}>
                Buy Now
              </button>
              {product.countInStock <= 5 && (
                <div style={{ marginTop: 10, color: '#B12704', fontSize: 13, fontWeight: 700 }}>
                  ⚠ Only {product.countInStock} left in stock!
                </div>
              )}
            </>
          ) : (
            <div className="buy-box-stock outstock">Out of Stock</div>
          )}
          <hr className="detail-divider" />
          <div style={{ fontSize: 12, color: '#565959' }}>
            <p>Ships from: <strong>Amazon Clone</strong></p>
            <p>Sold by: <strong>{product.brand}</strong></p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetailPage