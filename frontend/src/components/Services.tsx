import React from 'react';
import { ScissorsIcon, SparklesIcon } from 'lucide-react';
export function Services() {
  const services = [{
    icon: <ScissorsIcon className="w-10 h-10 text-amber-600 mb-4" />,
    title: 'Corte de Cabelo',
    description: 'Cortes modernos e clássicos com técnicas profissionais para um visual impecável.',
    price: 'R$ 45,00'
  }, {
    icon: <div className="w-10 h-10 text-amber-600 mb-4" />,
    title: 'Barba Completa',
    description: 'Modelagem, tratamento e acabamento especiais para uma barba bem cuidada e saudável.',
    price: 'R$ 40,00'
  }, {
    icon: <SparklesIcon className="w-10 h-10 text-amber-600 mb-4" />,
    title: 'Corte + Barba',
    description: 'O pacote completo para renovar seu visual com corte de cabelo e aparagem de barba.',
    price: 'R$ 80,00'
  }, {
    icon: <div className="w-10 h-10 text-amber-600 mb-4" />,
    title: 'Tratamentos Capilares',
    description: 'Cobertura de fios brancos e hidratação de visual com produtos de alta qualidade.',
    price: 'R$ 70,00'
  }, {
    icon: <div className="w-10 h-10 text-amber-600 mb-4" />,
    title: 'Pigmentação Capilar',
    description: 'Tratamento de disfarçação para cabelos ralos/finos, especiais de camuflagem.',
    price: 'R$ 65,00'
  }, {
    icon: <SparklesIcon className="w-10 h-10 text-amber-600 mb-4" />,
    title: 'Pacote Premium',
    description: 'Corte, barba, tratamento capilar e massagem relaxante para uma experiência completa.',
    price: 'R$ 150,00'
  }];
  return <section id="services" className="py-16 bg-white">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-bold text-center mb-2">Nossos Serviços</h2>
        <p className="text-center text-gray-600 mb-12">
          Oferecemos serviços premium com atenção aos detalhes e produtos de
          alta qualidade.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => <div key={index} className="border p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="flex flex-col items-center text-center">
                {service.icon}
                <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
                <p className="text-gray-600 mb-4">{service.description}</p>
                <span className="text-amber-600 font-bold">
                  {service.price}
                </span>
              </div>
            </div>)}
        </div>
      </div>
    </section>;
}