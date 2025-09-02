import { CheckCircle2, ArrowRight, Building, TrendingUp, Shield, Crown, Slice } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FaMoneyBill, FaPizzaSlice } from 'react-icons/fa';

const HowItWorks = () => {
  const steps = [
    {
      id: 1,
      title: "Browse Premium Properties",
      description: "Browse our exclusive collection of luxury real estate vetted by experts for quality and investment potential.",
      icon: Building,
    },
    {
      id: 2,
      title: "Purchase Your Fraction",
      description: "Choose the ownership share that fits your budget and investment goals. Each property comes with a minimum investment threshold, giving you the flexibility to diversify your portfolio across multiple real estate assets.",
      icon: FaPizzaSlice,
    },
    {
      id: 3,
      title: "Quick & Easy Verification",
      description: "Complete a simple online KYC to verify your identity and meet legal requirements—fast, secure, and hassle-free. It ensures regulatory compliance while protecting your identity and investment.",
      icon: Shield,
    },
    {
      id: 4,
      title: "Enjoy Usage & Benefits",
      description: "Use your share for personal enjoyment, rent it out for passive income, or hold it as a long-term investment.",
      icon: Crown,
    },
    // {
    //   id: 5,
    //   title: "Easy Exit Options",
    //   description: "When ready, list your ownership share for resale on our platform — enjoy liquidity and transparent pricing.",
    //   icon: FaMoneyBill,
    // },
  ];

  const benefits = [
    "Premium Property Access",
    "Quarterly Dividend Returns",
    "Professional Asset Management",
    "Capital Appreciation Potential",
    "Diversified Portfolio Options",
    "White-Glove Service",
    "Flexible Exit Strategies",
    "Full Investment Transparency",
  ];

  return (
    <section className="py-16 lg:py-20" style={{ backgroundColor: '#F2F1ED' }}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 lg:mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4" style={{ color: '#161616' }}>
            How It Works ?
          </h2>
          <p className="text-lg" style={{ color: '#710014' }}>
            Premium fractional real estate investment made simple and accessible for sophisticated investors.
          </p>
        </div>

        {/* Process Steps */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 mb-16 lg:mb-20">
          {steps.map((step) => {
            const IconComponent = step.icon;
            return (
              <div 
                key={step.id} 
                className="relative flex flex-col items-center text-center group"
              >
                {/* Connection Arrow - Hidden on mobile */}
                {step.id < steps.length && (
                  <div className="absolute top-10 left-full w-full transform -translate-x-1/2 hidden lg:block">
                    <ArrowRight className="h-5 w-5 mx-auto" style={{ color: '#B38F6F' }} />
                  </div>
                )}
                
                {/* Step Circle */}
                <div className="relative mb-6">
                  <div 
                    className="flex h-20 w-20 items-center justify-center rounded-full shadow-lg group-hover:scale-110 transition-transform duration-300"
                    style={{ backgroundColor: '#710014' }}
                  >
                    <IconComponent className="h-8 w-8" style={{ color: '#F2F1ED' }} />
                  </div>
                  <div 
                    className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold"
                    style={{ backgroundColor: '#B38F6F', color: '#F2F1ED' }}
                  >
                    {step.id}
                  </div>
                </div>
                
                <h3 className="text-lg font-semibold mb-3" style={{ color: '#161616' }}>
                  {step.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: '#710014' }}>
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Benefits Section */}
        <div className="bg-white rounded-2xl p-8 lg:p-12 shadow-lg border" style={{ borderColor: '#B38F6F20' }}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div>
              <h3 className="text-2xl lg:text-3xl font-bold mb-6" style={{ color: '#161616' }}>
                Benefits of Premium 
                <span style={{ color: '#710014' }}> Fractional Ownership</span>
              </h3>
              <p className="text-gray-600 mb-8 leading-relaxed">
                Join an exclusive community of investors accessing institutional-grade properties 
                with professional management and transparent returns.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center">
                    <CheckCircle2 className="h-5 w-5 shrink-0 mr-3" style={{ color: '#710014' }} />
                    <span className="text-sm font-medium text-gray-700">{benefit}</span>
                  </div>
                ))}
              </div>
              
              <Button 
                size="lg" 
                className="rounded-lg font-semibold hover:scale-105 transition-all duration-300 shadow-lg"
                style={{ 
                  backgroundColor: '#710014', 
                  color: '#F2F1ED',
                  borderColor: '#710014'
                }}
              >
                Start Premium Investing
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
            
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Premium property investment portfolio"
                className="rounded-xl shadow-xl w-full h-auto"
              />
              
              {/* Stats Card */}
              <div className="absolute -bottom-4 -right-4 bg-white rounded-lg shadow-lg p-4 max-w-[200px] border" style={{ borderColor: '#B38F6F40' }}>
                <div className="flex items-center mb-2">
                  <div 
                    className="h-8 w-8 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: '#B38F6F' }}
                  >
                    <Crown className="h-4 w-4" style={{ color: '#F2F1ED' }} />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-semibold" style={{ color: '#161616' }}>
                      Premium Returns
                    </p>
                    <p className="text-xs" style={{ color: '#710014' }}>
                      15K+ Elite Investors
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;