import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, leftIcon, className = '', ...props }, ref) => {
    const inputCls = [
      'w-full h-10 rounded-lg border bg-white text-sm text-text-primary',
      'placeholder:text-text-muted transition',
      'focus:outline-none focus:ring-2 focus:border-primary',
      'disabled:bg-background disabled:cursor-not-allowed',
      leftIcon ? 'pl-9' : 'pl-3',
      'pr-3',
      error
        ? 'border-danger focus:ring-danger/30 focus:border-danger'
        : 'border-border focus:ring-primary/30',
      className,
    ].join(' ');

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label className="text-sm font-medium text-text-primary">{label}</label>
        )}
        <div className="relative">
          {leftIcon && (
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none">
              {leftIcon}
            </span>
          )}
          <input ref={ref} className={inputCls} {...props} />
        </div>
        {error && <p className="text-xs text-danger">{error}</p>}
        {hint && !error && <p className="text-xs text-text-muted">{hint}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
export default Input;
