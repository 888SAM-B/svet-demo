import React from 'react';
import { getImageUrl } from '../../../services/countryApi';

export default function ImageSection({ section }) {
  const { image, caption } = section.content_json || {};
  if (!image) return null;
  return (
    <div className="px-8 py-8 border-b border-border-color last:border-0">
      {section.section_title && (
        <h3 className="font-display font-bold text-lg text-primary-blue mb-4">
          {section.section_title}
        </h3>
      )}
      <div className="rounded-xl overflow-hidden border border-border-color">
        <img
          src={getImageUrl(image)}
          alt={caption || section.section_title || 'Image'}
          className="w-full object-cover max-h-80"
        />
      </div>
      {caption && (
        <p className="text-xs text-secondary-text text-center mt-2 font-light italic">{caption}</p>
      )}
    </div>
  );
}
