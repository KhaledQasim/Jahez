import { io, Socket } from 'socket.io-client';

export interface GroupOrderMessage {
  type: 'cart_update' | 'user_joined' | 'user_left' | 'order_placed';
  roomId: string;
  data: CartItem[] | string | Record<string, unknown>;
  userId: string;
  timestamp: number;
}

export interface CartItem {
  id: number;
  name: string;
  selectedSize: { name: string; price: number };
  quantity: number;
  totalPrice: number;
  category: string;
  addedBy: string;
}

class WebSocketService {
  private socket: Socket | null = null;
  private roomId: string | null = null;
  private userId: string | null = null;

  connect(roomId: string, userId: string) {
    this.roomId = roomId;
    this.userId = userId;

    // Connect to Directus WebSocket endpoint
    // You'll need to set up WebSocket handling in Directus
    const wsUrl = process.env.NEXT_PUBLIC_DIRECTUS_WS_URL || 'ws://localhost:8055';
    this.socket = io(wsUrl, {
      transports: ['websocket'],
      query: {
        roomId,
        userId
      }
    });

    this.socket.on('connect', () => {
      console.log('Connected to WebSocket server');
      this.joinRoom(roomId);
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from WebSocket server');
    });

    this.socket.on('error', (error) => {
      console.error('WebSocket error:', error);
    });
  }

  private joinRoom(roomId: string) {
    if (this.socket) {
      this.socket.emit('join_room', { roomId, userId: this.userId });
    }
  }

  leaveRoom() {
    if (this.socket && this.roomId) {
      this.socket.emit('leave_room', { roomId: this.roomId, userId: this.userId });
    }
  }

  updateCart(cartItems: CartItem[]) {
    if (this.socket && this.roomId) {
      this.socket.emit('cart_update', {
        roomId: this.roomId,
        userId: this.userId,
        cartItems,
        timestamp: Date.now()
      });
    }
  }

  onCartUpdate(callback: (cartItems: CartItem[]) => void) {
    if (this.socket) {
      this.socket.on('cart_update', (data) => {
        if (data.userId !== this.userId) {
          callback(data.cartItems);
        }
      });
    }
  }

  onUserJoined(callback: (userId: string) => void) {
    if (this.socket) {
      this.socket.on('user_joined', (data) => {
        if (data.userId !== this.userId) {
          callback(data.userId);
        }
      });
    }
  }

  onUserLeft(callback: (userId: string) => void) {
    if (this.socket) {
      this.socket.on('user_left', (data) => {
        if (data.userId !== this.userId) {
          callback(data.userId);
        }
      });
    }
  }

  onOrderPlaced(callback: (orderData: Record<string, unknown>) => void) {
    if (this.socket) {
      this.socket.on('order_placed', (data) => {
        callback(data);
      });
    }
  }

  placeOrder(orderData: Record<string, unknown>) {
    if (this.socket && this.roomId) {
      this.socket.emit('place_order', {
        roomId: this.roomId,
        userId: this.userId,
        orderData,
        timestamp: Date.now()
      });
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
    this.roomId = null;
    this.userId = null;
  }

  isConnected(): boolean {
    return this.socket?.connected || false;
  }
}

// Create a singleton instance
const websocketService = new WebSocketService();

export default websocketService; 