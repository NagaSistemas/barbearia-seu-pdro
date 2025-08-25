import React from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Services } from './components/Services';
import { Barbers } from './components/Barbers';
import { Gallery } from './components/Gallery';
import { Testimonials } from './components/Testimonials';
import { BookingFormSimple as BookingForm } from './components/BookingFormSimple';

import { Footer } from './components/Footer';

export function App() {
  return (
    <div className="flex flex-col min-h-screen w-full">
      <Header />
      <main className="flex-grow">
        <Hero />
        <Services />
        <Barbers />
        <Gallery />
        <Testimonials />
        <BookingForm />

      </main>
      <Footer />
    </div>
  );
}