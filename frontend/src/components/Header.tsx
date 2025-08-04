import { FaCut, FaBars } from "react-icons/fa";

const Header: React.FC = () => {
  return (
    <header className="fixed w-full z-50 bg-white shadow-md">
      <div className="container mx-auto px-4">
        <nav className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <div className="bg-primary w-10 h-10 rounded-full flex items-center justify-center">
              <FaCut className="text-white text-xl" />
            </div>
            <span className="ml-3 text-2xl font-bold font-serif">Seu Pedro</span>
          </div>

          <div className="hidden md:flex space-x-8">
            <a href="#home" className="hover:text-primary transition">Início</a>
            <a href="#services" className="hover:text-primary transition">Serviços</a>
            <a href="#barbers" className="hover:text-primary transition">Barbeiros</a>
            <a href="#gallery" className="hover:text-primary transition">Galeria</a>
            <a href="#testimonials" className="hover:text-primary transition">Depoimentos</a>
            <a href="#contact" className="hover:text-primary transition">Contato</a>
          </div>

          <a href="#appointment" className="bg-primary text-white px-6 py-2 rounded-full hover:bg-opacity-90 transition hidden md:block">
            Agendar Horário
          </a>

          <button className="md:hidden text-2xl">
            <FaBars />
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Header;
