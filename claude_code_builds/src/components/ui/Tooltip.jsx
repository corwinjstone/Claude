import { useState } from 'react';
import { HelpCircle } from 'lucide-react';

export function Tooltip({ content, children }) {
  const [visible, setVisible] = useState(false);

  return (
    <span className="relative inline-flex items-center">
      <span
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={() => setVisible(false)}
        className="cursor-help"
      >
        {children ?? <HelpCircle size={14} className="text-gray-500 hover:text-gray-300 transition-colors" />}
      </span>
      {visible && (
        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-60 bg-gray-800 border border-gray-700 text-gray-200 text-xs rounded-lg p-3 shadow-xl z-50 pointer-events-none">
          {content}
          <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-700" />
        </span>
      )}
    </span>
  );
}
