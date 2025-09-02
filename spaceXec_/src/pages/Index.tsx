
import { useState } from 'react';
import Hero from '@/components/home/Hero';
import FeaturedProperties from '@/components/home/FeaturedProperties';
import HowItWorks from '@/components/home/HowItWorks';
import ValueProposition from '@/components/home/ValueProposition';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import AuthModal from '@/components/auth/AuthModal';
import Services from '@/components/home/Services';
import LegalSection from '@/components/home/LegalSection';

const Index = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  return (
    <div className="min-h-screen">
      <Hero />
      {/* <FeaturedProperties /> */}
      <HowItWorks />
      <Services />
      <ValueProposition />
      <LegalSection />
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </div>
  );
};

export default Index;
