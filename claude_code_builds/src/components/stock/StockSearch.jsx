import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import { useSymbolSearch } from '../../hooks/useSymbolSearch';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { POPULAR_TICKERS } from '../../utils/constants';

function useDebounce(value, delay) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

export function StockSearch({ placeholder = 'Search stocks…', onSelect, className = '' }) {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const debouncedQuery = useDebounce(query, 350);

  const { data: results, isFetching } = useSymbolSearch(debouncedQuery);

  useEffect(() => {
    function handler(e) {
      if (!ref.current?.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  function select(symbol) {
    setQuery('');
    setOpen(false);
    if (onSelect) onSelect(symbol);
    else navigate(`/stock/${symbol}`);
  }

  const items = debouncedQuery.length >= 1 ? (results ?? []) : [];
  const showPopular = debouncedQuery.length === 0;

  return (
    <div ref={ref} className={`relative ${className}`}>
      <div className="relative">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
        <input
          value={query}
          onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          placeholder={placeholder}
          className="w-full bg-gray-800 border border-gray-700 rounded-xl pl-9 pr-8 py-2.5 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
        />
        {query && (
          <button onClick={() => setQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300">
            <X size={14} />
          </button>
        )}
      </div>

      {open && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-gray-900 border border-gray-700 rounded-xl shadow-2xl z-50 overflow-hidden">
          {isFetching && (
            <div className="flex items-center justify-center py-4">
              <LoadingSpinner size="sm" />
            </div>
          )}

          {!isFetching && items.length > 0 && (
            <ul>
              {items.map((r) => (
                <li key={r.symbol}>
                  <button
                    onClick={() => select(r.symbol)}
                    className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-800 transition-colors text-left"
                  >
                    <span className="text-sm font-bold text-white w-16 shrink-0">{r.symbol}</span>
                    <span className="text-xs text-gray-400 truncate">{r.description}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}

          {!isFetching && debouncedQuery.length >= 1 && items.length === 0 && (
            <div className="px-4 py-3 text-sm text-gray-500">No results for "{debouncedQuery}"</div>
          )}

          {showPopular && (
            <div>
              <div className="px-4 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider">Popular</div>
              <ul>
                {POPULAR_TICKERS.map((t) => (
                  <li key={t.symbol}>
                    <button
                      onClick={() => select(t.symbol)}
                      className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-800 transition-colors text-left"
                    >
                      <span className="text-sm font-bold text-white w-16 shrink-0">{t.symbol}</span>
                      <span className="text-xs text-gray-400 truncate">{t.name}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
