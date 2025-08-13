'use client';

import { CartItem } from '@/types';

interface CartProps {
  items: CartItem[];
  onUpdateQuantity: (itemId: string, quantity: number) => void;
  onRemoveItem: (itemId: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

export default function Cart({ items, onUpdateQuantity, onRemoveItem, isOpen, onClose }: CartProps) {
  const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const groupedItems = items.reduce((groups, item) => {
    const key = `${item.menuItemId}-${item.size || 'default'}`;
    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(item);
    return groups;
  }, {} as Record<string, CartItem[]>);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-md max-h-[80vh] flex flex-col">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold text-gray-800">Group Cart</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {Object.entries(groupedItems).length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              <div className="text-4xl mb-2">🛒</div>
              <p>Cart is empty</p>
            </div>
          ) : (
            <div className="space-y-4">
              {Object.entries(groupedItems).map(([key, groupItems]) => {
                const firstItem = groupItems[0];
                const totalQuantity = groupItems.reduce((sum, item) => sum + item.quantity, 0);
                const totalPrice = groupItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

                return (
                  <div key={key} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-800">{firstItem.name}</h3>
                        <p className="text-sm text-gray-600">
                          Added by: {groupItems.map(item => item.addedBy).join(', ')}
                        </p>
                      </div>
                      <button
                        onClick={() => groupItems.forEach(item => onRemoveItem(item.id))}
                        className="text-red-500 hover:text-red-700 ml-2"
                      >
                        ✕
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => {
                            if (totalQuantity > 1) {
                              onUpdateQuantity(firstItem.id, totalQuantity - 1);
                            }
                          }}
                          className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 text-sm"
                        >
                          -
                        </button>
                        <span className="font-medium">{totalQuantity}</span>
                        <button
                          onClick={() => onUpdateQuantity(firstItem.id, totalQuantity + 1)}
                          className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 text-sm"
                        >
                          +
                        </button>
                      </div>
                      <div className="text-lg font-bold text-red-600">
                        ${totalPrice.toFixed(2)}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {Object.entries(groupedItems).length > 0 && (
          <div className="border-t p-4">
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-semibold">Total:</span>
              <span className="text-xl font-bold text-red-600">${total.toFixed(2)}</span>
            </div>
            <button
              className="w-full bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 font-semibold"
            >
              Place Group Order
            </button>
          </div>
        )}
      </div>
    </div>
  );
} 