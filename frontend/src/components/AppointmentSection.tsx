import React, { useState } from "react";

const services = [
  "Corte de Cabelo",
  "Barba Completa",
  "Corte + Barba",
  "Coloração",
  "Tratamento Capilar",
  "Pacote Premium",
];

const barbers = [
  "Qualquer barbeiro",
  "Carlos Mendes",
  "Ricardo Oliveira",
  "Marcos Silva",
  "Rafael Costa",
];

const AppointmentSection: React.FC = () => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [service, setService] = useState(services[0]);
  const [barber, setBarber] = useState(barbers[0]);
  const [datetime, setDatetime] = useState("");
  const [message, setMessage] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // Aqui você pode enviar os dados para o backend/Firebase/etc
    alert("Agendamento enviado! (Simulação)");
  }

  return (
    <section id="appointment" className="py-20 bg-secondary text-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 font-serif">Agende Seu Horário</h2>
            <div className="w-20 h-1 bg-primary mx-auto mb-6"></div>
            <p className="text-lg max-w-2xl mx-auto opacity-80">
              Preencha o formulário abaixo e reserve seu horário com nossos profissionais.
            </p>
          </div>

          <form
            className="appointment-form grid grid-cols-1 md:grid-cols-2 gap-6"
            onSubmit={handleSubmit}
          >
            <div>
              <label className="block mb-2">Nome Completo</label>
              <input
                type="text"
                className="w-full px-4 py-3 rounded-lg text-gray-800"
                placeholder="Seu nome"
                value={name}
                onChange={e => setName(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block mb-2">Telefone</label>
              <input
                type="tel"
                className="w-full px-4 py-3 rounded-lg text-gray-800"
                placeholder="(00) 00000-0000"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block mb-2">Email</label>
              <input
                type="email"
                className="w-full px-4 py-3 rounded-lg text-gray-800"
                placeholder="seuemail@exemplo.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block mb-2">Serviço</label>
              <select
                className="w-full px-4 py-3 rounded-lg text-gray-800"
                value={service}
                onChange={e => setService(e.target.value)}
              >
                {services.map((s, i) => (
                  <option key={i} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block mb-2">Barbeiro</label>
              <select
                className="w-full px-4 py-3 rounded-lg text-gray-800"
                value={barber}
                onChange={e => setBarber(e.target.value)}
              >
                {barbers.map((b, i) => (
                  <option key={i} value={b}>{b}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block mb-2">Data e Hora</label>
              <input
                type="datetime-local"
                className="w-full px-4 py-3 rounded-lg text-gray-800"
                value={datetime}
                onChange={e => setDatetime(e.target.value)}
                required
              />
            </div>
            <div className="md:col-span-2">
              <label className="block mb-2">Mensagem (Opcional)</label>
              <textarea
                className="w-full px-4 py-3 rounded-lg h-32 text-gray-800"
                placeholder="Alguma observação ou preferência especial..."
                value={message}
                onChange={e => setMessage(e.target.value)}
              />
            </div>
            <div className="md:col-span-2 text-center mt-4">
              <button
                type="submit"
                className="bg-primary text-white px-8 py-4 rounded-full hover:bg-opacity-90 transition font-medium"
              >
                Agendar Horário
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default AppointmentSection;
