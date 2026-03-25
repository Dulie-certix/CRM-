import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

const paddings = { none: '', sm: 'p-4', md: 'p-5', lg: 'p-6' };

const Card: React.FC<CardProps> = ({ children, className = '', padding = 'md' }) => (
  <div className={`bg-white rounded-xl border border-border shadow-card ${paddings[padding]} ${className}`}>
    {children}
  </div>
);

export default Card;
