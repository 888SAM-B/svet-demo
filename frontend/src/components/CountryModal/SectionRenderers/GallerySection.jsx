import React, { useState } from 'react';
import { getImageUrl } from '../../../services/countryApi';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

export default function GallerySection({ section }) {
  const { images = [] } = section.content_json || {};
  const [lightbox, setLightbox] = useState(null);

  if (!images.length) return null;

  return (
    <div className="px-8 py-8 border-b border-border-color last:border-0">
      {section.section_title && (
        <h3 className="font-display font-bold text-lg text-primary-blue mb-4">
          {section.section_title}
        </h3>
      )}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {images.map((img, i) => (
          <div
            key={i}
            className="rounded-lg overflow-hidden border border-border-color cursor-pointer hover:opacity-90 transition-opacity aspect-video"
            onClick={() => setLightbox(i)}
          >
            <img src={getImageUrl(img)} alt={`Gallery ${i + 1}`} className="w-full h-full object-cover" />
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {lightbox !== null && (
        <div className="fixed inset-0 z-[60] bg-black/90 flex items-center justify-center p-4" onClick={() => setLightbox(null)}>
          <button className="absolute top-4 right-4 text-white p-2" onClick={() => setLightbox(null)}>
            <X className="w-6 h-6" />
          </button>
          <button className="absolute left-4 text-white p-2" onClick={e => { e.stopPropagation(); setLightbox((lightbox - 1 + images.length) % images.length); }}>
            <ChevronLeft className="w-8 h-8" />
          </button>
          <img src={getImageUrl(images[lightbox])} alt="" className="max-w-full max-h-full rounded-lg" onClick={e => e.stopPropagation()} />
          <button className="absolute right-4 text-white p-2" onClick={e => { e.stopPropagation(); setLightbox((lightbox + 1) % images.length); }}>
            <ChevronRight className="w-8 h-8" />
          </button>
        </div>
      )}
    </div>
  );
}
