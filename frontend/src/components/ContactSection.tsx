import React, { useState } from "react";
import {
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
  FaClock,
} from "react-icons/fa";

const ContactSection: React.FC = () => {
  // Estado do formulário de contato
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // Aqui você pode integrar com backend/email
    alert("Mensagem enviada! (Simulação)");
    setName("");
    setEmail("");
    setSubject("");
    setMessage("");
  }

  return (
    <section id="contact" className="py-20 bg-gray-100">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 font-serif">Entre em Contato</h2>
          <div className="w-20 h-1 bg-primary mx-auto mb-6"></div>
          <p className="text-lg max-w-2xl mx-auto">
            Estamos à disposição para atender suas dúvidas e solicitações.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">
          {/* Informações de contato */}
          <div>
            <h3 className="text-xl font-bold mb-6">Informações de Contato</h3>
            <div className="flex items-start mb-8">
              <div className="bg-primary text-white p-3 rounded-full mr-4">
                <FaMapMarkerAlt />
              </div>
              <div>
                <h4 className="font-bold mb-1">Endereço</h4>
                <p>
                  Av. Paulista, 1000
                  <br />
                  São Paulo, SP
                  <br />
                  01310-100
                </p>
              </div>
            </div>
            <div className="flex items-start mb-8">
              <div className="bg-primary text-white p-3 rounded-full mr-4">
                <FaPhoneAlt />
              </div>
              <div>
                <h4 className="font-bold mb-1">Telefone</h4>
                <p>(11) 9999-9999</p>
              </div>
            </div>
            <div className="flex items-start mb-8">
              <div className="bg-primary text-white p-3 rounded-full mr-4">
                <FaEnvelope />
              </div>
              <div>
                <h4 className="font-bold mb-1">Email</h4>
                <p>contato@corteclassico.com.br</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="bg-primary text-white p-3 rounded-full mr-4">
                <FaClock />
              </div>
              <div>
                <h4 className="font-bold mb-1">Horário de Funcionamento</h4>
                <p>
                  Segunda a Sexta: 9h às 20h
                  <br />
                  Sábado: 9h às 18h
                  <br />
                  Domingo: Fechado
                </p>
              </div>
            </div>
          </div>

          {/* Formulário de contato */}
          <div>
            <h3 className="text-xl font-bold mb-6">Envie uma Mensagem</h3>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Seu nome"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-800"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required
                />
              </div>
              <div className="mb-4">
                <input
                  type="email"
                  placeholder="Seu email"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-800"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Assunto"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-800"
                  value={subject}
                  onChange={e => setSubject(e.target.value)}
                  required
                />
              </div>
              <div className="mb-4">
                <textarea
                  placeholder="Sua mensagem"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 h-32 text-gray-800"
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  required
                />
              </div>
              <button
                type="submit"
                className="bg-primary text-white px-8 py-3 rounded-full hover:bg-opacity-90 transition font-medium"
              >
                Enviar Mensagem
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
