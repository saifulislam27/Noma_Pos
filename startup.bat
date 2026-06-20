@echo off
REM NOMA POS - Startup Script untuk Windows
REM Menjalankan Backend dan Frontend secara bersamaan

echo.
echo ============================================
echo   NOMA POS - Startup Helper
echo ============================================
echo.

REM Cek apakah Node.js terinstall
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Node.js tidak terinstall!
    echo Silakan download dari https://nodejs.org
    pause
    exit /b 1
)

REM Cek apakah MySQL terinstall
where mysql >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [WARNING] MySQL tidak ditemukan di PATH
    echo Pastikan MySQL sudah terinstall dan berjalan!
    echo.
)

REM Setup Backend
echo [1/4] Mengecek Backend...
if not exist "server\node_modules" (
    echo [2/4] Install dependencies Backend...
    cd server
    call npm install
    cd ..
) else (
    echo [2/4] Backend dependencies sudah ada
)

REM Setup Frontend
echo [3/4] Mengecek Frontend...
if not exist "client\node_modules" (
    echo [4/4] Install dependencies Frontend...
    cd client
    call npm install
    cd ..
) else (
    echo [4/4] Frontend dependencies sudah ada
)

echo.
echo ============================================
echo   Startup Selesai!
echo ============================================
echo.
echo Jalankan perintah di bawah di 3 terminal TERPISAH:
echo.
echo Terminal 1 (Database):
echo   mysql -u root -p noma_pos ^< database\complete_schema.sql
echo.
echo Terminal 2 (Backend):
echo   cd server
echo   npm start
echo.
echo Terminal 3 (Frontend):
echo   cd client
echo   npm run dev
echo.
echo Buka browser: http://localhost:5173
echo Login dengan: admin / 123456
echo.
pause
