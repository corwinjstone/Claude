export function Card({ children, className = '', onClick, hover = false }) {
  return (
    <div
      onClick={onClick}
      className={`bg-gray-900 border border-gray-800 rounded-xl p-4 ${hover ? 'hover:border-gray-600 transition-colors cursor-pointer' : ''} ${className}`}
    >
      {children}
    </div>
  );
}
