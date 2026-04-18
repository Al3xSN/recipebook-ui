'use client';

import { SpinnerIcon } from '@/components/icons';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  isLoading?: boolean;
  children: React.ReactNode;
}

const variantClasses: Record<NonNullable<ButtonProps['variant']>, string> = {
  primary:
    'bg-orange-500 hover:bg-orange-600 text-white shadow-sm focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2',
  secondary:
    'border border-gray-300 hover:bg-gray-50 text-gray-700 focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2',
  ghost:
    'hover:bg-gray-100 text-gray-700 focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2',
};

export const Button = ({
  variant = 'primary',
  isLoading,
  children,
  className = '',
  disabled,
  ...rest
}: ButtonProps) => {
  return (
    <button
      disabled={disabled || isLoading}
      className={`inline-flex items-center justify-center rounded-lg px-5 py-2 text-sm font-medium outline-none transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${variantClasses[variant]} ${className}`}
      {...rest}
    >
      {isLoading && <SpinnerIcon className="mr-2 h-4 w-4 animate-spin" />}
      {children}
    </button>
  );
};
