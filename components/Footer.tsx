
import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-green-900 text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-1">
            <h3 className="text-2xl font-bold mb-6 heading-font">PURECHAIN</h3>
            <p className="text-green-100 leading-relaxed">
              Leading the organic revolution in Sri Lanka through technology and transparency. From farm to fork with trust.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-6 text-lg">Quick Links</h4>
            <ul className="space-y-4">
              <li><Link to="/story" className="text-green-200 hover:text-white">Our Story</Link></li>
              <li><Link to="/shop" className="text-green-200 hover:text-white">Shop Online</Link></li>
              <li><Link to="/visit" className="text-green-200 hover:text-white">Visit Store</Link></li>
              <li><Link to="/experience" className="text-green-200 hover:text-white">Farm Experience</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-6 text-lg">Contact</h4>
            <ul className="space-y-4 text-green-200">
              <li>450, Havelock City Mall, Colombo 05</li>
              <li>+94 11 255 6897</li>
              <li>info@purechain.lk</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-6 text-lg">Newsletter</h4>
            <p className="text-green-200 mb-4">Subscribe for harvest updates and new recipes.</p>
            <div className="flex">
              <input type="email" placeholder="Email" className="bg-green-800 text-white px-4 py-2 rounded-l focus:outline-none w-full border border-green-700" />
              <button className="bg-green-600 px-4 py-2 rounded-r hover:bg-green-500">Join</button>
            </div>
          </div>
        </div>
        <div className="border-t border-green-800 pt-8 text-center text-green-300 text-sm">
          <p>&copy; {new Date().getFullYear()} PureChain. All rights reserved. Created by undergraduates of UoM.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
