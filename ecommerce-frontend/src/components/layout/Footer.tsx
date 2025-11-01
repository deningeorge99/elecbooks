import React from 'react';
import { FiFacebook, FiTwitter, FiInstagram, FiLinkedin } from 'react-icons/fi';
import { useTheme } from '../../context/ThemeContext';

const FacebookIcon = FiFacebook as React.ComponentType<{ className?: string, size?: number }>;
const TwitterIcon = FiTwitter as React.ComponentType<{ className?: string, size?: number }>;
const InstagramIcon = FiInstagram as React.ComponentType<{ className?: string, size?: number }>;
const LinkedinIcon = FiLinkedin as React.ComponentType<{ className?: string, size?: number }>;

const Footer: React.FC = () => {
  const { colors } = useTheme();
  
  return (
    <footer className={`bg-[${colors.accent}] text-white py-12 mt-12`}>
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 bg-gradient-to-r from-[#d7773e] to-[#e8955f] text-white p-8 rounded-lg">
          {/* Company Info */}
          <div>
            <h3 className="text-xl font-bold mb-4 flex items-center">
              <span className="text-[#000000]">E</span>Commerce
            </h3>
            <p className="text-gray-300 mb-4">
              Your one-stop shop for all your needs. Quality products, affordable prices.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-[#d7773e] transition-colors">
                <FacebookIcon size={20} />
              </a>
              <a href="#" className="text-gray-300 hover:text-[#d7773e] transition-colors">
                <TwitterIcon size={20} />
              </a>
              <a href="#" className="text-gray-300 hover:text-[#d7773e] transition-colors">
                <InstagramIcon size={20} />
              </a>
              <a href="#" className="text-gray-300 hover:text-[#d7773e] transition-colors">
                <LinkedinIcon size={20} />
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-300 hover:text-[#d7773e] transition-colors">Home</a></li>
              <li><a href="#" className="text-gray-300 hover:text-[#d7773e] transition-colors">Products</a></li>
              <li><a href="#" className="text-gray-300 hover:text-[#d7773e] transition-colors">Categories</a></li>
              <li><a href="#" className="text-gray-300 hover:text-[#d7773e] transition-colors">Deals</a></li>
              <li><a href="#" className="text-gray-300 hover:text-[#d7773e] transition-colors">Contact Us</a></li>
            </ul>
          </div>
          
          {/* Customer Service */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Customer Service</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-300 hover:text-[#d7773e] transition-colors">FAQ</a></li>
              <li><a href="#" className="text-gray-300 hover:text-[#d7773e] transition-colors">Shipping Policy</a></li>
              <li><a href="#" className="text-gray-300 hover:text-[#d7773e] transition-colors">Returns & Refunds</a></li>
              <li><a href="#" className="text-gray-300 hover:text-[#d7773e] transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-gray-300 hover:text-[#d7773e] transition-colors">Terms & Conditions</a></li>
            </ul>
          </div>
          
          {/* Newsletter */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Newsletter</h4>
            <p className="text-gray-300 mb-4">
              Subscribe to get special offers and updates
            </p>
            <form className="flex">
              <input
                type="email"
                placeholder="Your email"
                className="px-4 py-2 rounded-l-lg text-gray-800 focus:outline-none w-full"
              />
              <button
                type="submit"
                className={`bg-[${colors.primary}] text-white px-4 py-2 rounded-r-lg hover:bg-opacity-90`}
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} ECommerce. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;