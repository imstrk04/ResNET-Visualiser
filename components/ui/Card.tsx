
import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className = '' }) => {
  return (
    <div className={`bg-slate-800/50 rounded-xl shadow-lg border border-slate-700 ${className}`}>
      {children}
    </div>
  );
};
