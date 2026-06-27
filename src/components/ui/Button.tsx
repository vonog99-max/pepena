import React from 'react';
import { cn } from '../../utils';
import { audio } from '../../audio/sounds';
import { motion, HTMLMotionProps } from 'motion/react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export function Button({ className, variant = 'primary', size = 'md', onClick, ...props }: ButtonProps) {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    audio.playClick();
    if (onClick) onClick(e);
  };

  const variants = {
    primary: 'bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-900/50',
    secondary: 'bg-gray-700 hover:bg-gray-600 text-white shadow-sm',
    danger: 'bg-red-600 hover:bg-red-500 text-white shadow-md shadow-red-900/50',
    ghost: 'bg-transparent hover:bg-white/10 text-gray-300'
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg font-bold'
  };

  return (
    <button
      onClick={handleClick}
      className={cn(
        'rounded-lg font-medium transition-all transform active:scale-95 disabled:opacity-50 disabled:pointer-events-none',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    />
  );
}
