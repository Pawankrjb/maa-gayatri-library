import React, { useRef, useEffect, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import API from '../../utils/api';
import { XMarkIcon } from '@heroicons/react/24/outline';

const defaultImages = [
  { url: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600&q=80', caption: 'Library Interior' },
  { url: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=600&q=80', caption: 'Study Desks' },
  { url: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=600&q=80', caption: 'Reading Area' },
  { url: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600&q=80', caption: 'Students Studying' },
  { url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80', caption: 'Focused Study' },
  { url: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=600&q=80', caption: 'Quiet Environment' },
];

export default function Gallery() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const [images, setImages] = useState(defaultImages);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    API.get('/settings/public').then(res => {
      if (res.data?.galleryImages?.length) setImages(res.data.galleryImages);
    }).catch(() => {});
  }, []);

  return (
    <section id="gallery" className="py-24 bg-gray-50 dark:bg-[rgb(43,43,45)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-16"
        >
          <span className="text-gold-600 dark:text-gold-400 font-semibold text-sm tracking-wider uppercase">Gallery</span>
          <h2 className="section-title mt-2">See Our Library</h2>
          <p className="section-subtitle">A glimpse into the peaceful and productive atmosphere at Maa Gayatri Library.</p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {images.map((img, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 0.07 * i }}
              className={`relative rounded-2xl overflow-hidden cursor-pointer group ${i === 0 ? 'md:col-span-2 md:row-span-2' : ''}`}
              onClick={() => setSelected(img)}
            >
              <img
                src={img.url}
                alt={img.caption || 'Library'}
                className={`w-full object-cover group-hover:scale-105 transition-transform duration-500 ${i === 0 ? 'h-56 sm:h-64 md:h-full' : 'h-44 sm:h-48'}`}
              />
              <div className="absolute inset-0 bg-navy-900/0 group-hover:bg-navy-900/40 transition-all duration-300 flex items-end">
                <div className="p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <p className="text-white font-medium text-sm">{img.caption}</p>
                </div>
              </div>
              <div className="absolute top-3 right-3 w-8 h-8 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-white text-sm">🔍</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
            onClick={() => setSelected(null)}
          >
            <button
              onClick={() => setSelected(null)}
              className="absolute top-4 right-4 text-white p-2 hover:bg-white/10 rounded-xl"
            >
              <XMarkIcon className="w-8 h-8" />
            </button>
            <motion.img
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              src={selected.url}
              alt={selected.caption}
              className="max-w-full max-h-[90vh] rounded-2xl object-contain shadow-2xl"
              onClick={e => e.stopPropagation()}
            />
            {selected.caption && (
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute bottom-6 text-white/70 text-sm"
              >
                {selected.caption}
              </motion.p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
