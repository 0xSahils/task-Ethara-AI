const variantClasses = {
  admin:    'bg-accent/10 text-accent border border-accent/20',
  member:   'bg-gray-100 text-gray-600',
  success:  'bg-green-100 text-green-700',
  warning:  'bg-yellow-100 text-yellow-700',
  danger:   'bg-red-100 text-danger',
  info:     'bg-blue-100 text-blue-700',
  default:  'bg-gray-100 text-gray-600',
};

export default function Badge({ children, variant = 'default', className = '' }) {
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${variantClasses[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
