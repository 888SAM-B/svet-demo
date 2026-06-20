import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Landmark, Languages, Clock, IndianRupee, RefreshCw } from 'lucide-react';
import { Card } from '../Common/Card';
import { Button } from '../Common/Button';
import { countryApi, getImageUrl } from '../../services/countryApi';
import CountryDetailModal from '../CountryModal/CountryDetailModal';

// ── Individual Card ──────────────────────────────────────────────────────────
export const CountryCard = ({ country, index, onLearnMore }) => {
  const feeDisplay = country.starting_fee
    ? `₹${(country.starting_fee / 100000).toFixed(1)}L+ / year`
    : 'Contact for pricing';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.4, delay: index * 0.04 }}
      className="h-full"
    >
      <Card
        hoverGlow
        className="overflow-hidden h-full flex flex-col justify-between bg-white border border-border-color p-5 hover:border-secondary-blue/40"
      >
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-lg overflow-hidden bg-secondary-bg flex items-center justify-center border border-border-color shrink-0">
              {country.flag_image ? (
                <img src={getImageUrl(country.flag_image)} alt={country.name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-xl">🌍</span>
              )}
            </div>
            <div className="px-2.5 py-0.5 rounded text-[10px] uppercase font-bold bg-secondary-blue/10 text-secondary-blue border border-secondary-blue/25">
              MBBS
            </div>
          </div>

          {/* Title & Desc */}
          <div>
            <h4 className="font-display font-bold text-base text-primary-blue">
              {country.name}
            </h4>
            <p className="text-xs text-secondary-text mt-1.5 line-clamp-2 font-light leading-relaxed">
              {country.short_description || 'Quality MBBS programs at globally recognized universities.'}
            </p>
          </div>

          <hr className="border-border-color my-1" />

          {/* Quick Stats */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs text-secondary-text">
              <IndianRupee className="w-3.5 h-3.5 text-secondary-blue shrink-0" />
              <span><strong className="text-primary-blue font-medium">Fee:</strong> {feeDisplay}</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-secondary-text">
              <Clock className="w-3.5 h-3.5 text-secondary-blue shrink-0" />
              <span><strong className="text-primary-blue font-medium">Duration:</strong> 6 Years</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-secondary-text">
              <Languages className="w-3.5 h-3.5 text-secondary-blue shrink-0" />
              <span><strong className="text-primary-blue font-medium">Language:</strong> English</span>
            </div>
          </div>
        </div>

        {/* Learn More */}
        <div className="mt-4 pt-3 border-t border-border-color">
          <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-secondary-text font-semibold mb-2">
            <Landmark className="w-3 h-3 text-secondary-blue" />
            <span>Top Medical Academies</span>
          </div>
          <div className="pt-1">
            <Button
              variant="outline"
              onClick={() => onLearnMore(country.slug)}
              className="w-full text-[10px] py-1.5 font-bold uppercase tracking-wider"
            >
              Learn More
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

// ── Grid with API fetch + Modal ──────────────────────────────────────────────
export default function CountryGrid() {
  const [countries, setCountries] = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [activeSlug, setActiveSlug] = useState(null);

  useEffect(() => {
    countryApi.getPublicCountries()
      .then(data => setCountries(data))
      .catch(err => console.error('Failed to load countries:', err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section id="countries" className="py-20 bg-primary-bg">
      <div className="max-w-7xl mx-auto px-6">

        {/* Section Title */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-xs uppercase tracking-widest text-secondary-blue font-bold">
            {loading ? 'Loading…' : `${countries.length} Premium Medical Destinations`}
          </span>
          <h2 className="font-display font-extrabold text-3xl md:text-4xl text-primary-blue">
            Choose Your Destination
          </h2>
          <p className="text-sm text-secondary-text leading-relaxed font-light">
            We partner with WHO, NMC &amp; UNESCO recognized medical universities worldwide to provide you high-quality, English-medium MBBS courses at affordable costs.
          </p>
        </div>

        {/* Loading state */}
        {loading && (
          <div className="flex items-center justify-center gap-3 py-20 text-secondary-text">
            <RefreshCw className="w-5 h-5 animate-spin text-secondary-blue" />
            <span className="text-sm">Loading destinations…</span>
          </div>
        )}

        {/* Grid */}
        {!loading && countries.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {countries.map((country, index) => (
              <CountryCard
                key={country.id}
                country={country}
                index={index}
                onLearnMore={setActiveSlug}
              />
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && countries.length === 0 && (
          <div className="text-center py-16 text-secondary-text text-sm">
            No destinations available yet. Check back soon!
          </div>
        )}
      </div>

      {/* Country Detail Modal */}
      {activeSlug && (
        <CountryDetailModal
          slug={activeSlug}
          onClose={() => setActiveSlug(null)}
        />
      )}
    </section>
  );
}
