import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'

const OrderDetailPage = () => {
  const { id } = useParams()
  const { userInfo, getAuthHeader } = useAuth()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [payLoading, setPayLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const { data } = await axios.get(`/api/orders/${id}`, { headers: getAuthHeader() })
        setOrder(data)
      } catch (err) {
        setError(err.response?.data?.message || 'Could not load order.')
      } finally {
        setLoading(false)
      }
    }
    fetchOrder()
  }, [id])

  const handlePay = async () => {
    setPayLoading(true)
    try {
      const { data } = await axios.put(`/api/orders/${id}/pay`, {}, { headers: getAuthHeader() })
      setOrder(data)
    } catch (err) {
      alert(err.response?.data?.message || 'Payment failed.')
    } finally {
      setPayLoading(false)
    }
  }

  if (loading) return (
    <div className="page-container loading-wrap">
      <div className="spinner" /><p className="loading-text">Loading order...</p>
    </div>
  )
  if (error) return <div className="page-container"><div className="alert alert-error">{error}</div></div>
  if (!order) return null

  const fmt = (d) => new Date(d).toLocaleDateString('en-US', { year:'numeric', month:'long', day:'numeric', hour:'2-digit', minute:'2-digit' })

  return (
    <div className="page-container">
      {/* Order Header */}
      <div className="order-detail-header">
        <div className="order-id">
          Order <span>#{order._id}</span>
        </div>
        <div style={{ display: 'flex', gap: 8, marginTop: 8, flexWrap: 'wrap' }}>
          <span className={`order-status-badge ${order.isPaid ? 'badge-paid' : 'badge-unpaid'}`}>
            {order.isPaid ? `✓ Paid — ${fmt(order.paidAt)}` : '⏳ Payment Pending'}
          </span>
          <span className={`order-status-badge ${order.isDelivered ? 'badge-delivered' : 'badge-pending'}`}>
            {order.isDelivered ? `✓ Delivered — ${fmt(order.deliveredAt)}` : '📦 Not Yet Delivered'}
          </span>
        </div>
      </div>

      <div className="order-detail-layout">
        {/* Left */}
        <div>
          {/* Shipping */}
          <div className="order-box">
            <h3>📍 Shipping Address</h3>
            <p><strong>{order.user?.name}</strong></p>
            <p>{order.shippingAddress?.address}</p>
            <p>{order.shippingAddress?.city}, {order.shippingAddress?.postalCode}</p>
            <p>{order.shippingAddress?.country}</p>
          </div>

          {/* Payment */}
          <div className="order-box">
            <h3>💳 Payment Method</h3>
            <p><strong>{order.paymentMethod}</strong></p>
            {order.isPaid && order.paymentResult && (
              <div style={{ marginTop: 8, fontSize: 13, color: '#067D62' }}>
                <p>Transaction ID: {order.paymentResult.id}</p>
                <p>Status: {order.paymentResult.status}</p>
              </div>
            )}
          </div>

          {/* Items */}
          <div className="order-box">
            <h3>📦 Order Items</h3>
            {order.orderItems.map((item, i) => (
              <div key={i} className="order-item-row">
                <img src={item.image} alt={item.name}
                  onError={e => { e.target.src = 'https://via.placeholder.com/60?text=No+Img' }}
                  style={{ width: 60, height: 60, objectFit: 'contain' }} />
                <div style={{ flex: 1 }}>
                  <Link to={`/product/${item.product}`} style={{ color: '#0066C0', fontSize: 14 }}>{item.name}</Link>
                </div>
                <div style={{ fontSize: 14, color: '#565959' }}>{item.qty} × ${item.price.toFixed(2)}</div>
                <div style={{ fontWeight: 700 }}>${(item.qty * item.price).toFixed(2)}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Summary */}
        <div>
          <div className="order-box">
            <h3>Order Summary</h3>
            <div className="order-price-row"><span>Items:</span><span>${(order.totalPrice - order.taxPrice - order.shippingPrice).toFixed(2)}</span></div>
            <div className="order-price-row">
              <span>Shipping:</span>
              <span>{order.shippingPrice === 0 ? <span style={{ color: '#067D62' }}>FREE</span> : `$${order.shippingPrice}`}</span>
            </div>
            <div className="order-price-row"><span>Tax:</span><span>${order.taxPrice.toFixed(2)}</span></div>
            <div className="order-price-row total">
              <span>Order Total:</span>
              <span style={{ color: '#B12704' }}>${order.totalPrice.toFixed(2)}</span>
            </div>

            {!order.isPaid && (
              <div style={{ marginTop: 16 }}>
                <div className="alert alert-info" style={{ fontSize: 13 }}>
                  🔒 Mock payment gateway — no real transaction
                </div>
                <button className="pay-btn" onClick={handlePay} disabled={payLoading}>
                  {payLoading ? 'Processing payment...' : `Pay $${order.totalPrice.toFixed(2)}`}
                </button>
              </div>
            )}

            {order.isPaid && !order.isDelivered && (
              <div className="alert alert-info" style={{ marginTop: 12, fontSize: 13 }}>
                📦 Your order is packed and will be delivered soon!
              </div>
            )}
          </div>
          <Link to="/my-orders">
            <button className="btn-secondary" style={{ width: '100%', padding: '10px' }}>← Back to My Orders</button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default OrderDetailPage