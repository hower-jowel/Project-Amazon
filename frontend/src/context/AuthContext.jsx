import React, { createContext, useState, useContext } from 'react'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [userInfo, setUserInfo] = useState(
    localStorage.getItem('userInfo')
      ? JSON.parse(localStorage.getItem('userInfo'))
      : null
  )

  const login = (data) => {
    setUserInfo(data)
    localStorage.setItem('userInfo', JSON.stringify(data))
  }

  const logout = () => {
    setUserInfo(null)
    localStorage.removeItem('userInfo')
    localStorage.removeItem('cartItems')
  }

  const getAuthHeader = () => ({
    Authorization: `Bearer ${userInfo?.token}`,
  })

  return (
    <AuthContext.Provider value={{ userInfo, login, logout, getAuthHeader }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)