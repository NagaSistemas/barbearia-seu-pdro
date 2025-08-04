import {
  FaCut,
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaWhatsapp,
  FaPaperPlane,
} from "react-icons/fa";

import React, { useState } from "react";

const Footer: React.FC = () => {
  const [newsletter, setNewsletter] = useState("");

  function handleNewsletterSubmit(e: React.FormEvent) {
    e.preventDefault();
    // Aqui você pode integrar com um backend ou Mailchimp
    alert("Inscrição realizada! (Simulação)");
    setNewsletter("");
  }

  return (
    <footer className="bg-secondary text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Marca + Descrição + Redes */}
          <div>
            <div className="flex items-center mb-6">
              <div className="bg-primary w-10 h-10 rounded-full flex items-center justify-center">
                <FaCut className="text-white text-xl" />
              </div>
              <span className="ml-3 text-2xl font-bold font-serif">Seu Pedro</span>
            </div>
            <p className="text-gray-400 mb-6">
              Barbearia premium oferecendo serviços de alta qualidade com profissionais experientes em um ambiente exclusivo.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-primary">
                <FaFacebookF />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary">
                <FaInstagram />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary">
                <FaTwitter />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary">
                <FaWhatsapp />
              </a>
            </div>
          </div>

          {/* Links rápidos */}
          <div>
            <h3 className="text-lg font-bold mb-6">Links Rápidos</h3>
            <ul className="space-y-3">
              <li>
                <a href="#home" className="text-gray-400 hover:text-primary transition">Início</a>
              </li>
              <li>
                <a href="#services" className="text-gray-400 hover:text-primary transition">Serviços</a>
              </li>
              <li>
                <a href="#barbers" className="text-gray-400 hover:text-primary transition">Barbeiros</a>
              </li>
              <li>
                <a href="#gallery" className="text-gray-400 hover:text-primary transition">Galeria</a>
              </li>
              <li>
                <a href="#testimonials" className="text-gray-400 hover:text-primary transition">Depoimentos</a>
              </li>
              <li>
                <a href="#contact" className="text-gray-400 hover:text-primary transition">Contato</a>
              </li>
            </ul>
          </div>

          {/* Serviços */}
          <div>
            <h3 className="text-lg font-bold mb-6">Serviços</h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-gray-400 hover:text-primary transition">Corte de Cabelo</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-primary transition">Barba Completa</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-primary transition">Corte + Barba</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-primary transition">Coloração</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-primary transition">Tratamento Capilar</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-primary transition">Pacote Premium</a>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-bold mb-6">Newsletter</h3>
            <p className="text-gray-400 mb-4">
              Inscreva-se para receber nossas promoções e novidades.
            </p>
            <form className="flex" onSubmit={handleNewsletterSubmit}>
              <input
                type="email"
                placeholder="Seu email"
                className="px-4 py-3 rounded-l-lg w-full text-gray-800"
                value={newsletter}
                onChange={e => setNewsletter(e.target.value)}
                required
              />
              <button type="submit" className="bg-primary px-4 py-3 rounded-r-lg">
                <FaPaperPlane />
              </button>
            </form>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-500">
          <p>&copy; 2023 Corte Clássico Barbearia. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
