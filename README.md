# NordicInventory

Inventory and order management system built with Laravel 11 and Vue 3.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | Laravel 11 (PHP 8.2+) |
| Frontend | Vue 3 (Composition API) + Vue Router |
| Styling | Tailwind CSS v4 |
| Auth | Laravel Sanctum (token-based) |
| Database | SQLite (default, configurable to MySQL/PostgreSQL) |
| Build | Vite |

## Process Requirements

### User Type
- All authenticated users have the same permissions (single user type).
- No role-based access control is implemented.

### Features
- **Product browsing** — Paginated list with ILIKE search filtering (case-insensitive).
- **Cart management** — Add multiple products with quantities, adjust or remove items.
- **Order placement** — Submit cart as an order with atomic stock deduction (DB transaction + row-level locking).
- **Order history** — Paginated list of the user's own recent orders.
- **Authentication** — Login/logout with rate limiting (5 attempts per minute).

### Constraints
- Stock cannot go below zero. Insufficient stock returns a 400 error and rolls back the transaction.
- Only the authenticated user's orders are visible to them.
- Currency is displayed in MMK.

## Setup Instructions

### Prerequisites

- PHP 8.2+
- Composer
- Node.js 18+ and npm

### Installation

1. Install PHP dependencies
   ```bash
   composer install
   ```

2. Install Node dependencies
   ```bash
   npm install
   ```

3. Copy environment file
   ```bash
   cp .env.example .env
   ```

4. Generate app key and create the SQLite database
   ```bash
   php artisan key:generate
   touch database/database.sqlite
   ```

5. Run migrations
   ```bash
   php artisan migrate
   ```

6. Seed test data (3 test users + 20 products)
   ```bash
   php artisan db:seed
   ```

   **Test accounts** (all use password `password123`):
   - `admin1@example.com`
   - `admin2@example.com`
   - `admin3@example.com`

7. Build frontend assets
   ```bash
   npm run build
   ```

### Development

Run the Laravel server:
```bash
php artisan serve
```

Start the Vite dev server (for hot-reloading during frontend development):
```bash
npm run dev
```

Then open `http://localhost:8000` in your browser.

## API Routes

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/login` | No | Authenticate and receive a token |
| POST | `/api/logout` | Yes | Revoke the current token |
| GET | `/api/user` | Yes | Get authenticated user info |
| GET | `/api/products` | Yes | List products (paginated, supports `?search=`) |
| GET | `/api/orders` | Yes | List user's orders (paginated) |
| POST | `/api/orders` | Yes | Create a new order |

## Project Structure

```
app/
├── Http/Controllers/Api/       # API controllers (Auth, Order, Product)
└── Models/                     # Eloquent models (Order, OrderItem, Product, User)
database/
├── migrations/                 # Database schema
└── seeders/                    # Seeders for products and test users
resources/
├── js/
│   ├── components/             # Vue components
│   │   ├── Dashboard.vue       # Parent layout
│   │   ├── Login.vue           # Login form
│   │   ├── Navbar.vue          # Top navigation
│   │   ├── ProductList.vue     # Product search and pagination
│   │   ├── ProductItem.vue     # Single product row
│   │   ├── Cart.vue            # Shopping cart
│   │   ├── CartItem.vue        # Single cart item
│   │   ├── OrderList.vue       # Order history
│   │   ├── PaginationBar.vue   # Reusable pagination
│   │   ├── ToastNotification.vue # Dismissible toast
│   │   └── LogoutModal.vue     # Logout confirmation
│   ├── composables/
│   │   └── useDashboard.js     # Shared state and logic
│   └── api.js                  # Axios instance with auth interceptors
└── views/
    └── welcome.blade.php       # Vue app mount point
routes/
└── api.php                     # API route definitions
```
