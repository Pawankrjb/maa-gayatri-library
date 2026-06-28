import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const facilities = [
  { icon: '📶', title: 'High-Speed WiFi', desc: 'Unlimited internet access for research and online study materials.' },
  { icon: '📹', title: 'CCTV Security', desc: '24/7 surveillance for complete safety of students and their belongings.' },
  { icon: '💧', title: 'Drinking Water', desc: 'Clean filtered drinking water available throughout your study session.' },
  { icon: '🔌', title: 'Charging Points', desc: 'Individual charging points at every seat for phones, tablets, and laptops.' },
  { icon: '🪑', title: 'Comfortable Seating', desc: 'Ergonomic chairs and wide desks for long, productive study sessions.' },
  { icon: '🚿', title: 'Clean Washrooms', desc: 'Well-maintained, hygienic washrooms available for all students.' },
  { icon: '🌿', title: 'Peaceful Environment', desc: 'Strict silence policy maintained to ensure maximum concentration.' },
  { icon: '💡', title: 'Proper Lighting', desc: 'Eye-friendly lighting designed to reduce strain during long study hours.' },
];

export default function Facilities() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="facilities" className="py-24 bg-white dark:bg-navy-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-16"
        >
          <span className="text-gold-600 dark:text-gold-400 font-semibold text-sm tracking-wider uppercase">What We Offer</span>
          <h2 className="section-title mt-2">World-Class Facilities</h2>
          <p className="section-subtitle">
            Everything you need for a productive and comfortable study experience, all under one roof.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {facilities.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 0.08 * i }}
              whileHover={{ scale: 1.03 }}
              className="relative group bg-gray-50 dark:bg-navy-800 rounded-2xl p-6 border border-gray-100 dark:border-navy-700 hover:border-gold-400 dark:hover:border-gold-500 hover:shadow-lg transition-all duration-300 cursor-default"
            >
              <div className="absolute top-4 right-4 w-8 h-8 bg-gold-100 dark:bg-gold-900/20 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-gold-600 text-xs font-bold">✓</span>
              </div>
              <div className="text-5xl mb-4">{f.icon}</div>
              <h3 className="font-semibold text-navy-900 dark:text-white text-lg mb-2">{f.title}</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.5 }}
          className="mt-16 text-center bg-gradient-navy rounded-3xl p-12 text-white relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-gold-400/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <h3 className="font-display text-3xl font-bold mb-4">Ready to Start Your Journey?</h3>
          <p className="text-white/70 text-lg mb-8 max-w-xl mx-auto">
            Join hundreds of successful students who chose Maa Gayatri Library as their study home.
          </p>
          <button
            onClick={() => document.getElementById('fees')?.scrollIntoView({ behavior: 'smooth' })}
            className="btn-primary text-lg px-10 py-4"
          >
            View Membership Plans
          </button>
        </motion.div>
      </div>
    </section>
  );
}
