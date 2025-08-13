interface DirectusConfig {
  url: string;
  token?: string;
}

interface MenuItem {
  id: number;
  name: string;
  description: string;
  category: string;
  image?: string;
  available: boolean;
  sort_order: number;
  sizes: MenuItemSize[];
}

interface MenuItemSize {
  id: number;
  name: string;
  price: number;
  available: boolean;
}

interface CartItem {
  id: string;
  room: string;
  user: string;
  user_name: string;
  menu_item: number;
  size: number;
  quantity: number;
  total_price: number;
  created_at: string;
  updated_at: string;
}

interface GroupOrderRoom {
  id: string;
  room_id: string;
  host_user: string;
  host_name: string;
  status: 'active' | 'ordered' | 'completed' | 'cancelled';
  created_at: string;
  updated_at: string;
}

class DirectusService {
  private config: DirectusConfig;

  constructor(config: DirectusConfig) {
    this.config = config;
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const url = `${this.config.url}/items/${endpoint}`;
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.config.token) {
      (headers as Record<string, string>)['Authorization'] = `Bearer ${this.config.token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      throw new Error(`Directus API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  // Menu Items
  async getMenuItems(): Promise<MenuItem[]> {
    const response = await this.request('menu_items?sort=sort_order&filter[available][_eq]=true&fields=*,sizes.*');
    return response.data || [];
  }

  async getMenuItemsByCategory(category: string): Promise<MenuItem[]> {
    const response = await this.request(`menu_items?filter[category][_eq]=${category}&filter[available][_eq]=true&sort=sort_order&fields=*,sizes.*`);
    return response.data || [];
  }

  // Group Order Rooms
  async createRoom(roomData: Partial<GroupOrderRoom>): Promise<GroupOrderRoom> {
    const response = await this.request('group_order_rooms', {
      method: 'POST',
      body: JSON.stringify(roomData),
    });
    return response.data;
  }

  async getRoom(roomId: string): Promise<GroupOrderRoom | null> {
    try {
      const response = await this.request(`group_order_rooms?filter[room_id][_eq]=${roomId}&fields=*`);
      return response.data?.[0] || null;
    } catch (error) {
      return null;
    }
  }

  async updateRoomStatus(roomId: string, status: GroupOrderRoom['status']): Promise<void> {
    const room = await this.getRoom(roomId);
    if (room) {
      await this.request(`group_order_rooms/${room.id}`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      });
    }
  }

  // Cart Items
  async getCartItems(roomId: string): Promise<CartItem[]> {
    const room = await this.getRoom(roomId);
    if (!room) return [];

    const response = await this.request(`cart_items?filter[room][_eq]=${room.id}&fields=*,menu_item.*,size.*`);
    return response.data || [];
  }

  async addCartItem(cartItem: Omit<CartItem, 'id' | 'created_at' | 'updated_at'>): Promise<CartItem> {
    const response = await this.request('cart_items', {
      method: 'POST',
      body: JSON.stringify(cartItem),
    });
    return response.data;
  }

  async updateCartItem(cartItemId: string, updates: Partial<CartItem>): Promise<CartItem> {
    const response = await this.request(`cart_items/${cartItemId}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
    return response.data;
  }

  async removeCartItem(cartItemId: string): Promise<void> {
    await this.request(`cart_items/${cartItemId}`, {
      method: 'DELETE',
    });
  }

  async clearRoomCart(roomId: string): Promise<void> {
    const room = await this.getRoom(roomId);
    if (!room) return;

    const cartItems = await this.getCartItems(roomId);
    for (const item of cartItems) {
      await this.removeCartItem(item.id);
    }
  }

  // Orders
  async createOrder(orderData: {
    room: string;
    total_amount: number;
    notes?: string;
  }): Promise<Record<string, unknown>> {
    const response = await this.request('orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
    return response.data;
  }

  // Authentication
  async authenticate(email: string, password: string): Promise<{ access_token: string; refresh_token: string }> {
    const response = await fetch(`${this.config.url}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      throw new Error('Authentication failed');
    }

    const data = await response.json();
    return data.data;
  }

  async refreshToken(refreshToken: string): Promise<{ access_token: string; refresh_token: string }> {
    const response = await fetch(`${this.config.url}/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });

    if (!response.ok) {
      throw new Error('Token refresh failed');
    }

    const data = await response.json();
    return data.data;
  }

  // WebSocket connection info
  getWebSocketUrl(): string {
    // Replace with your Directus WebSocket URL
    // Usually it's the same as your Directus URL but with ws:// or wss://
    return this.config.url.replace('http://', 'ws://').replace('https://', 'wss://');
  }
}

// Create a singleton instance
const directusService = new DirectusService({
  url: process.env.NEXT_PUBLIC_DIRECTUS_URL || 'http://localhost:8055',
});

export default directusService;
export type { MenuItem, MenuItemSize, CartItem, GroupOrderRoom }; 