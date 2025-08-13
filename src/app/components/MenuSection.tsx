'use client';

import { useState } from 'react';

interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  sizes: Array<{ name: string; price: number }>;
  category: string;
}

interface MenuSectionProps {
  title: string;
  items: MenuItem[];
  onAddToCart: (item: MenuItem, size: string, quantity: number) => void;
}

export default function MenuSection({ title, items, onAddToCart }: MenuSectionProps) {
  const [selectedItems, setSelectedItems] = useState<Record<number, { size: string; quantity: number }>>({});

  const handleSizeSelect = (itemId: number, size: string) => {
    setSelectedItems(prev => ({
      ...prev,
      [itemId]: { ...prev[itemId], size }
    }));
  };

  const handleQuantityChange = (itemId: number, quantity: number) => {
    setSelectedItems(prev => ({
      ...prev,
      [itemId]: { ...prev[itemId], quantity: Math.max(1, quantity) }
    }));
  };

  const handleAddToCart = (item: MenuItem) => {
    const selected = selectedItems[item.id];
    if (selected && selected.size) {
      onAddToCart(item, selected.size, selected.quantity);
      // Reset selection
      setSelectedItems(prev => {
        const newState = { ...prev };
        delete newState[item.id];
        return newState;
      });
    }
  };

  return (
    <div className="mb-8">
      <h3 className="text-xl font-bold text-gray-800 mb-4">{title}</h3>
      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.id} className="bg-white rounded-lg shadow-sm border p-4">
            <div className="flex space-x-4">
              {/* Item Image Placeholder */}
              <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-gray-500 text-2xl">
                  {item.category === 'Pizza' ? '🍕' : item.category === 'Pasta' ? '🍝' : '🥗'}
                </span>
              </div>
              
              {/* Item Details */}
              <div className="flex-1">
                <h4 className="font-semibold text-gray-800 mb-1">{item.name}</h4>
                <p className="text-gray-600 text-sm mb-2">{item.description}</p>
                
                {/* Size Selection */}
                <div className="mb-3">
                  <p className="text-sm font-medium text-gray-700 mb-2">Select Size:</p>
                  <div className="flex space-x-2">
                    {item.sizes.map((size) => (
                      <button
                        key={size.name}
                        onClick={() => handleSizeSelect(item.id, size.name)}
                        className={`px-3 py-1 text-xs rounded-full border transition-colors ${
                          selectedItems[item.id]?.size === size.name
                            ? 'bg-red-600 text-white border-red-600'
                            : 'bg-white text-gray-700 border-gray-300 hover:border-red-300'
                        }`}
                      >
                        {size.name} - ${size.price}
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Quantity and Add Button */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleQuantityChange(item.id, (selectedItems[item.id]?.quantity || 1) - 1)}
                      className="w-8 h-8 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center hover:bg-gray-300"
                    >
                      -
                    </button>
                    <span className="w-8 text-center font-medium">
                      {selectedItems[item.id]?.quantity || 1}
                    </span>
                    <button
                      onClick={() => handleQuantityChange(item.id, (selectedItems[item.id]?.quantity || 1) + 1)}
                      className="w-8 h-8 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center hover:bg-gray-300"
                    >
                      +
                    </button>
                  </div>
                  
                  <button
                    onClick={() => handleAddToCart(item)}
                    disabled={!selectedItems[item.id]?.size}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      selectedItems[item.id]?.size
                        ? 'bg-red-600 text-white hover:bg-red-700'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 