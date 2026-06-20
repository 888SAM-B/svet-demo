import React from 'react';

export default function RichTextSection({ section }) {
  const { content } = section.content_json || {};
  return (
    <div className="px-8 py-8 border-b border-border-color last:border-0">
      {section.section_title && (
        <h3 className="font-display font-bold text-lg text-primary-blue mb-4">
          {section.section_title}
        </h3>
      )}
      <div
        className="text-sm text-secondary-text leading-relaxed
          [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:text-primary-blue [&_h1]:mb-3
          [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-primary-blue [&_h2]:mb-2
          [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-primary-blue [&_h3]:mb-2
          [&_p]:mb-3
          [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-3
          [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:mb-3
          [&_li]:mb-1
          [&_a]:text-secondary-blue [&_a]:underline [&_a]:hover:text-primary-blue
          [&_strong]:font-semibold [&_strong]:text-primary-blue
          [&_hr]:border-border-color [&_hr]:my-4"
        dangerouslySetInnerHTML={{ __html: content || '<p>No content.</p>' }}
      />
    </div>
  );
}
