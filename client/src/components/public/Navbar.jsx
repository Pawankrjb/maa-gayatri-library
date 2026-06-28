import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import { SunIcon, MoonIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

const navLinks = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Facilities', href: '#facilities' },
  { label: 'Timings', href: '#timings' },
  { label: 'Fees', href: '#fees' },
  { label: 'Gallery', href: '#gallery' },
  { label: 'Contact', href: '#contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { dark, toggleTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (href) => {
    const id = href.replace('#', '');
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
    setMenuOpen(false);
  };

  return (
    <motion.nav
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/90 dark:bg-navy-950/90 backdrop-blur-md shadow-lg border-b border-gray-100 dark:border-navy-800' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <button onClick={() => scrollTo('#home')} className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-gold-400 to-gold-600 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-navy-900 font-display font-bold text-lg">M</span>
            </div>
            <div className="hidden sm:block">
              <p className="text-navy-900 dark:text-white font-display font-bold text-lg leading-tight">Maa Gayatri</p>
              <p className="text-gold-600 dark:text-gold-400 text-xs font-medium tracking-wider uppercase">Library</p>
            </div>
          </button>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map(link => (
              <button
                key={link.label}
                onClick={() => scrollTo(link.href)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  scrolled
                    ? 'text-gray-700 dark:text-gray-300 hover:text-navy-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-navy-800'
                    : 'text-white/90 hover:text-white hover:bg-white/10'
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-lg transition-all ${scrolled ? 'text-gray-700 dark:text-gray-300 hover:bg-black/10 dark:hover:bg-white/10' : 'text-white hover:bg-black/20'} focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-500`}
            >
              {dark ? <SunIcon className="w-5 h-5" /> : <MoonIcon className="w-5 h-5" />}
            </button>
            <Link
              to="/admin/login"
              className={`hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                scrolled ? 'bg-navy-900 dark:bg-navy-700 text-white hover:bg-navy-800' : 'glass text-white hover:bg-white/20'
              }`}
            >
              Admin
            </Link>
            <button
              onClick={() => scrollTo('#contact')}
              className="btn-primary text-sm px-5 py-2.5 hidden sm:inline-flex"
            >
              Join Now
            </button>
            {/* Mobile menu button */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className={`lg:hidden p-2 rounded-lg ${scrolled ? 'text-gray-700 dark:text-gray-300' : 'text-white'}`}
            >
              {menuOpen ? <XMarkIcon className="w-6 h-6" /> : <Bars3Icon className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white dark:bg-navy-900 border-t border-gray-100 dark:border-navy-800"
          >
            <div className="px-4 py-4 space-y-1">
              {navLinks.map(link => (
                <button
                  key={link.label}
                  onClick={() => scrollTo(link.href)}
                  className="block w-full text-left px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-navy-800 font-medium transition-all"
                >
                  {link.label}
                </button>
              ))}
              <div className="pt-2 flex gap-2">
                <Link to="/admin/login" className="flex-1 btn-secondary text-center text-sm">Admin</Link>
                <button onClick={() => scrollTo('#contact')} className="flex-1 btn-primary text-sm">Join Now</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
