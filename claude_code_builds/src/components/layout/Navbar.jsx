import { Link, useNavigate, useLocation } from 'react-router-dom';
import { TrendingUp, BarChart2, Briefcase, BookOpen, Newspaper, Search } from 'lucide-react';
import { usePortfolioStore } from '../../stores/portfolioStore';
import { formatCurrency } from '../../utils/formatters';
import { useState } from 'react';

const navLinks = [
  { to: '/',          label: 'Dashboard',  icon: TrendingUp },
  { to: '/market',    label: 'Market',     icon: BarChart2 },
  { to: '/portfolio', label: 'Portfolio',  icon: Briefcase },
  { to: '/news',      label: 'News',       icon: Newspaper },
  { to: '/learn',     label: 'Learn',      icon: BookOpen },
];

export function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { cash, holdings } = usePortfolioStore();
  const [search, setSearch] = useState('');

  function handleSearch(e) {
    e.preventDefault();
    const ticker = search.trim().toUpperCase();
    if (ticker) {
      navigate(`/stock/${ticker}`);
      setSearch('');
    }
  }

  return (
    <nav className="sticky top-0 z-40 bg-gray-950/95 backdrop-blur border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 flex items-center gap-4 h-16">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 text-white font-bold text-xl shrink-0 mr-2">
          <TrendingUp size={22} className="text-blue-400" />
          <span>MarketSim</span>
        </Link>

        {/* Search */}
        <form onSubmit={handleSearch} className="flex-1 max-w-xs">
          <div className="relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search ticker or company…"
              className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-9 pr-3 py-2 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>
        </form>

        {/* Nav links — hidden on small screens */}
        <div className="hidden md:flex items-center gap-1 flex-1">
          {navLinks.map(({ to, label, icon: Icon }) => {
            const active = location.pathname === to;
            return (
              <Link
                key={to}
                to={to}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  active ? 'bg-gray-800 text-white' : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/50'
                }`}
              >
                <Icon size={15} />
                {label}
              </Link>
            );
          })}
        </div>

        {/* Portfolio balance */}
        <Link
          to="/portfolio"
          className="ml-auto shrink-0 flex flex-col items-end text-right"
        >
          <span className="text-xs text-gray-500">Cash Available</span>
          <span className="text-sm font-semibold text-white">{formatCurrency(cash)}</span>
        </Link>
      </div>
    </nav>
  );
}
