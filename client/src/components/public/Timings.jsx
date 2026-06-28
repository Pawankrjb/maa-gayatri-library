import React, { useRef, useEffect, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import API from '../../utils/api';

export default function Timings() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const [timing, setTiming] = useState({ openTime: '6:00 AM', closeTime: '10:00 PM', days: 'Monday to Sunday', notes: '' });

  useEffect(() => {
    API.get('/settings/public').then(res => {
      if (res.data?.libraryTiming) setTiming(res.data.libraryTiming);
    }).catch(() => {});
  }, []);

  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const isOpen = () => {
    const hour = time.getHours();
    return hour >= 6 && hour < 22;
  };

  return (
    <section id="timings" className="py-24 bg-gray-50 dark:bg-[rgb(43,43,45)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-16"
        >
          <span className="text-gold-600 dark:text-gold-400 font-semibold text-sm tracking-wider uppercase">Schedule</span>
          <h2 className="section-title mt-2">Library Timings</h2>
          <p className="section-subtitle">We're open 7 days a week to accommodate your study schedule.</p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Live Clock & Status */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              className="card p-8 text-center"
            >
              <div className="mb-4">
                <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full font-medium text-sm ${isOpen() ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
                  <span className={`w-2 h-2 rounded-full animate-pulse ${isOpen() ? 'bg-green-500' : 'bg-red-500'}`} />
                  {isOpen() ? 'Currently Open' : 'Currently Closed'}
                </span>
              </div>
              <div className="font-display text-6xl font-bold text-navy-900 dark:text-white mb-2">
                {time.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </div>
              <p className="text-gray-500 dark:text-gray-400">
                {time.toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </motion.div>

            {/* Timing Details */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.2 }}
              className="card p-8"
            >
              <h3 className="font-display font-bold text-2xl text-navy-900 dark:text-white mb-6">Opening Hours</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b border-gray-100 dark:border-navy-700">
                  <span className="font-medium text-gray-700 dark:text-gray-300">📅 Days Open</span>
                  <span className="font-semibold text-navy-900 dark:text-white">{timing.days}</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-100 dark:border-navy-700">
                  <span className="font-medium text-gray-700 dark:text-gray-300">🌅 Opening Time</span>
                  <span className="font-semibold text-gold-600 dark:text-gold-400 text-lg">{timing.openTime}</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-100 dark:border-navy-700">
                  <span className="font-medium text-gray-700 dark:text-gray-300">🌙 Closing Time</span>
                  <span className="font-semibold text-gold-600 dark:text-gold-400 text-lg">{timing.closeTime}</span>
                </div>
                <div className="py-3">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-700 dark:text-gray-300">⏱️ Total Hours</span>
                    <span className="font-semibold text-navy-900 dark:text-white">16 Hours/Day</span>
                  </div>
                </div>
              </div>
              {timing.notes && (
                <div className="mt-4 p-3 bg-gold-50 dark:bg-gold-900/20 rounded-xl">
                  <p className="text-sm text-gold-700 dark:text-gold-400">📌 {timing.notes}</p>
                </div>
              )}
            </motion.div>
          </div>

          {/* Day-wise timing */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.3 }}
            className="mt-8 card p-6"
          >
            <div className="grid grid-cols-7 gap-2">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => {
                const today = new Date().getDay();
                const isToday = (i + 1) % 7 === today % 7 || (i === 6 && today === 0);
                return (
                  <div key={day} className={`rounded-xl p-3 text-center transition-all ${isToday ? 'bg-gold-500 text-navy-900' : 'bg-gray-50 dark:bg-navy-800 text-gray-700 dark:text-gray-300'}`}>
                    <p className="font-semibold text-sm">{day}</p>
                    <p className={`text-xs mt-1 ${isToday ? 'text-navy-900/70' : 'text-gray-500 dark:text-gray-500'}`}>Open</p>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
