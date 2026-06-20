import React from 'react';
import { getImageUrl } from '../../../services/countryApi';

export default function HeroSection({ section }) {
  const { title, subtitle, image } = section.content_json || {};
  return (
    <div className="relative h-56 md:h-72 bg-primary-blue overflow-hidden">
      {image && (
        <img
          src={getImageUrl(image)}
          alt={title || 'Hero'}
          className="absolute inset-0 w-full h-full object-cover opacity-50"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-b from-primary-blue/40 to-primary-blue/80" />
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-8 py-6">
        {title && (
          <h2 className="font-display font-extrabold text-2xl md:text-3xl text-white leading-tight">
            {title}
          </h2>
        )}
        {subtitle && (
          <p className="text-blue-100/80 mt-3 text-sm md:text-base max-w-xl">{subtitle}</p>
        )}
      </div>
    </div>
  );
}
