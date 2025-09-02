import { BarChart3, Users, TrendingUp, Shield, Headphones, FileText, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Services = () => {
  const primaryServices = [
    {
      icon: <BarChart3 className="h-8 w-8" style={{ color: '#710014' }} />,
      title: "Performance Tracking",
      description: "Monitor your portfolio with detailed reports on rental income, occupancy rates, and capital appreciation.",
      features: [
        "Real-time portfolio dashboard",
        "Monthly income statements",
        "Property performance analytics",
        "ROI tracking & projections"
      ]
    },
    {
      icon: <Users className="h-8 w-8" style={{ color: '#710014' }} />,
      title: "Expert Support",
      description: "Access guidance from seasoned real estate professionals and financial advisors when you need it most.",
      features: [
        "Dedicated relationship manager",
        "Investment strategy consulting",
        "Market timing guidance",
        "Portfolio optimization advice"
      ]
    }
  ];

  const supportServices = [
    { icon: <Headphones className="h-6 w-6" />, title: "Priority Support", subtitle: "24/7 assistance" },
    { icon: <TrendingUp className="h-6 w-6" />, title: "Financial Advisory", subtitle: "Expert guidance" },
    { icon: <FileText className="h-6 w-6" />, title: "Market Research", subtitle: "Data-driven insights" },
    { icon: <Shield className="h-6 w-6" />, title: "Legal Protection", subtitle: "Secure investments" }
  ];

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 mb-20">
          <div className="lg:col-span-2">
            <h1 className="text-3xl lg:text-4xl font-bold mb-6" style={{ color: '#161616' }}>Services</h1>
            <div className="h-1 w-24 mb-8" style={{ backgroundColor: '#710014' }}></div>
            <p className="text-2xl font-medium mb-6" style={{ color: '#710014' }}>
              Investment Insights & Expert Support
            </p>
            <p className="text-2xl font-medium mb-6" style={{ color: '#710014' }}>
              Stay Informed. Make Smarter Decisions.
            </p>
            <p className="text-lg leading-relaxed" style={{ color: '#161616' }}>
              We empower you with real-time data, expert-backed market analysis, and transparent 
              performance tracking—so you can make confident investment choices.
            </p>
          </div>
          
          <div className="bg-gray-50 rounded-2xl p-8 lg:p-12 flex flex-col justify-center">
            <div className="text-center">
              <div className="text-4xl font-bold mb-2" style={{ color: '#710014' }}>98%</div>
              <div className="text-sm font-medium mb-4" style={{ color: '#161616' }}>Client Satisfaction</div>
              <div className="text-3xl font-bold mb-2" style={{ color: '#710014' }}>15K+</div>
              <div className="text-sm font-medium" style={{ color: '#161616' }}>Active Investors</div>
            </div>
          </div>
        </div>

        {/* Primary Services Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
          {primaryServices.map((service, index) => (
            <div key={index} className="bg-white border rounded-3xl p-10 shadow-sm hover:shadow-lg transition-shadow" style={{ borderColor: '#B38F6F40' }}>
              <div className="flex items-start mb-8">
                <div className="flex-shrink-0 mr-6">
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ backgroundColor: '#F2F1ED' }}>
                    {service.icon}
                  </div>
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-4" style={{ color: '#161616' }}>
                    {service.title}
                  </h3>
                  <p className="text-lg leading-relaxed" style={{ color: '#161616' }}>
                    {service.description}
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {service.features.map((feature, featureIndex) => (
                  <div key={featureIndex} className="flex items-center py-2">
                    <div className="w-2 h-2 rounded-full mr-3" style={{ backgroundColor: '#B38F6F' }}></div>
                    <span className="text-sm font-medium" style={{ color: '#710014' }}>
                      {feature}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Support Services Section */}
        <div className="rounded-3xl p-12 lg:p-16" style={{ backgroundColor: '#F2F1ED' }}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            <div>
              <h3 className="text-3xl font-bold mb-6" style={{ color: '#161616' }}>
                Dedicated Customer Support & Financial Advisory
              </h3>
              <p className="text-xl mb-8" style={{ color: '#710014' }}>
                Comprehensive support services to maximize your returns
              </p>
              
              <Button 
                size="lg" 
                className="rounded-xl font-semibold"
                style={{ 
                  backgroundColor: '#710014',
                  color: '#F2F1ED'
                }}
              >
                Schedule Consultation
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {supportServices.map((service, index) => (
                <div key={index} className="bg-white rounded-2xl p-6 shadow-sm">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: '#B38F6F20' }}>
                    <div style={{ color: '#710014' }}>
                      {service.icon}
                    </div>
                  </div>
                  <h4 className="text-lg font-semibold mb-2" style={{ color: '#161616' }}>
                    {service.title}
                  </h4>
                  <p className="text-sm font-medium" style={{ color: '#B38F6F' }}>
                    {service.subtitle}
                  </p>
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;