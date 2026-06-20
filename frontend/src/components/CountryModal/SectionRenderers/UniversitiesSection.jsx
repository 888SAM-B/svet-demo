import React from 'react';
import { Landmark } from 'lucide-react';

export default function UniversitiesSection({ section }) {
  const { universities = [] } = section.content_json || {};
  if (!universities.length) return null;
  return (
    <div className="px-8 py-8 border-b border-border-color last:border-0">
      {section.section_title && (
        <h3 className="font-display font-bold text-lg text-primary-blue mb-4">
          {section.section_title}
        </h3>
      )}
      <div className="space-y-3">
        {universities.map((uni, i) => (
          <div key={i} className="flex gap-4 p-4 rounded-lg border border-border-color bg-white hover:border-secondary-blue/30 transition-colors">
            <div className="w-10 h-10 rounded-lg bg-secondary-blue/10 flex items-center justify-center shrink-0 border border-secondary-blue/20">
              <Landmark className="w-5 h-5 text-secondary-blue" />
            </div>
            <div>
              <p className="font-display font-bold text-sm text-primary-blue">{uni.name}</p>
              {uni.description && (
                <p className="text-xs text-secondary-text mt-1 font-light leading-relaxed">{uni.description}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
