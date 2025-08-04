const Hero: React.FC = () => {
  return (
    <section id="home" className="hero-bg pt-32 pb-20 text-white">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center">
        <div className="md:w-1/2 mb-10 md:mb-0">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 font-serif">
            A Arte da Barbearia Clássica
          </h1>
          <p className="text-xl mb-8 opacity-90">
            Onde tradição encontra modernidade. Cortes de cabelo e barba premium em um ambiente exclusivo para homens.
          </p>
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <a
              href="#appointment"
              className="bg-primary text-white px-8 py-4 rounded-full text-center hover:bg-opacity-90 transition font-medium"
            >
              Agendar Horário
            </a>
            <a
              href="#services"
              className="bg-white text-secondary px-8 py-4 rounded-full text-center hover:bg-gray-100 transition font-medium"
            >
              Nossos Serviços
            </a>
          </div>
        </div>
        <div className="md:w-1/2 flex justify-center">
          <div className="relative">
            <div className="bg-primary w-64 h-64 rounded-full absolute -top-6 -left-6 z-0"></div>
            <img
              src="https://images.unsplash.com/photo-1503951914875-452162b0f3f1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
              alt="Barbeiro profissional"
              className="relative z-10 rounded-lg shadow-2xl w-full max-w-md"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
