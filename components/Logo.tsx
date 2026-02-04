
import React from 'react';
import { LogoIcon } from '../constants';

const Logo: React.FC<{ size?: 'sm' | 'md' | 'lg' }> = ({ size = 'md' }) => {
  const sizes = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  return (
    <div className="flex items-center gap-2 font-bold text-primary tracking-tight font-heading">
      <LogoIcon className={`${sizes[size]} text-[var(--primary)]`} />
      <span className={size === 'lg' ? 'text-2xl' : 'text-lg'}>
        Sustainability Council
      </span>
    </div>
  );
};

export default Logo;
