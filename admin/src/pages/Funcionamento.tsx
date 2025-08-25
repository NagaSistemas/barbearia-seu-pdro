import React, { useState, useEffect } from 'react'
import { Calendar, Clock, Save, RotateCcw, AlertCircle } from 'lucide-react'

interface DiaFuncionamento {
  data: string
  aberto: boolean
  motivo?: string
}

export default function Funcionamento() {
  const [diasEspeciais, setDiasEspeciais] = useState<DiaFuncionamento[]>([])
  const [novaData, setNovaData] = useState('')
  const [novoStatus, setNovoStatus] = useState(true)
  const [novoMotivo, setNovoMotivo] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDiasFuncionamento()
  }, [])

  const fetchDiasFuncionamento = async () => {
    try {
      setLoading(true)
      const response = await fetch('http://localhost:3001/api/funcionamento')
      const data = await response.json()
      
      if (data.success) {
        setDiasEspeciais(data.data)
      }
    } catch (error) {
      console.error('Erro ao buscar dias de funcionamento:', error)
    } finally {
      setLoading(false)
    }
  }

  const salvarDiaEspecial = async () => {
    if (!novaData) {
      alert('Selecione uma data')
      return
    }

    try {
      const response = await fetch('http://localhost:3001/api/funcionamento', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          data: novaData,
          aberto: novoStatus,
          motivo: novoMotivo || undefined
        })
      })

      const data = await response.json()
      
      if (data.success) {
        await fetchDiasFuncionamento()
        setNovaData('')
        setNovoStatus(true)
        setNovoMotivo('')
        alert('Dia especial configurado!')
      } else {
        alert('Erro: ' + data.error)
      }
    } catch (error) {
      console.error('Erro ao salvar:', error)
      alert('Erro de conexão')
    }
  }

  const removerDiaEspecial = async (data: string) => {
    if (!confirm('Remover configuração especial para este dia?')) return

    try {
      const response = await fetch(`http://localhost:3001/api/funcionamento/${data}`, {
        method: 'DELETE'
      })

      const result = await response.json()
      
      if (result.success) {
        await fetchDiasFuncionamento()
        alert('Configuração removida!')
      } else {
        alert('Erro ao remover')
      }
    } catch (error) {
      console.error('Erro ao remover:', error)
      alert('Erro de conexão')
    }
  }

  const getStatusColor = (aberto: boolean) => {
    return aberto ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
  }

  const getStatusIcon = (aberto: boolean) => {
    return aberto ? '🟢' : '🔴'
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
        <span className="ml-2 text-gray-600">Carregando...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Funcionamento</h2>
        <p className="text-gray-600">Gerencie dias especiais de abertura e fechamento</p>
      </div>

      {/* Formulário para Novo Dia Especial */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <Calendar className="w-5 h-5 mr-2 text-red-600" />
          Configurar Dia Especial
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Data</label>
            <input
              type="date"
              value={novaData}
              onChange={(e) => setNovaData(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              value={novoStatus ? 'aberto' : 'fechado'}
              onChange={(e) => setNovoStatus(e.target.value === 'aberto')}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500"
            >
              <option value="aberto">🟢 Aberto</option>
              <option value="fechado">🔴 Fechado</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Motivo (opcional)</label>
            <input
              type="text"
              value={novoMotivo}
              onChange={(e) => setNovoMotivo(e.target.value)}
              placeholder="Ex: Feriado, Evento..."
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500"
            />
          </div>
          
          <div className="flex items-end">
            <button
              onClick={salvarDiaEspecial}
              className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center"
            >
              <Save className="w-4 h-4 mr-2" />
              Salvar
            </button>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start">
            <AlertCircle className="w-5 h-5 text-blue-500 mr-2 mt-0.5" />
            <div className="text-sm text-blue-700">
              <p className="font-medium mb-1">Como funciona:</p>
              <ul className="list-disc list-inside space-y-1">
                <li><strong>Fechado:</strong> Nenhum horário ficará disponível para agendamento</li>
                <li><strong>Aberto:</strong> Funcionamento normal (sobrescreve configuração padrão)</li>
                <li><strong>Sem configuração:</strong> Segue horário padrão da semana</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Lista de Dias Especiais */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b">
          <h3 className="text-lg font-semibold text-gray-800">
            Dias Especiais Configurados ({diasEspeciais.length})
          </h3>
        </div>
        
        <div className="overflow-x-auto">
          {diasEspeciais.length === 0 ? (
            <div className="p-8 text-center">
              <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Nenhum dia especial configurado</p>
              <p className="text-sm text-gray-500 mt-1">
                A barbearia seguirá o horário padrão da semana
              </p>
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Data
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Motivo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {diasEspeciais
                  .sort((a, b) => a.data.localeCompare(b.data))
                  .map((dia) => (
                    <tr key={dia.data} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {new Date(dia.data + 'T12:00:00').toLocaleDateString('pt-BR')}
                            </div>
                            <div className="text-xs text-gray-500">
                              {new Date(dia.data + 'T12:00:00').toLocaleDateString('pt-BR', { weekday: 'long' })}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(dia.aberto)}`}>
                          {getStatusIcon(dia.aberto)} {dia.aberto ? 'Aberto' : 'Fechado'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-900">
                          {dia.motivo || '-'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => removerDiaEspecial(dia.data)}
                          className="text-red-600 hover:text-red-900 text-sm font-medium"
                        >
                          Remover
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}