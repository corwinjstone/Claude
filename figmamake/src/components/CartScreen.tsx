import { ArrowLeft, Trash2, Plus, Minus } from 'lucide-react';
import { CartItem } from '../types';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface CartScreenProps {
  cartItems: CartItem[];
  onBack: () => void;
  onUpdateQuantity: (productId: number, newQuantity: number) => void;
  onRemoveItem: (productId: number) => void;
  onCheckout: () => void;
}

export function CartScreen({ 
  cartItems, 
  onBack, 
  onUpdateQuantity, 
  onRemoveItem,
  onCheckout 
}: CartScreenProps) {
  const subtotal = cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const deliveryFee = subtotal > 50 ? 0 : 5.99;
  const total = subtotal + deliveryFee;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-[#1a3e3e] px-4 pt-12 pb-4">
        <div className="flex items-center justify-between">
          <button 
            onClick={onBack}
            className="bg-white rounded-full p-2 hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-[#1a3e3e]" />
          </button>
          <h1 className="text-white text-xl">My Cart</h1>
          <div className="w-9"></div>
        </div>
      </div>

      {cartItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 px-4">
          <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mb-4">
            <span className="text-4xl">🛒</span>
          </div>
          <h2 className="text-xl text-gray-800 mb-2">Your cart is empty</h2>
          <p className="text-gray-500 text-center mb-6">Add some products to get started</p>
          <button
            onClick={onBack}
            className="bg-[#c5e17a] px-6 py-3 rounded-full hover:bg-[#b5d16a] transition-colors"
          >
            Start Shopping
          </button>
        </div>
      ) : (
        <>
          {/* Cart Items */}
          <div className="px-4 py-6 space-y-4">
            {cartItems.map((item) => (
              <div key={item.product.id} className="bg-white rounded-2xl p-4 shadow-sm">
                <div className="flex gap-4">
                  <div className="w-20 h-20 rounded-xl overflow-hidden bg-gray-50 flex-shrink-0">
                    <ImageWithFallback
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm text-gray-800 mb-0.5 truncate">{item.product.name}</h3>
                        <p className="text-xs text-gray-500">{item.product.description}</p>
                        <p className="text-xs text-gray-400 mt-1">{item.product.weight}</p>
                      </div>
                      <button
                        onClick={() => onRemoveItem(item.product.id)}
                        className="ml-2 p-1 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <div className="flex justify-between items-center mt-3">
                      <div className="flex items-baseline gap-0.5">
                        <span className="text-lg">{Math.floor(item.product.price)}.</span>
                        <span className="text-xs">{(item.product.price % 1).toFixed(3).slice(2)}</span>
                        <span className="text-xs">$</span>
                      </div>
                      
                      <div className="flex items-center gap-2 bg-gray-100 rounded-full px-3 py-1">
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                          className="w-6 h-6 rounded-full border border-gray-400 flex items-center justify-center hover:bg-gray-200 transition-colors"
                        >
                          <Minus className="w-3 h-3 text-gray-600" />
                        </button>
                        <span className="text-sm min-w-[1.5rem] text-center">{item.quantity}</span>
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                          className="w-6 h-6 rounded-full bg-[#c5e17a] flex items-center justify-center hover:bg-[#b5d16a] transition-colors"
                        >
                          <Plus className="w-3 h-3 text-gray-700" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="px-4 pb-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-lg text-gray-800 mb-4">Order Summary</h2>
              
              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="text-gray-800">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Delivery Fee</span>
                  <span className="text-gray-800">
                    {deliveryFee === 0 ? (
                      <span className="text-green-600">Free</span>
                    ) : (
                      `$${deliveryFee.toFixed(2)}`
                    )}
                  </span>
                </div>
                {subtotal < 50 && (
                  <p className="text-xs text-gray-500 italic">
                    Add ${(50 - subtotal).toFixed(2)} more for free delivery
                  </p>
                )}
                <div className="border-t border-gray-200 pt-3 flex justify-between">
                  <span className="text-gray-800">Total</span>
                  <div className="flex items-baseline gap-0.5">
                    <span className="text-2xl">{Math.floor(total)}.</span>
                    <span className="text-sm">{(total % 1).toFixed(2).slice(2)}</span>
                    <span className="text-sm">$</span>
                  </div>
                </div>
              </div>

              <button
                onClick={onCheckout}
                className="w-full bg-[#c5e17a] rounded-full py-4 hover:bg-[#b5d16a] transition-colors"
              >
                <span className="text-gray-800">Proceed to Checkout</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
