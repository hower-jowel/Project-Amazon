import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

// Import Context Providers
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'

// Import Components
import Header from './components/Header'

// Import Pages
import HomePage from './pages/HomePage'
import ProductDetailPage from './pages/ProductDetailPage'
import CartPage from './pages/CartPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import ShippingPage from './pages/ShippingPage'
import PlaceOrderPage from './pages/PlaceOrderPage'
import OrderDetailPage from './pages/OrderDetailPage'
import CreateProductPage from './pages/CreateProductPage'
import MyOrdersPage from './pages/MyOrdersPage'

const App = () => {
  return (
    // 1. Wrap everything in Context so user & cart data is available everywhere
    <AuthProvider>
      <CartProvider>
        {/* 2. Set up the Router */}
        <Router>
          {/* Header stays outside Routes so it always shows on top */}
          <Header />
          
          {/* 3. Define the Routes (URL -> Page mapping) */}
          <main style={{ minHeight: '80vh' }}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/product/:id" element={<ProductDetailPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/shipping" element={<ShippingPage />} />
              <Route path="/placeorder" element={<PlaceOrderPage />} />
              <Route path="/order/:id" element={<OrderDetailPage />} />
              
              {/* Placeholders for the final seller/admin features */}
              <Route path="/create-product" element={<CreateProductPage />} />
              <Route path="/my-orders" element={<MyOrdersPage />} />
            </Routes>
          </main>
          
          {/* Simple Footer */}
          <footer className="amazon-footer">
            <div className="footer-back-top" onClick={() => window.scrollTo(0,0)}>
              Back to top
            </div>
            <div style={{ padding: '20px' }}>
              © 2024-2026, Amazon Clone Project
            </div>
          </footer>
        </Router>
      </CartProvider>
    </AuthProvider>
  )
}

export default App