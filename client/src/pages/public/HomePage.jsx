import React from 'react';
import Navbar from '../../components/public/Navbar';
import Hero from '../../components/public/Hero';
import About from '../../components/public/About';
import Facilities from '../../components/public/Facilities';
import Timings from '../../components/public/Timings';
import Fees from '../../components/public/Fees';
import Gallery from '../../components/public/Gallery';
import Contact from '../../components/public/Contact';
import Footer from '../../components/public/Footer';

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <About />
      <Facilities />
      <Timings />
      <Fees />
      <Gallery />
      <Contact />
      <Footer />
    </div>
  );
}
