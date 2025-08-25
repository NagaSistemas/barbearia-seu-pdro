const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

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

let agendamentos = [];

app.get('/', (req, res) => {
  res.json({ message: 'API funcionando!' });
});

app.get('/api/barbeiros', (req, res) => {
  res.json({ success: true, data: barbeiros });
});

app.get('/api/servicos', (req, res) => {
  res.json({ success: true, data: servicos });
});

app.post('/api/agendamentos', (req, res) => {
  const agendamento = {
    id: Date.now().toString(),
    ...req.body,
    status: 'confirmado',
    createdAt: new Date().toISOString()
  };
  
  agendamentos.push(agendamento);
  res.json({ success: true, data: agendamento });
});

app.get('/api/agendamentos', (req, res) => {
  res.json({ success: true, data: agendamentos });
});

module.exports = app;