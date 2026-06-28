import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-navy-950 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-gold-400 to-gold-600 rounded-xl flex items-center justify-center">
                <span className="text-navy-900 font-display font-bold text-lg">M</span>
              </div>
              <div>
                <p className="font-display font-bold text-lg text-white">Maa Gayatri Library</p>
                <p className="text-gold-400 text-xs">Study Library</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-4">
              A peaceful study environment for competitive exam aspirants and students who take their studies seriously.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-white mb-4 text-lg">Quick Links</h3>
            <ul className="space-y-2">
              {['About', 'Facilities', 'Timings', 'Fees', 'Gallery', 'Contact'].map(link => (
                <li key={link}>
                  <button
                    onClick={() => document.getElementById(link.toLowerCase())?.scrollIntoView({ behavior: 'smooth' })}
                    className="text-gray-400 hover:text-gold-400 transition-colors text-sm"
                  >
                    → {link}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-white mb-4 text-lg">Contact</h3>
            <div className="space-y-3 text-sm text-gray-400">
              <p>📍 Shanti Nagar, Balti Factory<br />Jehanabad,Bihar</p>
              <p>📞 +91 98765 43210</p>
              <p>✉️ info@maagayatrilibrary.com</p>
              <p>⏰ Mon–Sun: 6:00 AM – 10:00 PM</p>
            </div>
          </div>
        </div>

        <div className="border-t border-navy-800 mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">© {new Date().getFullYear()} Maa Gayatri Library. All rights reserved.</p>
          <Link to="/admin/login" className="text-gray-500 hover:text-gold-400 text-sm transition-colors">
            Admin Panel →
          </Link>
        </div>
      </div>
    </footer>
  );
}
