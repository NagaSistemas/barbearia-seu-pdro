import React, { useState, useEffect } from 'react'
import { Calendar, Users, Scissors, DollarSign, Clock, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react'

interface Agendamento {
  id: string
  name: string
  phone: string
  services: string[]
  barber: string
  date: string
  time: string
  status: string
  createdAt: string
}

interface Barbeiro {
  id: string
  name: string
  specialty: string
  status: string
}

export default function Dashboard() {
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([])
  const [barbeiros, setBarbeiros] = useState<Barbeiro[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDados()
  }, [])

  const fetchDados = async () => {
    try {
      setLoading(true)
      
      // Buscar agendamentos
      const agendamentosRes = await fetch('http://localhost:3001/api/agendamentos')
      const agendamentosData = await agendamentosRes.json()
      
      // Buscar barbeiros
      const barbeirosRes = await fetch('http://localhost:3001/api/barbeiros')
      const barbeirosData = await barbeirosRes.json()
      
      if (agendamentosData.success) {
        setAgendamentos(agendamentosData.data)
      }
      
      if (barbeirosData.success) {
        setBarbeiros(barbeirosData.data)
      }
    } catch (error) {
      console.error('Erro ao buscar dados:', error)
    } finally {
      setLoading(false)
    }
  }

  // Cálculos das estatísticas
  const hoje = new Date().toISOString().split('T')[0]
  const agendamentosHoje = agendamentos.filter(a => a.date === hoje)
  const agendamentosConfirmados = agendamentos.filter(a => a.status === 'confirmado')
  const agendamentosConcluidos = agendamentos.filter(a => a.status === 'concluido')
  const agendamentosCancelados = agendamentos.filter(a => a.status === 'cancelado')
  
  // Receita total (apenas concluídos)
  const servicesPrices = {
    corte: 60,
    barba: 40,
    sobrancelha: 20,
    coloracao: 80,
    luzes: 120,
    relaxamento: 100
  }
  
  const receitaTotal = agendamentosConcluidos.reduce((total, agendamento) => {
    return total + agendamento.services.reduce((subtotal, serviceId) => {
      return subtotal + (servicesPrices[serviceId as keyof typeof servicesPrices] || 0)
    }, 0)
  }, 0)

  const receitaHoje = agendamentosHoje
    .filter(a => a.status === 'concluido')
    .reduce((total, agendamento) => {
      return total + agendamento.services.reduce((subtotal, serviceId) => {
        return subtotal + (servicesPrices[serviceId as keyof typeof servicesPrices] || 0)
      }, 0)
    }, 0)

  // Próximos agendamentos
  const proximosAgendamentos = agendamentos
    .filter(a => a.status === 'confirmado' && a.date >= hoje)
    .sort((a, b) => {
      if (a.date === b.date) {
        return a.time.localeCompare(b.time)
      }
      return a.date.localeCompare(b.date)
    })
    .slice(0, 5)

  const getBarbeiroNome = (barberId: string) => {
    const barbeiro = barbeiros.find(b => b.id === barberId)
    return barbeiro ? barbeiro.name : barberId
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
        <span className="ml-2 text-gray-600">Carregando dashboard...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
          <p className="text-gray-600">Visão geral da barbearia</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">Hoje</p>
          <p className="text-lg font-semibold text-gray-900">
            {new Date().toLocaleDateString('pt-BR', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>
        </div>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {/* Agendamentos Hoje */}
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Calendar className="h-8 w-8 text-blue-500" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Hoje</p>
              <p className="text-2xl font-bold text-gray-900">{agendamentosHoje.length}</p>
            </div>
          </div>
        </div>

        {/* Total Confirmados */}
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Confirmados</p>
              <p className="text-2xl font-bold text-gray-900">{agendamentosConfirmados.length}</p>
            </div>
          </div>
        </div>

        {/* Receita Hoje */}
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-yellow-500">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <DollarSign className="h-8 w-8 text-yellow-500" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Receita Hoje</p>
              <p className="text-2xl font-bold text-gray-900">R$ {receitaHoje}</p>
            </div>
          </div>
        </div>

        {/* Receita Total */}
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-red-500">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <TrendingUp className="h-8 w-8 text-red-500" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Receita Total</p>
              <p className="text-2xl font-bold text-gray-900">R$ {receitaTotal}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Gráficos e Listas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
        {/* Status dos Agendamentos */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Status dos Agendamentos</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-green-500 rounded-full mr-3"></div>
                <span className="text-sm text-gray-600">Confirmados</span>
              </div>
              <span className="text-sm font-semibold text-gray-900">{agendamentosConfirmados.length}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-blue-500 rounded-full mr-3"></div>
                <span className="text-sm text-gray-600">Concluídos</span>
              </div>
              <span className="text-sm font-semibold text-gray-900">{agendamentosConcluidos.length}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-red-500 rounded-full mr-3"></div>
                <span className="text-sm text-gray-600">Cancelados</span>
              </div>
              <span className="text-sm font-semibold text-gray-900">{agendamentosCancelados.length}</span>
            </div>
          </div>
        </div>

        {/* Próximos Agendamentos */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Próximos Agendamentos</h3>
          <div className="space-y-3">
            {proximosAgendamentos.length === 0 ? (
              <p className="text-gray-500 text-center py-4">Nenhum agendamento próximo</p>
            ) : (
              proximosAgendamentos.map((agendamento) => (
                <div key={agendamento.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{agendamento.name}</p>
                    <p className="text-sm text-gray-600">{getBarbeiroNome(agendamento.barber)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">
                      {new Date(agendamento.date + 'T12:00:00').toLocaleDateString('pt-BR')}
                    </p>
                    <p className="text-sm text-green-600 font-semibold">{agendamento.time}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Barbeiros Ativos */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Equipe ({barbeiros.filter(b => b.status === 'ativo').length})</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {barbeiros.filter(b => b.status === 'ativo').map((barbeiro) => {
            const agendamentosBarbeiro = agendamentos.filter(a => a.barber === barbeiro.id && a.status === 'concluido')
            const receitaBarbeiro = agendamentosBarbeiro.reduce((total, agendamento) => {
              return total + agendamento.services.reduce((subtotal, serviceId) => {
                return subtotal + (servicesPrices[serviceId as keyof typeof servicesPrices] || 0)
              }, 0)
            }, 0)

            return (
              <div key={barbeiro.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <Users className="w-5 h-5 text-gray-400 mr-2" />
                  <h4 className="font-medium text-gray-900">{barbeiro.name}</h4>
                </div>
                <p className="text-sm text-gray-600 mb-2">{barbeiro.specialty}</p>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Atendimentos:</span>
                  <span className="font-medium">{agendamentosBarbeiro.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Receita:</span>
                  <span className="font-medium text-green-600">R$ {receitaBarbeiro}</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}