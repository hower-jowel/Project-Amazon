import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'

const CreateProductPage = () => {
  const { userInfo, getAuthHeader } = useAuth()
  const navigate = useNavigate()

  // Form State
  const [name, setName] = useState('')
  const [price, setPrice] = useState(0)
  const [image, setImage] = useState('')
  const [brand, setBrand] = useState('')
  const [category, setCategory] = useState('')
  const [countInStock, setCountInStock] = useState(0)
  const [description, setDescription] = useState('')
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Security Check: Only let Sellers or Admins see this page
  useEffect(() => {
    if (!userInfo || (userInfo.role !== 'seller' && userInfo.role !== 'admin')) {
      navigate('/')
    }
  }, [userInfo, navigate])

  const submitHandler = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const { data } = await axios.post(
        '/api/products',
        { name, price, image, brand, category, countInStock, description },
        { headers: getAuthHeader() }
      )
      // Success! Take them to their brand new product page
      navigate(`/product/${data._id}`)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create product.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page-container" style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
      <div className="checkout-card" style={{ maxWidth: '600px', width: '100%' }}>
        <h2 style={{ marginBottom: '20px', fontSize: '24px' }}>Add New Product</h2>
        
        {error && <div className="alert alert-danger" style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}
        
        <form onSubmit={submitHandler}>
          <div className="form-group">
            <label className="form-label">Product Name</label>
            <input className="form-input" type="text" placeholder="e.g., Sony PlayStation 5" 
              value={name} onChange={(e) => setName(e.target.value)} required />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <div className="form-group">
              <label className="form-label">Price ($)</label>
              <input className="form-input" type="number" step="0.01" placeholder="499.99" 
                value={price} onChange={(e) => setPrice(e.target.value)} required />
            </div>
            <div className="form-group">
              <label className="form-label">Stock Quantity</label>
              <input className="form-input" type="number" placeholder="10" 
                value={countInStock} onChange={(e) => setCountInStock(e.target.value)} required />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Image URL</label>
            <input className="form-input" type="text" placeholder="https://example.com/image.jpg" 
              value={image} onChange={(e) => setImage(e.target.value)} required />
            <span style={{ fontSize: '12px', color: '#565959' }}>Paste a link to an image for now.</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <div className="form-group">
              <label className="form-label">Brand</label>
              <input className="form-input" type="text" placeholder="e.g., Sony" 
                value={brand} onChange={(e) => setBrand(e.target.value)} required />
            </div>
            <div className="form-group">
              <label className="form-label">Category</label>
              <select className="form-select" value={category} onChange={(e) => setCategory(e.target.value)} required>
                <option value="">Select Category</option>
                <option value="Electronics">Electronics</option>
                <option value="Clothing">Clothing</option>
                <option value="Books">Books</option>
                <option value="Furniture">Furniture</option>
                <option value="Toys">Toys</option>
                <option value="Sports">Sports</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea className="form-input" rows="4" placeholder="Describe the item..." 
              value={description} onChange={(e) => setDescription(e.target.value)} required></textarea>
          </div>

          <button type="submit" className="btn-amazon" style={{ width: '100%', marginTop: '10px' }} disabled={loading}>
            {loading ? 'Creating...' : 'List Product for Sale'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default CreateProductPage