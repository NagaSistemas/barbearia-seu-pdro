import { FaCut, FaUser, FaSpa, FaMagic, FaFire, FaCrown } from "react-icons/fa";

type Service = {
  icon: React.ReactNode;
  title: string;
  description: string;
  price: string;
};

const services: Service[] = [
  {
    icon: <FaCut className="text-primary text-3xl" />,
    title: "Corte de Cabelo",
    description: "Cortes modernos e clássicos com técnicas profissionais para um visual impecável.",
    price: "R$ 50,00",
  },
  {
    icon: <FaUser className="text-primary text-3xl" />,
    title: "Barba Completa",
    description: "Modelagem, tratamento e cuidados especiais para uma barba bem definida e saudável.",
    price: "R$ 40,00",
  },
  {
    icon: <FaSpa className="text-primary text-3xl" />,
    title: "Corte + Barba",
    description: "O pacote completo para renovar seu visual com corte de cabelo e tratamento de barba.",
    price: "R$ 80,00",
  },
  {
    icon: <FaMagic className="text-primary text-3xl" />,
    title: "Coloração",
    description: "Cobertura de fios brancos ou mudança de visual com produtos de alta qualidade.",
    price: "R$ 70,00",
  },
  {
    icon: <FaFire className="text-primary text-3xl" />,
    title: "Tratamento Capilar",
    description: "Hidratação e reconstrução para cabelos danificados, ressecados ou com química.",
    price: "R$ 60,00",
  },
  {
    icon: <FaCrown className="text-primary text-3xl" />,
    title: "Pacote Premium",
    description: "Corte, barba, tratamento capilar e massagem relaxante para uma experiência completa.",
    price: "R$ 120,00",
  },
];

const ServicesSection: React.FC = () => {
  return (
    <section id="services" className="py-20 bg-gray-100">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 font-serif">Nossos Serviços</h2>
          <div className="w-20 h-1 bg-primary mx-auto mb-6"></div>
          <p className="text-lg max-w-2xl mx-auto">
            Oferecemos serviços premium com atenção aos detalhes e produtos de alta qualidade.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, idx) => (
            <div
              key={service.title}
              className="service-card bg-white rounded-xl shadow-lg p-8 text-center hover:shadow-xl transition"
            >
              <div className="bg-primary bg-opacity-10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                {service.icon}
              </div>
              <h3 className="text-xl font-bold mb-3">{service.title}</h3>
              <p className="text-gray-600 mb-4">{service.description}</p>
              <p className="text-primary font-bold text-xl">{service.price}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
