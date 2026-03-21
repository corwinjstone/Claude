import { useState, useMemo } from 'react';
import { Search, ShoppingCart, MapPin, X } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Product } from '../types';
import { allProducts } from '../data/products';

interface HomeScreenProps {
  onProductClick: (product: Product) => void;
  onOpenCart: () => void;
  onAddToCart: (product: Product, quantity: number) => void;
  cartCount: number;
}

export function HomeScreen({ onProductClick, onOpenCart, onAddToCart, cartCount }: HomeScreenProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = [
    {
      name: 'Meats',
      id: 'meats',
      icon: '🥩',
      bgColor: 'bg-amber-100',
    },
    {
      name: 'Veggies',
      id: 'veggies',
      icon: '🥦',
      bgColor: 'bg-green-100',
    },
    {
      name: 'Fruits',
      id: 'fruits',
      icon: '🍎',
      bgColor: 'bg-red-100',
    },
    {
      name: 'Breads',
      id: 'breads',
      icon: '🥖',
      bgColor: 'bg-orange-100',
    },
  ];

  // Filter products based on search query and selected category
  const filteredProducts = useMemo(() => {
    let products = [...allProducts];

    // Filter by category
    if (selectedCategory) {
      products = products.filter(p => p.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      products = products.filter(p => 
        p.name.toLowerCase().includes(query) || 
        p.description.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query)
      );
    }

    return products;
  }, [searchQuery, selectedCategory]);

  // Display only first 3 for "You might need" section when no search
  const displayProducts = searchQuery.trim() || selectedCategory ? filteredProducts : filteredProducts.slice(0, 3);
  const showSeeMore = !searchQuery.trim() && !selectedCategory && filteredProducts.length > 3;

  const handleCategoryClick = (categoryId: string) => {
    if (selectedCategory === categoryId) {
      setSelectedCategory(null);
    } else {
      setSelectedCategory(categoryId);
      setSearchQuery('');
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
  };

  const handleSeeMore = () => {
    // Show all products by clearing filters
    setSelectedCategory(null);
    setSearchQuery('');
  };

  const handleQuickAdd = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    onAddToCart(product, 1);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-[#1a3e3e] px-4 pt-12 pb-6 rounded-b-3xl">
        {/* Search Bar */}
        <div className="flex items-center gap-3 mb-4">
          <div className="flex-1 bg-white rounded-full px-4 py-3 flex items-center gap-2">
            <Search className="w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search for 'Grocery'"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 outline-none text-sm"
            />
            {searchQuery && (
              <button onClick={handleClearSearch} className="p-1">
                <X className="w-4 h-4 text-gray-400" />
              </button>
            )}
          </div>
          <button 
            onClick={onOpenCart}
            className="bg-white rounded-full p-3 relative hover:bg-gray-100 transition-colors"
          >
            <ShoppingCart className="w-5 h-5 text-[#1a3e3e]" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>
        </div>

        {/* Location */}
        <button 
          onClick={() => alert('Location selector clicked')}
          className="text-center mb-6 w-full hover:opacity-80 transition-opacity"
        >
          <p className="text-gray-300 text-xs mb-1">Current Location</p>
          <div className="flex items-center justify-center gap-1">
            <p className="text-[#c5e17a]">California, USA</p>
            <MapPin className="w-4 h-4 text-[#c5e17a]" />
          </div>
        </button>

        {/* Categories */}
        <div className="flex justify-between gap-2">
          {categories.map((category) => (
            <button 
              key={category.name} 
              onClick={() => handleCategoryClick(category.id)}
              className={`flex flex-col items-center gap-2 transition-all ${
                selectedCategory === category.id ? 'opacity-100 scale-110' : 'opacity-80 hover:opacity-100'
              }`}
            >
              <div className={`${category.bgColor} w-16 h-16 rounded-full flex items-center justify-center text-2xl ${
                selectedCategory === category.id ? 'ring-4 ring-white ring-opacity-50' : ''
              }`}>
                {category.icon}
              </div>
              <span className="text-white text-xs">{category.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Active Filters */}
      {(searchQuery || selectedCategory) && (
        <div className="px-4 mt-4 flex items-center gap-2">
          <span className="text-sm text-gray-600">Active filters:</span>
          {searchQuery && (
            <span className="bg-gray-200 text-gray-700 text-xs px-3 py-1 rounded-full flex items-center gap-1">
              "{searchQuery}"
              <button onClick={handleClearSearch}>
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {selectedCategory && (
            <span className="bg-gray-200 text-gray-700 text-xs px-3 py-1 rounded-full flex items-center gap-1">
              {categories.find(c => c.id === selectedCategory)?.name}
              <button onClick={() => setSelectedCategory(null)}>
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
        </div>
      )}

      {/* Products section */}
      <div className="px-4 mt-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg text-gray-800">
            {searchQuery ? `Search results (${displayProducts.length})` : 
             selectedCategory ? `${categories.find(c => c.id === selectedCategory)?.name} (${displayProducts.length})` :
             'You might need'}
          </h2>
          {showSeeMore && (
            <button 
              onClick={handleSeeMore}
              className="text-sm text-orange-500 hover:text-orange-600 transition-colors"
            >
              See more
            </button>
          )}
        </div>

        {displayProducts.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-4xl">🔍</span>
            </div>
            <h3 className="text-lg text-gray-800 mb-2">No products found</h3>
            <p className="text-gray-500 text-sm mb-4">Try a different search or category</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory(null);
              }}
              className="text-orange-500 hover:text-orange-600 text-sm"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-3">
            {displayProducts.map((product) => (
              <button
                key={product.id}
                onClick={() => onProductClick(product)}
                className="bg-white rounded-2xl p-3 shadow-sm hover:shadow-md transition-shadow text-left"
              >
                <div className="aspect-square mb-2 rounded-xl overflow-hidden bg-gray-50">
                  <ImageWithFallback
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-sm text-gray-800 mb-0.5 truncate">{product.name}</h3>
                <p className="text-xs text-gray-500 mb-2 truncate">{product.description}</p>
                <p className="text-xs text-gray-400 mb-2">{product.weight}</p>
                <div className="flex items-baseline gap-0.5 mb-3">
                  <span className="text-lg">{Math.floor(product.price)}.</span>
                  <span className="text-xs">{(product.price % 1).toFixed(3).slice(2)}</span>
                  <span className="text-xs">$</span>
                </div>
                <button 
                  onClick={(e) => handleQuickAdd(e, product)}
                  className="w-full border border-gray-300 rounded-full p-1.5 hover:bg-gray-50 transition-colors"
                >
                  <span className="text-lg">+</span>
                </button>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Promotional Cards - Only show when no filters active */}
      {!searchQuery && !selectedCategory && (
        <>
          <div className="px-4 mt-6 flex gap-3">
            <button 
              onClick={() => alert('Grocery section clicked')}
              className="flex-1 bg-gradient-to-br from-amber-50 to-amber-100 rounded-2xl p-4 relative overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="relative z-10">
                <h3 className="text-sm text-gray-800 mb-1">Grocery</h3>
                <p className="text-xs text-gray-600 mb-1">By 12:15pm</p>
                <p className="text-xs text-green-600">Free delivery</p>
              </div>
              <div className="absolute right-0 bottom-0 w-20 h-20">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1741515042473-7664f850f7dd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhdm9jYWRvJTIwaGFsZiUyMGdyZWVufGVufDF8fHx8MTc2OTU0MjYyN3ww&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Grocery"
                  className="w-full h-full object-cover opacity-60"
                />
              </div>
            </button>
            <button 
              onClick={() => alert('Wholesale section clicked')}
              className="flex-1 bg-gradient-to-br from-pink-50 to-pink-100 rounded-2xl p-4 relative overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="relative z-10">
                <h3 className="text-sm text-gray-800 mb-1">Wholesale</h3>
                <p className="text-xs text-gray-600 mb-1">By 4:30pm</p>
                <p className="text-xs text-green-600">Free delivery</p>
              </div>
              <div className="absolute right-0 bottom-0 w-20 h-20">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1603462903957-566630607cc7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMGJlZXRyb290JTIwdmVnZXRhYmxlfGVufDF8fHx8MTc2OTU0MjYyNnww&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Wholesale"
                  className="w-full h-full object-cover opacity-60"
                />
              </div>
            </button>
          </div>

          {/* Featured Section */}
          <div className="px-4 mt-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg text-gray-800">Featured</h2>
              <button 
                onClick={() => alert('See all featured clicked')}
                className="text-sm text-orange-500 hover:text-orange-600 transition-colors"
              >
                See all
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
