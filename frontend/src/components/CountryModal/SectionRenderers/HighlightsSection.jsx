import React from 'react';
import { CheckCircle2 } from 'lucide-react';

export default function HighlightsSection({ section }) {
  const { items = [] } = section.content_json || {};
  if (!items.length) return null;
  return (
    <div className="px-8 py-8 border-b border-border-color last:border-0">
      {section.section_title && (
        <h3 className="font-display font-bold text-lg text-primary-blue mb-4">
          {section.section_title}
        </h3>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {items.map((item, i) => (
          <div key={i} className="flex items-start gap-2.5 p-3 bg-secondary-bg/40 rounded-lg border border-border-color">
            <CheckCircle2 className="w-4 h-4 text-secondary-blue shrink-0 mt-0.5" />
            <span className="text-sm text-primary-blue font-medium">{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
