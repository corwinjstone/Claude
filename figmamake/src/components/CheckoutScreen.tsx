import { useState } from 'react';
import { ArrowLeft, MapPin, Clock, CreditCard, Wallet, CheckCircle2 } from 'lucide-react';
import { CartItem } from '../types';
import { DeliveryMap } from './DeliveryMap';

interface CheckoutScreenProps {
  cartItems: CartItem[];
  onBack: () => void;
  onPlaceOrder: (orderDetails: OrderDetails) => void;
}

export interface OrderDetails {
  deliveryAddress: string;
  deliveryTime: string;
  paymentMethod: string;
  subtotal: number;
  deliveryFee: number;
  total: number;
}

export function CheckoutScreen({ cartItems, onBack, onPlaceOrder }: CheckoutScreenProps) {
  const [selectedAddress, setSelectedAddress] = useState('home');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('morning');
  const [selectedPayment, setSelectedPayment] = useState('card');

  const subtotal = cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const deliveryFee = subtotal > 50 ? 0 : 5.99;
  const total = subtotal + deliveryFee;

  const addresses = [
    {
      id: 'home',
      label: 'Home',
      address: '1234 Main Street, Apt 5B, California, USA 90210',
      icon: '🏠',
    },
    {
      id: 'work',
      label: 'Work',
      address: '5678 Business Ave, Suite 300, California, USA 90211',
      icon: '🏢',
    },
  ];

  const timeSlots = [
    {
      id: 'morning',
      label: 'Morning',
      time: '8:00 AM - 12:00 PM',
      icon: '🌅',
    },
    {
      id: 'afternoon',
      label: 'Afternoon',
      time: '12:00 PM - 4:00 PM',
      icon: '☀️',
    },
    {
      id: 'evening',
      label: 'Evening',
      time: '4:00 PM - 8:00 PM',
      icon: '🌆',
    },
  ];

  const paymentMethods = [
    {
      id: 'card',
      label: 'Credit/Debit Card',
      detail: '•••• •••• •••• 4242',
      icon: CreditCard,
    },
    {
      id: 'wallet',
      label: 'Digital Wallet',
      detail: 'Apple Pay, Google Pay',
      icon: Wallet,
    },
  ];

  const handlePlaceOrder = () => {
    const selectedAddressData = addresses.find(a => a.id === selectedAddress);
    const selectedTimeSlotData = timeSlots.find(t => t.id === selectedTimeSlot);
    const selectedPaymentData = paymentMethods.find(p => p.id === selectedPayment);

    onPlaceOrder({
      deliveryAddress: selectedAddressData?.address || '',
      deliveryTime: selectedTimeSlotData?.time || '',
      paymentMethod: selectedPaymentData?.label || '',
      subtotal,
      deliveryFee,
      total,
    });
  };

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
          <h1 className="text-white text-xl">Checkout</h1>
          <div className="w-9"></div>
        </div>
      </div>

      <div className="px-4 py-6 space-y-6 pb-32">
        {/* Delivery Map */}
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <MapPin className="w-5 h-5 text-[#1a3e3e]" />
            <h2 className="text-lg text-gray-800">Delivery Location</h2>
          </div>
          <DeliveryMap 
            deliveryAddress={addresses.find(a => a.id === selectedAddress)?.address}
            showRoute={true}
          />
        </div>

        {/* Delivery Address */}
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <MapPin className="w-5 h-5 text-[#1a3e3e]" />
            <h2 className="text-lg text-gray-800">Delivery Address</h2>
          </div>
          
          <div className="space-y-3">
            {addresses.map((address) => (
              <button
                key={address.id}
                onClick={() => setSelectedAddress(address.id)}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                  selectedAddress === address.id
                    ? 'border-[#c5e17a] bg-green-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{address.icon}</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-sm text-gray-800">{address.label}</h3>
                      {selectedAddress === address.id && (
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                      )}
                    </div>
                    <p className="text-xs text-gray-600">{address.address}</p>
                  </div>
                </div>
              </button>
            ))}
            
            <button className="w-full p-4 rounded-xl border-2 border-dashed border-gray-300 hover:border-gray-400 transition-colors text-center text-sm text-gray-600">
              + Add New Address
            </button>
          </div>
        </div>

        {/* Delivery Time Slot */}
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-5 h-5 text-[#1a3e3e]" />
            <h2 className="text-lg text-gray-800">Delivery Time</h2>
          </div>
          
          <div className="grid grid-cols-3 gap-3">
            {timeSlots.map((slot) => (
              <button
                key={slot.id}
                onClick={() => setSelectedTimeSlot(slot.id)}
                className={`p-3 rounded-xl border-2 transition-all ${
                  selectedTimeSlot === slot.id
                    ? 'border-[#c5e17a] bg-green-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="text-2xl mb-2">{slot.icon}</div>
                <h3 className="text-xs text-gray-800 mb-1">{slot.label}</h3>
                <p className="text-xs text-gray-500">{slot.time}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Payment Method */}
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <CreditCard className="w-5 h-5 text-[#1a3e3e]" />
            <h2 className="text-lg text-gray-800">Payment Method</h2>
          </div>
          
          <div className="space-y-3">
            {paymentMethods.map((method) => {
              const Icon = method.icon;
              return (
                <button
                  key={method.id}
                  onClick={() => setSelectedPayment(method.id)}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                    selectedPayment === method.id
                      ? 'border-[#c5e17a] bg-green-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-6 h-6 text-gray-600" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-sm text-gray-800">{method.label}</h3>
                        {selectedPayment === method.id && (
                          <CheckCircle2 className="w-4 h-4 text-green-600" />
                        )}
                      </div>
                      <p className="text-xs text-gray-500">{method.detail}</p>
                    </div>
                  </div>
                </button>
              );
            })}
            
            <button className="w-full p-4 rounded-xl border-2 border-dashed border-gray-300 hover:border-gray-400 transition-colors text-center text-sm text-gray-600">
              + Add Payment Method
            </button>
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <h2 className="text-lg text-gray-800 mb-4">Order Summary</h2>
          
          <div className="space-y-3 mb-4">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Items ({cartItems.length})</span>
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
            <div className="border-t border-gray-200 pt-3 flex justify-between">
              <span className="text-gray-800">Total</span>
              <div className="flex items-baseline gap-0.5">
                <span className="text-2xl">{Math.floor(total)}.</span>
                <span className="text-sm">{(total % 1).toFixed(2).slice(2)}</span>
                <span className="text-sm">$</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Fixed Bottom Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
        <div className="max-w-md mx-auto">
          <button
            onClick={handlePlaceOrder}
            className="w-full bg-[#c5e17a] rounded-full py-4 hover:bg-[#b5d16a] transition-colors"
          >
            <span className="text-gray-800">Place Order • ${total.toFixed(2)}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
