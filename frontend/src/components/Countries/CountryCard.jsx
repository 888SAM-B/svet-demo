import React from 'react';
import { motion } from 'framer-motion';
import { mockCountries } from '../../data/mockCountries';
import { Card } from '../Common/Card';
import { Button } from '../Common/Button';
import { Landmark, Languages, Clock, IndianRupee } from 'lucide-react';

export const CountryCard = ({ country, index }) => {
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
            <span className="text-4xl" role="img" aria-label={country.name}>
              {country.flag}
            </span>
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
              {country.description}
            </p>
          </div>

          <hr className="border-border-color my-1" />

          {/* Quick Stats */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs text-secondary-text">
              <IndianRupee className="w-3.5 h-3.5 text-secondary-blue shrink-0" />
              <span><strong className="text-primary-blue font-medium">Fee:</strong> {country.tuitionFee}</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-secondary-text">
              <Clock className="w-3.5 h-3.5 text-secondary-blue shrink-0" />
              <span><strong className="text-primary-blue font-medium">Duration:</strong> {country.duration}</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-secondary-text">
              <Languages className="w-3.5 h-3.5 text-secondary-blue shrink-0" />
              <span><strong className="text-primary-blue font-medium">Language:</strong> {country.language}</span>
            </div>
          </div>
        </div>

        {/* Universities List Preview */}
        <div className="mt-4 pt-3 border-t border-border-color space-y-2">
          <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-secondary-text font-semibold">
            <Landmark className="w-3 h-3 text-secondary-blue" />
            <span>Top Medical Academies</span>
          </div>
          <div className="text-[11px] text-primary-blue/80 line-clamp-1 font-medium italic">
            {country.popularUniversities.join(', ')}
          </div>
          
          <div className="pt-1">
            <Button variant="outline" className="w-full text-[10px] py-1.5 font-bold uppercase tracking-wider">
              Learn More
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default function CountryGrid() {
  return (
    <section id="countries" className="py-20 bg-primary-bg">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Section Title */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-xs uppercase tracking-widest text-secondary-blue font-bold">10 Premium Medical Destinations</span>
          <h2 className="font-display font-extrabold text-3xl md:text-4xl text-primary-blue">
            Choose Your Destination
          </h2>
          <p className="text-sm text-secondary-text leading-relaxed font-light">
            We partner with WHO, NMC & UNESCO recognized medical universities worldwide to provide you high-quality, English-medium MBBS courses at affordable costs.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {mockCountries.map((country, index) => (
            <CountryCard key={country.id} country={country} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
