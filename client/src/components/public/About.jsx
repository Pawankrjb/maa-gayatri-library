import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

const features = [
  {
    icon: '🤫',
    title: 'Quiet Environment',
    description: 'Maintain a strict no-noise policy to help every student concentrate deeply on their studies without interruptions.',
  },
  {
    icon: '🪑',
    title: 'Comfortable Seating',
    description: 'Ergonomic chairs and spacious desks designed for long study sessions. Your comfort is our priority.',
  },
  {
    icon: '🏆',
    title: 'Exam Excellence',
    description: 'The ideal study environment for UPSC, SSC, Banking, Railways, and all competitive exam preparation.',
  },
  {
    icon: '📅',
    title: 'Flexible Timings',
    description: 'Open from 6 AM to 10 PM, 7 days a week. Study at your own schedule and convenience.',
  },
  {
    icon: '🔒',
    title: 'Safe & Secure',
    description: '24/7 CCTV surveillance and secure premises to ensure your belongings and your wellbeing are always protected.',
  },
  {
    icon: '🌟',
    title: 'Supportive Community',
    description: 'Join hundreds of focused students who come here daily. Success is contagious in our inspiring atmosphere.',
  },
];

export default function About() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="about" className="py-24 bg-gray-50 dark:bg-[rgb(43,43,45)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" ref={ref}>
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7 }}
            className="relative"
          >
            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80"
                alt="Students studying"
                className="w-full h-[360px] sm:h-[500px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy-900/40 to-transparent" />
            </div>
            {/* Floating card */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ repeat: Infinity, duration: 4 }}
              className="absolute -bottom-6 -right-6 bg-white dark:bg-navy-800 rounded-2xl p-5 shadow-xl border border-gray-100 dark:border-navy-700"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gold-100 dark:bg-gold-900/30 rounded-xl flex items-center justify-center text-2xl">🎯</div>
                <div>
                  <p className="font-bold text-navy-900 dark:text-white">Goal-Oriented</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Study Environment</p>
                </div>
              </div>
            </motion.div>
            {/* Gold accent */}
            <div className="absolute -top-4 -left-4 w-24 h-24 bg-gold-400/20 rounded-full blur-2xl" />
          </motion.div>

          {/* Text */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <span className="text-gold-600 dark:text-gold-400 font-semibold text-sm tracking-wider uppercase">About Us</span>
            <h2 className="section-title mt-2">Why Students Choose Us</h2>
            <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed mb-6">
              Maa Gayatri Library is more than just a reading space — it's a sanctuary of focus and academic growth. 
              We understand that environment shapes performance, which is why we've created the perfect atmosphere 
              for serious students.
            </p>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-8">
              Whether you're preparing for UPSC, banking exams, or university studies, our library provides 
              everything you need to reach your goals. Join our community of achievers today.
            </p>
            <div className="flex flex-wrap gap-3">
              {['UPSC Prep', 'SSC/Banking', 'Medical Exams', 'Engineering', 'Board Exams', 'State PSC'].map(tag => (
                <span key={tag} className="px-4 py-2 bg-navy-100 dark:bg-navy-800 text-navy-700 dark:text-navy-200 rounded-full text-sm font-medium">
                  {tag}
                </span>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1 * i, duration: 0.5 }}
              className="card p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
            >
              <div className="text-4xl mb-4">{f.icon}</div>
              <h3 className="font-display font-semibold text-xl text-navy-900 dark:text-white mb-2 group-hover:text-gold-600 dark:group-hover:text-gold-400 transition-colors">{f.title}</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{f.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
