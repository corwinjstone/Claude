const variants = {
  positive:  'bg-green-900/50 text-green-400 border-green-800',
  negative:  'bg-red-900/50 text-red-400 border-red-800',
  neutral:   'bg-gray-800 text-gray-400 border-gray-700',
  blue:      'bg-blue-900/50 text-blue-400 border-blue-800',
  yellow:    'bg-yellow-900/50 text-yellow-400 border-yellow-800',
};

export function Badge({ children, variant = 'neutral', className = '' }) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
}
