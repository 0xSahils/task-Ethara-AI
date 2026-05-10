import { motion } from 'framer-motion';

const variants = {
  primary: 'bg-accent text-white hover:bg-opacity-90',
  danger:  'bg-danger text-white hover:bg-opacity-90',
  ghost:   'bg-transparent text-accent border border-accent hover:bg-accent hover:text-white',
  outline: 'bg-transparent text-gray-700 border border-gray-200 hover:bg-gray-50',
};

const sizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
};

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  className = '',
  ...props
}) {
  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      whileHover={{ opacity: 0.92 }}
      className={`inline-flex items-center gap-2 font-medium rounded-input transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading && (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      )}
      {children}
    </motion.button>
  );
}
