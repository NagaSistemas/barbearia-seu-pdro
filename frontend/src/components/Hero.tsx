const heroStyle = {
  backgroundImage: `url('/Foto header.avif')`
};

export function Hero() {
  return <section className="relative w-full bg-black text-white">
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="relative h-[500px] bg-cover bg-center" style={heroStyle}>
        <div className="container mx-auto px-6 py-16 h-full flex items-center">
          <div className="max-w-xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-black">
              A Arte da Barbearia Clássica
            </h1>
            <p className="text-lg mb-8 text-black">
              Onde tradição encontra modernidade. Cortes de cabelo e barba
              premium em um ambiente exclusivo para homens.
            </p>
            <div className="flex space-x-4">
              <a href="#booking" className="bg-barber-red text-white px-6 py-2 rounded hover:bg-red-800 transition-colors">
                Agendar horário
              </a>
              <a href="#services" className="border border-black text-black px-6 py-2 rounded hover:bg-black hover:text-white transition-colors">
                Nossos Serviços
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>;
}