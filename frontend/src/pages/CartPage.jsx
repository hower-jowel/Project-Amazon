import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'

const CartPage = () => {
  const { cartItems, removeFromCart, updateQty, itemsPrice, shippingPrice, taxPrice, totalPrice, totalItems } = useCart()
  const { userInfo } = useAuth()
  const navigate = useNavigate()

  const checkoutHandler = () => {
    if (!userInfo) navigate('/login?redirect=/shipping')
    else navigate('/shipping')
  }

  if (cartItems.length === 0) {
    return (
      <div className="page-container">
        <div className="cart-empty">
          <div style={{ fontSize: 80 }}>🛒</div>
          <h2 style={{ marginTop: 16 }}>Your Amazon Clone Cart is empty</h2>
          <p>Your Shopping Cart lives here. Start by adding products to it.</p>
          <Link to="/">
            <button className="btn-amazon" style={{ marginTop: 20, width: 'auto', padding: '10px 28px' }}>
              Shop today's deals
            </button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="page-container">
      <div className="cart-page">
        {/* Left: Cart Items */}
        <div className="cart-box">
          <h1>Shopping Cart</h1>
          <div style={{ textAlign: 'right', fontSize: 12, color: '#565959', borderBottom: '1px solid #ddd', paddingBottom: 8, marginBottom: 0 }}>Price</div>

          {cartItems.map(item => (
            <div key={item._id} className="cart-item">
              <div className="cart-item-img">
                <img src={item.image} alt={item.name}
                  onError={e => { e.target.src = 'https://via.placeholder.com/120?text=No+Img' }} />
              </div>
              <div>
                <Link to={`/product/${item._id}`} className="cart-item-name">{item.name}</Link>
                <div className="cart-item-stock">In Stock</div>
                <div style={{ fontSize: 12, color: '#565959', marginBottom: 8 }}>Brand: {item.brand}</div>
                <div className="cart-item-controls">
                  <button className="qty-btn"
                    onClick={() => item.qty > 1 ? updateQty(item._id, item.qty - 1) : removeFromCart(item._id)}>−</button>
                  <span className="qty-display">{item.qty}</span>
                  <button className="qty-btn"
                    onClick={() => item.qty < item.countInStock && updateQty(item._id, item.qty + 1)}
                    disabled={item.qty >= item.countInStock}>+</button>
                  <span style={{ color: '#ddd', margin: '0 6px' }}>|</span>
                  <button className="cart-item-delete" onClick={() => removeFromCart(item._id)}>Delete</button>
                  <span style={{ color: '#ddd', margin: '0 6px' }}>|</span>
                  <button className="cart-item-delete" style={{ color: '#0066C0' }}>Save for later</button>
                </div>
              </div>
              <div className="cart-item-price">${(item.price * item.qty).toFixed(2)}</div>
            </div>
          ))}

          <div style={{ textAlign: 'right', paddingTop: 16, fontSize: 18 }}>
            Subtotal ({totalItems} {totalItems === 1 ? 'item' : 'items'}):
            <strong> ${itemsPrice.toFixed(2)}</strong>
          </div>
        </div>

        {/* Right: Summary */}
        <div className="cart-summary-box">
          <div style={{ color: '#067D62', fontSize: 16, fontWeight: 700, marginBottom: 8 }}>
            ✓ Your order qualifies for FREE Delivery
          </div>
          <div className="cart-total">
            Subtotal ({totalItems} items): <span className="cart-total-price">${itemsPrice.toFixed(2)}</span>
          </div>
          <div style={{ fontSize: 13, color: '#565959', marginBottom: 4 }}>
            Shipping: {shippingPrice === 0 ? <span style={{ color: '#067D62' }}>FREE</span> : `$${shippingPrice}`}
          </div>
          <div style={{ fontSize: 13, color: '#565959', marginBottom: 12 }}>
            Estimated tax: ${taxPrice.toFixed(2)}
          </div>
          <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>
            Order Total: ${totalPrice.toFixed(2)}
          </div>
          <button className="btn-amazon" onClick={checkoutHandler}>
            Proceed to checkout ({totalItems} {totalItems === 1 ? 'item' : 'items'})
          </button>
        </div>
      </div>
    </div>
  )
}

export default CartPage