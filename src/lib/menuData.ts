import { MenuItem } from '@/types';

export const menuItems: MenuItem[] = [
  {
    id: '1',
    name: 'Margherita Pizza',
    description: 'Fresh mozzarella, tomato sauce, and basil',
    price: 12.99,
    image: '/images/margherita.jpg',
    category: 'Pizza',
    sizes: {
      small: 10.99,
      medium: 12.99,
      large: 15.99
    },
    availableSizes: ['small', 'medium', 'large']
  },
  {
    id: '2',
    name: 'Pepperoni Pizza',
    description: 'Spicy pepperoni with melted cheese',
    price: 14.99,
    image: '/images/pepperoni.jpg',
    category: 'Pizza',
    sizes: {
      small: 12.99,
      medium: 14.99,
      large: 17.99
    },
    availableSizes: ['small', 'medium', 'large']
  },
  {
    id: '3',
    name: 'Quattro Formaggi',
    description: 'Four cheese blend with mozzarella, gorgonzola, parmesan, and ricotta',
    price: 16.99,
    image: '/images/quattro-formaggi.jpg',
    category: 'Pizza',
    sizes: {
      small: 14.99,
      medium: 16.99,
      large: 19.99
    },
    availableSizes: ['small', 'medium', 'large']
  },
  {
    id: '4',
    name: 'Spaghetti Carbonara',
    description: 'Eggs, cheese, pancetta, and black pepper',
    price: 13.99,
    image: '/images/carbonara.jpg',
    category: 'Pasta'
  },
  {
    id: '5',
    name: 'Fettuccine Alfredo',
    description: 'Creamy parmesan sauce with butter',
    price: 12.99,
    image: '/images/alfredo.jpg',
    category: 'Pasta'
  },
  {
    id: '6',
    name: 'Caesar Salad',
    description: 'Romaine lettuce, parmesan, croutons, and caesar dressing',
    price: 8.99,
    image: '/images/caesar-salad.jpg',
    category: 'Salad'
  },
  {
    id: '7',
    name: 'Garlic Bread',
    description: 'Toasted bread with garlic butter and herbs',
    price: 4.99,
    image: '/images/garlic-bread.jpg',
    category: 'Appetizer'
  },
  {
    id: '8',
    name: 'Tiramisu',
    description: 'Classic Italian dessert with coffee and mascarpone',
    price: 6.99,
    image: '/images/tiramisu.jpg',
    category: 'Dessert'
  }
];

export const categories = ['Pizza', 'Pasta', 'Salad', 'Appetizer', 'Dessert']; 