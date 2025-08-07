import React from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Services } from './components/Services';
import { Barbers } from './components/Barbers';
import { Gallery } from './components/Gallery';
import { Testimonials } from './components/Testimonials';
import { BookingForm } from './components/BookingForm';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
export function App() {
  return <div className="flex flex-col min-h-screen w-full">
      <Header />
      <main className="flex-grow">
        <Hero />
        <Services />
        <Barbers />
        <Gallery />
        <Testimonials />
        <BookingForm />
        <Contact />
      </main>
      <Footer />
    </div>;
}