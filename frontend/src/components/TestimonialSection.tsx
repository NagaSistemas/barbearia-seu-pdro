import { FaQuoteLeft, FaStar } from "react-icons/fa";

type Testimonial = {
  text: string;
  client: string;
  clientInfo: string;
  avatar: string;
};

const testimonials: Testimonial[] = [
  {
    text: "A melhor barbearia que já fui! O Carlos é um artista com as tesouras. Saio sempre com um corte impecável e a barba perfeita.",
    client: "João Silva",
    clientInfo: "Cliente há 3 anos",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80",
  },
  {
    text: "Ambiente premium, profissionais qualificados e atendimento excelente. Vale cada centavo! Minha barba nunca esteve tão bem cuidada.",
    client: "Pedro Almeida",
    clientInfo: "Cliente há 1 ano",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=764&q=80",
  },
  {
    text: "Sou cliente fiel há mais de 2 anos. O atendimento é personalizado e os barbeiros realmente entendem o que o cliente quer. Recomendo!",
    client: "Rafael Costa",
    clientInfo: "Cliente há 2 anos",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80",
  },
];

const TestimonialSection: React.FC = () => {
  return (
    <section id="testimonials" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 font-serif">O Que Nossos Clientes Dizem</h2>
          <div className="w-20 h-1 bg-primary mx-auto mb-6"></div>
          <p className="text-lg max-w-2xl mx-auto">
            Depoimentos de clientes satisfeitos com nossos serviços.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, idx) => (
            <div key={idx} className="testimonial-card bg-gray-50 rounded-xl p-8">
              <div className="flex items-center mb-4">
                <div className="text-3xl text-primary mr-3">
                  <FaQuoteLeft />
                </div>
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} className="text-yellow-400" />
                  ))}
                </div>
              </div>
              <p className="text-gray-600 mb-6">&quot;{t.text}&quot;</p>
              <div className="flex items-center">
                <img
                  src={t.avatar}
                  alt={`Cliente ${t.client}`}
                  className="w-12 h-12 rounded-full object-cover mr-4"
                />
                <div>
                  <h4 className="font-bold">{t.client}</h4>
                  <p className="text-sm text-gray-500">{t.clientInfo}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialSection;
