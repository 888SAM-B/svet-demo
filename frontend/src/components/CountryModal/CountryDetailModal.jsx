import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, RefreshCw, Globe, AlertCircle } from 'lucide-react';
import { countryApi, getImageUrl } from '../../services/countryApi';

import HeroSection        from './SectionRenderers/HeroSection';
import RichTextSection    from './SectionRenderers/RichTextSection';
import ImageSection       from './SectionRenderers/ImageSection';
import GallerySection     from './SectionRenderers/GallerySection';
import HighlightsSection  from './SectionRenderers/HighlightsSection';
import TableSection       from './SectionRenderers/TableSection';
import UniversitiesSection from './SectionRenderers/UniversitiesSection';
import FAQSection         from './SectionRenderers/FAQSection';
import CTASection         from './SectionRenderers/CTASection';

const SECTION_MAP = {
  hero:         HeroSection,
  rich_text:    RichTextSection,
  image:        ImageSection,
  gallery:      GallerySection,
  highlights:   HighlightsSection,
  table:        TableSection,
  universities: UniversitiesSection,
  faq:          FAQSection,
  cta:          CTASection,
};

export default function CountryDetailModal({ slug, onClose }) {
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  useEffect(() => {
    if (!slug) return;
    setData(null);
    setLoading(true);
    setError(null);
    countryApi.getPublicCountry(slug)
      .then(res => setData(res))
      .catch(err => setError(err.message || 'Failed to load content'))
      .finally(() => setLoading(false));
  }, [slug]);

  // Lock body scroll while modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  // Close on Escape key
  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onClose]);

  const country  = data?.country;
  const sections = data?.sections || [];

  return (
    <AnimatePresence>
      <motion.div
        key="modal-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6"
        onClick={onClose}
      >
        {/* Backdrop */}
        <div className="absolute inset-0 bg-primary-blue/70 backdrop-blur-sm" />

        {/* Modal Panel */}
        <motion.div
          key="modal-panel"
          initial={{ opacity: 0, scale: 0.96, y: 24 }}
          animate={{ opacity: 1, scale: 1,    y: 0  }}
          exit={{    opacity: 0, scale: 0.96, y: 24 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-[90vw] h-[90vh] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden"
          onClick={e => e.stopPropagation()}
        >
          {/* Sticky Header */}
          <div className="flex items-center justify-between px-6 sm:px-8 py-4 border-b border-border-color bg-white shrink-0">
            <div className="flex items-center gap-3">
              {country?.flag_image && (
                <img src={getImageUrl(country.flag_image)} alt={country.name} className="w-7 h-7 rounded object-cover" />
              )}
              <div>
                <h2 className="font-display font-extrabold text-base sm:text-xl text-primary-blue leading-tight">
                  {loading ? 'Loading…' : (country?.name || 'Country Details')}
                </h2>
                {country?.short_description && (
                  <p className="text-xs text-secondary-text font-light hidden sm:block">{country.short_description}</p>
                )}
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-primary-bg text-secondary-text hover:text-primary-blue transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Scrollable Body */}
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="flex flex-col items-center justify-center h-full gap-3 text-secondary-text">
                <RefreshCw className="w-6 h-6 animate-spin text-secondary-blue" />
                <p className="text-sm">Loading country details…</p>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center h-full gap-3 text-red-500 px-8">
                <AlertCircle className="w-8 h-8" />
                <p className="text-sm text-center">{error}</p>
                <p className="text-xs text-secondary-text text-center">Make sure the backend is running and sections have been added for this country.</p>
              </div>
            ) : sections.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full gap-4 px-8 text-center">
                <Globe className="w-12 h-12 text-border-color" />
                <p className="text-sm text-secondary-text">No content configured for this country yet.</p>
                <p className="text-xs text-secondary-text">Admin can add sections via Country Management → Page Builder.</p>
              </div>
            ) : (
              <div>
                {sections.map(section => {
                  const Component = SECTION_MAP[section.section_type];
                  if (!Component) return null;
                  return <Component key={section.id} section={section} />;
                })}
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
