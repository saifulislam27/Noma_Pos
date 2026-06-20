#!/bin/bash

# NOMA POS - Startup Script untuk Linux/macOS
# Menjalankan Backend dan Frontend secara bersamaan

echo ""
echo "============================================"
echo "  NOMA POS - Startup Helper"
echo "============================================"
echo ""

# Cek apakah Node.js terinstall
if ! command -v node &> /dev/null; then
    echo "[ERROR] Node.js tidak terinstall!"
    echo "Silakan download dari https://nodejs.org"
    exit 1
fi

# Cek apakah MySQL terinstall
if ! command -v mysql &> /dev/null; then
    echo "[WARNING] MySQL tidak ditemukan"
    echo "Pastikan MySQL sudah terinstall dan berjalan!"
    echo ""
fi

# Setup Backend
echo "[1/4] Mengecek Backend..."
if [ ! -d "server/node_modules" ]; then
    echo "[2/4] Install dependencies Backend..."
    cd server
    npm install
    cd ..
else
    echo "[2/4] Backend dependencies sudah ada"
fi

# Setup Frontend
echo "[3/4] Mengecek Frontend..."
if [ ! -d "client/node_modules" ]; then
    echo "[4/4] Install dependencies Frontend..."
    cd client
    npm install
    cd ..
else
    echo "[4/4] Frontend dependencies sudah ada"
fi

echo ""
echo "============================================"
echo "  Startup Selesai!"
echo "============================================"
echo ""
echo "Jalankan perintah di bawah di 3 terminal TERPISAH:"
echo ""
echo "Terminal 1 (Database):"
echo "  mysql -u root -p noma_pos < database/complete_schema.sql"
echo ""
echo "Terminal 2 (Backend):"
echo "  cd server && npm start"
echo ""
echo "Terminal 3 (Frontend):"
echo "  cd client && npm run dev"
echo ""
echo "Buka browser: http://localhost:5173"
echo "Login dengan: admin / 123456"
echo ""
