import React from 'react';
import Navbar from '../../components/Navbar';
import HeroSection from '../../components/HeroSection';
import FeaturesSection from '../../components/FeaturesSection';
import StatsSection from '../../components/StatsSection';
import Footer from '../../components/Footer';

import '../Home/Home.css';

const Home = () => {
  return (
    <div className="sweet-shop-landing">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <StatsSection />
      <Footer />
    </div>
  );
};

export default Home;
