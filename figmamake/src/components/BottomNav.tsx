import { Home, List, Heart, Truck } from 'lucide-react';

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  const tabs = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'categories', icon: List, label: 'Categories' },
    { id: 'favorites', icon: Heart, label: 'Favorites' },
    { id: 'orders', icon: Truck, label: 'Orders' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 safe-area-bottom">
      <div className="flex justify-around items-center max-w-md mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className="flex flex-col items-center gap-1 py-2 px-3"
            >
              <Icon
                className={`w-6 h-6 ${isActive ? 'text-[#1a3e3e]' : 'text-gray-400'}`}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}
