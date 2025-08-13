'use client';

interface Restaurant {
  name: string;
  description: string;
  rating: number;
  deliveryTime: string;
  image: string;
}

interface RestaurantHeaderProps {
  restaurant: Restaurant;
  onGroupOrderClick: () => void;
  isGroupOrderActive: boolean;
}

export default function RestaurantHeader({ restaurant, onGroupOrderClick, isGroupOrderActive }: RestaurantHeaderProps) {
  return (
    <div className="relative bg-white shadow-sm border-b">
      {/* Background Image */}
      <div className="relative h-48 bg-gradient-to-br from-red-600 to-red-800">
        <div className="absolute inset-0 bg-black bg-opacity-30"></div>
        
        {/* Header Content */}
        <div className="relative z-10 p-4 h-full flex flex-col justify-between">
          {/* Top Bar */}
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                <span className="text-red-600 font-bold text-sm">🍕</span>
              </div>
              <span className="text-white font-semibold">Bella Italia</span>
            </div>
            
            {/* Group Order Button */}
            <button
              onClick={onGroupOrderClick}
              className={`px-4 py-2 rounded-full font-medium text-sm transition-all ${
                isGroupOrderActive 
                  ? 'bg-green-600 text-white shadow-lg' 
                  : 'bg-green-500 text-white hover:bg-green-600'
              }`}
            >
              {isGroupOrderActive ? 'Group Order Active' : 'Group Order'}
            </button>
          </div>
          
          {/* Restaurant Info */}
          <div className="text-white">
            <h1 className="text-2xl font-bold mb-1">{restaurant.name}</h1>
            <p className="text-red-100 mb-2">{restaurant.description}</p>
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center space-x-1">
                <span className="text-yellow-300">⭐</span>
                <span>{restaurant.rating}</span>
              </div>
              <div className="flex items-center space-x-1">
                <span className="text-red-200">🕒</span>
                <span>{restaurant.deliveryTime}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 