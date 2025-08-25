import React, { useState, useEffect } from 'react'
import { Calendar, Clock, User, Phone, Scissors, Filter, Search, CheckCircle, XCircle, MessageCircle } from 'lucide-react'

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

export default function Agendamentos() {
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([])
  const [loading, setLoading] = useState(true)
  const [filtroData, setFiltroData] = useState('')
  const [filtroBarbeiro, setFiltroBarbeiro] = useState('')
  const [filtroStatus, setFiltroStatus] = useState('')
  const [busca, setBusca] = useState('')

  useEffect(() => {
    fetchAgendamentos()
  }, [filtroData, filtroBarbeiro, filtroStatus])

  const fetchAgendamentos = async () => {
    try {
      setLoading(true)
      let url = 'http://localhost:3001/api/agendamentos?'
      
      if (filtroData) url += `date=${filtroData}&`
      if (filtroBarbeiro) url += `barber=${filtroBarbeiro}&`
      if (filtroStatus) url += `status=${filtroStatus}&`
      
      const response = await fetch(url)
      const data = await response.json()
      
      if (data.success) {
        setAgendamentos(data.data)
      }
    } catch (error) {
      console.error('Erro ao buscar agendamentos:', error)
    } finally {
      setLoading(false)
    }
  }

  const agendamentosFiltrados = agendamentos.filter(agendamento =>
    agendamento.name.toLowerCase().includes(busca.toLowerCase()) ||
    agendamento.phone.includes(busca)
  )

  const getBarbeiroNome = (barber: string) => {
    return barber === 'carlos' ? 'Carlos Mendes' : 'Ricardo Oliveira'
  }

  const handleStatusChange = async (id: string, novoStatus: string) => {
    const agendamento = agendamentos.find(a => a.id === id)
    if (!agendamento) return

    if (novoStatus === 'cancelado') {
      // Confirmar cancelamento
      if (!confirm(`Tem certeza que deseja cancelar o agendamento de ${agendamento.name}?`)) {
        return
      }

      // Perguntar sobre notificação
      const notificar = confirm('Deseja notificar o cliente sobre o cancelamento?')
      
      if (notificar) {
        // Abrir WhatsApp antes de cancelar
        const phoneClean = agendamento.phone.replace(/\D/g, '')
        if (phoneClean.length === 11) {
          const whatsappUrl = `https://wa.me/55${phoneClean}`
          window.open(whatsappUrl, '_blank')
        } else {
          alert('Número de telefone inválido para notificação.')
        }
      }
    } else {
      // Confirmar conclusão
      if (!confirm(`Tem certeza que deseja concluir este agendamento?`)) {
        return
      }
    }

    try {
      const response = await fetch(`http://localhost:3001/api/agendamentos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: novoStatus })
      })

      const data = await response.json()
      
      if (data.success) {
        await fetchAgendamentos()
        alert(`Agendamento ${novoStatus}!`)
      } else {
        alert('Erro ao atualizar agendamento')
      }
    } catch (error) {
      console.error('Erro ao atualizar status:', error)
      alert('Erro de conexão')
    }
  }

  const abrirWhatsApp = (phone: string) => {
    // Limpar telefone (remover caracteres especiais)
    const phoneClean = phone.replace(/\D/g, '')
    
    // Verificar se tem 11 dígitos (DDD + número)
    if (phoneClean.length !== 11) {
      alert('Número de telefone inválido. Deve ter 11 dígitos (DDD + número).')
      return
    }
    
    // URL do WhatsApp (sem mensagem pré-definida)
    const whatsappUrl = `https://wa.me/55${phoneClean}`
    
    // Abrir em nova aba
    window.open(whatsappUrl, '_blank')
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmado':
        return 'bg-green-100 text-green-800'
      case 'cancelado':
        return 'bg-red-100 text-red-800'
      case 'concluido':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6">
      {/* Filtros */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Filtros</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Search className="w-4 h-4 inline mr-1" />
              Buscar Cliente
            </label>
            <input
              type="text"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Nome ou telefone..."
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Calendar className="w-4 h-4 inline mr-1" />
              Data
            </label>
            <input
              type="date"
              value={filtroData}
              onChange={(e) => setFiltroData(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <User className="w-4 h-4 inline mr-1" />
              Barbeiro
            </label>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
              <button
                onClick={() => setFiltroBarbeiro('')}
                className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filtroBarbeiro === ''
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Todos
              </button>
              <button
                onClick={() => setFiltroBarbeiro('carlos')}
                className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filtroBarbeiro === 'carlos'
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Carlos
              </button>
              <button
                onClick={() => setFiltroBarbeiro('ricardo')}
                className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filtroBarbeiro === 'ricardo'
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Ricardo
              </button>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Filter className="w-4 h-4 inline mr-1" />
              Status
            </label>
            <select
              value={filtroStatus}
              onChange={(e) => setFiltroStatus(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              <option value="">Todos os Status</option>
              <option value="confirmado">Confirmados</option>
              <option value="concluido">Concluídos</option>
              <option value="cancelado">Cancelados</option>
            </select>
          </div>
          
          <div className="flex items-end">
            <button
              onClick={() => {
                setFiltroData('')
                setFiltroBarbeiro('')
                setFiltroStatus('')
                setBusca('')
              }}
              className="w-full bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors"
            >
              Limpar Filtros
            </button>
          </div>
        </div>
      </div>

      {/* Lista de Agendamentos */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-800">
              Agendamentos ({agendamentosFiltrados.length})
            </h3>
            <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors">
              Novo Agendamento
            </button>
          </div>
        </div>
        
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Carregando agendamentos...</p>
          </div>
        ) : agendamentosFiltrados.length === 0 ? (
          <div className="p-8 text-center">
            <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Nenhum agendamento encontrado</p>
          </div>
        ) : (
          <>
            {/* Layout Desktop - Tabela */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cliente
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Serviços
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Barbeiro
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Data/Hora
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {agendamentosFiltrados.map((agendamento) => (
                    <tr key={agendamento.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="flex items-center">
                            <User className="w-4 h-4 text-gray-400 mr-2" />
                            <span className="text-sm font-medium text-gray-900">
                              {agendamento.name}
                            </span>
                          </div>
                          <div className="flex items-center mt-1">
                            <Phone className="w-4 h-4 text-gray-400 mr-2" />
                            <span className="text-sm text-gray-600">
                              {agendamento.phone}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-start">
                          <Scissors className="w-4 h-4 text-gray-400 mr-2 mt-0.5" />
                          <div>
                            <div className="text-sm text-gray-900 font-medium">
                              {agendamento.services?.map(serviceId => {
                                const servicesPrices = {
                                  corte: { name: 'Corte', price: 60 },
                                  barba: { name: 'Barba', price: 40 },
                                  sobrancelha: { name: 'Sobrancelha', price: 20 },
                                  coloracao: { name: 'Coloração', price: 80 },
                                  luzes: { name: 'Luzes/Reflexos', price: 120 },
                                  relaxamento: { name: 'Relaxamento', price: 100 }
                                };
                                const service = servicesPrices[serviceId as keyof typeof servicesPrices];
                                return service ? `${service.name} (R$ ${service.price})` : serviceId;
                              }).join(', ') || 'N/A'}
                            </div>
                            <div className="text-xs text-green-600 font-semibold mt-1">
                              Total: R$ {agendamento.services?.reduce((total, serviceId) => {
                                const servicesPrices = {
                                  corte: { name: 'Corte', price: 60 },
                                  barba: { name: 'Barba', price: 40 },
                                  sobrancelha: { name: 'Sobrancelha', price: 20 },
                                  coloracao: { name: 'Coloração', price: 80 },
                                  luzes: { name: 'Luzes/Reflexos', price: 120 },
                                  relaxamento: { name: 'Relaxamento', price: 100 }
                                };
                                const service = servicesPrices[serviceId as keyof typeof servicesPrices];
                                return total + (service?.price || 0);
                              }, 0) || 0},00
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center mr-2">
                            <User className="w-4 h-4 text-gray-600" />
                          </div>
                          <span className="text-sm text-gray-900 font-medium">
                            {getBarbeiroNome(agendamento.barber)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                            <span className="text-sm text-gray-900">
                              {new Date(agendamento.date + 'T12:00:00').toLocaleDateString('pt-BR')}
                            </span>
                          </div>
                          <div className="flex items-center mt-2">
                            <Clock className="w-4 h-4 text-green-500 mr-2" />
                            <span className="text-lg font-bold text-green-600 bg-green-50 px-2 py-1 rounded-lg">
                              {agendamento.time}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(agendamento.status)}`}>
                          {agendamento.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button 
                            onClick={() => abrirWhatsApp(agendamento.phone)}
                            className="flex items-center px-3 py-1 rounded-lg font-medium bg-green-500 text-white hover:bg-green-600 transition-colors"
                            title="Entrar em contato via WhatsApp"
                          >
                            <MessageCircle className="w-4 h-4 mr-1" />
                            WhatsApp
                          </button>
                          <button 
                            onClick={() => handleStatusChange(agendamento.id, 'concluido')}
                            className={`flex items-center px-3 py-1 rounded-lg font-medium transition-colors ${
                              agendamento.status === 'concluido'
                                ? 'bg-green-100 text-green-800 cursor-not-allowed'
                                : 'bg-green-600 text-white hover:bg-green-700'
                            }`}
                            disabled={agendamento.status === 'concluido'}
                            title={agendamento.status === 'concluido' ? 'Já concluído' : 'Marcar como concluído'}
                          >
                            <CheckCircle className="w-4 h-4 mr-1" />
                            {agendamento.status === 'concluido' ? 'Concluído' : 'Concluir'}
                          </button>
                          <button 
                            onClick={() => handleStatusChange(agendamento.id, 'cancelado')}
                            className={`flex items-center px-3 py-1 rounded-lg font-medium transition-colors ${
                              agendamento.status === 'cancelado'
                                ? 'bg-red-100 text-red-800 cursor-not-allowed'
                                : 'bg-red-600 text-white hover:bg-red-700'
                            }`}
                            disabled={agendamento.status === 'cancelado'}
                            title={agendamento.status === 'cancelado' ? 'Já cancelado' : 'Cancelar agendamento'}
                          >
                            <XCircle className="w-4 h-4 mr-1" />
                            {agendamento.status === 'cancelado' ? 'Cancelado' : 'Cancelar'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Layout Mobile/Tablet - Cards */}
            <div className="lg:hidden space-y-4">
              {agendamentosFiltrados.map((agendamento) => (
                <div key={agendamento.id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                  {/* Header do Card */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center mb-1">
                        <User className="w-4 h-4 text-gray-400 mr-2" />
                        <span className="font-semibold text-gray-900">{agendamento.name}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Phone className="w-4 h-4 text-gray-400 mr-2" />
                        <span>{agendamento.phone}</span>
                      </div>
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(agendamento.status)}`}>
                      {agendamento.status}
                    </span>
                  </div>

                  {/* Informações do Agendamento */}
                  <div className="space-y-3">
                    {/* Barbeiro e Data/Hora */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Barbeiro</p>
                        <p className="text-sm font-medium text-gray-900">{getBarbeiroNome(agendamento.barber)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Data</p>
                        <p className="text-sm text-gray-900">
                          {new Date(agendamento.date + 'T12:00:00').toLocaleDateString('pt-BR')}
                        </p>
                        <div className="mt-1">
                          <span className="text-lg font-bold text-green-600 bg-green-50 px-2 py-1 rounded-lg">
                            {agendamento.time}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Serviços */}
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Serviços</p>
                      <div className="text-sm text-gray-900">
                        {agendamento.services?.map(serviceId => {
                          const servicesPrices = {
                            corte: { name: 'Corte', price: 60 },
                            barba: { name: 'Barba', price: 40 },
                            sobrancelha: { name: 'Sobrancelha', price: 20 },
                            coloracao: { name: 'Coloração', price: 80 },
                            luzes: { name: 'Luzes/Reflexos', price: 120 },
                            relaxamento: { name: 'Relaxamento', price: 100 }
                          };
                          const service = servicesPrices[serviceId as keyof typeof servicesPrices];
                          return service ? `${service.name} (R$ ${service.price})` : serviceId;
                        }).join(', ') || 'N/A'}
                      </div>
                      <div className="text-sm text-green-600 font-semibold mt-1">
                        Total: R$ {agendamento.services?.reduce((total, serviceId) => {
                          const servicesPrices = {
                            corte: { name: 'Corte', price: 60 },
                            barba: { name: 'Barba', price: 40 },
                            sobrancelha: { name: 'Sobrancelha', price: 20 },
                            coloracao: { name: 'Coloração', price: 80 },
                            luzes: { name: 'Luzes/Reflexos', price: 120 },
                            relaxamento: { name: 'Relaxamento', price: 100 }
                          };
                          const service = servicesPrices[serviceId as keyof typeof servicesPrices];
                          return total + (service?.price || 0);
                        }, 0) || 0},00
                      </div>
                    </div>

                    {/* Ações */}
                    <div className="flex flex-col sm:flex-row gap-2 pt-2 border-t border-gray-100">
                      <button 
                        onClick={() => abrirWhatsApp(agendamento.phone)}
                        className="flex items-center justify-center px-3 py-2 rounded-lg font-medium bg-green-500 text-white hover:bg-green-600 transition-colors text-sm"
                      >
                        <MessageCircle className="w-4 h-4 mr-2" />
                        WhatsApp
                      </button>
                      <button 
                        onClick={() => handleStatusChange(agendamento.id, 'concluido')}
                        className={`flex items-center justify-center px-3 py-2 rounded-lg font-medium transition-colors text-sm ${
                          agendamento.status === 'concluido'
                            ? 'bg-green-100 text-green-800 cursor-not-allowed'
                            : 'bg-green-600 text-white hover:bg-green-700'
                        }`}
                        disabled={agendamento.status === 'concluido'}
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        {agendamento.status === 'concluido' ? 'Concluído' : 'Concluir'}
                      </button>
                      <button 
                        onClick={() => handleStatusChange(agendamento.id, 'cancelado')}
                        className={`flex items-center justify-center px-3 py-2 rounded-lg font-medium transition-colors text-sm ${
                          agendamento.status === 'cancelado'
                            ? 'bg-red-100 text-red-800 cursor-not-allowed'
                            : 'bg-red-600 text-white hover:bg-red-700'
                        }`}
                        disabled={agendamento.status === 'cancelado'}
                      >
                        <XCircle className="w-4 h-4 mr-2" />
                        {agendamento.status === 'cancelado' ? 'Cancelado' : 'Cancelar'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}