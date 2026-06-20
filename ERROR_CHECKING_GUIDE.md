# NOMA POS - Error Checking & Troubleshooting Guide

## ✅ Verifikasi Pre-Startup

Sebelum menjalankan aplikasi, pastikan semua ini sudah dipenuhi:

### 1. **Node.js & npm**
```bash
node --version    # Harus v16 atau lebih baru
npm --version     # Harus v8 atau lebih baru
```

### 2. **MySQL**
```bash
mysql --version   # Harus v5.7 atau lebih baru

# Cek MySQL sudah berjalan
mysql -u root -p -e "SELECT 1;"
```

### 3. **Database Setup**
```bash
# Import schema
mysql -u root -p < database/complete_schema.sql

# Verify
mysql -u root -p -e "USE noma_pos; SHOW TABLES;"
```

---

## 🚀 Startup Sequence

### **Terminal 1: Database** (Optional - hanya jika perlu reset)
```bash
mysql -u root -p
> USE noma_pos;
> SHOW TABLES;  # Pastikan ada 5 tabel
> EXIT;
```

### **Terminal 2: Backend Server**
```bash
cd server

# Cek .env file
cat .env  # Pastikan DB_HOST, DB_USER, DB_PASSWORD benar

# Install dependencies (first time only)
npm install

# Start server
npm start
# Expected output: "Server running on port 5000"
```

### **Terminal 3: Frontend**
```bash
cd client

# Install dependencies (first time only)
npm install

# Start dev server
npm run dev
# Expected output: "Local: http://localhost:5173"
```

---

## ❌ Common Errors & Solutions

### **Error 1: "Cannot find module 'xxx'"**

**Problem**: Package tidak terinstall
```bash
# Solution:
cd server (atau client)
npm install

# Atau install specific package:
npm install <package-name>
```

---

### **Error 2: "connect ECONNREFUSED 127.0.0.1:3306"**

**Problem**: MySQL tidak berjalan atau database tidak ada

**Solutions**:
```bash
# 1. Cek MySQL running
# Windows: 
tasklist | find "mysql"

# macOS:
brew services list

# Linux:
systemctl status mysql

# 2. Start MySQL jika belum berjalan
# Windows: 
net start MySQL80  (atau nama service Anda)

# macOS:
brew services start mysql

# Linux:
sudo systemctl start mysql

# 3. Import database
mysql -u root -p < database/complete_schema.sql

# 4. Verify database ada
mysql -u root -p -e "SHOW DATABASES;" | grep noma_pos
```

---

### **Error 3: "Port 5000 already in use"**

**Problem**: Port 5000 sudah digunakan

**Solutions**:
```bash
# 1. Find process using port 5000
# Windows:
netstat -ano | find "5000"
taskkill /PID <PID> /F

# macOS/Linux:
lsof -i :5000
kill -9 <PID>

# 2. Atau ganti port di server/.env
PORT=5001
```

---

### **Error 4: "Port 5173 already in use"**

**Problem**: Port 5173 sudah digunakan

**Solutions**:
```bash
# 1. Kill process
# Windows:
netstat -ano | find "5173"
taskkill /PID <PID> /F

# macOS/Linux:
lsof -i :5173
kill -9 <PID>

# 2. Atau Vite akan otomatis gunakan port berikutnya (5174, 5175, etc)
```

---

### **Error 5: "GET /api/dashboard 404"**

**Problem**: API endpoint tidak ditemukan

**Checklist**:
- [ ] Backend server running (Terminal 2)
- [ ] Route terdaftar di `server/src/app.js`
- [ ] Controller file ada
- [ ] Syntax di route/controller benar

**Fix**:
```bash
# 1. Cek di app.js
grep "dashboard" server/src/app.js
# Harus ada: app.use("/api/dashboard", dashboardRoutes);

# 2. Cek route file
ls -la server/src/routes/dashboardRoutes.js

# 3. Cek controller
ls -la server/src/controllers/dashboardController.js
```

---

### **Error 6: "Unexpected token '<' in JSON at position 0"**

**Problem**: Backend mengembalikan HTML (error) bukan JSON

**Cause**: Biasanya 500 error yang belum ditangani

**Solutions**:
```bash
# 1. Cek backend logs
# Lihat console Terminal 2

# 2. Debug API call
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:5000/api/dashboard

# 3. Jika ada SQL error, cek:
#    - Kolom tabel ada
#    - Foreign keys valid
#    - Query syntax benar
```

---

### **Error 7: "CORS policy: No 'Access-Control-Allow-Origin' header"**

**Problem**: Frontend tidak bisa akses backend

**Check**: Di `server/src/app.js`
```javascript
app.use(cors()); // Harus ada

// Atau specific origin:
app.use(cors({
  origin: 'http://localhost:5173'
}));
```

---

### **Error 8: "TypeError: Cannot read property 'xxx' of undefined"**

**Problem**: Component state atau data tidak di-initialize

**Fix**: Pastikan state punya default value:
```javascript
const [data, setData] = useState({
  totalSales: 0,
  todayTransactions: 0
}); // Bukan: useState()
```

---

### **Error 9: "tailwindcss: Unknown @tailwind directive 'base'"**

**Problem**: VS Code tidak recognize Tailwind

**Solution**: Ini hanya IDE warning, bukan runtime error
- Aplikasi akan tetap berjalan normal
- Untuk menghilangkan warning:
  1. Install VS Code extension: "Tailwind CSS IntelliSense"
  2. Atau tambah di `.vscode/settings.json`:
  ```json
  {
    "css.lint.unknownAtRules": "ignore"
  }
  ```

---

### **Error 10: "Login gagal - Token tidak valid"**

**Problem**: JWT signature tidak match

**Checklist**:
- [ ] JWT_SECRET di server/.env ada
- [ ] JWT_SECRET di .env server dan client HARUS SAMA
- [ ] Token di frontend disimpan dengan benar
- [ ] Token dikirim di header Authorization

**Fix**:
```bash
# 1. Verifikasi JWT_SECRET
cat server/.env | grep JWT_SECRET

# 2. Logout dan login ulang
# Clear localStorage di browser: F12 > Application > localStorage > clear

# 3. Test manual
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"123456"}'
```

---

## 🧪 Quick Testing

### **Test 1: Backend API**
```bash
# Test auth
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"123456"}'

# Save token from response, then:
curl -H "Authorization: Bearer TOKEN_HERE" \
  http://localhost:5000/api/dashboard
```

### **Test 2: Database Connection**
```bash
mysql -u root -p -e "USE noma_pos; SELECT COUNT(*) FROM users;"
```

### **Test 3: Frontend Build**
```bash
cd client
npm run build

# Check dist folder
ls -la dist/
```

---

## 📊 Health Check Script

Buat file `health-check.sh` atau `health-check.bat`:

```bash
#!/bin/bash
echo "=== NOMA POS Health Check ==="

echo ""
echo "1. Node.js:"
node --version

echo ""
echo "2. MySQL:"
mysql --version

echo ""
echo "3. Database tables:"
mysql -u root -p -e "USE noma_pos; SHOW TABLES;"

echo ""
echo "4. API endpoint:"
curl -s http://localhost:5000/api/products > /dev/null && \
  echo "✓ Backend running" || \
  echo "✗ Backend not running"

echo ""
echo "5. Frontend:"
curl -s http://localhost:5173 > /dev/null && \
  echo "✓ Frontend running" || \
  echo "✗ Frontend not running"

echo ""
echo "=== Health Check Complete ==="
```

---

## 📝 Debugging Tips

### **Enable Debug Mode**

Backend:
```javascript
// Di server/src/app.js
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    next();
  });
}
```

Frontend:
```javascript
// Di client/src/services/api.js
api.interceptors.response.use(
  response => {
    console.log('API Response:', response.config.url, response.data);
    return response;
  }
);
```

### **Check Logs**

```bash
# Backend logs (dari Terminal 2)
# Lihat console output

# Frontend logs
# F12 > Console di browser

# MySQL error log
tail -f /var/log/mysql/error.log  # Linux
```

---

## ✅ Success Indicators

Jika Anda melihat ini, semuanya berhasil:

**Terminal 1 (Database)**:
```
mysql> USE noma_pos;
Database changed
mysql> SHOW TABLES;
+-------------------+
| Tables_in_noma_pos|
+-------------------+
| categories        |
| products          |
| sale_items        |
| sales             |
| users             |
+-------------------+
```

**Terminal 2 (Backend)**:
```
Server running on port 5000
```

**Terminal 3 (Frontend)**:
```
Local: http://localhost:5173
```

**Browser**:
```
- Login page muncul
- Bisa login dengan admin/123456
- Dashboard muncul tanpa error
- API calls berjalan normal
```

---

## 🆘 Emergency Restart

Jika semua kacau, coba ini:

```bash
# 1. Kill all Node processes
# Windows:
taskkill /F /IM node.exe

# macOS/Linux:
killall node

# 2. Clear dependencies
rm -rf node_modules package-lock.json
rm -rf client/node_modules client/package-lock.json
rm -rf server/node_modules server/package-lock.json

# 3. Reinstall
cd server && npm install && cd ..
cd client && npm install && cd ..

# 4. Reset database
mysql -u root -p -e "DROP DATABASE noma_pos;"
mysql -u root -p < database/complete_schema.sql

# 5. Start fresh
# Terminal 1: Backend
cd server && npm start

# Terminal 2: Frontend
cd client && npm run dev
```

---

## 📞 When All Else Fails

1. Check error message exactly
2. Google the error message
3. Check Stack Overflow
4. Read file/documentation comments
5. Review console logs carefully
6. Try minimal reproduction
7. Check .env file configuration
8. Verify database schema
9. Restart everything
10. Ask for help with specific error

---

**Good luck! 🚀**
