import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function CTASection({ section }) {
  const { title, buttonText } = section.content_json || {};
  return (
    <div className="px-8 py-10 text-center bg-primary-blue">
      {title && (
        <h3 className="font-display font-extrabold text-xl md:text-2xl text-white mb-4">
          {title}
        </h3>
      )}
      {buttonText && (
        <Link to="/apply">
          <button className="inline-flex items-center gap-2 px-8 py-3 bg-white text-primary-blue font-bold text-sm rounded-lg hover:bg-secondary-bg transition-colors group cursor-pointer">
            {buttonText}
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </Link>
      )}
    </div>
  );
}
