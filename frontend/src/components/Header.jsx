import React, { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'

const Header = () => {
  const { userInfo, logout, getAuthHeader } = useAuth()
  const { totalItems } = useCart()
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [notifications, setNotifications] = useState([])
  const [showNotif, setShowNotif] = useState([])
  const [notifOpen, setNotifOpen] = useState(false)
  const notifRef = useRef(null)

  const isSeller = userInfo?.role === 'seller'
  const isAdmin = userInfo?.role === 'admin'

  // Fetch notifications for seller/admin
  useEffect(() => {
    if (!userInfo || (!isSeller && !isAdmin)) return
    const fetchNotifs = async () => {
      try {
        const { data } = await axios.get('/api/notifications', { headers: getAuthHeader() })
        setNotifications(data)
      } catch (err) { /* silent */ }
    }
    fetchNotifs()
    const interval = setInterval(fetchNotifs, 30000) // poll every 30s
    return () => clearInterval(interval)
  }, [userInfo])

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const unreadCount = notifications.filter(n => !n.isRead).length

  const markAllRead = async () => {
    try {
      await axios.put('/api/notifications/read-all', {}, { headers: getAuthHeader() })
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })))
    } catch (err) { /* silent */ }
  }

  const markOneRead = async (id) => {
    try {
      await axios.put(`/api/notifications/${id}/read`, {}, { headers: getAuthHeader() })
      setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n))
    } catch (err) { /* silent */ }
  }

  const handleLogout = () => { logout(); navigate('/login') }

  const handleSearch = (e) => {
    e.preventDefault()
    if (search.trim()) navigate(`/?search=${encodeURIComponent(search.trim())}`)
  }

  const timeAgo = (dateStr) => {
    const diff = Math.floor((Date.now() - new Date(dateStr)) / 1000)
    if (diff < 60) return 'just now'
    if (diff < 3600) return `${Math.floor(diff/60)}m ago`
    if (diff < 86400) return `${Math.floor(diff/3600)}h ago`
    return `${Math.floor(diff/86400)}d ago`
  }

  return (
    <header className="amazon-header">
      {/* Top Row */}
      <div className="header-top">
        {/* Logo */}
        <Link to="/" className="header-logo">
          <span className="logo-text">amazon<span>clone</span></span>
        </Link>

        {/* Deliver to */}
        <div className="header-deliver" style={{ display: 'flex', flexDirection: 'column' }}>
          <span>Hello</span>
          <strong>📍 India</strong>
        </div>

        {/* Search bar */}
        <form className="header-search" onSubmit={handleSearch}>
          <select className="search-category">
            <option>All</option>
            <option>Electronics</option>
            <option>Books</option>
            <option>Clothing</option>
          </select>
          <input
            className="search-input"
            type="text"
            placeholder="Search Amazon Clone..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <button type="submit" className="search-btn">
            <svg viewBox="0 0 24 24"><path d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round"/></svg>
          </button>
        </form>

        {/* Account */}
        {userInfo ? (
          <div style={{ display: 'flex', flexDirection: 'column', color: 'white', cursor: 'pointer' }}
            className="header-account" onClick={handleLogout}>
            <span style={{ fontSize: 11, color: '#ccc' }}>Hello, {userInfo.name.split(' ')[0]}</span>
            <strong style={{ fontSize: 13 }}>Account & Logout</strong>
          </div>
        ) : (
          <Link to="/login" className="header-account" style={{ display: 'flex', flexDirection: 'column' }}>
            <span>Hello, sign in</span>
            <strong>Account & Lists</strong>
          </Link>
        )}

        {/* Notifications Bell (seller/admin only) */}
        {userInfo && (isSeller || isAdmin) && (
          <div className="notif-bell-wrap header-account" ref={notifRef}
            onClick={() => setNotifOpen(o => !o)}>
            <span style={{ fontSize: 22 }}>🔔</span>
            {unreadCount > 0 && (
              <span className="notif-badge">{unreadCount}</span>
            )}
            {notifOpen && (
              <div className="notif-dropdown" onClick={e => e.stopPropagation()}>
                <div className="notif-header">
                  Notifications
                  {unreadCount > 0 && (
                    <button className="notif-mark-all" onClick={markAllRead}>Mark all read</button>
                  )}
                </div>
                {notifications.length === 0 ? (
                  <div className="notif-empty">No notifications yet</div>
                ) : (
                  notifications.map(n => (
                    <div key={n._id} className={`notif-item ${!n.isRead ? 'unread' : ''}`}
                      onClick={() => markOneRead(n._id)}>
                      {!n.isRead && <div className="notif-dot" />}
                      <div>
                        <div className="notif-text">{n.message}</div>
                        <div className="notif-time">{timeAgo(n.createdAt)}</div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        )}

        {/* User Sign In / Account */}
        {userInfo ? (
          <div className="header-option" style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', color: 'white', marginRight: '15px' }} onClick={logout}>
            <span style={{ fontSize: '12px' }}>Hello, {userInfo.name}</span>
            <span style={{ fontSize: '14px', fontWeight: 'bold' }}>Sign Out</span>
          </div>
        ) : (
          <Link to="/login" style={{ textDecoration: 'none', color: 'white', display: 'flex', flexDirection: 'column', marginRight: '15px' }}>
            <span style={{ fontSize: '12px' }}>Hello, sign in</span>
            <span style={{ fontSize: '14px', fontWeight: 'bold' }}>Account & Lists</span>
          </Link>
        )}
        
        {/* Cart */}
        <Link to="/cart" className="header-cart">
          🛒
          <span className="cart-count">{totalItems}</span>
          <span className="cart-label">Cart</span>
        </Link>
      </div>

      {/* Bottom nav */}
      <nav className="header-nav">
        <button className="nav-btn">☰ All</button>
        <Link to="/"><button className="nav-btn">Today's Deals</button></Link>
        <button className="nav-btn">Customer Service</button>
        <button className="nav-btn prime">Try Prime</button>
        {userInfo && (
          <Link to="/profile"><button className="nav-btn">My Account</button></Link>
        )}
        {userInfo && (
          <Link to="/my-orders"><button className="nav-btn">Returns & Orders</button></Link>
        )}
        {(isSeller || isAdmin) && (
          <Link to="/create-product"><button className="nav-btn" style={{ color: '#febd69' }}>+ Add Product <span className="seller-tag">SELLER</span></button></Link>
        )}
      </nav>
    </header>
  )
}

export default Header