import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'

const MyOrdersPage = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const { userInfo, getAuthHeader } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!userInfo) {
      navigate('/login')
      return
    }

    const fetchMyOrders = async () => {
      try {
        // This fetches only the orders belonging to the logged-in user
        const { data } = await axios.get('/api/orders/myorders', {
          headers: getAuthHeader(),
        })
        setOrders(data)
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch orders')
      } finally {
        setLoading(false)
      }
    }

    fetchMyOrders()
  }, [userInfo, navigate])

  return (
    <div className="page-container" style={{ padding: '20px' }}>
      <h2 style={{ marginBottom: '20px' }}>Your Orders</h2>
      
      {loading ? (
        <div>Loading your orders...</div>
      ) : error ? (
        <div className="alert alert-danger" style={{ color: 'red' }}>{error}</div>
      ) : orders.length === 0 ? (
        <div style={{ padding: '40px', textAlign: 'center', background: 'white' }}>
          <h3>You haven't placed any orders yet.</h3>
          <Link to="/">
            <button className="btn-amazon" style={{ marginTop: '15px', width: 'auto', padding: '10px 20px' }}>
              Start Shopping
            </button>
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {orders.map((order) => (
            <div key={order._id} className="checkout-card" style={{ padding: '15px', border: '1px solid #ddd', borderRadius: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #ddd', paddingBottom: '10px', marginBottom: '10px' }}>
                <div>
                  <span style={{ fontSize: '12px', color: '#565959', display: 'block' }}>ORDER PLACED</span>
                  <span style={{ fontSize: '14px' }}>{order.createdAt ? order.createdAt.substring(0, 10) : 'Today'}</span>
                </div>
                <div>
                  <span style={{ fontSize: '12px', color: '#565959', display: 'block' }}>TOTAL</span>
                  <span style={{ fontSize: '14px' }}>${order.totalPrice.toFixed(2)}</span>
                </div>
                <div>
                  <span style={{ fontSize: '12px', color: '#565959', display: 'block' }}>ORDER #</span>
                  <span style={{ fontSize: '14px' }}>{order._id}</span>
                </div>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <span style={{ fontWeight: 'bold', color: order.isPaid ? '#067D62' : '#B12704', display: 'block', marginBottom: '5px' }}>
                    {order.isPaid ? '✓ Paid' : '⚠ Not Paid'}
                  </span>
                  <span style={{ fontSize: '14px' }}>
                    {order.orderItems.length} item(s)
                  </span>
                </div>
                <Link to={`/order/${order._id}`}>
                  <button className="btn-amazon" style={{ padding: '8px 15px', width: 'auto' }}>
                    View Order Details
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default MyOrdersPage