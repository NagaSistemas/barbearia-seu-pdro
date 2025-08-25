import React from 'react';
export function Barbers() {
  const barbers = [{
    name: 'Carlos Mendes',
    role: 'Especialista em Cortes Clássicos',
    experience: 'Com 10 anos de experiência, Carlos domina técnicas tradicionais com toques modernos.',
    image: "/image.png"
  }, {
    name: 'Ricardo Oliveira',
    role: 'Mestre em Barbas',
    experience: 'Especializado em design e cuidados com barbas de todos os tipos e estilos.',
    image: "/image.png"
  }];
  return <section id="barbers" className="py-16 bg-black text-white">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-bold text-center mb-2">
          Nossos Barbeiros
        </h2>
        <p className="text-center text-gray-400 mb-12">
          Profissionais qualificados com anos de experiência no mercado.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {barbers.map((barber) => <div key={barber.name} className="text-center">
              <div className="mb-4 overflow-hidden rounded-lg">
                <img src={barber.image} alt={barber.name} className="w-full h-64 object-cover hover:scale-105 transition-transform" />
              </div>
              <h3 className="text-xl font-semibold mb-1">{barber.name}</h3>
              <p className="text-barber-red mb-2">{barber.role}</p>
              <p className="text-gray-400 text-sm">{barber.experience}</p>
            </div>)}
        </div>
      </div>
    </section>;
}