import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin, Clock } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-[#B38F6F]/20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <Link to="/" className="text-xl md:text-2xl font-light inline-block text-[#161616]">
              Space<span className="font-medium text-[#710014]">X</span>ec
            </Link>
            <p className="mt-3 md:mt-4 text-xs md:text-sm text-[#B38F6F] max-w-md leading-relaxed">
              Transforming real estate investment through fractional ownership. Access premium properties with minimal investment.
            </p>
            <div className="mt-4 md:mt-6 flex space-x-3 md:space-x-4">
              <a href="#" className="text-[#B38F6F] hover:text-[#710014] transition-colors">
                <span className="sr-only">Facebook</span>
                <Facebook className="h-4 w-4 md:h-5 md:w-5" />
              </a>
              <a href="#" className="text-[#B38F6F] hover:text-[#710014] transition-colors">
                <span className="sr-only">Twitter</span>
                <Twitter className="h-4 w-4 md:h-5 md:w-5" />
              </a>
              <a href="https://www.instagram.com/spacexec/?igsh=MWZiNnJnZGltbXc0bQ%3D%3D#" className="text-[#B38F6F] hover:text-[#710014] transition-colors">
                <span className="sr-only">Instagram</span>
                <Instagram className="h-4 w-4 md:h-5 md:w-5" />
              </a>
              <a href="https://www.linkedin.com/company/spacexec/" className="text-[#B38F6F] hover:text-[#710014] transition-colors">
                <span className="sr-only">LinkedIn</span>
                <Linkedin className="h-4 w-4 md:h-5 md:w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xs md:text-sm font-medium text-[#161616] tracking-wider uppercase mb-3 md:mb-4">
              Properties
            </h3>
            <ul className="space-y-2">
              <li>
                <Link to="/properties?type=residential" className="text-xs md:text-sm text-[#B38F6F] hover:text-[#710014] transition-colors">
                  Residential
                </Link>
              </li>
              <li>
                <Link to="/properties?type=commercial" className="text-xs md:text-sm text-[#B38F6F] hover:text-[#710014] transition-colors">
                  Commercial
                </Link>
              </li>
              <li>
                <Link to="/properties?type=vacation" className="text-xs md:text-sm text-[#B38F6F] hover:text-[#710014] transition-colors">
                  Vacation Homes
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-xs md:text-sm text-[#B38F6F] hover:text-[#710014] transition-colors">
                  How It Works
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-xs md:text-sm font-medium text-[#161616] tracking-wider uppercase mb-3 md:mb-4">
              Contact
            </h3>
            <div className="space-y-3 md:space-y-4">
              <div>
                <div className="flex items-center mb-1">
                  <Phone className="h-4 w-4 text-[#710014] mr-2" />
                  <span className="text-xs md:text-sm font-medium text-[#161616]">Call Us</span>
                </div>
                <a href="tel:+919717033809" className="text-xs md:text-sm text-[#710014] font-medium hover:text-[#710014]/80 transition-colors block ml-6">
                  +91 9717033809
                </a>
                <p className="text-xs text-[#B38F6F] ml-6">Mon-Fri 9AM-6PM</p>
              </div>

              <div>
                <div className="flex items-center mb-1">
                  <Mail className="h-4 w-4 text-[#710014] mr-2" />
                  <span className="text-xs md:text-sm font-medium text-[#161616]">Email Us</span>
                </div>
                <a href="mailto:contact@spacexec.com" className="text-xs md:text-sm text-[#710014] font-medium hover:text-[#710014]/80 transition-colors block ml-6">
                  contact@spacexec.com
                </a>
                <p className="text-xs text-[#B38F6F] ml-6">24/7 Support</p>
              </div>
            </div>
          </div>

          {/* Office Info */}
          <div>
            <h3 className="text-xs md:text-sm font-medium text-[#161616] tracking-wider uppercase mb-3 md:mb-4">
              Office
            </h3>
            <div className="space-y-3 md:space-y-4">
              <div>
                <div className="flex items-start mb-1">
                  <MapPin className="h-4 w-4 text-[#710014] mr-2 mt-0.5" />
                  <span className="text-xs md:text-sm font-medium text-[#161616]">Visit Us</span>
                </div>
                <address className="text-xs md:text-sm text-[#B38F6F] not-italic ml-6 leading-relaxed">
                  114, Pyramid Urban Square,<br />
                  Sector 67A, Gurgaon,<br />
                  Haryana, India, 122102
                </address>
              </div>

              <div>
                <div className="flex items-center mb-1">
                  <Clock className="h-4 w-4 text-[#710014] mr-2" />
                  <span className="text-xs md:text-sm font-medium text-[#161616]">Office Hours</span>
                </div>
                <div className="text-xs md:text-sm text-[#B38F6F] ml-6">
                  <p>Mon-Fri: 9AM-6PM</p>
                  <p>Sat: 10AM-4PM</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 md:mt-12 pt-6 md:pt-8 border-t border-[#B38F6F]/20">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
            <p className="text-xs md:text-sm text-[#B38F6F]">
              &copy; {new Date().getFullYear()} SpaceXec. All rights reserved.
            </p>
            <div className="flex flex-wrap gap-4 md:gap-6">
              <Link to="/terms" className="text-xs md:text-sm text-[#B38F6F] hover:text-[#710014] transition-colors">
                Terms of Service
              </Link>
              <Link to="/privacypolicy" className="text-xs md:text-sm text-[#B38F6F] hover:text-[#710014] transition-colors">
                Privacy Policy
              </Link>
              <Link to="/refundPolicy" className="text-xs md:text-sm text-[#B38F6F] hover:text-[#710014] transition-colors">
                Refund Policy
              </Link>
              <Link to="/disclaimer" className="text-xs md:text-sm text-[#B38F6F] hover:text-[#710014] transition-colors">
                Disclaimer
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;