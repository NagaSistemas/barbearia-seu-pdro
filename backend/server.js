const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Arquivo para persistir bloqueios
const BLOQUEIOS_FILE = path.join(__dirname, 'bloqueios.json');

// Carregar bloqueios do arquivo
const carregarBloqueios = () => {
  try {
    if (fs.existsSync(BLOQUEIOS_FILE)) {
      const data = fs.readFileSync(BLOQUEIOS_FILE, 'utf8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Erro ao carregar bloqueios:', error);
  }
  return [];
};

// Salvar bloqueios no arquivo
const salvarBloqueios = (bloqueios) => {
  try {
    fs.writeFileSync(BLOQUEIOS_FILE, JSON.stringify(bloqueios, null, 2));
  } catch (error) {
    console.error('Erro ao salvar bloqueios:', error);
  }
};

const app = express();
const PORT = process.env.PORT || 8080;

// Variáveis globais
let agendamentosMemoria = [];

// Middlewares
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Headers adicionais para CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Routes
app.get('/', (req, res) => {
  res.json({ 
    message: 'API Barbearia Seu Pedro funcionando!',
    version: '1.0.0',
    endpoints: {
      agendamentos: '/api/agendamentos',
      barbeiros: '/api/barbeiros',
      servicos: '/api/servicos'
    }
  });
});

// Agendamentos Routes
app.post('/api/agendamentos', async (req, res) => {
  try {
    const { name, phone, services, barber, date, time } = req.body;
    
    // Validação básica
    if (!name || !phone || !services || !barber || !date || !time) {
      return res.status(400).json({ 
        error: 'Todos os campos são obrigatórios' 
      });
    }

    // Criar agendamento
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

    // Salvar na memória
    agendamentosMemoria.push(agendamento);
    
    console.log('✅ Novo agendamento criado:', agendamento);
    console.log(`📋 Total de agendamentos: ${agendamentosMemoria.length}`);

    res.status(201).json({
      success: true,
      message: 'Agendamento criado com sucesso!',
      data: agendamento
    });

  } catch (error) {
    console.error('Erro ao criar agendamento:', error);
    res.status(500).json({ 
      error: 'Erro interno do servidor' 
    });
  }
});

// Atualizar agendamento
app.put('/api/agendamentos/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const index = agendamentosMemoria.findIndex(a => a.id === id);
    if (index === -1) {
      return res.status(404).json({ error: 'Agendamento não encontrado' });
    }
    
    agendamentosMemoria[index] = {
      ...agendamentosMemoria[index],
      status: status || agendamentosMemoria[index].status,
      updatedAt: new Date().toISOString()
    };
    
    console.log(`📝 Agendamento ${id} atualizado para: ${status}`);
    
    res.json({
      success: true,
      data: agendamentosMemoria[index]
    });

  } catch (error) {
    console.error('❌ Erro ao atualizar agendamento:', error);
    res.status(500).json({ 
      error: 'Erro interno do servidor' 
    });
  }
});

// Listar agendamentos
app.get('/api/agendamentos', (req, res) => {
  const { date, barber, status } = req.query;
  
  let agendamentosFiltrados = agendamentosMemoria;
  
  // Filtrar por data
  if (date) {
    agendamentosFiltrados = agendamentosFiltrados.filter(a => a.date === date);
  }
  
  // Filtrar por barbeiro
  if (barber) {
    agendamentosFiltrados = agendamentosFiltrados.filter(a => a.barber === barber);
  }
  
  // Filtrar por status
  if (status) {
    console.log(`🔍 Filtrando por status: ${status}`);
    console.log(`📊 Status dos agendamentos:`, agendamentosMemoria.map(a => ({ id: a.id, name: a.name, status: a.status })));
    agendamentosFiltrados = agendamentosFiltrados.filter(a => a.status === status);
  }
  
  console.log(`📋 Total de agendamentos: ${agendamentosMemoria.length}, Filtrados: ${agendamentosFiltrados.length}`);
  
  res.json({
    success: true,
    data: agendamentosFiltrados,
    total: agendamentosFiltrados.length
  });
});

// Barbeiros - Persistência
const BARBEIROS_FILE = path.join(__dirname, 'barbeiros.json');

const carregarBarbeiros = () => {
  try {
    if (fs.existsSync(BARBEIROS_FILE)) {
      const data = fs.readFileSync(BARBEIROS_FILE, 'utf8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Erro ao carregar barbeiros:', error);
  }
  return [
    {
      id: 'carlos',
      name: 'Carlos Mendes',
      specialty: 'Especialista em Cortes Clássicos',
      experience: '10 anos',
      rating: 4.9,
      status: 'ativo'
    },
    {
      id: 'ricardo', 
      name: 'Ricardo Oliveira',
      specialty: 'Mestre em Barbas',
      experience: '8 anos',
      rating: 4.8,
      status: 'ativo'
    }
  ];
};

const salvarBarbeiros = (barbeiros) => {
  try {
    fs.writeFileSync(BARBEIROS_FILE, JSON.stringify(barbeiros, null, 2));
  } catch (error) {
    console.error('Erro ao salvar barbeiros:', error);
  }
};

let barbeiros = carregarBarbeiros();
console.log(`👨‍💼 ${barbeiros.length} barbeiros carregados`);

// Listar barbeiros
app.get('/api/barbeiros', (req, res) => {
  res.json({
    success: true,
    data: barbeiros
  });
});

// Criar barbeiro
app.post('/api/barbeiros', (req, res) => {
  const { name, specialty, experience, photo } = req.body;
  
  if (!name || !specialty) {
    return res.status(400).json({ error: 'Nome e especialidade são obrigatórios' });
  }
  
  const novoBarbeiro = {
    id: Date.now().toString(),
    name: name.trim(),
    specialty: specialty.trim(),
    experience: experience || '0 anos',
    photo: photo || '',
    rating: 5.0,
    status: 'ativo'
  };
  
  barbeiros.push(novoBarbeiro);
  salvarBarbeiros(barbeiros);
  
  console.log(`✅ Barbeiro criado: ${novoBarbeiro.name}`);
  res.json({ success: true, data: novoBarbeiro });
});

// Atualizar barbeiro
app.put('/api/barbeiros/:id', (req, res) => {
  const { id } = req.params;
  const { name, specialty, experience, photo, status } = req.body;
  
  const index = barbeiros.findIndex(b => b.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Barbeiro não encontrado' });
  }
  
  barbeiros[index] = {
    ...barbeiros[index],
    name: name || barbeiros[index].name,
    specialty: specialty || barbeiros[index].specialty,
    experience: experience || barbeiros[index].experience,
    photo: photo !== undefined ? photo : barbeiros[index].photo,
    status: status || barbeiros[index].status
  };
  
  salvarBarbeiros(barbeiros);
  
  console.log(`📝 Barbeiro atualizado: ${barbeiros[index].name}`);
  res.json({ success: true, data: barbeiros[index] });
});

// Excluir barbeiro
app.delete('/api/barbeiros/:id', (req, res) => {
  const { id } = req.params;
  
  const barbeiroRemovido = barbeiros.find(b => b.id === id);
  if (!barbeiroRemovido) {
    return res.status(404).json({ error: 'Barbeiro não encontrado' });
  }
  
  barbeiros = barbeiros.filter(b => b.id !== id);
  salvarBarbeiros(barbeiros);
  
  console.log(`🗑️ Barbeiro removido: ${barbeiroRemovido.name}`);
  res.json({ success: true, message: 'Barbeiro removido' });
});

// Serviços disponíveis
app.get('/api/servicos', (req, res) => {
  res.json({
    success: true,
    data: [
      { id: 'corte', name: 'Corte', price: 60, duration: 30 },
      { id: 'barba', name: 'Barba', price: 40, duration: 20 },
      { id: 'sobrancelha', name: 'Sobrancelha', price: 20, duration: 10 },
      { id: 'coloracao', name: 'Coloração', price: 80, duration: 45 },
      { id: 'luzes', name: 'Luzes/Reflexos', price: 120, duration: 60 },
      { id: 'relaxamento', name: 'Relaxamento', price: 100, duration: 40 }
    ]
  });
});

// Funcionamento - Persistência
const FUNCIONAMENTO_FILE = path.join(__dirname, 'funcionamento.json');

const carregarFuncionamento = () => {
  try {
    if (fs.existsSync(FUNCIONAMENTO_FILE)) {
      const data = fs.readFileSync(FUNCIONAMENTO_FILE, 'utf8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Erro ao carregar funcionamento:', error);
  }
  return [];
};

const salvarFuncionamento = (funcionamento) => {
  try {
    fs.writeFileSync(FUNCIONAMENTO_FILE, JSON.stringify(funcionamento, null, 2));
  } catch (error) {
    console.error('Erro ao salvar funcionamento:', error);
  }
};

// Agenda e Bloqueios
let bloqueiosHorarios = carregarBloqueios();
let diasFuncionamento = carregarFuncionamento();
agendamentosMemoria = []; // Limpar para testes
console.log(`📅 ${bloqueiosHorarios.length} bloqueios carregados do arquivo`);
console.log(`📋 ${agendamentosMemoria.length} agendamentos em memória (limpo para testes)`);
console.log(`🏢 ${diasFuncionamento.length} dias especiais de funcionamento`);
let horariosConfig = {
  carlos: {
    segunda: { ativo: true, inicio: '07:00', fim: '18:00' },
    terca: { ativo: true, inicio: '07:00', fim: '18:00' },
    quarta: { ativo: true, inicio: '07:00', fim: '18:00' },
    quinta: { ativo: true, inicio: '07:00', fim: '18:00' },
    sexta: { ativo: true, inicio: '07:00', fim: '18:00' },
    sabado: { ativo: true, inicio: '07:00', fim: '18:00' },
    domingo: { ativo: false, inicio: '07:00', fim: '18:00' }
  },
  ricardo: {
    segunda: { ativo: true, inicio: '07:00', fim: '18:00' },
    terca: { ativo: true, inicio: '07:00', fim: '18:00' },
    quarta: { ativo: true, inicio: '07:00', fim: '18:00' },
    quinta: { ativo: true, inicio: '07:00', fim: '18:00' },
    sexta: { ativo: true, inicio: '07:00', fim: '18:00' },
    sabado: { ativo: true, inicio: '07:00', fim: '18:00' },
    domingo: { ativo: false, inicio: '07:00', fim: '18:00' }
  }
};

// Buscar horários disponíveis
app.get('/api/horarios-disponiveis', (req, res) => {
  const { barber, date } = req.query;
  
  if (!barber || !date) {
    return res.status(400).json({ error: 'Barbeiro e data são obrigatórios' });
  }
  
  // Verificar se é um dia especial configurado
  const diaEspecial = diasFuncionamento.find(d => d.data === date);
  
  if (diaEspecial) {
    // Se é dia especial e está fechado
    if (!diaEspecial.aberto) {
      console.log(`🏢 Barbearia fechada em ${date}: ${diaEspecial.motivo || 'Dia especial'}`);
      return res.json({ success: true, data: [] });
    }
    // Se é dia especial e está aberto, continua com horário normal
  }
  
  const dataObj = new Date(date + 'T00:00:00');
  const diaSemana = ['domingo', 'segunda', 'terca', 'quarta', 'quinta', 'sexta', 'sabado'][dataObj.getDay()];
  
  const config = horariosConfig[barber]?.[diaSemana];
  if (!config || !config.ativo) {
    // Se não é dia especial aberto, segue configuração padrão
    if (!diaEspecial?.aberto) {
      return res.json({ success: true, data: [] });
    }
  }
  
  const horarios = [];
  const inicio = new Date(`2024-01-01T${config.inicio}:00`);
  const fim = new Date(`2024-01-01T${config.fim}:00`);
  
  while (inicio <= fim) {
    const horarioStr = inicio.toTimeString().slice(0, 5);
    
    // Verificar bloqueios (horário exato)
    const isBloqueado = bloqueiosHorarios.some(b => {
      const match = b.barber === barber && 
                   b.data === date && 
                   b.horarioInicio === horarioStr &&
                   b.horarioFim === horarioStr;
      
      if (match) {
        console.log(`❌ Horário ${horarioStr} bloqueado para ${barber} em ${date}`);
      }
      return match;
    });
    
    // Verificar agendamentos existentes (apenas confirmados)
    const isAgendado = agendamentosMemoria.some(a => {
      const match = a.barber === barber && 
                   a.date === date && 
                   a.time === horarioStr &&
                   a.status === 'confirmado'; // Apenas agendamentos confirmados bloqueiam
      
      if (match) {
        console.log(`📅 Horário ${horarioStr} já agendado para ${barber} em ${date}`);
      }
      return match;
    });
    
    // Verificar se é hoje e se o horário já passou (com 30min de antecedência)
    const isHoje = date === new Date().toISOString().split('T')[0];
    let isHorarioPassado = false;
    
    if (isHoje) {
      const agora = new Date();
      const horarioAgendamento = new Date();
      const [hora, minuto] = horarioStr.split(':');
      horarioAgendamento.setHours(parseInt(hora), parseInt(minuto), 0, 0);
      
      // Adicionar 30 minutos de antecedência
      const horarioLimite = new Date(horarioAgendamento.getTime() - 30 * 60 * 1000);
      
      isHorarioPassado = agora > horarioLimite;
      
      if (isHorarioPassado) {
        console.log(`⏰ Horário ${horarioStr} já passou (limite: ${horarioLimite.toTimeString().slice(0, 5)})`);
      }
    }
    
    if (!isBloqueado && !isAgendado && !isHorarioPassado) {
      horarios.push(horarioStr);
    }
    
    inicio.setHours(inicio.getHours() + 1);
  }
  
  console.log(`🔍 Horários disponíveis para ${barber} em ${date}:`, horarios);
  console.log(`📅 Total de bloqueios ativos:`, bloqueiosHorarios.length);
  console.log(`📋 Total de agendamentos confirmados:`, agendamentosMemoria.filter(a => a.status === 'confirmado').length);
  
  res.json({ success: true, data: horarios });
});

// Criar bloqueio
app.post('/api/bloqueios', (req, res) => {
  const { barber, data, horarioInicio, horarioFim, motivo } = req.body;
  
  if (!barber || !data || !horarioInicio || !horarioFim) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
  }
  
  const bloqueio = {
    id: Date.now().toString(),
    barber,
    data,
    horarioInicio,
    horarioFim,
    motivo: motivo || '',
    createdAt: new Date().toISOString()
  };
  
  bloqueiosHorarios.push(bloqueio);
  salvarBloqueios(bloqueiosHorarios);
  
  console.log(`✅ Bloqueio criado: ${bloqueio.barber} - ${bloqueio.data} ${bloqueio.horarioInicio}`);
  res.json({ success: true, data: bloqueio });
});

// Listar bloqueios
app.get('/api/bloqueios', (req, res) => {
  const { barber } = req.query;
  
  let bloqueios = bloqueiosHorarios;
  if (barber) {
    bloqueios = bloqueios.filter(b => b.barber === barber);
  }
  
  res.json({ success: true, data: bloqueios });
});

// Remover bloqueio
app.delete('/api/bloqueios/:id', (req, res) => {
  const { id } = req.params;
  
  const bloqueioRemovido = bloqueiosHorarios.find(b => b.id === id);
  bloqueiosHorarios = bloqueiosHorarios.filter(b => b.id !== id);
  salvarBloqueios(bloqueiosHorarios);
  
  if (bloqueioRemovido) {
    console.log(`❌ Bloqueio removido: ${bloqueioRemovido.barber} - ${bloqueioRemovido.data} ${bloqueioRemovido.horarioInicio}`);
  }
  res.json({ success: true, message: 'Bloqueio removido' });
});

// Funcionamento Routes

// Listar dias especiais
app.get('/api/funcionamento', (req, res) => {
  res.json({
    success: true,
    data: diasFuncionamento
  });
});

// Criar/Atualizar dia especial
app.post('/api/funcionamento', (req, res) => {
  const { data, aberto, motivo } = req.body;
  
  if (!data) {
    return res.status(400).json({ error: 'Data é obrigatória' });
  }
  
  // Remover configuração existente para a mesma data
  diasFuncionamento = diasFuncionamento.filter(d => d.data !== data);
  
  // Adicionar nova configuração
  const novaConfig = {
    data,
    aberto: aberto !== false, // Default true
    motivo: motivo || undefined
  };
  
  diasFuncionamento.push(novaConfig);
  salvarFuncionamento(diasFuncionamento);
  
  console.log(`🏢 Funcionamento configurado: ${data} - ${aberto ? 'Aberto' : 'Fechado'}`);
  res.json({ success: true, data: novaConfig });
});

// Remover dia especial
app.delete('/api/funcionamento/:data', (req, res) => {
  const { data } = req.params;
  
  const configRemovida = diasFuncionamento.find(d => d.data === data);
  diasFuncionamento = diasFuncionamento.filter(d => d.data !== data);
  salvarFuncionamento(diasFuncionamento);
  
  if (configRemovida) {
    console.log(`🗑️ Configuração removida: ${data}`);
  }
  res.json({ success: true, message: 'Configuração removida' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`📍 API disponível em: http://localhost:${PORT}`);
});