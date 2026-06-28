import React, { useRef, useEffect, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import API from '../../utils/api';

export default function Contact() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const [contact, setContact] = useState({
    phone: '+91 98765 43210',
    whatsapp: '+91 98765 43210',
    address: 'Shanti Nagar, Balti Factory',
    city: 'Ludhiana, Punjab',
    email: 'info@maagayatrilibrary.com',
    mapEmbed: ''
  });

  useEffect(() => {
    API.get('/settings/public').then(res => {
      if (res.data?.contactInfo) setContact(res.data.contactInfo);
    }).catch(() => {});
  }, []);

  const whatsappNum = contact.whatsapp?.replace(/[^\d]/g, '') || '919876543210';

  return (
    <section id="contact" className="py-24 bg-white dark:bg-navy-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-16"
        >
          <span className="text-gold-600 dark:text-gold-400 font-semibold text-sm tracking-wider uppercase">Get In Touch</span>
          <h2 className="section-title mt-2">Contact Us</h2>
          <p className="section-subtitle">Come visit us, call us, or message us on WhatsApp. We're here to help.</p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            className="space-y-6"
          >
            <div className="card p-8">
              <h3 className="font-display text-2xl font-bold text-navy-900 dark:text-white mb-6">
                📚 Maa Gayatri Library
              </h3>
              
              <div className="space-y-5">
                <a href={`tel:${contact.phone}`} className="flex items-start gap-4 group">
                  <div className="w-12 h-12 bg-navy-100 dark:bg-navy-800 rounded-xl flex items-center justify-center group-hover:bg-gold-100 dark:group-hover:bg-gold-900/30 transition-colors flex-shrink-0">
                    <span className="text-2xl">📞</span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Phone</p>
                    <p className="font-semibold text-navy-900 dark:text-white group-hover:text-gold-600 dark:group-hover:text-gold-400 transition-colors">{contact.phone}</p>
                  </div>
                </a>

                <a
                  href={`https://wa.me/${whatsappNum}?text=Hello%20Maa%20Gayatri%20Library%2C%20I%20am%20interested%20in%20joining.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-4 group"
                >
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-xl flex items-center justify-center group-hover:bg-green-200 dark:group-hover:bg-green-900/40 transition-colors flex-shrink-0">
                    <span className="text-2xl">💬</span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">WhatsApp</p>
                    <p className="font-semibold text-green-600 dark:text-green-400">{contact.whatsapp}</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500">Click to chat now</p>
                  </div>
                </a>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-navy-100 dark:bg-navy-800 rounded-xl flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl">📍</span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Address</p>
                    <p className="font-semibold text-navy-900 dark:text-white">{contact.address}</p>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">{contact.city}</p>
                  </div>
                </div>

                {contact.email && (
                  <a href={`mailto:${contact.email}`} className="flex items-start gap-4 group">
                    <div className="w-12 h-12 bg-navy-100 dark:bg-navy-800 rounded-xl flex items-center justify-center flex-shrink-0">
                      <span className="text-2xl">✉️</span>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Email</p>
                      <p className="font-semibold text-navy-900 dark:text-white group-hover:text-gold-600 dark:group-hover:text-gold-400 transition-colors">{contact.email}</p>
                    </div>
                  </a>
                )}
              </div>

              {/* WhatsApp Button */}
              <a
                href={`https://wa.me/${whatsappNum}?text=Hello%20Maa%20Gayatri%20Library%2C%20I%20am%20interested%20in%20joining%20the%20library.%20Please%20share%20details.`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 flex items-center justify-center gap-3 w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-4 rounded-xl transition-all hover:shadow-lg hover:-translate-y-0.5"
              >
                <span className="text-xl">💬</span>
                Chat on WhatsApp
              </a>
            </div>
          </motion.div>

          {/* Map */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.2 }}
            className="card overflow-hidden"
          >
            {contact.mapEmbed ? (
              <div
                className="w-full h-full min-h-[400px]"
                dangerouslySetInnerHTML={{ __html: contact.mapEmbed }}
              />
            ) : (
              <iframe
                title="Maa Gayatri Library Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d108783.21043068282!2d75.72491025!3d30.9009!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x391a837462345d4b%3A0x4f5c13c1f4d57b9f!2sLudhiana%2C%20Punjab!5e0!3m2!1sen!2sin!4v1718000000000"
                width="100%"
                height="100%"
                className="min-h-[400px] border-0"
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
