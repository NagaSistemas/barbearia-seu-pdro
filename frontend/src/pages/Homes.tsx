import Header from "../components/Header";
import Hero from "../components/HeroSection";
import ServicesSection from "../components/ServicesSection";
import BarbersSection from "../components/BarbersSection";
import GallerySection from "../components/GallerySection";
import TestimonialSection from "../components/TestimonialSection";
import { BookingSection } from "../components/BookingSection";
import AppointmentSection from "../components/AppointmentSection";
import ContactSection from "../components/ContactSection";
import Footer from "../components/Footer";

const Home: React.FC = () => {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <ServicesSection />
        <BarbersSection />
        <GallerySection />
        <TestimonialSection />
        <BookingSection/>
        <AppointmentSection />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
};

export default Home;
