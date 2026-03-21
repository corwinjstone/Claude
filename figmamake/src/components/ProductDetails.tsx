import { useState } from 'react';
import { ArrowLeft, ShoppingCart, Heart, Star, Minus, Plus } from 'lucide-react';
import beefImage from 'figma:asset/049ec2e2538c31fd60f4ea688f0115386ea5a50f.png';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  weight: string;
  image: string;
}

interface ProductDetailsProps {
  product: Product;
  onBack: () => void;
  onAddToCart: (quantity: number) => void;
  onOpenCart: () => void;
  cartCount: number;
}

export function ProductDetails({ product, onBack, onAddToCart, onOpenCart, cartCount }: ProductDetailsProps) {
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState(0);

  // Use the beef image for product ID 1, otherwise use the product image
  const displayImage = product.id === 1 ? beefImage : product.image;

  // For the beef product, override the details
  const isBeef = product.id === 1;
  const displayName = isBeef ? 'Beef Mixed Cut Bone in 50 gm' : product.name;
  const displayWeight = isBeef ? '1000 gm' : product.weight;
  const displayPrice = isBeef ? 23.46 : product.price;

  const variants = [
    { color: 'bg-purple-600' },
    { color: 'bg-orange-600' },
    { color: 'bg-blue-600' },
  ];

  const handleQuantityDecrease = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const handleQuantityIncrease = () => {
    setQuantity(quantity + 1);
  };

  const handleAddToCart = () => {
    onAddToCart(quantity);
    setQuantity(1);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-[#1a3e3e] px-4 pt-12 pb-4 flex items-center justify-between">
        <button onClick={onBack} className="bg-white rounded-full p-2">
          <ArrowLeft className="w-5 h-5 text-[#1a3e3e]" />
        </button>
        <h1 className="text-white">Product Details</h1>
        <button 
          onClick={onOpenCart}
          className="bg-white rounded-full p-2 relative hover:bg-gray-100 transition-colors"
        >
          <ShoppingCart className="w-5 h-5 text-[#1a3e3e]" />
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
              {cartCount}
            </span>
          )}
        </button>
      </div>

      {/* Product Image */}
      <div className="bg-white rounded-b-3xl px-4 py-8">
        <div className="aspect-square max-w-sm mx-auto">
          <img src={displayImage} alt={displayName} className="w-full h-full object-contain" />
        </div>
      </div>

      {/* Product Info */}
      <div className="px-4 py-6">
        <div className="bg-white rounded-3xl p-6 shadow-sm">
          <div className="flex justify-between items-start mb-2">
            <div className="flex-1">
              <h2 className="text-xl text-gray-800 mb-1">{displayName}</h2>
              <p className="text-sm text-gray-500">{displayWeight}</p>
            </div>
            <button className="p-2">
              <Heart className="w-6 h-6 text-gray-400" />
            </button>
          </div>

          <div className="flex items-baseline gap-1 mb-3">
            <span className="text-3xl">{Math.floor(displayPrice)}.</span>
            <span className="text-lg">{(displayPrice % 1).toFixed(3).slice(2)}</span>
            <span className="text-lg">$</span>
          </div>

          {/* Delivery Info */}
          <div className="flex items-center gap-2 mb-4">
            <div className="w-5 h-5 bg-purple-100 rounded-full flex items-center justify-center">
              <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
            </div>
            <span className="text-sm text-gray-600">Available on fast delivery</span>
          </div>

          {/* Variants */}
          <div className="flex gap-2 mb-4">
            {variants.map((variant, index) => (
              <button
                key={index}
                onClick={() => setSelectedVariant(index)}
                className={`w-8 h-8 rounded-full ${variant.color} ${
                  selectedVariant === index ? 'ring-2 ring-offset-2 ring-gray-400' : ''
                }`}
              ></button>
            ))}
          </div>

          {/* Rating */}
          <div className="flex items-center gap-1 mb-4">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm">4.5 Rating</span>
          </div>

          {/* Satisfaction Guarantee */}
          <p className="text-xs text-gray-500 mb-2">
            100% satisfaction guarantee. If you experience any of the following issues, missing, poor item, late
            arrival, unprofessional servic...{' '}
            <button className="text-gray-700">Read more</button>
          </p>

          {/* Quantity and Add to Cart */}
          <div className="flex items-center gap-3 mt-6">
            <div className="flex items-center gap-3 bg-gray-100 rounded-full px-4 py-2">
              <button
                onClick={handleQuantityDecrease}
                className="w-8 h-8 rounded-full border-2 border-gray-400 flex items-center justify-center"
              >
                <Minus className="w-4 h-4 text-gray-600" />
              </button>
              <span className="text-lg min-w-[2rem] text-center">{quantity}</span>
              <button
                onClick={handleQuantityIncrease}
                className="w-8 h-8 rounded-full bg-[#c5e17a] flex items-center justify-center"
              >
                <Plus className="w-4 h-4 text-gray-700" />
              </button>
            </div>
            <button
              onClick={handleAddToCart}
              className="flex-1 bg-[#c5e17a] rounded-full py-3 px-6 flex items-center justify-center gap-2"
            >
              <ShoppingCart className="w-5 h-5 text-gray-700" />
              <span className="text-gray-800">Add to cart</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
