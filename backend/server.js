const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 8080;

// CORS permissivo
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Dados em memória
let agendamentos = [];
const barbeiros = [
  { id: 'carlos', name: 'Carlos Mendes', specialty: 'Especialista em Cortes Clássicos', experience: '10 anos', status: 'ativo' },
  { id: 'ricardo', name: 'Ricardo Oliveira', specialty: 'Mestre em Barbas', experience: '8 anos', status: 'ativo' }
];

const servicos = [
  { id: 'corte', name: 'Corte', price: 60, duration: 30, status: 'ativo' },
  { id: 'barba', name: 'Barba', price: 40, duration: 20, status: 'ativo' },
  { id: 'sobrancelha', name: 'Sobrancelha', price: 20, duration: 10, status: 'ativo' },
  { id: 'coloracao', name: 'Coloração', price: 80, duration: 45, status: 'ativo' },
  { id: 'luzes', name: 'Luzes/Reflexos', price: 120, duration: 60, status: 'ativo' },
  { id: 'relaxamento', name: 'Relaxamento', price: 100, duration: 40, status: 'ativo' }
];

// Routes
app.get('/', (req, res) => {
  res.json({ 
    message: 'API Barbearia Seu Pedro funcionando!',
    version: '1.0.0'
  });
});

app.get('/api/barbeiros', (req, res) => {
  res.json({ success: true, data: barbeiros });
});

app.get('/api/servicos', (req, res) => {
  res.json({ success: true, data: servicos });
});

app.post('/api/agendamentos', (req, res) => {
  const { name, phone, services, barber, date, time } = req.body;
  
  if (!name || !phone || !services || !barber || !date || !time) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
  }

  const agendamento = {
    id: Date.now().toString(),
    name,
    phone,
    services,
    barber,
    date,
    time,
    status: 'confirmado',
    createdAt: new Date().toISOString()
  };

  agendamentos.push(agendamento);
  
  console.log('✅ Novo agendamento:', agendamento);
  
  res.status(201).json({
    success: true,
    message: 'Agendamento criado com sucesso!',
    data: agendamento
  });
});

app.get('/api/agendamentos', (req, res) => {
  res.json({ success: true, data: agendamentos });
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});