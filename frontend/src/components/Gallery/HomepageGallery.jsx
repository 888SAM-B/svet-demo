import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, X, Image as ImageIcon, Eye } from 'lucide-react';
import { galleryApi } from '../../services/galleryApi';
import { getImageUrl } from '../../services/countryApi';

export default function HomepageGallery() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lightboxIndex, setLightboxIndex] = useState(null);

  useEffect(() => {
    galleryApi.getPublicGallery()
      .then(data => {
        setImages(data || []);
      })
      .catch(err => {
        console.error('Failed to load gallery images:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <section className="py-20 bg-white border-b border-[#DBE2EF]">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-[#DBE2EF] rounded w-24 mx-auto" />
            <div className="h-8 bg-[#DBE2EF] rounded w-64 mx-auto" />
            <div className="h-4 bg-[#DBE2EF] rounded w-96 mx-auto" />
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 pt-12">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="aspect-video bg-[#DBE2EF] rounded-xl" />
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  // If there are no images, do not show the section
  if (!images.length) return null;

  const handlePrev = (e) => {
    e.stopPropagation();
    setLightboxIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = (e) => {
    e.stopPropagation();
    setLightboxIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <section id="gallery" className="py-24 bg-white border-b border-[#DBE2EF] overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 space-y-16">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs uppercase tracking-widest text-[#3F72AF] font-bold">
            Campus Gallery
          </span>
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-[#112D4E]">
            Glimpses of Global Medical Education
          </h2>
          <p className="text-sm sm:text-base text-[#3F72AF]/95 font-light leading-relaxed">
            Explore high-quality classrooms, state-of-the-art laboratories, and vibrant campus lives of our students studying medicine abroad.
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {images.map((img, index) => (
            <motion.div
              key={img.id || index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              onClick={() => setLightboxIndex(index)}
              className="group relative aspect-video rounded-2xl overflow-hidden border border-[#DBE2EF] bg-[#F9F7F7] cursor-pointer shadow-sm hover:shadow-lg transition-all duration-300"
            >
              {/* Image */}
              <img
                src={getImageUrl(img.image_path)}
                alt={img.title || `Gallery Image ${index + 1}`}
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
              />

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5">
                <div className="flex items-center justify-between">
                  <div className="text-white">
                    <p className="text-[10px] uppercase tracking-wider text-blue-200 font-semibold mb-1">
                      Campus Life
                    </p>
                    <h4 className="font-display font-bold text-sm sm:text-base leading-tight">
                      {img.title || 'Student Spotlight'}
                    </h4>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white border border-white/20">
                    <Eye className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Fullscreen Lightbox Modal */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4"
            onClick={() => setLightboxIndex(null)}
          >
            {/* Close Button */}
            <button
              onClick={() => setLightboxIndex(null)}
              className="absolute top-6 right-6 text-white/70 hover:text-white p-2.5 rounded-full bg-white/5 hover:bg-white/10 transition-colors border border-white/10"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Left Control */}
            <button
              onClick={handlePrev}
              className="absolute left-4 md:left-8 text-white/70 hover:text-white p-3 rounded-full bg-white/5 hover:bg-white/10 transition-colors border border-white/10"
              aria-label="Previous"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* Image & Caption Container */}
            <div className="relative max-w-5xl max-h-[80vh] flex flex-col items-center">
              <motion.img
                key={lightboxIndex}
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
                src={getImageUrl(images[lightboxIndex].image_path)}
                alt={images[lightboxIndex].title || ''}
                className="max-w-full max-h-[75vh] object-contain rounded-xl shadow-2xl border border-white/10"
                onClick={(e) => e.stopPropagation()}
              />
              {images[lightboxIndex].title && (
                <motion.div
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="mt-4 px-6 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-white text-xs sm:text-sm font-semibold tracking-wide"
                >
                  {images[lightboxIndex].title}
                </motion.div>
              )}
            </div>

            {/* Right Control */}
            <button
              onClick={handleNext}
              className="absolute right-4 md:right-8 text-white/70 hover:text-white p-3 rounded-full bg-white/5 hover:bg-white/10 transition-colors border border-white/10"
              aria-label="Next"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
