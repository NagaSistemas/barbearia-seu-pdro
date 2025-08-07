import React from 'react';
export function Header() {
  return <header className="bg-white py-3 px-6 flex justify-between items-center shadow-sm">
      <div className="flex items-center">
        <span className="text-amber-700 font-bold text-xl">Seu Pedro</span>
      </div>
      <nav className="hidden md:flex space-x-6">
        <a href="#" className="text-gray-800 hover:text-amber-700">
          Home
        </a>
        <a href="#services" className="text-gray-800 hover:text-amber-700">
          Serviços
        </a>
        <a href="#barbers" className="text-gray-800 hover:text-amber-700">
          Barbeiros
        </a>
        <a href="#gallery" className="text-gray-800 hover:text-amber-700">
          Galeria
        </a>
        <a href="#depoimentos" className="text-gray-800 hover:text-amber-700">
          Depoimentos
        </a>
        <a href="#contact" className="text-gray-800 hover:text-amber-700">
          Contato
        </a>
      </nav>
      <a href="#booking" className="bg-amber-600 text-white px-4 py-2 rounded hover:bg-amber-700 transition-colors">
        Agendar horário
      </a>
    </header>;
}