export function Hero() {
  return <section className="relative w-full bg-black text-white">
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="relative h-[500px] bg-cover bg-center" style={{
      backgroundImage: `url('/Foto header.avif')`
    }}>
        <div className="container mx-auto px-6 py-16 h-full flex items-center">
          <div className="max-w-xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              A Arte da Barbearia Clássica
            </h1>
            <p className="text-lg mb-8">
              Onde tradição encontra modernidade. Cortes de cabelo e barba
              premium em um ambiente exclusivo para homens.
            </p>
            <div className="flex space-x-4">
              <a href="#booking" className="bg-amber-600 text-white px-6 py-2 rounded hover:bg-amber-700 transition-colors">
                Agendar horário
              </a>
              <a href="#services" className="border border-white text-white px-6 py-2 rounded hover:bg-white hover:text-black transition-colors">
                Nossos Serviços
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>;
}