import { forwardRef } from 'react';

const Input = forwardRef(function Input(
  { label, error, className = '', ...props },
  ref
) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-sm font-medium text-gray-600">{label}</label>
      )}
      <input
        ref={ref}
        className={`w-full px-3 py-2.5 rounded-input border text-sm transition-all duration-200
          focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent
          ${error ? 'border-danger bg-red-50' : 'border-gray-200 bg-white'}
          ${className}`}
        {...props}
      />
      {error && <p className="text-xs text-danger mt-0.5">{error}</p>}
    </div>
  );
});

export default Input;
