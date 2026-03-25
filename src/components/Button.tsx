import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: React.ReactNode;
}

const variants: Record<string, string> = {
  primary:   'bg-primary hover:bg-primary-hover text-white shadow-sm',
  secondary: 'bg-primary/10 hover:bg-primary/20 text-primary',
  ghost:     'bg-transparent hover:bg-background text-text-secondary hover:text-text-primary',
  danger:    'bg-danger hover:bg-red-600 text-white shadow-sm',
  outline:   'bg-white border border-border hover:bg-background text-text-primary shadow-sm',
};

const sizes: Record<string, string> = {
  xs: 'h-7  px-2.5 text-xs  gap-1.5 rounded',
  sm: 'h-8  px-3   text-sm  gap-1.5 rounded-lg',
  md: 'h-9  px-4   text-sm  gap-2   rounded-lg',
  lg: 'h-10 px-5   text-base gap-2  rounded-lg',
};

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  children,
  className = '',
  disabled,
  ...props
}) => (
  <button
    className={`inline-flex items-center justify-center font-medium transition-all
                focus:outline-none focus:ring-2 focus:ring-primary/40 focus:ring-offset-1
                disabled:opacity-50 disabled:cursor-not-allowed
                ${variants[variant]} ${sizes[size]} ${className}`}
    disabled={disabled || loading}
    {...props}
  >
    {loading ? (
      <svg className="animate-spin h-3.5 w-3.5 shrink-0" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
      </svg>
    ) : icon ? (
      <span className="shrink-0">{icon}</span>
    ) : null}
    {children}
  </button>
);

export default Button;
