import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

export default function FAQSection({ section }) {
  const { faqs = [] } = section.content_json || {};
  const [open, setOpen] = useState(null);
  if (!faqs.length) return null;
  return (
    <div className="px-8 py-8 border-b border-border-color last:border-0">
      {section.section_title && (
        <h3 className="font-display font-bold text-lg text-primary-blue mb-4">
          {section.section_title}
        </h3>
      )}
      <div className="space-y-2">
        {faqs.map((faq, i) => (
          <div key={i} className="border border-border-color rounded-lg overflow-hidden">
            <button
              onClick={() => setOpen(open === i ? null : i)}
              className="w-full flex items-center justify-between px-4 py-3 text-left bg-white hover:bg-primary-bg transition-colors cursor-pointer"
            >
              <span className="text-sm font-semibold text-primary-blue">{faq.question}</span>
              {open === i
                ? <ChevronUp className="w-4 h-4 text-secondary-blue shrink-0" />
                : <ChevronDown className="w-4 h-4 text-secondary-text shrink-0" />}
            </button>
            {open === i && (
              <div className="px-4 pb-4 pt-1 bg-primary-bg/30 text-sm text-secondary-text leading-relaxed">
                {faq.answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
