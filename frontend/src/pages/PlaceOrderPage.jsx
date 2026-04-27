import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import CheckoutSteps from '../components/CheckoutSteps'

const PlaceOrderPage = () => {
  const { cartItems, shippingAddress, paymentMethod, itemsPrice, shippingPrice, taxPrice, totalPrice, clearCart } = useCart()
  const { userInfo, getAuthHeader } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  if (!userInfo) { navigate('/login'); return null }
  if (!shippingAddress.address) { navigate('/shipping'); return null }

  const placeOrderHandler = async () => {
    setLoading(true)
    setError('')
    try {
      const { data } = await axios.post('/api/orders', {
        orderItems: cartItems.map(item => ({
          name: item.name,
          qty: item.qty,
          image: item.image,
          price: item.price,
          product: item._id,
        })),
        shippingAddress,
        paymentMethod,
        taxPrice,
        shippingPrice,
        totalPrice,
      }, { headers: getAuthHeader() })

      clearCart()
      navigate(`/order/${data._id}`)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to place order. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page-container">
      <CheckoutSteps step={4} />
      {error && <div className="alert alert-error">{error}</div>}
      <div className="placeorder-layout">
        {/* Left Column */}
        <div>
          {/* Shipping */}
          <div className="order-section">
            <h3>Delivery address</h3>
            <p><strong>{userInfo.name}</strong></p>
            <p>{shippingAddress.address}</p>
            <p>{shippingAddress.city}, {shippingAddress.postalCode}</p>
            <p>{shippingAddress.country}</p>
            <Link to="/shipping" style={{ color: '#0066C0', fontSize: 13, marginTop: 8, display: 'inline-block' }}>Change</Link>
          </div>

          {/* Payment */}
          <div className="order-section">
            <h3>Payment method</h3>
            <p>🔒 {paymentMethod}</p>
            <p style={{ fontSize: 12, color: '#565959', marginTop: 4 }}>
              Mock payment — no real transaction will occur.
            </p>
          </div>

          {/* Items */}
          <div className="order-section">
            <h3>Order items ({cartItems.reduce((a, i) => a + i.qty, 0)})</h3>
            {cartItems.map(item => (
              <div key={item._id} className="order-item-row">
                <img src={item.image} alt={item.name}
                  onError={e => { e.target.src = 'https://via.placeholder.com/60?text=No+Img' }} />
                <div style={{ flex: 1 }}>
                  <Link to={`/product/${item._id}`} style={{ color: '#0066C0', fontSize: 14 }}>{item.name}</Link>
                  <div style={{ fontSize: 12, color: '#565959' }}>{item.brand}</div>
                </div>
                <div style={{ fontSize: 14 }}>{item.qty} × ${item.price.toFixed(2)}</div>
                <div style={{ fontWeight: 700 }}>${(item.qty * item.price).toFixed(2)}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Summary */}
        <div className="order-section" style={{ position: 'sticky', top: 80 }}>
          <h3>Order Summary</h3>
          <div className="order-price-row">
            <span>Items ({cartItems.reduce((a, i) => a + i.qty, 0)}):</span>
            <span>${itemsPrice.toFixed(2)}</span>
          </div>
          <div className="order-price-row">
            <span>Shipping & handling:</span>
            <span>{shippingPrice === 0 ? <span style={{ color: '#067D62' }}>FREE</span> : `$${shippingPrice}`}</span>
          </div>
          <div className="order-price-row">
            <span>Estimated tax:</span>
            <span>${taxPrice.toFixed(2)}</span>
          </div>
          <div className="order-price-row total">
            <span>Order Total:</span>
            <span style={{ color: '#B12704' }}>${totalPrice.toFixed(2)}</span>
          </div>
          <button className="btn-amazon" style={{ marginTop: 16 }}
            onClick={placeOrderHandler} disabled={loading}>
            {loading ? 'Placing order...' : 'Place your order'}
          </button>
          <p style={{ fontSize: 12, color: '#565959', marginTop: 12 }}>
            By placing your order, you agree to Amazon Clone's privacy notice and conditions of use.
          </p>
        </div>
      </div>
    </div>
  )
}

export default PlaceOrderPage