# NOMA POS - Complete Setup & Deployment Guide

## 🎯 Overview

NOMA POS adalah sistem Point of Sales (POS) modern dengan:
- ✅ Dashboard analytics dengan grafik penjualan
- ✅ Manajemen kasir dan produk
- ✅ Laporan penjualan real-time
- ✅ Support pembayaran Tunai & QRIS
- ✅ UI/UX responsif dengan Tailwind CSS

---

## 📋 Prerequisites

Sebelum memulai, pastikan sudah terinstall:

### Required:
- ✅ **Node.js** v16+ (Download dari https://nodejs.org)
- ✅ **MySQL** v5.7+ (Download dari https://www.mysql.com)
- ✅ **Git** (Optional, untuk version control)
- ✅ **Code Editor** (VS Code recommended)

### Verify Installation:
```bash
node --version      # v16+
npm --version       # 8+
mysql --version     # 5.7+
```

---

## 🏗️ Project Structure

```
noma-pos/
├── client/                    # Frontend (React + Vite)
│   ├── public/
│   │   └── logo.png          # Your logo here
│   ├── src/
│   │   ├── components/        # Reusable components
│   │   ├── pages/            # Page components
│   │   ├── services/         # API services
│   │   ├── context/          # Context API
│   │   ├── utils/            # Helper functions
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
├── server/                    # Backend (Express)
│   ├── src/
│   │   ├── config/           # Database config
│   │   ├── controllers/      # Business logic
│   │   ├── middleware/       # Auth, upload, etc
│   │   ├── routes/           # API routes
│   │   ├── uploads/          # Product images
│   │   ├── app.js
│   │   └── server.js
│   ├── package.json
│   └── .env.example
│
├── database/
│   ├── schema.sql           # Initial schema
│   └── complete_schema.sql  # Full setup (NEW)
│
├── BACKEND_SETUP.md         # Backend guide (NEW)
├── FRONTEND_SETUP.md        # Frontend guide (NEW)
└── README.md
```

---

## 🚀 Quick Start (5 Steps)

### Step 1: Setup Database
```bash
# Login ke MySQL
mysql -u root -p

# Import schema
USE mysql;
SOURCE path/to/noma-pos/database/complete_schema.sql;

# Verify
USE noma_pos;
SHOW TABLES;
# Output: categories, products, sales, sale_items, users ✓
```

### Step 2: Setup Backend
```bash
cd noma-pos/server

# Copy .env.example ke .env
cp .env.example .env

# Edit .env dengan database credentials Anda
nano .env
# Atau buka dengan text editor

# Install dependencies
npm install

# Jalankan server
npm start
# atau npm run dev (dengan auto-reload)

# Expected output:
# ✓ Server berjalan di http://localhost:5000
# ✓ Database connected
```

### Step 3: Setup Frontend
```bash
cd noma-pos/client

# Pastikan logo sudah ada
ls public/logo.png  # Jika tidak ada, copy logo Anda ke sini

# Install dependencies
npm install

# Jalankan dev server
npm run dev

# Expected output:
# ✓ Local: http://localhost:5173
# ✓ Press o to open in browser
```

### Step 4: Test Login
1. Buka http://localhost:5173 di browser
2. Login dengan:
   - Username: `admin`
   - Password: `123456`

3. Jika berhasil, Anda sudah di Dashboard ✓

### Step 5: Verify Features
- [ ] Dashboard muncul dengan grafik
- [ ] Klik "Total Produk", modal muncul
- [ ] Buka halaman "Laporan", tabel muncul
- [ ] Buka "Kasir", bisa tambah/hapus kasir
- [ ] Login sebagai kasir, bisa buat transaksi
- [ ] Pilih QRIS, modal barcode muncul

---

## 🔐 Security Checklist

### Before Production:
```bash
# 1. Change default password
UPDATE users SET password = '[BCRYPT_HASH]' WHERE username = 'admin';

# 2. Generate strong JWT secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
# Copy output ke server/.env JWT_SECRET

# 3. Update CORS origin
// Di server/src/app.js
app.use(cors({
  origin: 'https://yourdomain.com', // Bukan localhost
  credentials: true
}));

# 4. Enable HTTPS
# Gunakan reverse proxy (nginx) atau Cloudflare

# 5. Setup firewall
# Hanya port 80 (HTTP) dan 443 (HTTPS) yang public
# Port 3306 (MySQL) hanya accessible dari server
```

---

## 📝 Environment Configuration

### Server: `server/.env`
```env
# Database
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=noma_pos

# JWT
JWT_SECRET=your_very_long_and_secret_key_here

# Server
PORT=5000
NODE_ENV=development
```

### Client: `client/.env`
```env
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=NOMA POS
```

---

## 🌐 Deployment Options

### Option 1: Heroku (Free tier available)
```bash
# Install Heroku CLI
# https://devcenter.heroku.com/articles/heroku-cli

# Login
heroku login

# Create app
heroku create noma-pos-app

# Add MySQL add-on
heroku addons:create cleardb:ignite

# Deploy
git push heroku main
```

### Option 2: DigitalOcean / Linode
```bash
# 1. Rent a VPS (Ubuntu 20.04)
# 2. SSH ke server
# 3. Install Node, MySQL, Nginx
# 4. Clone repository
# 5. Konfigurasi environment variables
# 6. Setup process manager (PM2)

npm install -g pm2
pm2 start server/src/server.js --name "noma-pos-backend"
pm2 startup
pm2 save

# 7. Setup Nginx reverse proxy
# 8. Setup SSL dengan Let's Encrypt
```

### Option 3: Docker (Containerized)
```dockerfile
# Dockerfile
FROM node:16-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 5000
CMD ["npm", "start"]
```

```bash
# Build dan run
docker build -t noma-pos .
docker run -p 5000:5000 --env-file .env noma-pos
```

---

## 📊 Database Backup & Recovery

### Backup Database
```bash
# Full backup
mysqldump -u root -p noma_pos > backup_$(date +%Y%m%d_%H%M%S).sql

# Scheduled backup (Linux cron)
0 2 * * * mysqldump -u root -pPASSWORD noma_pos > /backups/noma_pos_$(date +\%Y\%m\%d).sql
```

### Restore Database
```bash
# Restore dari backup
mysql -u root -p noma_pos < backup_20260621_120000.sql
```

---

## 🧪 Testing

### Backend Testing dengan Postman

```
Collection: NOMA POS API

1. Auth
   POST /api/auth/login
   Body: { "username": "admin", "password": "123456" }

2. Dashboard
   GET /api/dashboard
   Headers: { "Authorization": "Bearer TOKEN" }

3. Products
   GET /api/products

4. Cashiers
   GET /api/cashiers
   Headers: { "Authorization": "Bearer TOKEN" }

5. Reports
   GET /api/reports/sales?startDate=2026-06-01&endDate=2026-06-21
   Headers: { "Authorization": "Bearer TOKEN" }

6. Create Transaction
   POST /api/transactions
   Body: { "items": [...], "payment_method": "tunai|qris" }
```

### Frontend Testing

```bash
# Unit tests (optional)
npm run test

# Build test
npm run build

# Preview production build
npm run preview
```

---

## 🐛 Troubleshooting

### Backend won't start
```bash
# Check port 5000
lsof -i :5000

# Kill process
kill -9 [PID]

# Check MySQL connection
mysql -u root -p -e "SELECT 1;"

# Check .env
cat server/.env
```

### Frontend not connecting to API
```javascript
// Debug in browser console
fetch('http://localhost:5000/api/products')
  .then(r => r.json())
  .then(d => console.log(d))
  .catch(e => console.error(e))
```

### Database errors
```bash
# Check MySQL logs
tail -f /var/log/mysql/error.log

# Restart MySQL
systemctl restart mysql
# atau
brew services restart mysql  # macOS
```

### Image upload not working
```bash
# Check folder permissions
chmod -R 755 server/src/uploads/products

# Check if folder exists
mkdir -p server/src/uploads/products

# Check server logs
tail -f server/logs/*.log
```

---

## 📚 Documentation Files

- **BACKEND_SETUP.md** - Detailed backend configuration
- **FRONTEND_SETUP.md** - Detailed frontend configuration
- **database/complete_schema.sql** - Full database schema
- **server/.env.example** - Backend environment template
- **README.md** - Project overview (di root)

---

## 🎓 Learning Resources

### React & Vite
- https://react.dev
- https://vitejs.dev
- https://tailwindcss.com

### Express.js & Node
- https://expressjs.com
- https://nodejs.org/docs
- https://jwt.io

### MySQL
- https://dev.mysql.com/doc
- https://www.w3schools.com/sql

### APIs
- https://www.postman.com (API testing)
- https://curl.se (CLI requests)

---

## ✅ Final Checklist

Before going live:

- [ ] Database backup created
- [ ] .env files secured (not in git)
- [ ] JWT_SECRET changed
- [ ] Admin password changed
- [ ] CORS properly configured
- [ ] Error handling added
- [ ] Logging configured
- [ ] SSL/HTTPS enabled
- [ ] Database indexed
- [ ] API rate limiting added
- [ ] Input validation complete
- [ ] XSS/SQL injection protected

---

## 🎉 Success!

Jika Anda bisa menyelesaikan semua steps di atas tanpa error, maka:

✅ **NOMA POS sudah siap digunakan!**

## 📞 Support & Issues

Jika ada error atau pertanyaan:

1. **Check logs**
   - Backend: `server/logs/error.log`
   - Frontend: Browser console (F12)

2. **Search error message** di GitHub issues atau Stack Overflow

3. **Contact support**
   - Email: support@noma-pos.com
   - GitHub: https://github.com/noma-pos/issues

---

**Happy coding! 🚀**
