import React from 'react';
import { getImageUrl } from '../../../services/countryApi';

export default function HeroSection({ section, country }) {
  const { title, subtitle, image } = section.content_json || {};
  const bgImage = image || country?.card_image;

  return (
    <div className="relative h-56 md:h-72 bg-transparent overflow-hidden">
      {bgImage && (
        <img
          src={getImageUrl(bgImage)}
          alt={title || 'Hero Background'}
          className="absolute inset-0 w-full h-full object-cover opacity-100"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-b from-[#112D4E]/80 to-[#112D4E]/95" />
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-8 py-6">
        {title && (
          <h2 className="font-display font-extrabold text-2xl md:text-4xl text-white leading-tight drop-shadow-md">
            {title}
          </h2>
        )}
        {subtitle && (
          <p className="text-blue-100/90 mt-3 text-sm md:text-base max-w-xl drop-shadow-sm font-light">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}
