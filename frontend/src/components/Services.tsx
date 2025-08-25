import React from 'react';
import { ScissorsIcon, SparklesIcon, BeakerIcon, PaletteIcon } from 'lucide-react';
export function Services() {
  const services = [{
    icon: <ScissorsIcon className="w-10 h-10 text-barber-red mb-4" />,
    title: 'Corte',
    description: 'Cortes modernos e clássicos com técnicas profissionais para um visual impecável.',
    price: 'R$ 60,00'
  }, {
    icon: <ScissorsIcon className="w-10 h-10 text-barber-red mb-4" />,
    title: 'Barba',
    description: 'Modelagem, tratamento e acabamento especiais para uma barba bem cuidada e saudável.',
    price: 'R$ 40,00'
  }, {
    icon: <BeakerIcon className="w-10 h-10 text-barber-red mb-4" />,
    title: 'Sobrancelha',
    description: 'Design e modelagem de sobrancelhas para um olhar mais expressivo e definido.',
    price: 'R$ 20,00'
  }, {
    icon: <PaletteIcon className="w-10 h-10 text-barber-red mb-4" />,
    title: 'Coloração',
    description: 'Coloração profissional para cobertura de fios brancos ou mudança de visual.',
    price: 'R$ 80,00'
  }, {
    icon: <SparklesIcon className="w-10 h-10 text-barber-red mb-4" />,
    title: 'Luzes/Reflexos',
    description: 'Técnicas de luzes e reflexos para um visual moderno e sofisticado.',
    price: 'R$ 120,00'
  }, {
    icon: <BeakerIcon className="w-10 h-10 text-barber-red mb-4" />,
    title: 'Relaxamento',
    description: 'Tratamento de relaxamento capilar para cabelos mais lisos e manejáveis.',
    price: 'R$ 100,00'
  }];
  return <section id="services" className="py-16 bg-white">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-bold text-center mb-2">Nossos Serviços</h2>
        <p className="text-center text-gray-600 mb-12">
          Oferecemos serviços premium com atenção aos detalhes e produtos de
          alta qualidade.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {services.map((service) => <div key={service.title} className="border p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="flex flex-col items-center text-center">
                {service.icon}
                <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
                <p className="text-gray-600 mb-4">{service.description}</p>
                <span className="text-barber-red font-bold">
                  {service.price}
                </span>
              </div>
            </div>)}
        </div>
      </div>
    </section>;
}