import React, { useState, useEffect } from 'react'
import { Calendar, Clock, User, Plus, X, Check } from 'lucide-react'

interface HorarioConfig {
  dia: string
  ativo: boolean
  inicio: string
  fim: string
  intervaloInicio?: string
  intervaloFim?: string
}

interface BloqueioHorario {
  id: string
  data: string
  horarioInicio: string
  horarioFim: string
  motivo: string
}

export default function Agenda() {
  const [barbeiroSelecionado, setBarbeiroSelecionado] = useState('carlos')
  const [dataSelecionada, setDataSelecionada] = useState(new Date().toISOString().split('T')[0])
  const [showBloqueio, setShowBloqueio] = useState(false)
  
  const [horariosPadrao, setHorariosPadrao] = useState<HorarioConfig[]>([
    { dia: 'Segunda', ativo: true, inicio: '07:00', fim: '18:00' },
    { dia: 'Terça', ativo: true, inicio: '07:00', fim: '18:00' },
    { dia: 'Quarta', ativo: true, inicio: '07:00', fim: '18:00' },
    { dia: 'Quinta', ativo: true, inicio: '07:00', fim: '18:00' },
    { dia: 'Sexta', ativo: true, inicio: '07:00', fim: '18:00' },
    { dia: 'Sábado', ativo: true, inicio: '07:00', fim: '18:00' },
    { dia: 'Domingo', ativo: false, inicio: '07:00', fim: '18:00' }
  ])

  const [bloqueios, setBloqueios] = useState<BloqueioHorario[]>([])

  useEffect(() => {
    fetchBloqueios()
  }, [barbeiroSelecionado])

  // Buscar bloqueios ao carregar a página
  useEffect(() => {
    fetchBloqueios()
  }, [])

  const fetchBloqueios = async () => {
    try {
      const response = await fetch(`http://localhost:3001/api/bloqueios?barber=${barbeiroSelecionado}`)
      const data = await response.json()
      if (data.success) {
        setBloqueios(data.data)
        console.log('Bloqueios carregados:', data.data.length)
      }
    } catch (error) {
      console.error('Erro ao buscar bloqueios:', error)
      setBloqueios([]) // Limpar em caso de erro
    }
  }
  const [novoBloqueio, setNovoBloqueio] = useState({
    data: '',
    horarioInicio: '',
    horarioFim: '',
    motivo: ''
  })

  const barbeiros = [
    { id: 'carlos', name: 'Carlos Mendes' },
    { id: 'ricardo', name: 'Ricardo Oliveira' }
  ]

  const toggleDia = (index: number) => {
    const novosHorarios = [...horariosPadrao]
    novosHorarios[index].ativo = !novosHorarios[index].ativo
    setHorariosPadrao(novosHorarios)
  }

  const updateHorario = (index: number, field: string, value: string) => {
    const novosHorarios = [...horariosPadrao]
    novosHorarios[index] = { ...novosHorarios[index], [field]: value }
    setHorariosPadrao(novosHorarios)
  }

  const adicionarBloqueio = async () => {
    if (!novoBloqueio.data || !novoBloqueio.horarioInicio || !novoBloqueio.horarioFim) {
      alert('Preencha todos os campos obrigatórios')
      return
    }

    try {
      const response = await fetch('http://localhost:3001/api/bloqueios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          barber: barbeiroSelecionado,
          ...novoBloqueio
        })
      })

      const data = await response.json()
      if (data.success) {
        setBloqueios([...bloqueios, data.data])
        setNovoBloqueio({ data: '', horarioInicio: '', horarioFim: '', motivo: '' })
        setShowBloqueio(false)
        alert('Horário bloqueado com sucesso!')
      } else {
        alert('Erro ao bloquear horário')
      }
    } catch (error) {
      console.error('Erro ao criar bloqueio:', error)
      alert('Erro de conexão')
    }
  }

  const removerBloqueio = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:3001/api/bloqueios/${id}`, {
        method: 'DELETE'
      })

      const data = await response.json()
      if (data.success) {
        setBloqueios(bloqueios.filter(b => b.id !== id))
        alert('Bloqueio removido!')
      }
    } catch (error) {
      console.error('Erro ao remover bloqueio:', error)
    }
  }

  const toggleHorario = async (horario: string) => {
    // Buscar bloqueio exato para este horário específico
    const bloqueioExato = bloqueios.find(b => 
      b.data === dataSelecionada && 
      b.barber === barbeiroSelecionado &&
      b.horarioInicio === horario &&
      b.horarioFim === horario
    )

    if (bloqueioExato) {
      // Remover bloqueio (abrir horário)
      await removerBloqueio(bloqueioExato.id)
    } else {
      // Verificar se já existe algum bloqueio para este horário
      const jaExisteBloqueio = bloqueios.some(b => 
        b.data === dataSelecionada && 
        b.barber === barbeiroSelecionado &&
        horario >= b.horarioInicio && 
        horario <= b.horarioFim
      )
      
      if (!jaExisteBloqueio) {
        // Criar novo bloqueio (fechar horário)
        try {
          const response = await fetch('http://localhost:3001/api/bloqueios', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              barber: barbeiroSelecionado,
              data: dataSelecionada,
              horarioInicio: horario,
              horarioFim: horario,
              motivo: 'Fechado pelo admin'
            })
          })

          const data = await response.json()
          if (data.success) {
            setBloqueios([...bloqueios, data.data])
          }
        } catch (error) {
          console.error('Erro ao bloquear horário:', error)
        }
      }
    }
  }

  const gerarHorariosDisponiveis = () => {
    const hoje = new Date(dataSelecionada)
    const diaSemana = hoje.getDay()
    const diasSemana = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado']
    const configDia = horariosPadrao.find(h => h.dia === diasSemana[diaSemana])
    
    if (!configDia || !configDia.ativo) {
      return []
    }

    const horarios = []
    const inicio = new Date(`2024-01-01T${configDia.inicio}:00`)
    const fim = new Date(`2024-01-01T${configDia.fim}:00`)
    
    while (inicio < fim) {
      const horarioStr = inicio.toTimeString().slice(0, 5)
      
      // Verificar se está bloqueado
      const isBloqueado = bloqueios.some(b => 
        b.data === dataSelecionada && 
        horarioStr >= b.horarioInicio && 
        horarioStr < b.horarioFim
      )
      
      horarios.push({
        horario: horarioStr,
        disponivel: !isBloqueado,
        motivo: isBloqueado ? 'Bloqueado' : ''
      })
      
      inicio.setHours(inicio.getHours() + 1)
    }
    
    return horarios
  }

  return (
    <div className="space-y-6">
      {/* Seletor de Barbeiro */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <User className="w-5 h-5 mr-2 text-red-600" />
          Selecione o Barbeiro
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {barbeiros.map(barbeiro => (
            <button
              key={barbeiro.id}
              onClick={() => setBarbeiroSelecionado(barbeiro.id)}
              className={`p-6 rounded-xl border-2 transition-all duration-200 transform hover:scale-105 ${
                barbeiroSelecionado === barbeiro.id
                  ? 'border-red-500 bg-red-50 shadow-lg'
                  : 'border-gray-300 hover:border-gray-400 bg-white'
              }`}
            >
              <div className="flex items-center justify-center mb-3">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
                  barbeiroSelecionado === barbeiro.id ? 'bg-red-500' : 'bg-gray-400'
                }`}>
                  <User className="w-8 h-8 text-white" />
                </div>
              </div>
              <h4 className={`text-lg font-semibold ${
                barbeiroSelecionado === barbeiro.id ? 'text-red-700' : 'text-gray-700'
              }`}>
                {barbeiro.name}
              </h4>
              {barbeiroSelecionado === barbeiro.id && (
                <div className="mt-2 flex items-center justify-center text-red-600">
                  <Check className="w-5 h-5 mr-1" />
                  <span className="text-sm font-medium">Selecionado</span>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Calendário Melhorado */}
        <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
          <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
            <div className="bg-red-500 rounded-full p-2 mr-3">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            Selecione o Dia
          </h3>
          
          {/* Input de Data Estilizado */}
          <div className="relative mb-6">
            <input
              type="date"
              value={dataSelecionada}
              onChange={(e) => setDataSelecionada(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className="w-full text-xl p-4 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-red-200 focus:border-red-500 transition-all duration-200 bg-gradient-to-r from-gray-50 to-white"
            />
          </div>
          
          {/* Data Selecionada com Visual Melhorado */}
          <div className="bg-gradient-to-br from-red-50 to-red-100 border-2 border-red-200 rounded-xl p-6">
            <div className="flex items-center mb-3">
              <div className="bg-red-500 rounded-full p-2 mr-3">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <h4 className="font-semibold text-red-700">Data Selecionada</h4>
            </div>
            
            <div className="space-y-2">
              <p className="text-2xl font-bold text-red-800">
                {new Date(dataSelecionada + 'T12:00:00').toLocaleDateString('pt-BR', {
                  weekday: 'long'
                }).charAt(0).toUpperCase() + new Date(dataSelecionada + 'T12:00:00').toLocaleDateString('pt-BR', {
                  weekday: 'long'
                }).slice(1)}
              </p>
              <p className="text-lg text-red-700">
                {new Date(dataSelecionada + 'T12:00:00').toLocaleDateString('pt-BR', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}
              </p>
            </div>
            
            {/* Indicador se é hoje */}
            {dataSelecionada === new Date().toISOString().split('T')[0] && (
              <div className="mt-3 inline-flex items-center px-3 py-1 bg-red-500 text-white text-sm font-medium rounded-full">
                <Clock className="w-4 h-4 mr-1" />
                Hoje
              </div>
            )}
            
            {/* Indicador se é amanhã */}
            {dataSelecionada === new Date(Date.now() + 24*60*60*1000).toISOString().split('T')[0] && (
              <div className="mt-3 inline-flex items-center px-3 py-1 bg-orange-500 text-white text-sm font-medium rounded-full">
                <Calendar className="w-4 h-4 mr-1" />
                Amanhã
              </div>
            )}
          </div>

        </div>

        {/* Horários Clicáveis */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <Clock className="w-5 h-5 mr-2 text-red-600" />
            Gerenciar Horários
          </h3>
          
          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-2">
              <span className="inline-block w-4 h-4 bg-green-500 rounded mr-2"></span>
              Verde = Aberto
            </p>
            <p className="text-sm text-gray-600">
              <span className="inline-block w-4 h-4 bg-red-500 rounded mr-2"></span>
              Vermelho = Fechado
            </p>
          </div>
          
          <div className="grid grid-cols-3 gap-3">
            {['07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'].map((horario) => {
              const isBloqueado = bloqueios.some(b => 
                b.data === dataSelecionada && 
                b.barber === barbeiroSelecionado &&
                b.horarioInicio === horario &&
                b.horarioFim === horario
              );
              
              return (
                <button
                  key={horario}
                  onClick={() => toggleHorario(horario)}
                  className={`p-4 rounded-lg font-semibold text-white transition-all duration-200 transform hover:scale-105 ${
                    isBloqueado
                      ? 'bg-red-500 hover:bg-red-600 shadow-lg'
                      : 'bg-green-500 hover:bg-green-600 shadow-lg'
                  }`}
                >
                  {horario}
                </button>
              );
            })}
          </div>
          
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 text-center">
              Clique nos horários para abrir (verde) ou fechar (vermelho)
            </p>
          </div>
        </div>
      </div>

      {/* Bloqueios Ativos */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Bloqueios Ativos</h3>
        {bloqueios.length === 0 ? (
          <p className="text-gray-500">Nenhum bloqueio ativo</p>
        ) : (
          <div className="space-y-2">
            {bloqueios.map(bloqueio => (
              <div key={bloqueio.id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                <div>
                  <span className="font-medium">
                    {new Date(bloqueio.data).toLocaleDateString('pt-BR')}
                  </span>
                  <span className="mx-2">•</span>
                  <span>{bloqueio.horarioInicio} às {bloqueio.horarioFim}</span>
                  {bloqueio.motivo && (
                    <>
                      <span className="mx-2">•</span>
                      <span className="text-gray-600">{bloqueio.motivo}</span>
                    </>
                  )}
                </div>
                <button
                  onClick={() => removerBloqueio(bloqueio.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal Bloqueio */}
      {showBloqueio && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Bloquear Horário</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Data</label>
                <input
                  type="date"
                  value={novoBloqueio.data}
                  onChange={(e) => setNovoBloqueio({...novoBloqueio, data: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Início</label>
                  <input
                    type="time"
                    value={novoBloqueio.horarioInicio}
                    onChange={(e) => setNovoBloqueio({...novoBloqueio, horarioInicio: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fim</label>
                  <input
                    type="time"
                    value={novoBloqueio.horarioFim}
                    onChange={(e) => setNovoBloqueio({...novoBloqueio, horarioFim: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Motivo (opcional)</label>
                <input
                  type="text"
                  value={novoBloqueio.motivo}
                  onChange={(e) => setNovoBloqueio({...novoBloqueio, motivo: e.target.value})}
                  placeholder="Ex: Compromisso pessoal"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                />
              </div>
            </div>
            <div className="flex space-x-3 mt-6">
              <button
                onClick={adicionarBloqueio}
                className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700"
              >
                Bloquear
              </button>
              <button
                onClick={() => setShowBloqueio(false)}
                className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}