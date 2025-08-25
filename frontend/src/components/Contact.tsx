import React from 'react';
import { MapPinIcon, PhoneIcon, MailIcon, ClockIcon } from 'lucide-react';
export function Contact() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implementar envio do formulário
    console.log('Formulário enviado');
  };

  return <section id="contact" className="py-16 bg-white">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-bold text-center mb-2">
          Entre em Contato
        </h2>
        <p className="text-center text-gray-600 mb-12">
          Estamos à disposição para atender suas dúvidas e solicitações.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <h3 className="text-xl font-semibold mb-6">
              Informações de Contato
            </h3>
            <div className="space-y-6">
              <div className="flex items-start">
                <MapPinIcon className="w-6 h-6 text-amber-600 mr-3 flex-shrink-0" />
                <div>
                  <p className="font-medium">Endereço</p>
                  <p className="text-gray-600">Rua Exemplo, 1000</p>
                  <p className="text-gray-600">São Paulo, SP</p>
                  <p className="text-gray-600">CEP: 00000-000</p>
                </div>
              </div>
              <div className="flex items-start">
                <PhoneIcon className="w-6 h-6 text-amber-600 mr-3 flex-shrink-0" />
                <div>
                  <p className="font-medium">Telefone</p>
                  <p className="text-gray-600">(11) 9999-9999</p>
                </div>
              </div>
              <div className="flex items-start">
                <MailIcon className="w-6 h-6 text-amber-600 mr-3 flex-shrink-0" />
                <div>
                  <p className="font-medium">Email</p>
                  <p className="text-gray-600">
                    contato@barberiaseupedro.com.br
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <ClockIcon className="w-6 h-6 text-amber-600 mr-3 flex-shrink-0" />
                <div>
                  <p className="font-medium">Horário de Funcionamento</p>
                  <p className="text-gray-600">Segunda a Sexta: 09h às 20h</p>
                  <p className="text-gray-600">Sábado: 09h às 18h</p>
                  <p className="text-gray-600">Domingo: Fechado</p>
                </div>
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-6">Envie uma Mensagem</h3>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <input type="text" placeholder="Seu nome" className="w-full p-3 border border-gray-300 rounded-md" required />
              </div>
              <div>
                <input type="email" placeholder="Seu email" className="w-full p-3 border border-gray-300 rounded-md" required />
              </div>
              <div>
                <input type="text" placeholder="Assunto" className="w-full p-3 border border-gray-300 rounded-md" required />
              </div>
              <div>
                <textarea placeholder="Sua mensagem" className="w-full p-3 border border-gray-300 rounded-md" rows={4} required></textarea>
              </div>
              <button type="submit" className="bg-amber-600 hover:bg-amber-700 text-white font-medium rounded-md px-6 py-3 transition-colors">
                Enviar Mensagem
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>;
}