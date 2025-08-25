// Configuração da API
export const API_BASE_URL = 'https://barbearia-seu-pdro.vercel.app'

// Helper para fazer requests
export const apiRequest = async (endpoint: string, options?: RequestInit) => {
  const url = `${API_BASE_URL}${endpoint}`
  return fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  })
}