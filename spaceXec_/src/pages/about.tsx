import React, { useState, useEffect } from 'react';
import { 
  FaRocket,
  FaUsers,
  FaEye,
  FaHeart,
  FaShieldAlt,
  FaLightbulb,
  FaStar,
  FaHandshake,
  FaChartLine,
  FaGlobe,
  FaAward,
  FaQuoteLeft,
  FaBuilding
} from 'react-icons/fa';

const AboutUs = () => {
  const [activeValue, setActiveValue] = useState(0);
  const [statsVisible, setStatsVisible] = useState(false);

  const values = [
    {
      icon: FaShieldAlt,
      title: "Integrity and Transparency",
      description: "We believe in complete honesty and openness in all our dealings. Every transaction, every detail, and every process is transparent to build lasting trust with our community."
    },
    {
      icon: FaUsers,
      title: "Customer-Centric Approach",
      description: "Our clients are at the heart of everything we do. We listen, understand, and tailor our solutions to meet the unique needs and aspirations of each investor."
    },
    {
      icon: FaLightbulb,
      title: "Innovation and Security",
      description: "We leverage cutting-edge technology and blockchain solutions to ensure the highest levels of security while continuously innovating to improve the investment experience."
    },
    {
      icon: FaStar,
      title: "Excellence in Service",
      description: "We are committed to delivering exceptional service at every touchpoint. Our team strives for perfection in every interaction and transaction."
    }
  ];

  const stats = [
    { number: "500+", label: "Luxury Properties" },
    { number: "2,00+", label: "Happy Investors" },
    { number: "$5M+", label: "Assets Under Management" },
    { number: "5+", label: "Countries Served" }
  ];

  const teamMembers = [
    {
      name: "Ashish Trivedi",
      role: "CEO & Founder",
      bio: "15+ years in luxury real estate and fintech innovation"
    },
    {
      name: "Sanskar Seth",
      role: "CTO",
      bio: "Blockchain expert with 2+ years in financial technology"
    },
    {
      name: "Ankit Tawar",
      role: "Head of Operations",
      bio: "Luxury asset management specialist with global experience"
    },
    // {
    //   name: "David Kim",
    //   role: "Head of Finance",
    //   bio: "Former investment banker specializing in alternative assets"
    // }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveValue((prev) => (prev + 1) % values.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [values.length]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStatsVisible(true);
        }
      },
      { threshold: 0.5 }
    );

    const statsElement = document.getElementById('stats-section');
    if (statsElement) {
      observer.observe(statsElement);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F2F1ED' }}>
      {/* Hero Section */}
      <section className="relative py-24 px-4 overflow-hidden" style={{ backgroundColor: '#161616' }}>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-32 h-32 rounded-full" style={{ backgroundColor: '#710014' }}></div>
          <div className="absolute bottom-20 right-10 w-48 h-48 rounded-full" style={{ backgroundColor: '#B38F6F' }}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full" style={{ backgroundColor: '#710014' }}></div>
        </div>
        
        <div className="container mx-auto text-center relative z-10">
          <div className="flex justify-center mb-8">
            <div 
              className="w-20 h-20 rounded-full flex items-center justify-center"
              style={{ backgroundColor: '#710014' }}
            >
              <FaBuilding className="w-10 h-10" style={{ color: '#F2F1ED' }} />
            </div>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6" style={{ color: '#F2F1ED' }}>
            About SpaceXec
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-4xl mx-auto leading-relaxed" style={{ color: '#B38F6F' }}>
            Revolutionizing luxury ownership through innovative fractional investment solutions
          </p>
          <div className="w-32 h-1 mx-auto rounded-full" style={{ backgroundColor: '#710014' }}></div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="flex items-center mb-6">
                <div 
                  className="w-16 h-16 rounded-full flex items-center justify-center mr-6"
                  style={{ backgroundColor: '#710014' }}
                >
                  <FaRocket className="w-8 h-8" style={{ color: '#F2F1ED' }} />
                </div>
                <h2 className="text-4xl font-bold" style={{ color: '#161616' }}>
                  Our Mission
                </h2>
              </div>
              <p className="text-lg leading-relaxed mb-8" style={{ color: '#B38F6F' }}>
                At SpaceXec, our mission is to revolutionize luxury ownership by making it accessible, 
                flexible, and transparent for discerning investors and enthusiasts. We break down financial 
                and logistical barriers through innovative fractional ownership solutions.
              </p>
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center p-6 rounded-2xl" style={{ backgroundColor: 'white' }}>
                  <FaHandshake className="w-8 h-8 mx-auto mb-3" style={{ color: '#710014' }} />
                  <h3 className="font-bold" style={{ color: '#161616' }}>Accessible</h3>
                </div>
                <div className="text-center p-6 rounded-2xl" style={{ backgroundColor: 'white' }}>
                  <FaChartLine className="w-8 h-8 mx-auto mb-3" style={{ color: '#710014' }} />
                  <h3 className="font-bold" style={{ color: '#161616' }}>Flexible</h3>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div 
                className="rounded-3xl p-12 shadow-2xl"
                style={{ backgroundColor: 'white' }}
              >
                <FaQuoteLeft className="w-12 h-12 mb-6" style={{ color: '#710014' }} />
                <blockquote className="text-xl italic leading-relaxed" style={{ color: '#161616' }}>
                  "We're not just changing how people invest in luxury assets - we're creating a new paradigm 
                  where exclusive ownership becomes inclusive opportunity."
                </blockquote>
                <div className="mt-6 pt-6 border-t" style={{ borderTopColor: '#F2F1ED' }}>
                  <p className="font-bold" style={{ color: '#710014' }}>SpaceXec Leadership Team</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section id="stats-section" className="py-20 px-4" style={{ backgroundColor: '#710014' }}>
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6" style={{ color: '#F2F1ED' }}>
              Our Impact in Numbers
            </h2>
            <div className="w-24 h-1 mx-auto rounded-full" style={{ backgroundColor: '#F2F1ED' }}></div>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div 
                key={index}
                className={`text-center transform transition-all duration-1000 ${
                  statsVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                }`}
                style={{ transitionDelay: `${index * 200}ms` }}
              >
                <div className="text-4xl md:text-5xl font-bold mb-3" style={{ color: '#F2F1ED' }}>
                  {stat.number}
                </div>
                <div className="text-lg font-medium" style={{ color: '#B38F6F' }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who We Are Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6" style={{ color: '#161616' }}>
              Who We Are
            </h2>
            <div className="w-24 h-1 mx-auto rounded-full mb-8" style={{ backgroundColor: '#710014' }}></div>
            <p className="text-xl leading-relaxed max-w-4xl mx-auto" style={{ color: '#B38F6F' }}>
              SpaceXec is built by experts in luxury assets, finance, and technology. We combine decades 
              of industry experience with cutting-edge blockchain technology to create a secure platform 
              where owners can confidently invest in fractions of high-value properties.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <div 
                key={index}
                className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 text-center group"
              >
                <div 
                  className="w-24 h-24 rounded-full mx-auto mb-6 flex items-center justify-center text-2xl font-bold group-hover:scale-110 transition-transform duration-300"
                  style={{ backgroundColor: '#F2F1ED', color: '#710014' }}
                >
                  {member.name.split(' ').map(n => n[0]).join('')}
                </div>
                <h3 className="text-xl font-bold mb-2" style={{ color: '#161616' }}>
                  {member.name}
                </h3>
                <p className="text-sm font-semibold mb-4" style={{ color: '#710014' }}>
                  {member.role}
                </p>
                <p className="text-sm leading-relaxed" style={{ color: '#B38F6F' }}>
                  {member.bio}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="py-20 px-4" style={{ backgroundColor: 'white' }}>
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="relative">
              <div 
                className="rounded-3xl p-12 shadow-2xl relative overflow-hidden"
                style={{ backgroundColor: '#F2F1ED' }}
              >
                <div className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-20" style={{ backgroundColor: '#710014' }}></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 rounded-full opacity-20" style={{ backgroundColor: '#B38F6F' }}></div>
                
                <FaEye className="w-16 h-16 mb-6 relative z-10" style={{ color: '#710014' }} />
                <h2 className="text-4xl font-bold mb-6 relative z-10" style={{ color: '#161616' }}>
                  Our Vision
                </h2>
                <p className="text-lg leading-relaxed relative z-10" style={{ color: '#B38F6F' }}>
                  We envision a future where luxury is shared and enjoyed by many, not just a few. 
                  Our platform fosters a community of smart investors who value flexibility, 
                  transparency, and smart asset management.
                </p>
              </div>
            </div>
            
            <div className="space-y-8">
              <div className="flex items-start space-x-6">
                <div 
                  className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: '#710014' }}
                >
                  <FaGlobe className="w-6 h-6" style={{ color: '#F2F1ED' }} />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-3" style={{ color: '#161616' }}>
                    Global Accessibility
                  </h3>
                  <p style={{ color: '#B38F6F' }}>
                    Breaking geographical barriers to luxury asset investment
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-6">
                <div 
                  className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: '#710014' }}
                >
                  <FaHandshake className="w-6 h-6" style={{ color: '#F2F1ED' }} />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-3" style={{ color: '#161616' }}>
                    Community Driven
                  </h3>
                  <p style={{ color: '#B38F6F' }}>
                    Building a network of like-minded investors and asset enthusiasts
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-6">
                <div 
                  className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: '#710014' }}
                >
                  <FaAward className="w-6 h-6" style={{ color: '#F2F1ED' }} />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-3" style={{ color: '#161616' }}>
                    Smart Investment
                  </h3>
                  <p style={{ color: '#B38F6F' }}>
                    Empowering intelligent decisions through data and technology
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 px-4" style={{ backgroundColor: '#F2F1ED' }}>
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6" style={{ color: '#161616' }}>
              Our Core Values
            </h2>
            <div className="w-24 h-1 mx-auto rounded-full" style={{ backgroundColor: '#710014' }}></div>
          </div>

          <div className="max-w-6xl mx-auto">
            {/* Value Navigation */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
              {values.map((value, index) => (
                <button
                  key={index}
                  onClick={() => setActiveValue(index)}
                  className={`p-6 rounded-2xl transition-all duration-300 transform hover:scale-105 ${
                    activeValue === index ? 'shadow-xl' : 'shadow-md hover:shadow-lg'
                  }`}
                  style={{ 
                    backgroundColor: activeValue === index ? '#710014' : 'white',
                    color: activeValue === index ? '#F2F1ED' : '#161616'
                  }}
                >
                  <value.icon className={`w-8 h-8 mx-auto mb-3 ${activeValue === index ? 'animate-pulse' : ''}`} />
                  <h3 className="font-bold text-sm lg:text-base">
                    {value.title}
                  </h3>
                </button>
              ))}
            </div>

            {/* Active Value Description */}
            <div 
              className="bg-white rounded-3xl p-8 lg:p-12 shadow-2xl transition-all duration-500"
              key={activeValue}
            >
              <div className="flex items-center mb-6">
                <div 
                  className="w-16 h-16 rounded-full flex items-center justify-center mr-6"
                  style={{ backgroundColor: '#710014' }}
                >
                  {React.createElement(values[activeValue].icon, {
                    className: "w-8 h-8",
                    style: { color: '#F2F1ED' }
                  })}
                </div>
                <h3 className="text-3xl font-bold" style={{ color: '#161616' }}>
                  {values[activeValue].title}
                </h3>
              </div>
              <p className="text-lg leading-relaxed" style={{ color: '#B38F6F' }}>
                {values[activeValue].description}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 px-4" style={{ backgroundColor: 'white' }}>
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6" style={{ color: '#161616' }}>
              Meet Our Leadership
            </h2>
            <div className="w-24 h-1 mx-auto rounded-full mb-8" style={{ backgroundColor: '#710014' }}></div>
            <p className="text-xl max-w-3xl mx-auto" style={{ color: '#B38F6F' }}>
              Our team brings together decades of experience in luxury assets, finance, and technology
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <div 
                key={index}
                className="group cursor-pointer"
              >
                <div 
                  className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-4 text-center relative overflow-hidden"
                  style={{ border: `2px solid #F2F1ED` }}
                >
                  <div className="absolute top-0 left-0 w-full h-2" style={{ backgroundColor: '#710014' }}></div>
                  
                  <div 
                    className="w-24 h-24 rounded-full mx-auto mb-6 flex items-center justify-center text-2xl font-bold group-hover:scale-110 transition-transform duration-300"
                    style={{ backgroundColor: '#F2F1ED', color: '#710014' }}
                  >
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  
                  <h3 className="text-xl font-bold mb-2" style={{ color: '#161616' }}>
                    {member.name}
                  </h3>
                  <p className="text-sm font-semibold mb-4" style={{ color: '#710014' }}>
                    {member.role}
                  </p>
                  <p className="text-sm leading-relaxed" style={{ color: '#B38F6F' }}>
                    {member.bio}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4" style={{ backgroundColor: '#161616' }}>
        <div className="container mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6" style={{ color: '#F2F1ED' }}>
            Ready to Transform Your Investment Journey?
          </h2>
          <p className="text-xl mb-12 max-w-3xl mx-auto" style={{ color: '#B38F6F' }}>
            Join thousands of smart investors who are already building wealth through fractional luxury ownership
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <a
              href="/properties"
              className="px-10 py-4 rounded-full font-bold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl"
              style={{ 
                backgroundColor: '#710014', 
                color: '#F2F1ED'
              }}
            >
              Start Investing Today
            </a>
            <button 
              className="px-10 py-4 rounded-full font-bold text-lg border-2 transition-all duration-300 transform hover:scale-105"
              style={{ 
                borderColor: '#F2F1ED', 
                color: '#F2F1ED',
                backgroundColor: 'transparent'
              }}
            >
              Learn More
            </button>
          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: FaShieldAlt,
                title: "Secure & Transparent",
                description: "Blockchain-powered security and complete transparency"
              },
              {
                icon: FaUsers,
                title: "Expert Support",
                description: "Dedicated team of luxury asset specialists"
              },
              {
                icon: FaChartLine,
                title: "Smart Returns",
                description: "Optimized portfolio management and growth strategies"
              }
            ].map((feature, index) => (
              <div key={index} className="text-center">
                <div 
                  className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6"
                  style={{ backgroundColor: '#710014' }}
                >
                  <feature.icon className="w-8 h-8" style={{ color: '#F2F1ED' }} />
                </div>
                <h3 className="text-xl font-bold mb-3" style={{ color: '#F2F1ED' }}>
                  {feature.title}
                </h3>
                <p style={{ color: '#B38F6F' }}>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      {/* <footer className="py-12 px-4" style={{ backgroundColor: '#B38F6F' }}>
        <div className="container mx-auto text-center">
          <div className="mb-8">
            <img src="/logo.png" alt="SpaceXec Logo" className="h-12 mx-auto mb-4" />
            <p className="text-lg max-w-2xl mx-auto" style={{ color: '#F2F1ED' }}>
              Transforming luxury ownership through innovation, transparency, and community.
            </p>
          </div>
          
          <div className="border-t pt-8" style={{ borderTopColor: '#F2F1ED' }}>
            <p style={{ color: '#F2F1ED' }}>
              © 2025 SpaceXec. All rights reserved. | Revolutionizing Luxury Ownership
            </p>
          </div>
        </div>
      </footer> */}
    </div>
  );
};

export default AboutUs;