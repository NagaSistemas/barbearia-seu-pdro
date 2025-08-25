import React, { useState, useEffect } from 'react'
import { User, Edit, Trash2, Plus, X, Save } from 'lucide-react'

interface Barbeiro {
  id: string
  name: string
  specialty: string
  experience: string
  rating: number
  status: 'ativo' | 'inativo'
}

export default function Barbeiros() {
  const [barbeiros, setBarbeiros] = useState<Barbeiro[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingBarbeiro, setEditingBarbeiro] = useState<Barbeiro | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    specialty: '',
    experience: '',
    photo: ''
  })
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string>('')

  useEffect(() => {
    fetchBarbeiros()
  }, [])

  const fetchBarbeiros = async () => {
    try {
      setLoading(true)
      const response = await fetch('http://localhost:3001/api/barbeiros')
      const data = await response.json()
      
      if (data.success) {
        setBarbeiros(data.data)
      }
    } catch (error) {
      console.error('Erro ao buscar barbeiros:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const url = editingBarbeiro 
        ? `http://localhost:3001/api/barbeiros/${editingBarbeiro.id}`
        : 'http://localhost:3001/api/barbeiros'
      
      const method = editingBarbeiro ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const data = await response.json()
      
      if (data.success) {
        await fetchBarbeiros()
        closeModal()
        alert(editingBarbeiro ? 'Barbeiro atualizado!' : 'Barbeiro criado!')
      } else {
        alert('Erro: ' + data.error)
      }
    } catch (error) {
      console.error('Erro ao salvar barbeiro:', error)
      alert('Erro de conexão')
    }
  }

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Tem certeza que deseja excluir ${name}?`)) return
    
    try {
      const response = await fetch(`http://localhost:3001/api/barbeiros/${id}`, {
        method: 'DELETE'
      })

      const data = await response.json()
      
      if (data.success) {
        await fetchBarbeiros()
        alert('Barbeiro excluído!')
      } else {
        alert('Erro ao excluir barbeiro')
      }
    } catch (error) {
      console.error('Erro ao excluir barbeiro:', error)
      alert('Erro de conexão')
    }
  }

  const openModal = (barbeiro?: Barbeiro) => {
    if (barbeiro) {
      setEditingBarbeiro(barbeiro)
      setFormData({
        name: barbeiro.name,
        specialty: barbeiro.specialty,
        experience: barbeiro.experience,
        photo: barbeiro.photo || ''
      })
      setPhotoPreview(barbeiro.photo || '')
      setPhotoFile(null)
    } else {
      setEditingBarbeiro(null)
      setFormData({
        name: '',
        specialty: '',
        experience: '',
        photo: ''
      })
      setPhotoPreview('')
      setPhotoFile(null)
    }
    setShowModal(true)
  }

  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')!
      const img = new Image()
      
      img.onload = () => {
        // Redimensionar para máximo 300x300
        const maxSize = 300
        let { width, height } = img
        
        if (width > height) {
          if (width > maxSize) {
            height = (height * maxSize) / width
            width = maxSize
          }
        } else {
          if (height > maxSize) {
            width = (width * maxSize) / height
            height = maxSize
          }
        }
        
        canvas.width = width
        canvas.height = height
        
        ctx.drawImage(img, 0, 0, width, height)
        
        // Comprimir para JPEG com qualidade 0.7
        const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.7)
        resolve(compressedDataUrl)
      }
      
      img.src = URL.createObjectURL(file)
    })
  }

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Verificar tamanho do arquivo (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Arquivo muito grande! Máximo 5MB.')
        return
      }
      
      setPhotoFile(file)
      
      try {
        const compressedImage = await compressImage(file)
        setPhotoPreview(compressedImage)
        setFormData({...formData, photo: compressedImage})
      } catch (error) {
        console.error('Erro ao comprimir imagem:', error)
        alert('Erro ao processar imagem')
      }
    }
  }

  const removePhoto = () => {
    setPhotoPreview('')
    setFormData({...formData, photo: ''})
    setPhotoFile(null)
    // Limpar o input file
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement
    if (fileInput) fileInput.value = ''
  }

  const closeModal = () => {
    setShowModal(false)
    setEditingBarbeiro(null)
    setFormData({
      name: '',
      specialty: '',
      experience: '',
      photo: ''
    })
    setPhotoPreview('')
    setPhotoFile(null)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
        <span className="ml-2 text-gray-600">Carregando barbeiros...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Barbeiros ({barbeiros.length})</h2>
        <button 
          onClick={() => openModal()}
          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          Adicionar Barbeiro
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {barbeiros.map((barbeiro) => (
          <div key={barbeiro.id} className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                {barbeiro.photo ? (
                  <img 
                    src={barbeiro.photo} 
                    alt={barbeiro.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-8 h-8 text-gray-600" />
                )}
              </div>
              <span className={`px-3 py-1 text-xs rounded-full font-medium ${
                barbeiro.status === 'ativo' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {barbeiro.status}
              </span>
            </div>
            
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {barbeiro.name}
            </h3>
            <p className="text-sm text-red-600 font-medium mb-2">{barbeiro.specialty}</p>
            <p className="text-sm text-gray-500 mb-4">{barbeiro.experience}</p>
            

            
            <div className="flex space-x-2">
              <button 
                onClick={() => openModal(barbeiro)}
                className="flex-1 bg-blue-600 text-white py-2 px-3 rounded text-sm hover:bg-blue-700 flex items-center justify-center"
              >
                <Edit className="w-4 h-4 mr-1" />
                Editar
              </button>
              <button 
                onClick={() => handleDelete(barbeiro.id, barbeiro.name)}
                className="bg-red-600 text-white py-2 px-3 rounded text-sm hover:bg-red-700"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {barbeiros.length === 0 && (
        <div className="text-center py-12">
          <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Nenhum barbeiro cadastrado</p>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">
                {editingBarbeiro ? 'Editar Barbeiro' : 'Novo Barbeiro'}
              </h3>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Foto</label>
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                    {photoPreview ? (
                      <img 
                        src={photoPreview} 
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-8 h-8 text-gray-600" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex space-x-2">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoChange}
                        className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500"
                      />
                      {photoPreview && (
                        <button
                          type="button"
                          onClick={removePhoto}
                          className="bg-gray-500 text-white px-3 py-2 rounded-lg hover:bg-gray-600 text-sm"
                          title="Remover foto"
                        >
                          ×
                        </button>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Máximo 5MB. Será redimensionada para 300x300px.
                    </p>
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500"
                  placeholder="Nome do barbeiro"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Especialidade</label>
                <input
                  type="text"
                  value={formData.specialty}
                  onChange={(e) => setFormData({...formData, specialty: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500"
                  placeholder="Ex: Especialista em Cortes Clássicos"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Experiência</label>
                <input
                  type="text"
                  value={formData.experience}
                  onChange={(e) => setFormData({...formData, experience: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500"
                  placeholder="Ex: 5 anos"
                />
              </div>
              

              
              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 flex items-center justify-center"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {editingBarbeiro ? 'Atualizar' : 'Criar'}
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}