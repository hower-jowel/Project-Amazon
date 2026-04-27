import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'

const LoginPage = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const redirect = new URLSearchParams(location.search).get('redirect') || '/'

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const { data } = await axios.post('/api/users/login', { email, password })
      login(data)
      navigate(redirect)
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div style={{ width: '100%', maxWidth: 350 }}>
        <div className="auth-logo">amazon<span>clone</span></div>
        <div className="auth-box">
          <h1 className="auth-title">Sign in</h1>
          {error && <div className="alert alert-error">{error}</div>}
          <form onSubmit={handleSubmit}>
            <label className="form-label" htmlFor="email">Email</label>
            <input
              id="email"
              className="form-input"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              autoFocus
            />
            <label className="form-label" htmlFor="password">Password</label>
            <input
              id="password"
              className="form-input"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
            <button type="submit" className="btn-amazon" disabled={loading}>
              {loading ? 'Signing in...' : 'Continue'}
            </button>
          </form>
          <p style={{ fontSize: 12, color: '#565959', marginTop: 12 }}>
            By continuing, you agree to Amazon Clone's Conditions of Use and Privacy Notice.
          </p>
        </div>
        <div className="auth-divider"><span>New to Amazon Clone?</span></div>
        <div className="auth-link-box">
          <Link to="/register">
            <button className="btn-amazon" style={{ background: '#f0f2f2', border: '1px solid #D5D9D9', width: '100%' }}>
              Create your Amazon Clone account
            </button>
          </Link>
        </div>
        <p style={{ textAlign: 'center', marginTop: 16, fontSize: 12 }}>
          Already have an account? <Link to="/login" style={{ color: '#0066C0' }}>Sign in</Link>
        </p>
      </div>
    </div>
  )
}

export default LoginPage