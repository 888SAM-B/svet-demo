import React from 'react';

export const Button = ({
  children,
  variant = 'primary',
  className = '',
  onClick,
  type = 'button',
  disabled = false
}) => {
  const baseStyle = 'inline-flex items-center justify-center px-6 py-2.5 font-display font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-secondary-blue/50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer text-sm';

  const variants = {
    primary: 'bg-secondary-blue hover:bg-primary-blue text-white shadow-sm active:scale-[0.98]',
    secondary: 'bg-transparent border border-border-color hover:border-secondary-blue text-primary-text hover:bg-secondary-bg active:scale-[0.98]',
    outline: 'border border-secondary-blue text-secondary-blue hover:bg-secondary-blue/5 active:scale-[0.98]',
    danger: 'bg-red-600 hover:bg-red-700 text-white shadow-sm active:scale-[0.98]',
    glass: 'bg-white border border-border-color text-secondary-text hover:bg-secondary-bg hover:text-primary-text active:scale-[0.98]',
  };

  return (
    <button
      type={type}
      className={`${baseStyle} ${variants[variant]} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};
