import { FaInstagram, FaFacebook, FaTwitter } from "react-icons/fa";

type Barber = {
  name: string;
  specialty: string;
  description: string;
  image: string;
  instagram?: string;
  facebook?: string;
  twitter?: string;
};

const barbers: Barber[] = [
  {
    name: "Carlos Mendes",
    specialty: "Especialista em Cortes Clássicos",
    description: "Com 12 anos de experiência, Carlos domina técnicas tradicionais com toque moderno.",
    image: "https://images.unsplash.com/photo-1562322140-8baeececf3df?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1469&q=80",
    instagram: "#",
    facebook: "#",
    twitter: "#",
  },
  {
    name: "Ricardo Oliveira",
    specialty: "Mestre em Barbas",
    description: "Especializado em design e cuidados com barba há mais de 8 anos.",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=761&q=80",
    instagram: "#",
    facebook: "#",
    twitter: "#",
  },
  {
    name: "Marcos Silva",
    specialty: "Estilista Capilar",
    description: "Cortes modernos e tendências atuais com 10 anos de experiência.",
    image: "https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=688&q=80",
    instagram: "#",
    facebook: "#",
    twitter: "#",
  },
  {
    name: "Rafael Costa",
    specialty: "Especialista em Tratamentos",
    description: "Focado em saúde capilar e tratamentos para barba e cabelo.",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80",
    instagram: "#",
    facebook: "#",
    twitter: "#",
  },
];

const BarbersSection: React.FC = () => {
  return (
    <section id="barbers" className="py-20 bg-secondary text-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 font-serif">Nossos Barbeiros</h2>
          <div className="w-20 h-1 bg-primary mx-auto mb-6"></div>
          <p className="text-lg max-w-2xl mx-auto opacity-80">
            Profissionais qualificados com anos de experiência no mercado.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {barbers.map((barber) => (
            <div
              key={barber.name}
              className="barber-card bg-accent rounded-xl overflow-hidden shadow-lg"
            >
              <div className="overflow-hidden">
                <img
                  src={barber.image}
                  alt={barber.name}
                  className="w-full h-80 object-cover transition duration-500"
                />
              </div>
              <div className="p-6 text-center">
                <h3 className="text-xl font-bold mb-1">{barber.name}</h3>
                <p className="text-primary mb-3">{barber.specialty}</p>
                <p className="text-gray-400 mb-4">{barber.description}</p>
                <div className="flex justify-center space-x-4">
                  <a href={barber.instagram} className="text-gray-400 hover:text-primary" target="_blank" rel="noopener noreferrer">
                    <FaInstagram />
                  </a>
                  <a href={barber.facebook} className="text-gray-400 hover:text-primary" target="_blank" rel="noopener noreferrer">
                    <FaFacebook />
                  </a>
                  <a href={barber.twitter} className="text-gray-400 hover:text-primary" target="_blank" rel="noopener noreferrer">
                    <FaTwitter />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BarbersSection;
