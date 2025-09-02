import React, { useState } from 'react';
import { 
  FaPhone, 
  FaEnvelope, 
  FaMapMarkerAlt, 
  FaClock,
  FaFacebookF,
  FaTwitter,
  FaLinkedinIn,
  FaInstagram,
  FaPaperPlane,
  FaCheckCircle
} from 'react-icons/fa';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSubmitting(false);
    setIsSubmitted(true);
    
    // Reset form after 3 seconds
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
    }, 3000);
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F2F1ED' }}>
      {/* Hero Section */}
      <section className="relative py-20 px-4" style={{ backgroundColor: '#161616' }}>
        <div className="container mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6" style={{ color: '#F2F1ED' }}>
            Get In Touch
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto leading-relaxed" style={{ color: '#B38F6F' }}>
            We're here to help you with all your real estate needs. Reach out to our expert team today.
          </p>
          <div className="w-24 h-1 mx-auto rounded-full" style={{ backgroundColor: '#710014' }}></div>
        </div>
      </section>

      {/* Contact Information Cards */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {[
              {
                icon: FaPhone,
                title: "Call Us",
                info: "+91 9717033809",
                subtitle: "Mon-Fri 9AM-6PM"
              },
              {
                icon: FaEnvelope,
                title: "Email Us",
                info: "contact@spacexec.com",
                subtitle: "24/7 Support"
              },
              {
                icon: FaMapMarkerAlt,
                title: "Visit Us",
                info: "114, Pyramid Urban Square, Sector 67A",
                subtitle: "Gurgaon, Haryana, India, 122102"
              },
              {
                icon: FaClock,
                title: "Office Hours",
                info: "Mon-Fri: 9AM-6PM",
                subtitle: "Sat: 10AM-4PM"
              }
            ].map((item, index) => (
              <div 
                key={index}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 text-center group"
                style={{ border: `1px solid #F2F1ED` }}
              >
                <div 
                  className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300"
                  style={{ backgroundColor: '#710014' }}
                >
                  <item.icon className="w-7 h-7" style={{ color: '#F2F1ED' }} />
                </div>
                <h3 className="text-xl font-bold mb-3" style={{ color: '#161616' }}>
                  {item.title}
                </h3>
                <p className="text-lg font-semibold mb-2" style={{ color: '#710014' }}>
                  {item.info}
                </p>
                <p className="text-sm" style={{ color: '#B38F6F' }}>
                  {item.subtitle}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            
            {/* Contact Form */}
            <div className="bg-white rounded-3xl shadow-2xl p-8 lg:p-12">
              <h2 className="text-3xl font-bold mb-8" style={{ color: '#161616' }}>
                Send Us a Message
              </h2>
              
              {isSubmitted ? (
                <div className="text-center py-12">
                  <div 
                    className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
                    style={{ backgroundColor: '#710014' }}
                  >
                    <FaCheckCircle className="w-10 h-10" style={{ color: '#F2F1ED' }} />
                  </div>
                  <h3 className="text-2xl font-bold mb-4" style={{ color: '#161616' }}>
                    Thank You!
                  </h3>
                  <p className="text-lg" style={{ color: '#B38F6F' }}>
                    Your message has been sent successfully. We'll get back to you soon.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold mb-2" style={{ color: '#161616' }}>
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-4 rounded-xl border-2 focus:outline-none focus:border-[#710014] focus:border-opacity-80 transition-all duration-200"
                        style={{ 
                          borderColor: '#B38F6F'
                        }}
                        placeholder="Enter your full name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2" style={{ color: '#161616' }}>
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-4 rounded-xl border-2 focus:outline-none focus:border-opacity-80 transition-all duration-200"
                        style={{ 
                          borderColor: '#B38F6F'
                        }}
                        placeholder="Enter your email"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold mb-2" style={{ color: '#161616' }}>
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full px-4 py-4 rounded-xl border-2 focus:outline-none focus:border-opacity-80 transition-all duration-200"
                        style={{ 
                          borderColor: '#B38F6F'
                        }}
                        placeholder="Enter your phone number"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2" style={{ color: '#161616' }}>
                        Subject *
                      </label>
                      <select
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-4 rounded-xl border-2 focus:outline-none focus:border-opacity-80 transition-all duration-200"
                        style={{ 
                          borderColor: '#B38F6F'
                        }}
                      >
                        <option value="">Select a subject</option>
                        <option value="general">General Inquiry</option>
                        <option value="property">Property Information</option>
                        <option value="marketplace">Marketplace Support</option>
                        <option value="partnership">Partnership Opportunities</option>
                        <option value="technical">Technical Support</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2" style={{ color: '#161616' }}>
                      Message *
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      rows={6}
                      className="w-full px-4 py-4 rounded-xl border-2 focus:outline-none focus:border-[#710014] focus:border-opacity-80 transition-all duration-200 resize-none"
                      style={{ 
                        borderColor: '#B38F6F'
                      }}
                      placeholder="Tell us how we can help you..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 px-8 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center justify-center space-x-3 disabled:opacity-70 disabled:cursor-not-allowed"
                    style={{ 
                      backgroundColor: '#710014', 
                      color: '#F2F1ED'
                    }}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <FaPaperPlane className="w-5 h-5" />
                        <span>Send Message</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>

            {/* Contact Information & Map */}
            <div className="space-y-8">
              {/* Company Info */}
              <div className="bg-white rounded-3xl shadow-2xl p-8 lg:p-12">
                <h2 className="text-3xl font-bold mb-8" style={{ color: '#161616' }}>
                  Let's Connect
                </h2>
                <div className="space-y-8">
                  <div>
                    <h3 className="text-xl font-bold mb-4" style={{ color: '#710014' }}>
                      Why Choose Us?
                    </h3>
                    <p className="text-lg leading-relaxed" style={{ color: '#161616' }}>
                      With over a decade of experience in real estate, we provide personalized service, 
                      market expertise, and innovative solutions to help you achieve your property goals.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-bold mb-4" style={{ color: '#710014' }}>
                      Our Services
                    </h3>
                    <ul className="space-y-3">
                      {[
                        'Residential Property Sales',
                        'Commercial Real Estate',
                        'Property Management',
                        'Investment Consultation',
                        'Market Analysis'
                      ].map((service, index) => (
                        <li key={index} className="flex items-center">
                          <div 
                            className="w-2 h-2 rounded-full mr-4"
                            style={{ backgroundColor: '#710014' }}
                          ></div>
                          <span style={{ color: '#161616' }}>{service}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Map Placeholder */}
              <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
                <div 
                  className="h-64 lg:h-80 flex items-center justify-center relative"
                  style={{ backgroundColor: '#B38F6F' }}
                >
                  <div className="text-center">
                    <FaMapMarkerAlt className="w-12 h-12 mx-auto mb-4" style={{ color: '#F2F1ED' }} />
                    <p className="text-lg font-semibold" style={{ color: '#F2F1ED' }}>
                      Interactive Map
                    </p>
                    <p className="text-sm" style={{ color: '#F2F1ED' }}>
                      123 Business Ave, New York, NY 10001
                    </p>
                  </div>
                  <div 
                    className="absolute bottom-4 right-4 px-4 py-2 rounded-full text-sm font-medium"
                    style={{ backgroundColor: '#710014', color: '#F2F1ED' }}
                  >
                    Get Directions
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4" style={{ backgroundColor: 'white' }}>
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-6" style={{ color: '#161616' }}>
              Frequently Asked Questions
            </h2>
            <div className="w-24 h-1 mx-auto rounded-full" style={{ backgroundColor: '#710014' }}></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {[
              {
                question: "How do I list my property?",
                answer: "You can list your property through our user dashboard or by contacting our team directly. We'll guide you through the entire process."
              },
              {
                question: "What are your commission rates?",
                answer: "Our commission rates are competitive and vary based on property type and services required. Contact us for a personalized quote."
              },
              {
                question: "Do you offer property management?",
                answer: "Yes, we provide comprehensive property management services including tenant screening, maintenance, and rent collection."
              },
              {
                question: "How long does it take to sell a property?",
                answer: "The timeline varies based on market conditions, property type, and pricing. On average, properties sell within 30-90 days."
              }
            ].map((faq, index) => (
              <div 
                key={index}
                className="p-6 rounded-2xl border-2 hover:shadow-lg transition-all duration-300"
                style={{ borderColor: '#F2F1ED' }}
              >
                <h3 className="text-lg font-bold mb-3" style={{ color: '#710014' }}>
                  {faq.question}
                </h3>
                <p className="leading-relaxed" style={{ color: '#B38F6F' }}>
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4" style={{ backgroundColor: '#710014' }}>
        <div className="container mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6" style={{ color: '#F2F1ED' }}>
            Ready to Get Started?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto" style={{ color: '#B38F6F' }}>
            Join thousands of satisfied clients who trust us with their real estate needs.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button 
              className="px-8 py-4 rounded-full font-bold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
              style={{ 
                backgroundColor: '#F2F1ED', 
                color: '#710014'
              }}
            >
              Schedule Consultation
            </button>
            <button 
              className="px-8 py-4 rounded-full font-bold text-lg border-2 transition-all duration-300 transform hover:scale-105"
              style={{ 
                borderColor: '#F2F1ED', 
                color: '#F2F1ED'
              }}
            >
              Browse Properties
            </button>
          </div>

          {/* Social Media Links */}
          <div className="mt-12">
            <p className="text-lg mb-6" style={{ color: '#B38F6F' }}>
              Follow us on social media
            </p>
            <div className="flex justify-center space-x-6">
              {[
                { icon: FaFacebookF, href: "#" },
                { icon: FaTwitter, href: "#" },
                { icon: FaLinkedinIn, href: "#" },
                { icon: FaInstagram, href: "#" }
              ].map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  className="w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110 hover:shadow-lg"
                  style={{ 
                    backgroundColor: '#F2F1ED', 
                    color: '#710014'
                  }}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      {/* <footer className="py-12 px-4" style={{ backgroundColor: '#161616' }}>
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <img src="/logo.png" alt="Logo" className="h-12 mb-4" />
              <p className="leading-relaxed" style={{ color: '#B38F6F' }}>
                Your trusted partner in real estate. We're committed to providing exceptional service and helping you achieve your property goals.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-bold mb-4" style={{ color: '#F2F1ED' }}>
                Quick Links
              </h3>
              <div className="space-y-2">
                {['Properties', 'Marketplace', 'About Us', 'Services'].map((link, index) => (
                  <a 
                    key={index}
                    href="#" 
                    className="block transition-colors duration-200 hover:text-opacity-80"
                    style={{ color: '#B38F6F' }}
                  >
                    {link}
                  </a>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-bold mb-4" style={{ color: '#F2F1ED' }}>
                Newsletter
              </h3>
              <p className="mb-4" style={{ color: '#B38F6F' }}>
                Stay updated with market trends and new listings.
              </p>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-1 px-4 py-3 rounded-l-xl border-0 focus:outline-none"
                  style={{ backgroundColor: '#F2F1ED', color: '#161616' }}
                />
                <button 
                  className="px-6 py-3 rounded-r-xl transition-all duration-200 hover:shadow-lg"
                  style={{ backgroundColor: '#710014', color: '#F2F1ED' }}
                >
                  Subscribe
                </button>
              </div>
            </div>
          </div>
          
          <div className="border-t mt-12 pt-8 text-center" style={{ borderTopColor: '#B38F6F' }}>
            <p style={{ color: '#B38F6F' }}>
              © 2025 Your Company Name. All rights reserved.
            </p>
          </div>
        </div>
      </footer> */}
    </div>
  );
};

export default ContactUs;