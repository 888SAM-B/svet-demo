import React from 'react';

export default function TableSection({ section }) {
  const { columns = [], rows = [] } = section.content_json || {};
  if (!columns.length) return null;
  return (
    <div className="px-8 py-8 border-b border-border-color last:border-0">
      {section.section_title && (
        <h3 className="font-display font-bold text-lg text-primary-blue mb-4">
          {section.section_title}
        </h3>
      )}
      <div className="overflow-x-auto rounded-lg border border-border-color">
        <table className="w-full text-sm text-left border-collapse">
          <thead>
            <tr className="bg-primary-blue text-white">
              {columns.map((col, i) => (
                <th key={i} className="px-4 py-3 font-semibold text-xs uppercase tracking-wider">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border-color">
            {rows.map((row, ri) => (
              <tr key={ri} className={ri % 2 === 0 ? 'bg-white' : 'bg-primary-bg/40'}>
                {row.map((cell, ci) => (
                  <td key={ci} className="px-4 py-3 text-secondary-text font-medium">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
