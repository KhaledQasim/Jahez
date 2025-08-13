'use client';

import { useState } from 'react';
import GroupOrderModal from './components/GroupOrderModal';
import RestaurantHeader from './components/RestaurantHeader';
import MenuSection from './components/MenuSection';
import Cart from './components/Cart';

interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  sizes: Array<{ name: string; price: number }>;
  category: string;
}

interface CartItem {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  sizes: Array<{ name: string; price: number }>;
  category: string;
  selectedSize: { name: string; price: number };
  quantity: number;
  totalPrice: number;
}

export default function Home() {
  const [isGroupOrderModalOpen, setIsGroupOrderModalOpen] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isGroupOrderActive, setIsGroupOrderActive] = useState(false);

  const restaurantData = {
    name: "Bella Italia",
    description: "Authentic Italian Cuisine",
    rating: 4.8,
    deliveryTime: "25-35 min",
    image: "/restaurant-bg.jpg"
  };

  const menuItems: MenuItem[] = [
    {
      id: 1,
      name: "Margherita Pizza",
      description: "Fresh mozzarella, tomato sauce, basil",
      price: 12.99,
      image: "/pizza-margherita.jpg",
      sizes: [
        { name: "Small", price: 9.99 },
        { name: "Medium", price: 12.99 },
        { name: "Large", price: 15.99 }
      ],
      category: "Pizza"
    },
    {
      id: 2,
      name: "Pepperoni Pizza",
      description: "Spicy pepperoni, mozzarella, tomato sauce",
      price: 14.99,
      image: "/pizza-pepperoni.jpg",
      sizes: [
        { name: "Small", price: 11.99 },
        { name: "Medium", price: 14.99 },
        { name: "Large", price: 17.99 }
      ],
      category: "Pizza"
    },
    {
      id: 3,
      name: "Spaghetti Carbonara",
      description: "Eggs, pancetta, parmesan, black pepper",
      price: 13.99,
      image: "/spaghetti-carbonara.jpg",
      sizes: [
        { name: "Regular", price: 13.99 },
        { name: "Large", price: 16.99 }
      ],
      category: "Pasta"
    },
    {
      id: 4,
      name: "Caesar Salad",
      description: "Romaine lettuce, parmesan, croutons, caesar dressing",
      price: 8.99,
      image: "/caesar-salad.jpg",
      sizes: [
        { name: "Regular", price: 8.99 },
        { name: "Large", price: 11.99 }
      ],
      category: "Salads"
    }
  ];

  const addToCart = (item: MenuItem, size: string, quantity: number = 1) => {
    const selectedSize = item.sizes.find((s) => s.name === size);
    if (!selectedSize) return;
    
    const cartItem: CartItem = {
      ...item,
      selectedSize,
      quantity,
      totalPrice: selectedSize.price * quantity
    };
    
    setCart(prev => [...prev, cartItem]);
  };

  const removeFromCart = (index: number) => {
    setCart(prev => prev.filter((_, i) => i !== index));
  };

  const updateCartItemQuantity = (index: number, quantity: number) => {
    setCart(prev => prev.map((item, i) => 
      i === index ? { ...item, quantity, totalPrice: item.totalPrice / item.quantity * quantity } : item
    ));
  };

  const handleGroupOrderStart = () => {
    setIsGroupOrderActive(true);
    setIsGroupOrderModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <RestaurantHeader 
        restaurant={restaurantData}
        onGroupOrderClick={handleGroupOrderStart}
        isGroupOrderActive={isGroupOrderActive}
      />

      {/* Main Content */}
      <main className="pb-20">
        {/* Menu Sections */}
        <div className="px-4 py-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Menu</h2>
          
          {['Pizza', 'Pasta', 'Salads'].map(category => (
            <MenuSection
              key={category}
              title={category}
              items={menuItems.filter(item => item.category === category)}
              onAddToCart={addToCart}
            />
          ))}
        </div>
      </main>

      {/* Cart */}
      <Cart 
        items={cart}
        onRemoveItem={removeFromCart}
        onUpdateQuantity={updateCartItemQuantity}
        isGroupOrder={isGroupOrderActive}
      />

      {/* Group Order Modal */}
      <GroupOrderModal
        isOpen={isGroupOrderModalOpen}
        onClose={() => setIsGroupOrderModalOpen(false)}
        cart={cart}
      />
    </div>
  );
}
