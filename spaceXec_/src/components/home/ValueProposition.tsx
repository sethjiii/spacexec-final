import { Building2, Percent, TrendingUp, Users, Shield, Star, CheckCircle2 } from 'lucide-react';

const ValueProposition = () => {
  const features = [
    {
      icon: <Building2 className="h-6 w-6" style={{ color: '#710014' }} />,
      title: "Curated, High-Quality Properties",
      description: "Each property on our platform is handpicked and thoroughly vetted for location, legal clarity, and ROI potential—so you invest only in the best.",
    },
    {
      icon: <Percent className="h-6 w-6" style={{ color: '#710014' }} />,
      title: "Earn Higher Returns",
      description: "Enjoy average annual returns of 12–18%, significantly higher than traditional investments like FDs or mutual funds.",
    },
    {
      icon: <TrendingUp className="h-6 w-6" style={{ color: '#710014' }} />,
      title: "Capital Growth & Rental Income",
      description: "Benefit from dual gains—steady monthly rental income and long-term property appreciation, all with low entry points.",
    },
    {
      icon: <Users className="h-6 w-6" style={{ color: '#710014' }} />,
      title: "Join a Growing Investor Community",
      description: "Co-invest alongside thousands of other savvy buyers in premium commercial, residential, and hospitality assets across India.",
    },
  ];

  const stats = [
    { value: "₹500 Cr+", label: "Assets Under Management" },
    { value: "18%", label: "Average Annual Return" },
    { value: "15,000+", label: "Active Investors" },
    { value: "98%", label: "Client Satisfaction Rate" },
  ];

  const offerings = [
    "Low-Entry Investment in High-End Real Estate",
    "Fully Managed and Expertly Maintained Luxury Properties Across India",
    "Transparent Ownership with Legal Protection",
    "Flexible Exit Options & Resale Opportunities",
  ];

  return (
    <section className="py-16 lg:py-20" style={{ backgroundColor: '#F2F1ED' }}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Stats Section */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 mb-16 lg:mb-20">
          {stats.map((stat, index) => (
            <div 
              key={index} 
              className="text-center p-6 bg-white rounded-xl shadow-sm border hover:shadow-md transition-shadow"
              style={{ borderColor: '#B38F6F20' }}
            >
              <p className="text-2xl lg:text-3xl font-bold mb-2" style={{ color: '#710014' }}>
                {stat.value}
              </p>
              <p className="text-sm font-medium" style={{ color: '#161616' }}>
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div>
            <span 
              className="inline-block rounded-full px-4 py-2 text-sm font-medium mb-6"
              style={{ 
                backgroundColor: '#710014',
                color: '#F2F1ED'
              }}
            >
              Why Choose SpaceXec
            </span>
            
            <h2 className="text-3xl lg:text-4xl font-bold mb-6" style={{ color: '#161616' }}>
              Revolutionizing Real Estate Investment for Everyone
            </h2>
            
            <p className="text-lg leading-relaxed mb-10" style={{ color: '#161616' }}>
              We're making real estate investment accessible, transparent, and profitable for everyday investors. Our platform breaks down the barriers to property ownership, allowing anyone to build a diversified real estate portfolio with minimal capital.
            </p>

            {/* Feature Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-12">
              {features.map((feature, index) => (
                <div key={index} className="group">
                  <div 
                    className="flex h-12 w-12 items-center justify-center rounded-xl mb-4 group-hover:scale-110 transition-transform"
                    style={{ backgroundColor: '#B38F6F20' }}
                  >
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-semibold mb-3" style={{ color: '#161616' }}>
                    {feature.title}
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: '#710014' }}>
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>

            {/* What We Offer */}
            <div className="bg-white rounded-xl p-6 lg:p-8 border" style={{ borderColor: '#B38F6F20' }}>
              <h3 className="text-xl font-bold mb-6" style={{ color: '#161616' }}>
                What We Offer:
              </h3>
              <div className="space-y-4">
                {offerings.map((offering, index) => (
                  <div key={index} className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 shrink-0 mt-0.5 mr-3" style={{ color: '#710014' }} />
                    <span className="text-sm font-medium" style={{ color: '#161616' }}>
                      {offering}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Image Section */}
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-xl">
              <img
                src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Premium property investment opportunity"
                className="w-full h-auto"
              />
              
              {/* Overlay information */}
              <div className="absolute bottom-0 left-0 right-0 p-6"
                   style={{
                     background: `linear-gradient(to top, rgba(22, 22, 22, 0.9), transparent)`
                   }}>
                <div className="flex justify-between items-end">
                  <div>
                    <h4 className="font-semibold mb-1" style={{ color: '#F2F1ED' }}>
                      Premium Office Space
                    </h4>
                    <p className="text-sm" style={{ color: '#B38F6F' }}>
                      Mumbai, Maharashtra
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg" style={{ color: '#F2F1ED' }}>
                      16.5%
                    </p>
                    <p className="text-sm" style={{ color: '#B38F6F' }}>
                      Annual Yield
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Floating testimonial card */}
            <div className="absolute -bottom-6 -left-6 bg-white rounded-lg shadow-xl p-4 max-w-[280px] border" 
                 style={{ borderColor: '#B38F6F40' }}>
              <div className="flex items-start">
                <div className="h-12 w-12 rounded-full overflow-hidden shrink-0">
                  <img
                    src="https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80"
                    alt="Investor testimonial"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="ml-3">
                  <div className="flex items-center mb-1">
                    <p className="text-sm font-semibold mr-2" style={{ color: '#161616' }}>
                      Rahul M.
                    </p>
                    <Star className="h-3 w-3 fill-current" style={{ color: '#B38F6F' }} />
                  </div>
                  <p className="text-xs leading-relaxed" style={{ color: '#710014' }}>
                    "I've earned 17% returns on my property investments in just 12 months!"
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ValueProposition;