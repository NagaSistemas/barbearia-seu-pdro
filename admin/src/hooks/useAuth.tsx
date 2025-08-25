import { useState, useEffect } from 'react'

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Verificar se há token de autenticação no localStorage
    const authToken = localStorage.getItem('adminAuth')
    setIsAuthenticated(authToken === 'true')
    setLoading(false)
  }, [])

  const login = () => {
    localStorage.setItem('adminAuth', 'true')
    setIsAuthenticated(true)
  }

  const logout = () => {
    localStorage.removeItem('adminAuth')
    setIsAuthenticated(false)
  }

  return {
    isAuthenticated,
    loading,
    login,
    logout
  }
}