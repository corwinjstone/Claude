import { useState } from 'react';
import { MapPin, Store, Navigation, Layers, Minus, Plus } from 'lucide-react';

interface DeliveryMapProps {
  deliveryAddress?: string;
  showRoute?: boolean;
}

export function DeliveryMap({ deliveryAddress, showRoute = false }: DeliveryMapProps) {
  const [mapStyle, setMapStyle] = useState<'default' | 'satellite'>('default');
  const [zoomLevel, setZoomLevel] = useState(14);

  return (
    <div className="w-full h-64 bg-[#e5e3df] rounded-2xl overflow-hidden relative">
      {/* Map Background */}
      {mapStyle === 'default' ? (
        <svg className="w-full h-full" viewBox="0 0 400 256" preserveAspectRatio="xMidYMid slice">
          {/* Background - Google Maps beige */}
          <rect x="0" y="0" width="400" height="256" fill="#f2efe9" />
          
          {/* Water features */}
          <ellipse cx="50" cy="220" rx="35" ry="25" fill="#aadaff" opacity="0.7" />
          <ellipse cx="370" cy="40" rx="40" ry="30" fill="#aadaff" opacity="0.7" />
          
          {/* Parks - Google Maps green */}
          <path d="M 250 65 Q 260 75, 270 65 L 310 75 Q 315 90, 310 105 L 260 95 Q 255 80, 250 65 Z" fill="#c8e6c9" />
          <path d="M 90 80 Q 95 85, 100 80 L 140 90 Q 143 100, 140 110 L 100 105 Q 95 95, 90 80 Z" fill="#c8e6c9" />
          
          {/* Major Roads - Google Maps yellow */}
          <rect x="0" y="120" width="400" height="12" fill="#fef7dd" />
          <rect x="0" y="122" width="400" height="8" fill="#ffeaa7" />
          <line x1="0" y1="126" x2="400" y2="126" stroke="#ffffff" strokeWidth="1.5" strokeDasharray="12,8" />
          
          <rect x="160" y="0" width="12" height="256" fill="#fef7dd" />
          <rect x="162" y="0" width="8" height="256" fill="#ffeaa7" />
          <line x1="166" y1="0" x2="166" y2="256" stroke="#ffffff" strokeWidth="1.5" strokeDasharray="12,8" />
          
          {/* Secondary Roads */}
          <rect x="0" y="60" width="400" height="8" fill="#ffffff" />
          <line x1="0" y1="64" x2="400" y2="64" stroke="#e0e0e0" strokeWidth="1" />
          
          <rect x="0" y="180" width="400" height="8" fill="#ffffff" />
          <line x1="0" y1="184" x2="400" y2="184" stroke="#e0e0e0" strokeWidth="1" />
          
          <rect x="80" y="0" width="8" height="256" fill="#ffffff" />
          <line x1="84" y1="0" x2="84" y2="256" stroke="#e0e0e0" strokeWidth="1" />
          
          <rect x="240" y="0" width="8" height="256" fill="#ffffff" />
          <line x1="244" y1="0" x2="244" y2="256" stroke="#e0e0e0" strokeWidth="1" />
          
          <rect x="320" y="0" width="8" height="256" fill="#ffffff" />
          <line x1="324" y1="0" x2="324" y2="256" stroke="#e0e0e0" strokeWidth="1" />
          
          {/* Buildings - 3D effect */}
          <g>
            {/* Building 1 */}
            <rect x="20" y="20" width="40" height="30" fill="#e8e8e8" stroke="#d0d0d0" strokeWidth="0.5" />
            <polygon points="20,20 25,15 65,15 60,20" fill="#f5f5f5" />
            <polygon points="60,20 65,15 65,45 60,50" fill="#d8d8d8" />
            
            {/* Building 2 */}
            <rect x="100" y="30" width="35" height="25" fill="#e8e8e8" stroke="#d0d0d0" strokeWidth="0.5" />
            <polygon points="100,30 105,25 140,25 135,30" fill="#f5f5f5" />
            
            {/* Building 3 */}
            <rect x="190" y="15" width="45" height="40" fill="#e8e8e8" stroke="#d0d0d0" strokeWidth="0.5" />
            <polygon points="190,15 195,10 240,10 235,15" fill="#f5f5f5" />
            <polygon points="235,15 240,10 240,50 235,55" fill="#d8d8d8" />
            
            {/* Building 4 */}
            <rect x="270" y="25" width="38" height="30" fill="#e8e8e8" stroke="#d0d0d0" strokeWidth="0.5" />
            <polygon points="270,25 275,20 313,20 308,25" fill="#f5f5f5" />
            
            {/* Building 5 */}
            <rect x="340" y="20" width="40" height="35" fill="#e8e8e8" stroke="#d0d0d0" strokeWidth="0.5" />
            <polygon points="340,20 345,15 385,15 380,20" fill="#f5f5f5" />
            <polygon points="380,20 385,15 385,50 380,55" fill="#d8d8d8" />
            
            {/* More buildings */}
            <rect x="25" y="140" width="35" height="30" fill="#e8e8e8" stroke="#d0d0d0" strokeWidth="0.5" />
            <rect x="110" y="145" width="40" height="28" fill="#e8e8e8" stroke="#d0d0d0" strokeWidth="0.5" />
            <rect x="200" y="138" width="45" height="35" fill="#e8e8e8" stroke="#d0d0d0" strokeWidth="0.5" />
            <rect x="280" y="142" width="35" height="32" fill="#e8e8e8" stroke="#d0d0d0" strokeWidth="0.5" />
            
            <rect x="30" y="200" width="40" height="30" fill="#e8e8e8" stroke="#d0d0d0" strokeWidth="0.5" />
            <rect x="105" y="205" width="38" height="28" fill="#e8e8e8" stroke="#d0d0d0" strokeWidth="0.5" />
            <rect x="195" y="198" width="42" height="32" fill="#e8e8e8" stroke="#d0d0d0" strokeWidth="0.5" />
            <rect x="285" y="202" width="40" height="30" fill="#e8e8e8" stroke="#d0d0d0" strokeWidth="0.5" />
            <rect x="345" y="200" width="35" height="28" fill="#e8e8e8" stroke="#d0d0d0" strokeWidth="0.5" />
          </g>
          
          {/* Street Labels */}
          <text x="200" y="115" fontSize="8" fill="#666" textAnchor="middle" fontFamily="Arial">Main Street</text>
          <text x="155" y="130" fontSize="7" fill="#666" textAnchor="middle" fontFamily="Arial" transform="rotate(-90 155 130)">Oak Avenue</text>
          
          {/* Route line if enabled - Google Maps blue */}
          {showRoute && (
            <>
              {/* Route shadow */}
              <path
                d="M 100 126 L 120 126 Q 140 126, 160 120 L 180 115 Q 200 110, 220 115 L 240 120 Q 260 125, 280 126"
                stroke="#000000"
                strokeWidth="6"
                fill="none"
                opacity="0.1"
              />
              {/* Main route */}
              <path
                d="M 100 126 L 120 126 Q 140 126, 160 120 L 180 115 Q 200 110, 220 115 L 240 120 Q 260 125, 280 126"
                stroke="#4285f4"
                strokeWidth="4"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {/* Animated overlay */}
              <path
                d="M 100 126 L 120 126 Q 140 126, 160 120 L 180 115 Q 200 110, 220 115 L 240 120 Q 260 125, 280 126"
                stroke="#ffffff"
                strokeWidth="2"
                fill="none"
                strokeDasharray="10,10"
                strokeLinecap="round"
              >
                <animate
                  attributeName="stroke-dashoffset"
                  from="20"
                  to="0"
                  dur="1s"
                  repeatCount="indefinite"
                />
              </path>
            </>
          )}
        </svg>
      ) : (
        /* Satellite View */
        <svg className="w-full h-full" viewBox="0 0 400 256" preserveAspectRatio="xMidYMid slice">
          <defs>
            <pattern id="satellite-texture" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
              <rect width="20" height="20" fill="#3a4a3a" />
              <circle cx="5" cy="5" r="1" fill="#4a5a4a" opacity="0.5" />
              <circle cx="15" cy="12" r="1" fill="#4a5a4a" opacity="0.5" />
            </pattern>
          </defs>
          
          <rect x="0" y="0" width="400" height="256" fill="url(#satellite-texture)" />
          
          {/* Roads appear lighter */}
          <rect x="0" y="120" width="400" height="10" fill="#5a5a5a" />
          <rect x="160" y="0" width="10" height="256" fill="#5a5a5a" />
          <rect x="0" y="60" width="400" height="6" fill="#4a4a4a" />
          <rect x="0" y="180" width="400" height="6" fill="#4a4a4a" />
          <rect x="80" y="0" width="6" height="256" fill="#4a4a4a" />
          <rect x="240" y="0" width="6" height="256" fill="#4a4a4a" />
          <rect x="320" y="0" width="6" height="256" fill="#4a4a4a" />
          
          {/* Buildings appear as dark rectangles */}
          <rect x="20" y="20" width="40" height="30" fill="#2a2a2a" opacity="0.8" />
          <rect x="100" y="30" width="35" height="25" fill="#2a2a2a" opacity="0.8" />
          <rect x="190" y="15" width="45" height="40" fill="#2a2a2a" opacity="0.8" />
          <rect x="270" y="25" width="38" height="30" fill="#2a2a2a" opacity="0.8" />
          <rect x="340" y="20" width="40" height="35" fill="#2a2a2a" opacity="0.8" />
          
          {/* Green spaces darker */}
          <rect x="255" y="70" width="60" height="40" fill="#2a3a2a" opacity="0.6" rx="4" />
          <rect x="95" y="85" width="50" height="30" fill="#2a3a2a" opacity="0.6" rx="4" />
          
          {/* Route on satellite */}
          {showRoute && (
            <path
              d="M 100 126 L 120 126 Q 140 126, 160 120 L 180 115 Q 200 110, 220 115 L 240 120 Q 260 125, 280 126"
              stroke="#4285f4"
              strokeWidth="4"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}
        </svg>
      )}
      
      {/* Store Marker - Google Maps style */}
      <div className="absolute left-[22%] top-[45%] transform -translate-x-1/2 -translate-y-full z-10">
        <div className="relative group cursor-pointer">
          {/* Pin */}
          <div className="relative">
            <svg width="32" height="40" viewBox="0 0 32 40" className="drop-shadow-lg">
              <path
                d="M16 0C9.373 0 4 5.373 4 12c0 8 12 28 12 28s12-20 12-28c0-6.627-5.373-12-12-12z"
                fill="#34a853"
              />
              <circle cx="16" cy="12" r="6" fill="white" />
              <Store className="absolute top-[6px] left-1/2 transform -translate-x-1/2 w-3 h-3 text-[#34a853]" />
            </svg>
          </div>
          {/* Tooltip */}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 bg-white px-3 py-1.5 rounded shadow-lg whitespace-nowrap text-xs opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            <div className="font-medium text-gray-800">Grocery Store</div>
            <div className="text-gray-500 text-xs">Open • 8AM - 10PM</div>
          </div>
        </div>
      </div>
      
      {/* Delivery Location Marker - Google Maps red pin */}
      <div className="absolute left-[72%] top-[45%] transform -translate-x-1/2 -translate-y-full z-10">
        <div className="relative group cursor-pointer animate-bounce">
          {/* Pin */}
          <div className="relative">
            <svg width="36" height="44" viewBox="0 0 36 44" className="drop-shadow-lg">
              <path
                d="M18 0C11.373 0 6 5.373 6 12c0 9 12 32 12 32s12-23 12-32c0-6.627-5.373-12-12-12z"
                fill="#ea4335"
              />
              <circle cx="18" cy="12" r="7" fill="white" />
              <MapPin className="absolute top-[5px] left-1/2 transform -translate-x-1/2 w-4 h-4 text-[#ea4335]" />
            </svg>
          </div>
          {/* Tooltip */}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 bg-white px-3 py-2 rounded-lg shadow-lg whitespace-nowrap text-xs opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none min-w-[140px]">
            <div className="font-medium text-gray-800">Your Location</div>
            {deliveryAddress && (
              <div className="text-gray-500 text-xs mt-0.5 max-w-[120px] truncate">
                {deliveryAddress}
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Distance & Time Card - Google Maps style */}
      {showRoute && (
        <div className="absolute top-4 left-4 bg-white px-4 py-3 rounded-lg shadow-lg">
          <div className="flex items-center gap-3">
            <div className="text-2xl font-medium text-gray-800">15</div>
            <div>
              <div className="text-xs text-gray-500">min</div>
              <div className="text-xs text-gray-500">(2.5 km)</div>
            </div>
          </div>
          <div className="mt-2 text-xs text-green-600">Fastest route now</div>
        </div>
      )}
      
      {/* Map Controls - Google Maps style */}
      <div className="absolute top-4 right-4 flex flex-col gap-2">
        {/* Map/Satellite Toggle */}
        <button
          onClick={() => setMapStyle(mapStyle === 'default' ? 'satellite' : 'default')}
          className="bg-white rounded-lg shadow-lg p-2 hover:bg-gray-50 transition-colors group"
          title={mapStyle === 'default' ? 'Satellite view' : 'Map view'}
        >
          <Layers className="w-5 h-5 text-gray-700" />
        </button>
      </div>
      
      {/* Zoom Controls - Google Maps style */}
      <div className="absolute bottom-4 right-4 bg-white rounded-lg shadow-lg overflow-hidden">
        <button
          onClick={() => setZoomLevel(Math.min(20, zoomLevel + 1))}
          className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 transition-colors border-b border-gray-200"
        >
          <Plus className="w-4 h-4 text-gray-700" />
        </button>
        <button
          onClick={() => setZoomLevel(Math.max(8, zoomLevel - 1))}
          className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 transition-colors"
        >
          <Minus className="w-4 h-4 text-gray-700" />
        </button>
      </div>
      
      {/* My Location Button */}
      <div className="absolute bottom-4 left-4 bg-white rounded-full shadow-lg p-2 hover:bg-gray-50 transition-colors cursor-pointer">
        <Navigation className="w-5 h-5 text-[#4285f4]" />
      </div>
      
      {/* Google Maps attribution style */}
      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-xs text-gray-500 bg-white bg-opacity-80 px-2 py-0.5 rounded">
        Map data ©2024
      </div>
    </div>
  );
}
