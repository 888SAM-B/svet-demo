import React from 'react';

export const Card = ({
  children,
  className = '',
  glow = false,
  hoverGlow = false,
  onClick
}) => {
  const isInteractive = onClick || hoverGlow;
  
  return (
    <div
      onClick={onClick}
      className={`academic-card p-6 ${
        isInteractive ? 'academic-card-hover cursor-pointer' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
};
