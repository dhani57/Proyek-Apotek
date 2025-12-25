# Web Apotek - Pharmacy Management System

A comprehensive pharmacy management system built with Next.js (frontend) and NestJS (backend), featuring JWT authentication, role-based access control, and a professional admin dashboard.

## 🚀 Features

### Backend (NestJS)
- ✅ JWT Authentication with Bcrypt password encryption
- ✅ Role-based access control (ADMIN, PELANGGAN)
- ✅ Protected admin endpoints using RolesGuard
- ✅ Automatic stock reduction on transactions
- ✅ RESTful API with TypeScript
- ✅ PostgreSQL database with Prisma ORM

### Frontend (Next.js)
- ✅ Modern, responsive UI with Tailwind CSS
- ✅ Emerald/Green professional theme
- ✅ Protected admin routes with HOC
- ✅ Admin Dashboard with statistics
- ✅ Inventory Management (CRUD operations)
- ✅ Transaction History
- ✅ Expiring Medicine Alerts
- ✅ Login/Register pages with API integration

## 📋 Prerequisites

- Node.js (v16 or higher)
- PostgreSQL database
- npm or yarn

## 🛠️ Installation & Setup

### 1. Clone the Repository

```bash
cd web-apotek
```

### 2. Backend Setup

```bash
cd server

# Install dependencies
npm install

# Configure environment variables
# Create .env file with:
DATABASE_URL="postgresql://username:password@localhost:5432/db_apotek"
JWT_SECRET="your-secret-key-change-in-production"
PORT=3000

# Run Prisma migrations
npx prisma migrate dev

# Seed database with admin account
npx prisma db seed

# Start backend server
npm run start:dev
```

**Default Admin Account:**
- Email: `admin@apotek.com`
- Password: `admin123`

### 3. Frontend Setup

```bash
cd client

# Install dependencies
npm install

# Start frontend server (runs on port 3001 by default)
npm run dev
```

## 🔐 API Endpoints

### Authentication
- `POST /auth/register` - Register new user (PELANGGAN role)
- `POST /auth/login` - Login user
- `GET /auth/profile` - Get user profile (requires JWT)

### Medicines (Protected)
- `GET /medicines` - Get all medicines (requires JWT)
- `GET /medicines/:id` - Get single medicine
- `POST /medicines` - Create medicine (ADMIN only)
- `PATCH /medicines/:id` - Update medicine (ADMIN only)
- `DELETE /medicines/:id` - Delete medicine (ADMIN only)
- `GET /medicines/statistics` - Get statistics (ADMIN only)
- `GET /medicines/low-stock` - Get low stock medicines (ADMIN only)
- `GET /medicines/expiring` - Get expiring medicines (ADMIN only)

### Transactions (Protected)
- `POST /transactions` - Create transaction (requires JWT)
- `GET /transactions` - Get all transactions (ADMIN only)
- `GET /transactions/:id` - Get single transaction
- `GET /transactions/statistics` - Get statistics (ADMIN only)

## 🎨 Admin Panel Routes

Access admin panel at `http://localhost:3001/admin` (requires ADMIN role)

- `/admin` - Dashboard with statistics
- `/admin/inventory` - Medicine inventory management (CRUD)
- `/admin/transactions` - Transaction history
- `/admin/alerts` - Expiring medicines and low stock alerts

## 🗄️ Database Schema

### User
- id, email, password (hashed), name, role (ADMIN/PELANGGAN)

### Product (Medicine)
- id, name, description, sellPrice, buyPrice, stock, unit
- batchNumber, expirationDate, categoryId, isActive

### Category
- id, name, description

### Transaction
- id, transactionNo, totalPrice, paymentMethod, status
- cashierId (User), items (TransactionItem[])

### TransactionItem
- id, quantity, price, subtotal
- transactionId, productId

## 🔒 Security Features

1. **Password Encryption**: All passwords are hashed using Bcrypt (10 rounds)
2. **JWT Authentication**: Secure token-based authentication with 24h expiry
3. **Role-Based Access Control**: Admin endpoints protected by RolesGuard
4. **Protected Routes**: Frontend admin routes protected by withAdminAuth HOC
5. **CORS Configuration**: Configured for localhost:3001 (Next.js)

## 📝 Key Implementation Details

### Automatic Stock Reduction
When a transaction is created, the system automatically:
1. Validates product availability and stock levels
2. Creates transaction with all items
3. Reduces stock for each product in a database transaction
4. Ensures data consistency with atomic operations

### Expiring Medicine Monitoring
- Monitors medicines expiring within 3 months
- Visual alerts with color-coded warnings:
  - Red: Expired or expires in ≤30 days
  - Orange: Expires in 31-60 days
  - Yellow: Expires in 61-90 days

### Low Stock Alerts
- Configurable threshold (default: 10 units)
- Color-coded stock levels:
  - Red: ≤5 units (Critical)
  - Yellow: 6-10 units (Low)
  - Green: >10 units (Adequate)

## 🎯 Usage Examples

### Login as Admin
```bash
POST http://localhost:3000/auth/login
Content-Type: application/json

{
  "email": "admin@apotek.com",
  "password": "admin123"
}
```

### Create Medicine (Admin)
```bash
POST http://localhost:3000/medicines
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Paracetamol",
  "description": "Pain reliever",
  "sellPrice": 5000,
  "buyPrice": 3000,
  "stock": 100,
  "unit": "tablet",
  "batchNumber": "BATCH001",
  "expirationDate": "2025-12-31",
  "categoryId": "<category-uuid>"
}
```

### Create Transaction
```bash
POST http://localhost:3000/transactions
Authorization: Bearer <token>
Content-Type: application/json

{
  "items": [
    {
      "productId": "<medicine-uuid>",
      "quantity": 5
    }
  ],
  "paymentMethod": "cash",
  "notes": "Optional notes"
}
```

## 🚦 Testing the System

1. Start both backend (port 3000) and frontend (port 3001)
2. Access `http://localhost:3001`
3. Click "Masuk" (Login)
4. Login with admin credentials
5. You'll be redirected to `/admin` dashboard
6. Explore the features:
   - View statistics on dashboard
   - Add/edit medicines in inventory
   - View transaction history
   - Check expiring medicine alerts

## 📱 Screenshots Features

### Admin Dashboard
- Total sales statistics
- Medicine count
- Low stock alerts
- Expiring medicines count

### Inventory Management
- Full CRUD operations
- Search functionality
- Batch number tracking
- Expiration date monitoring
- Stock level indicators

### Transaction History
- Date range filtering
- Detailed transaction view
- Payment method tracking
- Item breakdown

### Alerts Page
- Expiring medicines (next 3 months)
- Low stock warnings
- Color-coded urgency levels

## 🛡️ Error Handling

- Validation errors return appropriate HTTP status codes
- Authentication failures return 401 Unauthorized
- Authorization failures return 403 Forbidden
- Not found errors return 404
- Server errors return 500 with safe error messages

## 🔧 Development

### Backend Hot Reload
```bash
cd server
npm run start:dev
```

### Frontend Hot Reload
```bash
cd client
npm run dev
```

### Database Management
```bash
# View database in Prisma Studio
cd server
npx prisma studio

# Create new migration
npx prisma migrate dev --name migration_name

# Reset database
npx prisma migrate reset
```

## 📦 Tech Stack

**Backend:**
- NestJS
- TypeScript
- Prisma ORM
- PostgreSQL
- JWT & Passport
- Bcrypt
- Class Validator

**Frontend:**
- Next.js 15
- React 19
- TypeScript
- Tailwind CSS
- Lucide Icons

## 🤝 Contributing

This is a complete implementation. To extend:
1. Add more medicine categories
2. Implement supplier management
3. Add reporting features
4. Implement purchase orders
5. Add barcode scanning

## 📄 License

This project is for educational/demonstration purposes.

## 👨‍💻 Author

Created as a comprehensive pharmacy management system with modern web technologies and best practices.
