import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'

const RegisterPage = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [role, setRole] = useState('buyer')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }
    setError('')
    setLoading(true)
    try {
      const { data } = await axios.post('/api/users', { name, email, password, role })
      login(data)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div style={{ width: '100%', maxWidth: 400 }}>
        <div className="auth-logo">amazon<span>clone</span></div>
        <div className="auth-box">
          <h1 className="auth-title">Create account</h1>
          {error && <div className="alert alert-error">{error}</div>}
          <form onSubmit={handleSubmit}>
            <label className="form-label">Your name</label>
            <input className="form-input" type="text" placeholder="First and last name"
              value={name} onChange={e => setName(e.target.value)} required />

            <label className="form-label">Email</label>
            <input className="form-input" type="email"
              value={email} onChange={e => setEmail(e.target.value)} required />

            <label className="form-label">Password</label>
            <input className="form-input" type="password" placeholder="At least 6 characters"
              value={password} onChange={e => setPassword(e.target.value)} required />

            <label className="form-label">Re-enter password</label>
            <input className="form-input" type="password"
              value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required />

            <label className="form-label">Account type</label>
            <select className="form-select" value={role} onChange={e => setRole(e.target.value)}>
              <option value="buyer">Buyer — I want to shop</option>
              <option value="seller">Seller — I want to sell products</option>
              <option value="admin">Admin (Temporary)</option>
            </select>

            <button type="submit" className="btn-amazon" disabled={loading}>
              {loading ? 'Creating account...' : 'Continue'}
            </button>
          </form>
          <p style={{ fontSize: 12, color: '#565959', marginTop: 12 }}>
            By creating an account, you agree to Amazon Clone's Conditions of Use.
          </p>
          <div className="auth-divider"><span>Already have an account?</span></div>
          <p style={{ textAlign: 'center', fontSize: 14 }}>
            <Link to="/login" style={{ color: '#0066C0' }}>Sign in ›</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default RegisterPage