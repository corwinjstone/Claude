import { CheckCircle, MapPin, Clock, CreditCard, Package } from 'lucide-react';
import { OrderDetails } from './CheckoutScreen';
import { CartItem } from '../types';
import { DeliveryMap } from './DeliveryMap';

interface OrderConfirmationScreenProps {
  orderDetails: OrderDetails;
  cartItems: CartItem[];
  onBackToHome: () => void;
  orderNumber: string;
}

export function OrderConfirmationScreen({ 
  orderDetails, 
  cartItems, 
  onBackToHome,
  orderNumber 
}: OrderConfirmationScreenProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with Success Icon */}
      <div className="bg-[#1a3e3e] px-4 pt-12 pb-12 text-center">
        <div className="w-20 h-20 bg-[#c5e17a] rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-12 h-12 text-[#1a3e3e]" />
        </div>
        <h1 className="text-white text-2xl mb-2">Order Placed!</h1>
        <p className="text-gray-300 text-sm">Your order has been confirmed</p>
      </div>

      <div className="px-4 py-6 space-y-4 pb-24">
        {/* Order Number */}
        <div className="bg-white rounded-2xl p-5 shadow-sm text-center">
          <p className="text-gray-600 text-sm mb-1">Order Number</p>
          <h2 className="text-2xl text-gray-800">#{orderNumber}</h2>
        </div>

        {/* Live Delivery Tracking Map */}
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg text-gray-800">Live Tracking</h3>
            <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full">
              On the way
            </span>
          </div>
          <DeliveryMap 
            deliveryAddress={orderDetails.deliveryAddress}
            showRoute={true}
          />
          <div className="mt-4 flex items-center gap-3 bg-gray-50 p-3 rounded-xl">
            <div className="w-10 h-10 bg-[#1a3e3e] rounded-full flex items-center justify-center">
              <span className="text-white text-sm">🚚</span>
            </div>
            <div className="flex-1">
              <h4 className="text-sm text-gray-800">Your order is being prepared</h4>
              <p className="text-xs text-gray-500">Driver will be assigned shortly</p>
            </div>
          </div>
        </div>

        {/* Delivery Details */}
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <h3 className="text-lg text-gray-800 mb-4">Delivery Details</h3>
          
          <div className="space-y-4">
            <div className="flex gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <MapPin className="w-5 h-5 text-green-600" />
              </div>
              <div className="flex-1">
                <h4 className="text-sm text-gray-800 mb-1">Delivery Address</h4>
                <p className="text-xs text-gray-600">{orderDetails.deliveryAddress}</p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Clock className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <h4 className="text-sm text-gray-800 mb-1">Estimated Delivery</h4>
                <p className="text-xs text-gray-600">Today, {orderDetails.deliveryTime}</p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                <CreditCard className="w-5 h-5 text-purple-600" />
              </div>
              <div className="flex-1">
                <h4 className="text-sm text-gray-800 mb-1">Payment Method</h4>
                <p className="text-xs text-gray-600">{orderDetails.paymentMethod}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Package className="w-5 h-5 text-[#1a3e3e]" />
            <h3 className="text-lg text-gray-800">Order Items</h3>
          </div>
          
          <div className="space-y-3">
            {cartItems.map((item) => (
              <div key={item.product.id} className="flex justify-between items-center py-2">
                <div className="flex-1">
                  <h4 className="text-sm text-gray-800">{item.product.name}</h4>
                  <p className="text-xs text-gray-500">
                    {item.product.weight} × {item.quantity}
                  </p>
                </div>
                <div className="text-sm text-gray-800">
                  ${(item.product.price * item.quantity).toFixed(2)}
                </div>
              </div>
            ))}
            
            <div className="border-t border-gray-200 pt-3 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span className="text-gray-800">${orderDetails.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Delivery Fee</span>
                <span className="text-gray-800">
                  {orderDetails.deliveryFee === 0 ? (
                    <span className="text-green-600">Free</span>
                  ) : (
                    `$${orderDetails.deliveryFee.toFixed(2)}`
                  )}
                </span>
              </div>
              <div className="flex justify-between pt-2 border-t border-gray-200">
                <span className="text-gray-800">Total</span>
                <span className="text-lg text-gray-800">${orderDetails.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tracking Info */}
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-5">
          <h3 className="text-sm text-gray-800 mb-2">Track Your Order</h3>
          <p className="text-xs text-gray-600 mb-3">
            You'll receive updates via notifications as your order is prepared and delivered.
          </p>
          <button className="text-sm text-green-600 hover:text-green-700 transition-colors">
            View Order Status →
          </button>
        </div>
      </div>

      {/* Fixed Bottom Buttons */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
        <div className="max-w-md mx-auto space-y-3">
          <button
            onClick={onBackToHome}
            className="w-full bg-[#c5e17a] rounded-full py-4 hover:bg-[#b5d16a] transition-colors"
          >
            <span className="text-gray-800">Continue Shopping</span>
          </button>
          <button
            onClick={() => alert('Track order feature coming soon!')}
            className="w-full border-2 border-gray-300 rounded-full py-4 hover:bg-gray-50 transition-colors"
          >
            <span className="text-gray-800">Track Order</span>
          </button>
        </div>
      </div>
    </div>
  );
}
