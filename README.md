# 🚀 NOMA POS - Modern Point of Sale System

A full-stack web application for managing retail operations with real-time analytics, inventory management, and payment processing.

## ✨ Features

### 👤 Owner Dashboard
- 📊 **Real-time Analytics**: Sales trends with interactive charts
- 📦 **Product Management**: CRUD operations with image uploads
- 📋 **Category Management**: Organize products by category
- 💼 **Cashier Management**: Hire, deactivate, and manage cashier accounts
- 📈 **Sales Reports**: Detailed reports with date filtering and exports (Excel/PDF)
- 🎯 **Performance Metrics**: KPI dashboard with key statistics

### 🛒 Cashier Interface
- 🛍️ **Point of Sale**: Fast checkout with product search
- 💳 **Payment Methods**: Support for cash and QRIS payments
- 📱 **QRIS Modal**: Display QR code for contactless payments
- 🧾 **Receipt Printing**: Automatic receipt generation
- 📊 **Transaction History**: View past transactions

### 🔐 Security
- 🔑 **JWT Authentication**: Secure token-based auth
- 🛡️ **Role-Based Access**: Owner and Cashier roles
- 🔒 **Password Hashing**: bcryptjs encryption
- 🚫 **SQL Injection Protection**: Prepared statements
- ✅ **XSS Protection**: React built-in security

## 🛠️ Tech Stack

### Frontend
- **React 18+** - UI library
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Recharts** - Data visualization
- **Axios** - HTTP client
- **React Router** - Navigation

### Backend
- **Node.js** - Runtime
- **Express.js** - Web framework
- **MySQL** - Database
- **JWT** - Authentication
- **Multer** - File uploads
- **bcryptjs** - Password hashing

### DevOps
- **Docker** (Optional)
- **Git** - Version control
- **Environment variables** - Configuration

## 📋 Project Structure

```
noma-pos/
├── client/                      # React frontend
│   ├── public/                  # Static assets
│   │   └── logo.png            # Your logo
│   ├── src/
│   │   ├── components/         # Reusable components
│   │   ├── pages/              # Page components
│   │   ├── services/           # API services
│   │   ├── context/            # React Context
│   │   ├── utils/              # Helper functions
│   │   └── main.jsx            # Entry point
│   └── package.json
│
├── server/                      # Express backend
│   ├── src/
│   │   ├── config/             # Database config
│   │   ├── controllers/        # Business logic
│   │   ├── middleware/         # Express middleware
│   │   ├── routes/             # API routes
│   │   ├── uploads/            # Product images
│   │   ├── app.js              # Express app
│   │   └── server.js           # Server entry
│   └── package.json
│
├── database/
│   ├── schema.sql              # Initial schema
│   └── complete_schema.sql     # Full setup
│
├── COMPLETE_SETUP_GUIDE.md     # ⭐ Start here
├── BACKEND_SETUP.md            # Backend guide
├── FRONTEND_SETUP.md           # Frontend guide
├── SESSION_SUMMARY.md          # What was done
└── README.md                   # This file
```

## 🚀 Quick Start

### Prerequisites
```bash
# Check if Node.js is installed
node --version    # Should be v16+

# Check if MySQL is installed
mysql --version   # Should be v5.7+
```

### 1️⃣ Setup Database
```bash
# Start MySQL
# macOS:
brew services start mysql

# Linux:
sudo systemctl start mysql

# Windows: Use MySQL Installer or run mysql service

# Create database
mysql -u root -p < database/complete_schema.sql
```

### 2️⃣ Setup Backend
```bash
cd server

# Create environment file
cp .env.example .env

# Edit .env with your database info
# nano .env  (or use your text editor)

# Install dependencies
npm install

# Start server
npm start
# Server running on http://localhost:5000
```

### 3️⃣ Setup Frontend
```bash
cd client

# Install dependencies
npm install

# Start development server
npm run dev
# Open http://localhost:5173
```

### 4️⃣ Login
- **Username**: `admin`
- **Password**: `123456`

## 📖 Full Setup Instructions

For detailed setup instructions, see:
- 📚 [**COMPLETE_SETUP_GUIDE.md**](./COMPLETE_SETUP_GUIDE.md) - Everything you need
- 🔧 [**BACKEND_SETUP.md**](./BACKEND_SETUP.md) - Backend configuration
- 🎨 [**FRONTEND_SETUP.md**](./FRONTEND_SETUP.md) - Frontend configuration
- 📝 [**SESSION_SUMMARY.md**](./SESSION_SUMMARY.md) - What was implemented

## 🔑 Environment Variables

### Backend (.env)
```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=noma_pos
JWT_SECRET=your_secret_key
PORT=5000
NODE_ENV=development
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=NOMA POS
```

## 📊 API Endpoints

### Authentication
```
POST   /api/auth/login              Login user
POST   /api/auth/register           Register new cashier
POST   /api/auth/logout             Logout user
```

### Dashboard
```
GET    /api/dashboard               Get dashboard data (owner only)
```

### Products
```
GET    /api/products                Get all products
POST   /api/products                Create product (owner only)
PUT    /api/products/:id            Update product (owner only)
DELETE /api/products/:id            Delete product (owner only)
```

### Categories
```
GET    /api/categories              Get all categories
POST   /api/categories              Create category (owner only)
```

### Sales & Transactions
```
GET    /api/sales                   Get all sales
POST   /api/sales                   Create sale
GET    /api/transactions            Get all transactions
POST   /api/transactions            Create transaction
```

### Cashiers
```
GET    /api/cashiers                Get all cashiers
POST   /api/cashiers                Create cashier (owner only)
PUT    /api/cashiers/:id            Update cashier (owner only)
DELETE /api/cashiers/:id            Delete cashier (owner only)
```

### Reports
```
GET    /api/reports/sales           Get sales report with date filter
```

## 🎯 User Roles

### Owner
- ✅ Full access to all features
- ✅ Dashboard with analytics
- ✅ Product and category management
- ✅ Cashier management
- ✅ Sales reports and exports
- ✅ System settings

### Cashier
- ✅ Point of Sale access
- ✅ Create transactions
- ✅ View product catalog
- ❌ Cannot manage products
- ❌ Cannot manage users
- ❌ Cannot view reports

## 🧪 Testing

### Manual Testing
1. Open http://localhost:5173
2. Login with `admin` / `123456`
3. Explore each feature
4. Test QRIS payment flow
5. Export reports

### API Testing with Postman
1. Import API endpoints (see postman_collection.json if exists)
2. Create authorization token
3. Test each endpoint

## 📦 Build & Deploy

### Development
```bash
npm start (in both client and server)
```

### Production Build
```bash
# Frontend
cd client && npm run build
# Output: dist/ folder

# Backend
# Just copy server folder to production
# Update .env with production values
```

### Docker Deployment
```bash
docker build -t noma-pos .
docker run -p 5000:5000 --env-file .env noma-pos
```

## 🐛 Troubleshooting

### "Cannot connect to database"
```bash
# Check MySQL is running
mysql -u root -p -e "SELECT 1;"

# Check .env values match your setup
cat server/.env
```

### "Port 5000 already in use"
```bash
# Find and kill process
lsof -i :5000
kill -9 <PID>
```

### "API returns 404"
```bash
# Check server is running
curl http://localhost:5000/api/products

# Check CORS configuration in server/src/app.js
```

### "Frontend build fails"
```bash
# Clear dependencies
rm -rf node_modules package-lock.json
npm install
npm run build
```

## 📚 Documentation

| File | Purpose |
|------|---------|
| COMPLETE_SETUP_GUIDE.md | Full setup from scratch |
| BACKEND_SETUP.md | Backend configuration details |
| FRONTEND_SETUP.md | Frontend configuration details |
| SESSION_SUMMARY.md | Summary of all changes |
| database/complete_schema.sql | Complete database schema |

## 🔐 Security Best Practices

- ✅ Keep `.env` file secret (add to .gitignore)
- ✅ Never commit passwords or keys
- ✅ Change default admin password before production
- ✅ Use HTTPS in production
- ✅ Regular database backups
- ✅ Update dependencies regularly
- ✅ Use environment-specific configs

## 📈 Performance Tips

- Use database indexes (already configured)
- Enable caching for products
- Compress images before upload
- Use CDN for static assets in production
- Implement pagination for large datasets
- Monitor database query performance

## 🤝 Contributing

1. Create feature branch: `git checkout -b feature/new-feature`
2. Commit changes: `git commit -am 'Add new feature'`
3. Push to branch: `git push origin feature/new-feature`
4. Create Pull Request

## 📄 License

This project is licensed under the MIT License - see LICENSE file for details.

## 📞 Support

For issues, questions, or suggestions:

1. Check the troubleshooting section in COMPLETE_SETUP_GUIDE.md
2. Review existing GitHub issues
3. Create a new issue with detailed information
4. Contact the development team

## ✅ Checklist for First Run

- [ ] Database created and imported
- [ ] Backend server running (port 5000)
- [ ] Frontend dev server running (port 5173)
- [ ] Able to login with admin/123456
- [ ] Dashboard displays without errors
- [ ] Can create a transaction
- [ ] Can select QRIS payment
- [ ] Can view reports
- [ ] Can manage cashiers

## 🎉 Ready to Go!

Everything is configured and ready to run. Follow the **COMPLETE_SETUP_GUIDE.md** for detailed instructions, then start building amazing features!

---

**Last Updated**: 2026-06-21  
**Status**: ✅ Production Ready  
**Version**: 1.0.0

**Questions?** Check the documentation files or review the code comments for more details!
