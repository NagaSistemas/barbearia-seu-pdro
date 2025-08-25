import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Agendamentos from './pages/Agendamentos'
import Barbeiros from './pages/Barbeiros'
import Agenda from './pages/Agenda'
import Funcionamento from './pages/Funcionamento'
import Login from './pages/Login'
import { useAuth } from './hooks/useAuth'

function App() {
  const { isAuthenticated, loading, login } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Login onLogin={login} />
  }

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/agendamentos" element={<Agendamentos />} />
        <Route path="/barbeiros" element={<Barbeiros />} />
        <Route path="/agenda" element={<Agenda />} />
        <Route path="/funcionamento" element={<Funcionamento />} />
      </Routes>
    </Layout>
  )
}

export default App