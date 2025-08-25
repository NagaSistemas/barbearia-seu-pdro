import React, { useState, useEffect } from 'react';
import { User, Phone, Scissors, Calendar, Clock, CheckCircle, ArrowRight } from 'lucide-react';
import { apiRequest } from '../config/api';

interface Barbeiro {
  id: string
  name: string
  specialty: string
  experience: string
  photo?: string
  status: string
}

export function BookingFormSimple() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    services: [] as string[],
    barber: 'carlos'
  });
  
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  const [barbeiros, setBarbeiros] = useState<Barbeiro[]>([]);

  const servicesPrices = {
    corte: { name: 'Corte', price: 60 },
    barba: { name: 'Barba', price: 40 },
    sobrancelha: { name: 'Sobrancelha', price: 20 },
    coloracao: { name: 'Coloração', price: 80 },
    luzes: { name: 'Luzes/Reflexos', price: 120 },
    relaxamento: { name: 'Relaxamento', price: 100 }
  };

  const calculateTotal = () => {
    return formData.services.reduce((total, serviceId) => {
      return total + (servicesPrices[serviceId as keyof typeof servicesPrices]?.price || 0);
    }, 0);
  };

  // Buscar barbeiros ao carregar
  useEffect(() => {
    fetchBarbeiros();
  }, []);

  // Buscar horários disponíveis do backend
  useEffect(() => {
    if (selectedDate && formData.barber) {
      fetchHorariosDisponiveis();
    } else {
      setAvailableTimes([]);
      setSelectedTime('');
    }
  }, [selectedDate, formData.barber]);

  // Atualizar horários a cada 5 segundos para refletir mudanças do admin
  useEffect(() => {
    if (selectedDate && formData.barber) {
      const interval = setInterval(() => {
        fetchHorariosDisponiveis();
      }, 5000);
      
      return () => clearInterval(interval);
    }
  }, [selectedDate, formData.barber]);

  const fetchBarbeiros = async () => {
    try {
      const response = await apiRequest('/api/barbeiros');
      const data = await response.json();
      
      if (data.success) {
        const barbeirosAtivos = data.data.filter((b: Barbeiro) => b.status === 'ativo');
        setBarbeiros(barbeirosAtivos);
        
        // Se o barbeiro selecionado não existe mais, selecionar o primeiro
        if (barbeirosAtivos.length > 0 && !barbeirosAtivos.find((b: Barbeiro) => b.id === formData.barber)) {
          setFormData(prev => ({ ...prev, barber: barbeirosAtivos[0].id }));
        }
      }
    } catch (error) {
      console.error('Erro ao buscar barbeiros:', error);
      // Fallback para barbeiros padrão
      setBarbeiros([
        { id: 'carlos', name: 'Carlos Mendes', specialty: 'Especialista em Cortes Clássicos', experience: '10 anos', status: 'ativo' },
        { id: 'ricardo', name: 'Ricardo Oliveira', specialty: 'Mestre em Barbas', experience: '8 anos', status: 'ativo' }
      ]);
    }
  };

  const fetchHorariosDisponiveis = async () => {
    try {
      const dateStr = selectedDate!.toISOString().split('T')[0];
      const url = `/api/horarios-disponiveis?barber=${formData.barber}&date=${dateStr}`;
      console.log('🔍 Buscando horários:', url);
      
      const response = await apiRequest(url);
      const data = await response.json();
      
      console.log('📅 Resposta da API:', data);
      
      if (data.success) {
        setAvailableTimes(data.data);
        setSelectedTime('');
        console.log('✅ Horários atualizados:', data.data);
      } else {
        setAvailableTimes([]);
        setSelectedTime('');
        console.log('❌ Nenhum horário disponível');
      }
    } catch (error) {
      console.error('❌ Erro ao buscar horários:', error);
      // Fallback para horários padrão
      const day = selectedDate!.getDay();
      if (day === 0) {
        setAvailableTimes([]);
      } else {
        const times = [
          '07:00', '08:00', '09:00', '10:00', '11:00', '12:00',
          '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'
        ];
        setAvailableTimes(times);
        console.log('🔄 Usando fallback:', times);
      }
      setSelectedTime('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.services.length === 0) {
      alert('Por favor, selecione pelo menos um serviço.');
      return;
    }
    if (!selectedDate || !selectedTime) {
      alert('Por favor, selecione uma data e horário.');
      return;
    }
    
    try {
      const agendamentoData = {
        name: formData.name,
        phone: formData.phone,
        services: formData.services,
        barber: formData.barber,
        date: selectedDate.toISOString().split('T')[0],
        time: selectedTime
      };

      const response = await apiRequest('/api/agendamentos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(agendamentoData)
      });

      const result = await response.json();

      if (response.ok) {
        const total = calculateTotal();
        const servicesNames = formData.services.map(id => servicesPrices[id as keyof typeof servicesPrices]?.name).join(', ');
        const dateStr = selectedDate.toLocaleDateString('pt-BR');
        
        const barbeiroSelecionado = barbeiros.find(b => b.id === formData.barber);
        const barbeiroNome = barbeiroSelecionado ? barbeiroSelecionado.name : 'Barbeiro';
        
        alert(`✅ Agendamento confirmado com sucesso!\n\nCliente: ${formData.name}\nTelefone: ${formData.phone}\nBarbeiro: ${barbeiroNome}\nData: ${dateStr}\nHorário: ${selectedTime}\nServiços: ${servicesNames}\nTotal: R$ ${total},00\n\n📱 Em breve você receberá uma confirmação por WhatsApp!`);
        
        // Limpar formulário
        setFormData({
          name: '',
          phone: '',
          services: [],
          barber: 'carlos'
        });
        setSelectedDate(null);
        setSelectedTime('');
      } else {
        alert(`Erro ao agendar: ${result.error}`);
      }
    } catch (error) {
      console.error('Erro ao enviar agendamento:', error);
      alert('Erro de conexão. Verifique se o servidor está rodando.');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (e.target.name === 'phone') {
      handlePhoneChange(e as React.ChangeEvent<HTMLInputElement>);
    } else {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value
      });
    }
  };

  const handleServiceToggle = (serviceId: string) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.includes(serviceId)
        ? prev.services.filter(id => id !== serviceId)
        : [...prev.services, serviceId]
    }));
  };

  const validateBrazilianPhone = (phone: string) => {
    const numbers = phone.replace(/\D/g, '');
    
    // Deve ter 11 dígitos (DDD + número)
    if (numbers.length !== 11) return false;
    
    // DDD válido (11-99)
    const ddd = parseInt(numbers.slice(0, 2));
    const validDDDs = [
      11, 12, 13, 14, 15, 16, 17, 18, 19, // SP
      21, 22, 24, // RJ/ES
      27, 28, // ES
      31, 32, 33, 34, 35, 37, 38, // MG
      41, 42, 43, 44, 45, 46, // PR
      47, 48, 49, // SC
      51, 53, 54, 55, // RS
      61, // DF
      62, 64, // GO
      63, // TO
      65, 66, // MT
      67, // MS
      68, // AC
      69, // RO
      71, 73, 74, 75, 77, // BA
      79, // SE
      81, 87, // PE
      82, // AL
      83, // PB
      84, // RN
      85, 88, // CE
      86, 89, // PI
      91, 93, 94, // PA
      92, 97, // AM
      95, // RR
      96, // AP
      98, 99 // MA
    ];
    
    if (!validDDDs.includes(ddd)) return false;
    
    // Primeiro dígito do número deve ser 9 (celular) ou 2-5 (fixo)
    const firstDigit = parseInt(numbers.charAt(2));
    if (![2, 3, 4, 5, 9].includes(firstDigit)) return false;
    
    // Se for celular (9), deve ter 9 dígitos no total
    if (firstDigit === 9 && numbers.length !== 11) return false;
    
    return true;
  };

  const formatPhone = (value: string) => {
    // Remove tudo que não é número
    const numbers = value.replace(/\D/g, '');
    
    // Limita a 11 dígitos
    const limitedNumbers = numbers.slice(0, 11);
    
    // Aplica a máscara (11) 99999-9999
    if (limitedNumbers.length <= 2) {
      return limitedNumbers ? `(${limitedNumbers}` : '';
    } else if (limitedNumbers.length <= 7) {
      return `(${limitedNumbers.slice(0, 2)}) ${limitedNumbers.slice(2)}`;
    } else {
      return `(${limitedNumbers.slice(0, 2)}) ${limitedNumbers.slice(2, 7)}-${limitedNumbers.slice(7)}`;
    }
  };

  const [phoneError, setPhoneError] = useState('');

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhone(e.target.value);
    setFormData({
      ...formData,
      phone: formatted
    });
    
    // Validar apenas se o campo estiver completo
    if (formatted.length === 15) { // (11) 99999-9999 = 15 caracteres
      if (validateBrazilianPhone(formatted)) {
        setPhoneError('');
      } else {
        setPhoneError('Número de telefone inválido');
      }
    } else if (formatted.length > 0) {
      setPhoneError('Digite o número completo');
    } else {
      setPhoneError('');
    }
  };

  return (
    <section id="booking" className="py-20 bg-barber-navy text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{backgroundImage: 'radial-gradient(circle at 25% 25%, #B91128 0%, transparent 50%), radial-gradient(circle at 75% 75%, #B91128 0%, transparent 50%)'}}></div>
      </div>
      
      <div className="container mx-auto px-6 relative">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-barber-red to-red-600 bg-clip-text text-transparent leading-normal pb-2">
            Agende Seu Horário
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Reserve seu momento de transformação com nossos profissionais especializados
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Step 1: Dados Pessoais */}
            <div className="bg-barber-gray/20 backdrop-blur-sm rounded-2xl p-8 border border-barber-gray/50 shadow-2xl">
              <div className="flex items-center mb-6">
                <div className="bg-barber-red rounded-full p-3 mr-4">
                  <User className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-semibold">Seus Dados</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="relative">
                  <label className="block mb-3 text-sm font-medium text-gray-300">Nome Completo</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="bg-barber-navy/50 border border-barber-gray text-white rounded-xl w-full pl-12 pr-4 py-4 focus:ring-2 focus:ring-barber-red focus:border-transparent transition-all duration-200"
                      placeholder="Digite seu nome completo"
                      required
                    />
                  </div>
                </div>
                <div className="relative">
                  <label className="block mb-3 text-sm font-medium text-gray-300">WhatsApp</label>
                  <div className="relative">
                    <Phone className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                      phoneError ? 'text-red-400' : 'text-gray-400'
                    }`} />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      maxLength={15}
                      className={`bg-barber-navy/50 border text-white rounded-xl w-full pl-12 pr-4 py-4 focus:ring-2 focus:border-transparent transition-all duration-200 ${
                        phoneError 
                          ? 'border-red-500 focus:ring-red-500' 
                          : formData.phone.length === 15 && !phoneError
                          ? 'border-green-500 focus:ring-green-500'
                          : 'border-barber-gray focus:ring-barber-red'
                      }`}
                      placeholder="(11) 99999-9999"
                      required
                    />
                    {phoneError && (
                      <p className="text-red-400 text-xs mt-1 ml-1">{phoneError}</p>
                    )}
                    {formData.phone.length === 15 && !phoneError && (
                      <p className="text-green-400 text-xs mt-1 ml-1">✓ Número válido</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Step 2: Serviços */}
            <div className="bg-barber-gray/20 backdrop-blur-sm rounded-2xl p-8 border border-barber-gray/50 shadow-2xl">
              <div className="flex items-center mb-6">
                <div className="bg-barber-red rounded-full p-3 mr-4">
                  <Scissors className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-semibold">Escolha os Serviços</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {Object.entries(servicesPrices).map(([id, service]) => (
                  <label key={id} className={`relative flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 hover:scale-105 ${
                    formData.services.includes(id) 
                      ? 'border-barber-red bg-barber-red/10 shadow-lg shadow-barber-red/20' 
                      : 'border-barber-gray hover:border-gray-500 bg-barber-navy/30'
                  }`}>
                    <input
                      type="checkbox"
                      checked={formData.services.includes(id)}
                      onChange={() => handleServiceToggle(id)}
                      className="sr-only"
                    />
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center">
                        <div className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${
                          formData.services.includes(id) ? 'border-barber-red bg-barber-red' : 'border-gray-400'
                        }`}>
                          {formData.services.includes(id) && <CheckCircle className="w-3 h-3 text-white" />}
                        </div>
                        <span className="font-medium">{service.name}</span>
                      </div>
                      <span className="text-barber-red font-bold text-lg">R$ {service.price}</span>
                    </div>
                  </label>
                ))}
              </div>
              
              {formData.services.length > 0 && (
                <div className="bg-gradient-to-r from-barber-red/20 to-red-600/20 border border-barber-red/50 rounded-xl p-6">
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-semibold">Total do Agendamento:</span>
                    <span className="text-3xl font-bold text-barber-red">R$ {calculateTotal()},00</span>
                  </div>
                </div>
              )}
            </div>
            
            {/* Step 3: Barbeiro e Agendamento */}
            <div className="bg-barber-gray/20 backdrop-blur-sm rounded-2xl p-8 border border-barber-gray/50 shadow-2xl">
              <div className="flex items-center mb-6">
                <div className="bg-barber-red rounded-full p-3 mr-4">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-semibold">Data e Horário</h3>
              </div>
              
              <div className="mb-6">
                <label className="block mb-4 text-lg font-semibold text-gray-200 flex items-center">
                  <User className="w-5 h-5 mr-2 text-barber-red" />
                  Escolha seu Barbeiro
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {barbeiros.map((barbeiro) => (
                    <div 
                      key={barbeiro.id}
                      onClick={() => setFormData({...formData, barber: barbeiro.id})}
                      className={`cursor-pointer p-6 rounded-2xl border-2 transition-all duration-200 hover:scale-105 ${
                        formData.barber === barbeiro.id
                          ? 'border-barber-red bg-barber-red/10 shadow-lg shadow-barber-red/20'
                          : 'border-barber-gray hover:border-gray-500 bg-barber-navy/30'
                      }`}
                    >
                      <div className="flex items-center mb-4">
                        <div className="w-16 h-16 bg-barber-gray rounded-full flex items-center justify-center mr-4 overflow-hidden">
                          {barbeiro.photo ? (
                            <img 
                              src={barbeiro.photo} 
                              alt={barbeiro.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <User className="w-8 h-8 text-barber-red" />
                          )}
                        </div>
                        <div>
                          <h4 className="text-xl font-bold text-white">{barbeiro.name}</h4>
                          <p className="text-barber-red text-sm">{barbeiro.specialty}</p>
                        </div>
                      </div>
                      <p className="text-gray-300 text-sm">
                        {barbeiro.experience} de experiência
                      </p>
                      {formData.barber === barbeiro.id && (
                        <div className="mt-4 flex items-center text-barber-red">
                          <CheckCircle className="w-5 h-5 mr-2" />
                          <span className="font-medium">Selecionado</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Data */}
                <div>
                  <label className="block mb-4 text-lg font-semibold text-gray-200 flex items-center">
                    <Calendar className="w-5 h-5 mr-2 text-barber-red" />
                    Escolha a Data
                  </label>
                  <div className="bg-barber-navy/50 border border-barber-gray rounded-xl p-4">
                    <input
                      type="date"
                      value={selectedDate ? selectedDate.toISOString().split('T')[0] : ''}
                      onChange={(e) => setSelectedDate(new Date(e.target.value))}
                      min={new Date().toISOString().split('T')[0]}
                      className="bg-barber-gray border border-barber-gray text-white rounded-lg w-full p-3 focus:ring-2 focus:ring-barber-red"
                    />
                  </div>
                </div>
                
                {/* Horários */}
                <div>
                  <label className="block mb-4 text-lg font-semibold text-gray-200 flex items-center">
                    <Clock className="w-5 h-5 mr-2 text-barber-red" />
                    Horários Disponíveis
                  </label>
                  
                  {!selectedDate ? (
                    <div className="bg-barber-navy/50 border border-barber-gray rounded-xl p-8 text-center">
                      <Calendar className="w-12 h-12 text-barber-gray mx-auto mb-3" />
                      <p className="text-gray-400">Selecione uma data</p>
                    </div>
                  ) : availableTimes.length === 0 ? (
                    <div className="bg-red-900/20 border border-red-600 rounded-xl p-8 text-center">
                      <Clock className="w-12 h-12 text-red-400 mx-auto mb-3" />
                      <p className="text-red-400">Barbearia fechada neste dia</p>
                    </div>
                  ) : (
                    <div className="bg-barber-navy/50 border border-barber-gray rounded-xl p-4">
                      <div className="mb-4 flex items-center justify-between text-sm">
                        <div className="flex items-center">
                          <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                          <span className="text-gray-300">Disponível</span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-3 h-3 bg-barber-red rounded-full mr-2"></div>
                          <span className="text-gray-300">Selecionado</span>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-2 max-h-64 overflow-y-auto">
                        {availableTimes.map((time) => (
                          <button
                            key={time}
                            type="button"
                            onClick={() => setSelectedTime(time)}
                            className={`p-3 rounded-lg text-sm font-medium transition-all duration-200 transform hover:scale-105 ${
                              selectedTime === time
                                ? 'bg-barber-red text-white shadow-lg shadow-barber-red/50'
                                : 'bg-green-600 text-white hover:bg-green-700 shadow-md'
                            }`}
                          >
                            {time}
                          </button>
                        ))}
                      </div>
                      
                      <div className="mt-4 text-center">
                        <p className="text-gray-400 text-xs mb-2">
                          ⚡ Horários atualizados automaticamente
                        </p>
                        <button
                          type="button"
                          onClick={() => {
                            console.log('🔄 Forçando atualização manual...');
                            fetchHorariosDisponiveis();
                          }}
                          className="text-xs bg-gray-600 text-white px-3 py-1 rounded hover:bg-gray-500"
                        >
                          🔄 Atualizar Agora
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Botão de Agendamento */}
            <div className="text-center pt-8">
              <button
                type="submit"
                disabled={!formData.name || !formData.phone || phoneError || formData.services.length === 0 || !selectedDate || !selectedTime || !formData.barber}
                className={`group relative inline-flex items-center justify-center px-12 py-4 text-lg font-semibold rounded-2xl transition-all duration-300 transform hover:scale-105 ${
                  formData.name && formData.phone && !phoneError && formData.services.length > 0 && selectedDate && selectedTime && formData.barber
                    ? 'bg-gradient-to-r from-barber-red to-red-600 text-white shadow-lg shadow-barber-red/25 hover:shadow-xl hover:shadow-barber-red/40'
                    : 'bg-barber-gray text-gray-400 cursor-not-allowed'
                }`}
              >
                <span className="mr-2">Confirmar Agendamento</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                {formData.services.length > 0 && (
                  <span className="ml-3 px-3 py-1 bg-black/20 rounded-full text-sm">
                    R$ {calculateTotal()},00
                  </span>
                )}
              </button>
              
              {(!formData.name || !formData.phone || phoneError || formData.services.length === 0 || !selectedDate || !selectedTime || !formData.barber) && (
                <p className="text-gray-400 text-sm mt-3">
                  {!formData.name
                    ? 'Preencha seu nome'
                    : !formData.phone
                    ? 'Preencha seu WhatsApp'
                    : phoneError
                    ? 'Corrija o número do WhatsApp'
                    : formData.services.length === 0 
                    ? 'Selecione pelo menos um serviço'
                    : !formData.barber
                    ? 'Escolha um barbeiro'
                    : !selectedDate 
                    ? 'Selecione uma data'
                    : 'Selecione um horário'
                  }
                </p>
              )}
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}