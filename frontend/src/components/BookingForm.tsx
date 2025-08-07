import { useEffect, useState, ChangeEvent, FormEvent } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { CalendarIcon, ClockIcon, CheckIcon } from 'lucide-react';
import {ptBR} from 'date-fns/locale/pt-BR';
import { db } from '../../firebase';
import { collection, addDoc, Timestamp } from "firebase/firestore";

// Mapas de duração dos serviços (em minutos)
const serviceDurations: Record<string, number> = {
  corte: 30,
  barba: 20,
  'corte-barba': 50,
  barboterapia: 45,
  sobrancelha: 10,
  hidratacao: 20,
  reconstrucao: 20,
  'combo-1': 60,
  'combo-2': 60,
  'combo-3': 60,
  premium: 60,
  tratamento: 20,    // ajuste conforme necessidade
  pigmentacao: 20,   // ajuste conforme necessidadecd
};

// Tipos do form
type BookingFormData = {
  name: string;
  phone: string;
  email: string;
  service: string;
  barber: string;
};

export function BookingForm() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  const [formData, setFormData] = useState<BookingFormData>({
    name: '',
    phone: '',
    email: '',
    service: '',
    barber: ''
  });
  const [loading, setLoading] = useState(false);

  // Gera os horários de acordo com o serviço selecionado
  useEffect(() => {
    if (selectedDate && formData.service) {
      const times: string[] = [];
      const day = selectedDate.getDay();
      // Domingo fechado (0), dias úteis = 1-6
      if (day === 0) {
        setAvailableTimes([]);
        setSelectedTime(null);
        return;
      }

      // Segunda a sábado: 8h às 20h
      const startHour = 8;
      const endHour = 20;

      const duration = serviceDurations[formData.service] || 30;

      // Monta slots baseados na duração do serviço
      let current = new Date(selectedDate);
      current.setHours(startHour, 0, 0, 0);
      const end = new Date(selectedDate);
      end.setHours(endHour, 0, 0, 0);

      while (current.getTime() + duration * 60000 <= end.getTime()) {
        const hour = current.getHours().toString().padStart(2, '0');
        const minute = current.getMinutes().toString().padStart(2, '0');
        times.push(`${hour}:${minute}`);
        current = new Date(current.getTime() + duration * 60000);
      }
      setAvailableTimes(times);
      setSelectedTime(null);
    } else {
      setAvailableTimes([]);
      setSelectedTime(null);
    }
  }, [selectedDate, formData.service]);

  // Controle dos campos do formulário
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Envio do formulário para o Firestore
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedTime || !selectedDate) {
      alert('Por favor, selecione uma data e um horário disponível.');
      return;
    }
    setLoading(true);

    // Prepara data/hora do agendamento
    const [hours, minutes] = selectedTime.split(':').map(Number);
    const dateWithTime = new Date(selectedDate);
    dateWithTime.setHours(hours, minutes, 0, 0);

    const duration = serviceDurations[formData.service] || 30;

    // Objeto a ser salvo
    const bookingData = {
      name: formData.name,
      phone: formData.phone,
      service: formData.service,
      barber: formData.barber,
      date: Timestamp.fromDate(selectedDate),
      time: selectedTime,
      datetime: Timestamp.fromDate(dateWithTime), // útil para consultas posteriores
      serviceDuration: duration,
      createdAt: Timestamp.now()
    };

    try {
      await addDoc(collection(db, "agendamentos"), bookingData);
      alert(`Agendamento recebido para ${dateWithTime.toLocaleDateString('pt-BR')} às ${selectedTime}!`);
      setFormData({
        name: '',
        phone: '',
        email: '',
        service: '',
        barber: ''
      });
      setSelectedDate(null);
      setSelectedTime(null);
    } catch (error) {
      console.error("Erro ao salvar agendamento:", error);
      alert("Ocorreu um erro ao salvar o agendamento. Tente novamente.");
    } finally {
      setLoading(false);
    }
    console.log('bookingData', bookingData);
  };

  // Realça o dia de hoje
  const highlightWithRanges = [{
    'react-datepicker__day--highlighted-custom-1': [new Date()]
  }];

  // Desabilita datas passadas e domingos
  const isDateDisabled = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today || date.getDay() === 0;
  };

  return (
    <section id="booking" className="py-16 bg-black text-white">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-bold text-center mb-2">Agende Seu Horário</h2>
        <p className="text-center text-gray-400 mb-12">
          Preencha o formulário abaixo e reserve seu horário com nossos profissionais.
        </p>
        <div className="max-w-5xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Dados do cliente */}
              <div className="space-y-6">
                <h3 className="text-xl font-semibold flex items-center">
                  <span className="bg-amber-600 text-white rounded-full w-8 h-8 inline-flex items-center justify-center mr-3">1</span>
                  Seus Dados
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block mb-2 text-sm font-medium">Nome Completo</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="bg-gray-800 border border-gray-700 text-white rounded-md w-full p-2.5"
                      placeholder="Seu nome"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block mb-2 text-sm font-medium">Telefone</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="bg-gray-800 border border-gray-700 text-white rounded-md w-full p-2.5"
                      placeholder="(00) 00000-0000"
                      required
                    />
                  </div>
                </div>
                <h3 className="text-xl font-semibold flex items-center pt-4">
                  <span className="bg-amber-600 text-white rounded-full w-8 h-8 inline-flex items-center justify-center mr-3">2</span>
                  Escolha o Serviço
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="service" className="block mb-2 text-sm font-medium">Serviço</label>
                    <select
                      id="service"
                      name="service"
                      value={formData.service}
                      onChange={handleChange}
                      className="bg-gray-800 border border-gray-700 text-white rounded-md w-full p-2.5"
                      required
                    >
                      <option value="">Selecione um serviço</option>
                      <option value="corte">Corte de Cabelo</option>
                      <option value="barba">Barba Completa</option>
                      <option value="corte-barba">Corte + Barba</option>
                      <option value="barboterapia">Barboterapia</option>
                      <option value="sobrancelha">Sobrancelha</option>
                      <option value="hidratacao">Hidratação</option>
                      <option value="reconstrucao">Reconstrução</option>
                      <option value="combo-1">Combo 1: Corte + Barba</option>
                      <option value="combo-2">Combo 2: Corte + Barba + Sobrancelha</option>
                      <option value="combo-3">Combo 3: Corte + Barboterapia</option>
                      <option value="premium">Pacote Premium</option>
                      <option value="tratamento">Tratamento Capilar</option>
                      <option value="pigmentacao">Pigmentação Capilar</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="barber" className="block mb-2 text-sm font-medium">Barbeiro</label>
                    <select
                      id="barber"
                      name="barber"
                      value={formData.barber}
                      onChange={handleChange}
                      className="bg-gray-800 border border-gray-700 text-white rounded-md w-full p-2.5"
                      required
                    >
                      <option value="">Selecione um barbeiro</option>
                      <option value="carlos">Carlos Mendes</option>
                      <option value="ricardo">Ricardo Oliveira</option>
                      <option value="marcos">Marcos Silva</option>
                      <option value="rafael">Rafael Costa</option>
                    </select>
                  </div>
                </div>
              </div>
              {/* Calendário e horários */}
              <div className="bg-gray-900 p-6 rounded-lg">
                <h3 className="text-xl font-semibold flex items-center mb-6">
                  <span className="bg-amber-600 text-white rounded-full w-8 h-8 inline-flex items-center justify-center mr-3">3</span>
                  Escolha a Data e Horário
                </h3>
                <div className="mb-6">
                  <label className="block mb-2 text-sm font-medium flex items-center">
                    <CalendarIcon className="w-4 h-4 mr-2" />
                    Selecione uma data
                  </label>
                  <div className="calendar-container">
                    <DatePicker
                      selected={selectedDate}
                      onChange={date => setSelectedDate(date as Date)}
                      filterDate={date => !isDateDisabled(date as Date)}
                      highlightDates={highlightWithRanges}
                      inline
                      calendarClassName="bg-gray-800 border border-gray-700 rounded-lg p-4 mx-auto"
                      dayClassName={date =>
                        date.getDate() === new Date().getDate() &&
                        date.getMonth() === new Date().getMonth() &&
                        date.getFullYear() === new Date().getFullYear()
                          ? 'bg-amber-600 text-white rounded-full'
                          : ''
                      }
                      locale={ptBR}
                    />
                  </div>
                </div>
                {selectedDate && (
                  <div>
                    <label className="block mb-3 text-sm font-medium flex items-center">
                      <ClockIcon className="w-4 h-4 mr-2" />
                      Horários disponíveis para {selectedDate.toLocaleDateString('pt-BR')}:
                    </label>
                    {availableTimes.length > 0 ? (
                      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                        {availableTimes.map(time => (
                          <button
                            key={time}
                            type="button"
                            className={`p-2 rounded-md text-center text-sm transition-colors ${
                              selectedTime === time
                                ? 'bg-amber-600 text-white'
                                : 'bg-gray-800 hover:bg-gray-700'
                            }`}
                            onClick={() => setSelectedTime(time)}
                          >
                            {time}
                            {selectedTime === time && (
                              <CheckIcon className="w-4 h-4 inline-block ml-1" />
                            )}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <p className="text-amber-500">
                        Não há horários disponíveis nesta data. Por favor, selecione outra data.
                      </p>
                    )}
                  </div>
                )}
                {!selectedDate && (
                  <div className="text-center text-gray-400 mt-6">
                    <p>Selecione uma data para ver os horários disponíveis</p>
                  </div>
                )}
              </div>
            </div>
            <div className="flex justify-center pt-6">
              <button
                type="submit"
                disabled={!selectedDate || !selectedTime || loading}
                className={`font-medium rounded-md px-8 py-3 transition-colors ${
                  selectedDate && selectedTime && !loading
                    ? 'bg-amber-600 hover:bg-amber-700 text-white'
                    : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                }`}
              >
                {loading
                  ? 'Agendando...'
                  : selectedDate && selectedTime
                    ? `Agendar para ${selectedDate.toLocaleDateString('pt-BR')} às ${selectedTime}`
                    : 'Selecione data e horário'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
