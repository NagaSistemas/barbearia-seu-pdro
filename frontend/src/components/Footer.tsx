import React from 'react';
import { FacebookIcon, InstagramIcon, TwitterIcon } from 'lucide-react';
export function Footer() {
  const handleNewsletterSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    
    if (!email || !email.includes('@')) {
      alert('Por favor, insira um email válido');
      return;
    }
    
    // TODO: Implementar envio para backend
    console.log('Email cadastrado:', email);
  };

  return <footer className="bg-black text-white pt-12 pb-6">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Seu Pedro</h3>
            <p className="text-gray-400 mb-4">
              Barbearia premium oferecendo serviços de alta qualidade. Ambiente
              exclusivo com profissionais capacitados.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <FacebookIcon className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <InstagramIcon className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <TwitterIcon className="w-5 h-5" />
              </a>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Links Rápidos</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-400 hover:text-amber-500 transition-colors">
                  Home
                </a>
              </li>
              <li>
                <a href="#services" className="text-gray-400 hover:text-amber-500 transition-colors">
                  Serviços
                </a>
              </li>
              <li>
                <a href="#barbers" className="text-gray-400 hover:text-amber-500 transition-colors">
                  Barbeiros
                </a>
              </li>
              <li>
                <a href="#gallery" className="text-gray-400 hover:text-amber-500 transition-colors">
                  Galeria
                </a>
              </li>
              <li>
                <a href="#depoimentos" className="text-gray-400 hover:text-amber-500 transition-colors">
                  Depoimentos
                </a>
              </li>
              <li>
                <a href="#contact" className="text-gray-400 hover:text-amber-500 transition-colors">
                  Contato
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Serviços</h3>
            <ul className="space-y-2">
              <li>
                <a href="#services" className="text-gray-400 hover:text-amber-500 transition-colors">
                  Corte de Cabelo
                </a>
              </li>
              <li>
                <a href="#services" className="text-gray-400 hover:text-amber-500 transition-colors">
                  Barba Completa
                </a>
              </li>
              <li>
                <a href="#services" className="text-gray-400 hover:text-amber-500 transition-colors">
                  Corte + Barba
                </a>
              </li>
              <li>
                <a href="#services" className="text-gray-400 hover:text-amber-500 transition-colors">
                  Coloração
                </a>
              </li>
              <li>
                <a href="#services" className="text-gray-400 hover:text-amber-500 transition-colors">
                  Tratamentos Capilar
                </a>
              </li>
              <li>
                <a href="#services" className="text-gray-400 hover:text-amber-500 transition-colors">
                  Pacote Premium
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Newsletter</h3>
            <p className="text-gray-400 mb-4">
              Inscreva-se para receber nossas promoções e novidades.
            </p>
            <form onSubmit={handleNewsletterSubmit} className="flex">
              <input 
                type="email" 
                name="email"
                placeholder="Seu email" 
                className="bg-gray-800 border border-gray-700 text-white rounded-l-md p-2 flex-grow" 
                required
              />
              <button 
                type="submit"
                className="bg-amber-600 hover:bg-amber-700 text-white px-4 rounded-r-md transition-colors"
              >
                →
              </button>
            </form>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-6">
          <p className="text-center text-gray-500 text-sm">
            © 2023 Corte Clássico Barbearia. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>;
}