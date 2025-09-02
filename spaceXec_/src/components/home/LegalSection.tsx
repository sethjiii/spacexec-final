import { Shield, FileCheck, Users, CheckCircle2, Award, Lock } from 'lucide-react';

const LegalSection = () => {
  const legalFeatures = [
    {
      icon: <Shield className="h-8 w-8" style={{ color: '#710014' }} />,
      title: "Verified Title Ownership",
      description: "All properties listed on our platform undergo thorough title checks for authenticity and clear ownership.",
      details: ["Multi-layer verification process", "Government record validation", "Clear ownership history", "Legal risk assessment"]
    },
    {
      icon: <FileCheck className="h-8 w-8" style={{ color: '#710014' }} />,
      title: "End-to-End Legal Support",
      description: "From due diligence to co-ownership agreements, our legal experts take care of the entire process.",
      details: ["Due diligence reports", "Co-ownership agreements", "Regulatory compliance", "Legal documentation"]
    },
    {
      icon: <Users className="h-8 w-8" style={{ color: '#710014' }} />,
      title: "Seamless Onboarding",
      description: "Complete all KYC and paperwork digitally in a few easy steps—no visits, no delays.",
      details: ["Digital KYC process", "Electronic signatures", "Instant verification", "Paperless transactions"]
    }
  ];

  const trustIndicators = [
    { icon: <Award className="h-6 w-6" />, value: "100%", label: "Verified Properties" },
    { icon: <Lock className="h-6 w-6" />, value: "₹500Cr+", label: "Secured Investments" },
    { icon: <FileCheck className="h-6 w-6" />, value: "Zero", label: "Legal Disputes" },
    { icon: <Shield className="h-6 w-6" />, value: "24/7", label: "Legal Support" }
  ];

  return (
    <section className="py-20" style={{ backgroundColor: '#F2F1ED' }}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="max-w-4xl mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6" style={{ color: '#161616' }}>
            Hassle-Free Title Deed & Documentation
          </h2>
          <div className="h-1 w-32 mb-8" style={{ backgroundColor: '#710014' }}></div>
          <p className="text-2xl font-medium mb-6" style={{ color: '#710014' }}>
            Legal Clarity. Total Transparency. Zero Stress.
          </p>
          <p className="text-lg leading-relaxed max-w-3xl" style={{ color: '#161616' }}>
            At SpaceXec, we ensure that every investment is backed by verified title deeds and 
            legally sound documentation. Our expert legal team manages all the paperwork so you don't have to.
          </p>
        </div>

        {/* Trust Indicators */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {trustIndicators.map((indicator, index) => (
            <div key={index} className="bg-white rounded-2xl p-6 text-center shadow-sm border" style={{ borderColor: '#B38F6F20' }}>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: '#B38F6F20' }}>
                <div style={{ color: '#710014' }}>
                  {indicator.icon}
                </div>
              </div>
              <div className="text-2xl font-bold mb-2" style={{ color: '#710014' }}>
                {indicator.value}
              </div>
              <div className="text-sm font-medium" style={{ color: '#161616' }}>
                {indicator.label}
              </div>
            </div>
          ))}
        </div>

        {/* Main Legal Features */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {legalFeatures.map((feature, index) => (
            <div key={index} className="bg-white rounded-3xl p-8 shadow-sm border hover:shadow-lg transition-shadow" style={{ borderColor: '#B38F6F40' }}>
              
              {/* Icon and Title */}
              <div className="mb-6">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4" style={{ backgroundColor: '#F2F1ED' }}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-3" style={{ color: '#161616' }}>
                  {feature.title}
                </h3>
                <p className="text-base leading-relaxed" style={{ color: '#161616' }}>
                  {feature.description}
                </p>
              </div>

              {/* Feature Details */}
              <div className="space-y-3">
                {feature.details.map((detail, detailIndex) => (
                  <div key={detailIndex} className="flex items-center">
                    <CheckCircle2 className="h-4 w-4 mr-3 flex-shrink-0" style={{ color: '#B38F6F' }} />
                    <span className="text-sm font-medium" style={{ color: '#710014' }}>
                      {detail}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA Section */}
        <div className="bg-white rounded-3xl p-12 shadow-sm border text-center" style={{ borderColor: '#B38F6F40' }}>
          <div className="max-w-2xl mx-auto">
            <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6" style={{ backgroundColor: '#710014' }}>
              <Shield className="h-10 w-10" style={{ color: '#F2F1ED' }} />
            </div>
            <h3 className="text-2xl font-bold mb-4" style={{ color: '#161616' }}>
              Your Investment is Legally Protected
            </h3>
            <p className="text-lg mb-6" style={{ color: '#161616' }}>
              Every document verified. Every investment secured. Every step transparent.
            </p>
            <p className="text-base font-medium" style={{ color: '#710014' }}>
              Join thousands of investors who trust SpaceXec for secure, legally compliant real estate investments.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
};

export default LegalSection;