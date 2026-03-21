import { ArrowLeft, Package, Truck, CheckCircle, MapPin } from 'lucide-react';
import { DeliveryMap } from './DeliveryMap';

interface OrderTrackingScreenProps {
  orderNumber: string;
  deliveryAddress: string;
  onBack: () => void;
}

export function OrderTrackingScreen({ orderNumber, deliveryAddress, onBack }: OrderTrackingScreenProps) {
  const trackingSteps = [
    {
      id: 1,
      status: 'completed',
      title: 'Order Confirmed',
      description: 'We have received your order',
      time: '10:30 AM',
      icon: CheckCircle,
    },
    {
      id: 2,
      status: 'completed',
      title: 'Order Prepared',
      description: 'Your items are being packed',
      time: '10:45 AM',
      icon: Package,
    },
    {
      id: 3,
      status: 'active',
      title: 'Out for Delivery',
      description: 'Driver is on the way',
      time: 'Now',
      icon: Truck,
    },
    {
      id: 4,
      status: 'pending',
      title: 'Delivered',
      description: 'Order will be delivered soon',
      time: 'Est. 11:30 AM',
      icon: MapPin,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-[#1a3e3e] px-4 pt-12 pb-4">
        <div className="flex items-center justify-between mb-4">
          <button 
            onClick={onBack}
            className="bg-white rounded-full p-2 hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-[#1a3e3e]" />
          </button>
          <h1 className="text-white text-xl">Track Order</h1>
          <div className="w-9"></div>
        </div>
        <p className="text-center text-gray-300 text-sm">#{orderNumber}</p>
      </div>

      <div className="px-4 py-6 space-y-6">
        {/* Live Map */}
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg text-gray-800">Live Location</h2>
            <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full flex items-center gap-1">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              Live
            </span>
          </div>
          
          <DeliveryMap deliveryAddress={deliveryAddress} showRoute={true} />
          
          {/* Driver Info */}
          <div className="mt-4 flex items-center gap-3 bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-xl">
            <div className="w-12 h-12 bg-[#1a3e3e] rounded-full flex items-center justify-center">
              <span className="text-white text-lg">👨‍🦱</span>
            </div>
            <div className="flex-1">
              <h3 className="text-sm text-gray-800">John Martinez</h3>
              <p className="text-xs text-gray-500">Your delivery driver</p>
            </div>
            <div className="flex gap-2">
              <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm hover:shadow transition-shadow">
                <span className="text-lg">📞</span>
              </button>
              <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm hover:shadow transition-shadow">
                <span className="text-lg">💬</span>
              </button>
            </div>
          </div>
        </div>

        {/* Tracking Timeline */}
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <h2 className="text-lg text-gray-800 mb-6">Order Status</h2>
          
          <div className="space-y-6">
            {trackingSteps.map((step, index) => {
              const Icon = step.icon;
              const isLast = index === trackingSteps.length - 1;
              
              return (
                <div key={step.id} className="relative">
                  <div className="flex gap-4">
                    {/* Icon and line */}
                    <div className="flex flex-col items-center">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        step.status === 'completed' 
                          ? 'bg-green-500' 
                          : step.status === 'active'
                          ? 'bg-[#c5e17a] animate-pulse'
                          : 'bg-gray-200'
                      }`}>
                        <Icon className={`w-5 h-5 ${
                          step.status === 'pending' ? 'text-gray-400' : 'text-white'
                        }`} />
                      </div>
                      
                      {!isLast && (
                        <div className={`w-0.5 h-12 mt-2 ${
                          step.status === 'completed' ? 'bg-green-500' : 'bg-gray-200'
                        }`}></div>
                      )}
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1 pb-2">
                      <div className="flex justify-between items-start mb-1">
                        <h3 className={`text-sm ${
                          step.status === 'pending' ? 'text-gray-400' : 'text-gray-800'
                        }`}>
                          {step.title}
                        </h3>
                        <span className={`text-xs ${
                          step.status === 'pending' ? 'text-gray-400' : 'text-gray-500'
                        }`}>
                          {step.time}
                        </span>
                      </div>
                      <p className={`text-xs ${
                        step.status === 'pending' ? 'text-gray-400' : 'text-gray-500'
                      }`}>
                        {step.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Delivery Instructions */}
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <h3 className="text-sm text-gray-800 mb-3">Delivery Instructions</h3>
          <div className="bg-gray-50 p-3 rounded-xl">
            <p className="text-xs text-gray-600">
              "Please leave at front door if no one answers. Ring doorbell twice."
            </p>
          </div>
          <button className="text-sm text-[#1a3e3e] hover:text-[#2a4e4e] transition-colors mt-3">
            Edit Instructions
          </button>
        </div>

        {/* Support */}
        <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-2xl p-5">
          <h3 className="text-sm text-gray-800 mb-2">Need Help?</h3>
          <p className="text-xs text-gray-600 mb-3">
            Contact our support team for any questions about your order.
          </p>
          <button className="text-sm text-amber-700 hover:text-amber-800 transition-colors">
            Contact Support →
          </button>
        </div>
      </div>
    </div>
  );
}
