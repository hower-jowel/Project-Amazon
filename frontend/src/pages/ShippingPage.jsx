import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import CheckoutSteps from '../components/CheckoutSteps'

const ShippingPage = () => {
  const { shippingAddress, saveShippingAddress } = useCart()
  const { userInfo } = useAuth()
  const navigate = useNavigate()

  if (!userInfo) { navigate('/login'); return null }

  const [address, setAddress] = useState(shippingAddress.address || '')
  const [city, setCity] = useState(shippingAddress.city || '')
  const [postalCode, setPostalCode] = useState(shippingAddress.postalCode || '')
  const [country, setCountry] = useState(shippingAddress.country || '')

  const handleSubmit = (e) => {
    e.preventDefault()
    saveShippingAddress({ address, city, postalCode, country })
    navigate('/placeorder')
  }

  return (
    <div className="page-container">
      <CheckoutSteps step={2} />
      <div className="checkout-layout">
        <div className="checkout-card">
          <h2>Enter a delivery address</h2>
          <div style={{ fontSize: 14, color: '#565959', marginBottom: 20 }}>
            Delivering to <strong>{userInfo.name}</strong>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Address</label>
              <input className="form-input" type="text" placeholder="Street address or P.O. Box"
                value={address} onChange={e => setAddress(e.target.value)} required />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">City</label>
                <input className="form-input" type="text"
                  value={city} onChange={e => setCity(e.target.value)} required />
              </div>
              <div className="form-group">
                <label className="form-label">Postal Code</label>
                <input className="form-input" type="text"
                  value={postalCode} onChange={e => setPostalCode(e.target.value)} required />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Country</label>
              <select className="form-select" value={country} onChange={e => setCountry(e.target.value)} required>
                <option value="">Select country</option>
                <option value="India">India</option>
                <option value="United States">United States</option>
                <option value="United Kingdom">United Kingdom</option>
                <option value="Canada">Canada</option>
                <option value="Australia">Australia</option>
                <option value="Germany">Germany</option>
                <option value="France">France</option>
                <option value="Japan">Japan</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <button type="submit" className="btn-amazon" style={{ marginTop: 8 }}>
              Use this address
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default ShippingPage