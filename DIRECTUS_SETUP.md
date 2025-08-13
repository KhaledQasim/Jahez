# Directus Setup Guide for Group Ordering System

## 1. Install Directus

First, make sure you have Directus installed and running. You can use Docker:

```bash
# Create a new Directus project
npx create-directus-project@latest sawa-directus

# Or use Docker
docker run -p 8055:8055 directus/directus:latest
```

## 2. Create Collections

You need to create the following collections in Directus:

### Option A: Import Schema (Recommended)
1. Go to your Directus admin panel
2. Navigate to Settings → Data Model
3. Import the `directus-collections-schema.json` file

### Option B: Manual Creation
Create these collections manually:

#### 1. group_order_rooms
- **room_id** (String, Required, Unique)
- **host_user** (Many-to-One → directus_users)
- **host_name** (String, Required)
- **status** (String, Choices: active, ordered, completed, cancelled)

#### 2. menu_items
- **name** (String, Required)
- **description** (Text, Required)
- **category** (String, Choices: Pizza, Pasta, Salads, Drinks, Desserts)
- **image** (File)
- **available** (Boolean, Default: true)
- **sort_order** (Integer, Default: 0)

#### 3. menu_item_sizes
- **menu_item** (Many-to-One → menu_items)
- **name** (String, Required)
- **price** (Decimal, Required)
- **available** (Boolean, Default: true)

#### 4. cart_items
- **room** (Many-to-One → group_order_rooms)
- **user** (Many-to-One → directus_users)
- **user_name** (String, Required)
- **menu_item** (Many-to-One → menu_items)
- **size** (Many-to-One → menu_item_sizes)
- **quantity** (Integer, Required, Min: 1)
- **total_price** (Decimal, Required)

#### 5. orders
- **room** (Many-to-One → group_order_rooms)
- **total_amount** (Decimal, Required)
- **status** (String, Choices: pending, confirmed, preparing, ready, delivered, cancelled)
- **notes** (Text)

## 3. Set Up Permissions

For each collection, set up the following permissions:

### Public Access (for unauthenticated users)
- **group_order_rooms**: Read
- **menu_items**: Read
- **menu_item_sizes**: Read
- **cart_items**: Create, Read, Update, Delete
- **orders**: Create, Read

### Authenticated Users
- All collections: Full access

## 4. Add Sample Data

### Menu Items
Add these sample menu items:

#### Pizza Category
1. **Margherita Pizza**
   - Description: Fresh mozzarella, tomato sauce, basil
   - Sizes: Small ($9.99), Medium ($12.99), Large ($15.99)

2. **Pepperoni Pizza**
   - Description: Spicy pepperoni, mozzarella, tomato sauce
   - Sizes: Small ($11.99), Medium ($14.99), Large ($17.99)

#### Pasta Category
3. **Spaghetti Carbonara**
   - Description: Eggs, pancetta, parmesan, black pepper
   - Sizes: Regular ($13.99), Large ($16.99)

#### Salads Category
4. **Caesar Salad**
   - Description: Romaine lettuce, parmesan, croutons, caesar dressing
   - Sizes: Regular ($8.99), Large ($11.99)

## 5. Environment Variables

Add these to your NextJS `.env.local`:

```env
NEXT_PUBLIC_DIRECTUS_URL=http://localhost:8055
NEXT_PUBLIC_DIRECTUS_WS_URL=ws://localhost:8055
```

## 6. WebSocket Setup (Optional)

For real-time features, you'll need to set up WebSocket handling in Directus:

### Option A: Use Directus Hooks
Create a hook that listens for cart changes and broadcasts to connected clients.

### Option B: External WebSocket Server
Set up a separate WebSocket server that connects to Directus and handles real-time communication.

## 7. Testing the Setup

1. Start your Directus instance
2. Start your NextJS app: `npm run dev`
3. Visit the app and try:
   - Clicking "Group Order" button
   - Adding items to cart
   - Scanning QR code
   - Joining a room

## 8. Troubleshooting

### Common Issues:

1. **CORS Errors**: Make sure Directus allows requests from your NextJS app
2. **Permission Denied**: Check collection permissions
3. **WebSocket Connection Failed**: Verify WebSocket URL and setup

### Directus Configuration:

In your Directus `.env` file, ensure:

```env
CORS_ENABLED=true
CORS_ORIGIN=http://localhost:3000
PUBLIC_URL=http://localhost:8055
```

## 9. Next Steps

Once the basic setup is working:

1. Add real food images to menu items
2. Implement user authentication
3. Set up WebSocket real-time updates
4. Add order management features
5. Implement payment processing

## 10. API Endpoints

The app will use these Directus endpoints:

- `GET /items/menu_items` - Get all menu items
- `POST /items/group_order_rooms` - Create a new room
- `GET /items/group_order_rooms?filter[room_id][_eq]=xxx` - Get room by ID
- `POST /items/cart_items` - Add item to cart
- `GET /items/cart_items?filter[room][_eq]=xxx` - Get cart items for room
- `PATCH /items/cart_items/xxx` - Update cart item
- `DELETE /items/cart_items/xxx` - Remove cart item
- `POST /items/orders` - Create order

All endpoints will be handled by the `directus.ts` service in your NextJS app. 