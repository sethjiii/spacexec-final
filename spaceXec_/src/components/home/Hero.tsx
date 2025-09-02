import { useState, useEffect } from 'react';
import { ArrowRight, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Background images for the hero section
const backgroundImages = [
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=2075&q=80',
  'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2053&q=80',
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80'
];

const Hero = () => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveImageIndex((prevIndex) => (prevIndex + 1) % backgroundImages.length);
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  const scrollToNextSection = () => {
    const featuredSection = document.getElementById('featured-properties');
    if (featuredSection) {
      featuredSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* Background images with transition effect */}
      <div className="absolute inset-0">
        {backgroundImages.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-2000 ${
              index === activeImageIndex ? 'opacity-100' : 'opacity-0'
            }`}
            style={{
              backgroundImage: `url(${image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
        ))}
        {/* Clean overlay */}
        <div 
          className="absolute inset-0"
          style={{
            background: `linear-gradient(to right, rgba(22, 22, 22, 0.8), rgba(113, 0, 20, 0.6))`
          }}
        ></div>
      </div>

      {/* Hero content */}
      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-center">
        <div className="max-w-4xl">
          <span 
            className="inline-block px-3 py-1 text-sm font-medium rounded-full backdrop-blur-sm border"
            style={{ 
              color: '#F2F1ED', 
              borderColor: 'rgba(242, 241, 237, 0.2)',
              backgroundColor: 'rgba(242, 241, 237, 0.1)'
            }}
          >
            Fractional Real Estate Investment
          </span>
          
          <h1 className="mt-4 text-4xl sm:text-5xl md:text-6xl font-bold leading-tight mb-6" style={{ color: '#F2F1ED' }}>
            Own a Share of Luxury with SpaceXec
          </h1>
          
          <p 
            className="mt-6 max-w-xl text-lg"
            style={{ color: 'rgba(242, 241, 237, 0.8)' }}
          >
            SpaceXec: Owning Luxury Real Estate in India made Smarter, Easier, and More Affordable
          </p>
          
          <div className="mt-8 flex flex-wrap gap-4 mb-16">
            <Button
              size="lg"
              onClick={() => window.location.href='/properties'}
              className="rounded-md hover:opacity-90 transition-opacity"
              style={{ 
                backgroundColor: '#710014',
                color: '#F2F1ED'
              }}
            >
              Explore Our Offerings
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            
            <Button
              size="lg"
              onClick={() => window.location.href='/login'}
              variant="outline"
              className="rounded-md backdrop-blur-sm hover:bg-white hover:text-black transition-all"
              style={{ 
                borderColor: 'rgba(242, 241, 237, 0.2)',
                backgroundColor: 'rgba(242, 241, 237, 0.1)',
                color: '#F2F1ED'
              }}
            >
              Join Now
            </Button>
          </div>

          {/* Property stats */}
          <div className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-8">
            <div>
              <p className="text-3xl font-bold" style={{ color: '#F2F1ED' }}>200+</p>
              <p className="text-sm" style={{ color: 'rgba(242, 241, 237, 0.7)' }}>Properties Listed</p>
            </div>
            <div>
              <p className="text-3xl font-bold" style={{ color: '#F2F1ED' }}>15K+</p>
              <p className="text-sm" style={{ color: 'rgba(242, 241, 237, 0.7)' }}>Happy Investors</p>
            </div>
            <div>
              <p className="text-3xl font-bold" style={{ color: '#F2F1ED' }}>₹500Cr+</p>
              <p className="text-sm" style={{ color: 'rgba(242, 241, 237, 0.7)' }}>Property Value</p>
            </div>
            <div>
              <p className="text-3xl font-bold" style={{ color: '#F2F1ED' }}>12-18%</p>
              <p className="text-sm" style={{ color: 'rgba(242, 241, 237, 0.7)' }}>Annual Returns</p>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-pulse">
          <button
            onClick={scrollToNextSection}
            className="flex flex-col items-center justify-center transition-colors"
            style={{ color: 'rgba(242, 241, 237, 0.8)' }}
            aria-label="Scroll to featured properties"
          >
            <span className="text-xs uppercase tracking-wider mb-2">Scroll</span>
            <ChevronDown className="h-6 w-6" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;