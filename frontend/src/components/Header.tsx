import React from 'react';
export function Header() {
  return <header className="bg-white py-3 px-6 flex justify-between items-center shadow-sm">
      <div className="flex items-center">
        <span className="text-barber-navy font-bold text-xl">Seu Pedro</span>
      </div>
      <nav className="hidden md:flex space-x-6">
        <a href="#home" className="text-barber-gray hover:text-barber-red">
          Home
        </a>
        <a href="#services" className="text-barber-gray hover:text-barber-red">
          Serviços
        </a>
        <a href="#barbers" className="text-barber-gray hover:text-barber-red">
          Barbeiros
        </a>
        <a href="#gallery" className="text-barber-gray hover:text-barber-red">
          Galeria
        </a>
        <a href="#depoimentos" className="text-barber-gray hover:text-barber-red">
          Depoimentos
        </a>
      </nav>
      <a href="#booking" className="bg-barber-red text-white px-4 py-2 rounded hover:bg-red-800 transition-colors">
        Agendar horário
      </a>
    </header>;
}