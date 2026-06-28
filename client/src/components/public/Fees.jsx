import React, { useRef, useEffect, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import API from '../../utils/api';

export default function Fees() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const [plans, setPlans] = useState([
    { _id: '1', name: '1 Month', duration: 1, price: 700, description: 'Basic monthly plan', isPopular: false },
    { _id: '2', name: '3 Months', duration: 3, price: 1900, description: 'Quarterly plan – Save ₹200', isPopular: true },
    { _id: '3', name: '6 Months', duration: 6, price: 3500, description: 'Semi-annual plan – Save ₹700', isPopular: false },
    { _id: '4', name: '1 Year', duration: 12, price: 6000, description: 'Annual plan – Best Value', isPopular: false },
  ]);

  useEffect(() => {
    API.get('/settings/fee-plans').then(res => {
      if (res.data?.length) setPlans(res.data);
    }).catch(() => {});
  }, []);

  return (
    <section id="fees" className="py-24 bg-white dark:bg-navy-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-16"
        >
          <span className="text-gold-600 dark:text-gold-400 font-semibold text-sm tracking-wider uppercase">Membership</span>
          <h2 className="section-title mt-2">Affordable Fee Plans</h2>
          <p className="section-subtitle">
            Choose a plan that fits your schedule. All plans include access to all facilities.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((plan, i) => (
            <motion.div
              key={plan._id}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1 * i }}
              whileHover={{ scale: 1.03, y: -5 }}
              className={`relative rounded-2xl p-6 border-2 transition-all duration-300 flex flex-col ${
                plan.isPopular
                  ? 'bg-gradient-navy border-gold-500 text-white shadow-2xl shadow-navy-900/40'
                  : 'bg-white dark:bg-navy-800 border-gray-100 dark:border-navy-700 hover:border-gold-400'
              }`}
            >
              {plan.isPopular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-gold-500 text-navy-900 text-xs font-bold px-4 py-1 rounded-full shadow-lg">
                    MOST POPULAR
                  </span>
                </div>
              )}

              <div className={`text-sm font-medium mb-2 ${plan.isPopular ? 'text-gold-300' : 'text-gold-600 dark:text-gold-400'}`}>
                {plan.duration === 1 ? '1 Month' : plan.duration < 12 ? `${plan.duration} Months` : '1 Year'}
              </div>
              <h3 className={`font-display text-xl font-bold mb-1 ${plan.isPopular ? 'text-white' : 'text-navy-900 dark:text-white'}`}>
                {plan.name}
              </h3>
              <div className="my-4">
                <span className={`text-5xl font-display font-bold ${plan.isPopular ? 'text-gold-400' : 'text-navy-900 dark:text-white'}`}>
                  ₹{plan.price.toLocaleString('en-IN')}
                </span>
                <span className={`text-sm ml-1 ${plan.isPopular ? 'text-white/60' : 'text-gray-500 dark:text-gray-400'}`}>
                  /{plan.duration === 1 ? 'month' : `${plan.duration} months`}
                </span>
              </div>
              <p className={`text-sm mb-6 flex-1 ${plan.isPopular ? 'text-white/70' : 'text-gray-500 dark:text-gray-400'}`}>
                {plan.description}
              </p>

              <ul className="space-y-2 mb-6">
                {['All facilities included', 'WiFi access', 'CCTV security', 'Charging points'].map(f => (
                  <li key={f} className={`flex items-center gap-2 text-sm ${plan.isPopular ? 'text-white/80' : 'text-gray-600 dark:text-gray-400'}`}>
                    <span className={`w-4 h-4 rounded-full flex items-center justify-center text-xs ${plan.isPopular ? 'bg-gold-500/30 text-gold-300' : 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'}`}>✓</span>
                    {f}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                className={`w-full py-3 rounded-xl font-semibold text-sm transition-all ${
                  plan.isPopular
                    ? 'bg-gold-500 hover:bg-gold-400 text-navy-900'
                    : 'bg-navy-900 dark:bg-navy-700 hover:bg-navy-800 text-white'
                }`}
              >
                Get Started
              </button>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.5 }}
          className="text-center text-gray-500 dark:text-gray-500 text-sm mt-8"
        >
          * All prices are inclusive of taxes. Contact us for group/institutional discounts.
        </motion.p>
      </div>
    </section>
  );
}
