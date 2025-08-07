import React from 'react';
import { StarIcon } from 'lucide-react';
export function Testimonials() {
  const testimonials = [{
    name: 'João Silva',
    location: 'São Paulo, SP',
    text: 'A melhor barbearia que já fui! O Carlos é um artista com as tesouras. Saio sempre com um corte impecável e o atendimento perfeito.',
    stars: 5
  }, {
    name: 'Paulo Almeida',
    location: 'São Paulo, SP',
    text: 'Ambiente premium, profissionais qualificados e atendimento excelente. Cada visita melhora! Minha barba nunca esteve tão bem cuidada.',
    stars: 5
  }, {
    name: 'Rafael Costa',
    location: 'São Paulo, SP',
    text: 'Sou cliente há mais de 2 anos. O atendimento é personalizado e os barbeiros realmente entendem o que eu quero! Sensacional!',
    stars: 5
  }];
  const renderStars = count => {
    return Array(count).fill(0).map((_, i) => <StarIcon key={i} className="w-4 h-4 fill-amber-500 text-amber-500" />);
  };
  return <section id="depoimentos" className="py-16 bg-gray-50">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-bold text-center mb-2">
          O Que Nossos Clientes Dizem
        </h2>
        <p className="text-center text-gray-600 mb-12">
          Depoimentos de clientes satisfeitos com nossos serviços.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => <div key={index} className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex text-amber-500 mb-3">
                {renderStars(testimonial.stars)}
              </div>
              <p className="text-gray-700 mb-4">"{testimonial.text}"</p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gray-300 rounded-full mr-3 flex items-center justify-center">
                  <span className="text-gray-600 font-semibold">
                    {testimonial.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="font-semibold">{testimonial.name}</p>
                  <p className="text-gray-500 text-sm">
                    {testimonial.location}
                  </p>
                </div>
              </div>
            </div>)}
        </div>
      </div>
    </section>;
}