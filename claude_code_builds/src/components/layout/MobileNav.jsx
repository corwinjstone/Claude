import { NavLink } from 'react-router-dom';
import { Home, BarChart2, Briefcase, Newspaper, BookOpen } from 'lucide-react';

const tabs = [
  { to: '/',          label: 'Home',      icon: Home },
  { to: '/market',    label: 'Market',    icon: BarChart2 },
  { to: '/portfolio', label: 'Portfolio', icon: Briefcase },
  { to: '/news',      label: 'News',      icon: Newspaper },
  { to: '/learn',     label: 'Learn',     icon: BookOpen },
];

export function MobileNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-gray-950 border-t border-gray-800 md:hidden">
      <div className="flex items-stretch">
        {tabs.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex-1 flex flex-col items-center justify-center py-2 gap-0.5 text-xs transition-colors ${
                isActive ? 'text-blue-400' : 'text-gray-500'
              }`
            }
          >
            <Icon size={20} />
            <span>{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
