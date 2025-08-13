'use client';

interface CartItem {
  id: number;
  name: string;
  selectedSize: { name: string; price: number };
  quantity: number;
  totalPrice: number;
  category: string;
}

interface CartProps {
  items: CartItem[];
  onRemoveItem: (index: number) => void;
  onUpdateQuantity: (index: number, quantity: number) => void;
  isGroupOrder: boolean;
}

export default function Cart({ items, onRemoveItem, onUpdateQuantity, isGroupOrder }: CartProps) {
  const total = items.reduce((sum, item) => sum + item.totalPrice, 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
      {/* Cart Header */}
      <div className="px-4 py-3 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-lg">🛒</span>
            <span className="font-semibold text-gray-800">
              {isGroupOrder ? 'Group Cart' : 'Your Cart'}
            </span>
            <span className="bg-red-600 text-white text-xs px-2 py-1 rounded-full">
              {itemCount}
            </span>
          </div>
          <div className="text-right">
            <div className="font-bold text-lg text-gray-800">${total.toFixed(2)}</div>
            {isGroupOrder && (
              <div className="text-xs text-green-600 font-medium">Group Order Active</div>
            )}
          </div>
        </div>
      </div>

      {/* Cart Items */}
      <div className="max-h-64 overflow-y-auto">
        {items.map((item, index) => (
          <div key={index} className="px-4 py-3 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <span className="text-lg">
                    {item.category === 'Pizza' ? '🍕' : item.category === 'Pasta' ? '🍝' : '🥗'}
                  </span>
                  <div>
                    <div className="font-medium text-gray-800">{item.name}</div>
                    <div className="text-sm text-gray-600">{item.selectedSize.name}</div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                {/* Quantity Controls */}
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => onUpdateQuantity(index, item.quantity - 1)}
                    className="w-6 h-6 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center text-sm hover:bg-gray-300"
                  >
                    -
                  </button>
                  <span className="w-6 text-center font-medium text-sm">{item.quantity}</span>
                  <button
                    onClick={() => onUpdateQuantity(index, item.quantity + 1)}
                    className="w-6 h-6 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center text-sm hover:bg-gray-300"
                  >
                    +
                  </button>
                </div>
                
                {/* Price */}
                <div className="text-right">
                  <div className="font-medium text-gray-800">${item.totalPrice.toFixed(2)}</div>
                </div>
                
                {/* Remove Button */}
                <button
                  onClick={() => onRemoveItem(index)}
                  className="text-red-500 hover:text-red-700 p-1"
                >
                  ✕
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Checkout Button */}
      <div className="px-4 py-3">
        <button
          className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors"
        >
          {isGroupOrder ? 'Place Group Order' : 'Checkout'}
        </button>
      </div>
    </div>
  );
} 