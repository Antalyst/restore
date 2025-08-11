@echo off

REM Check if port 3000 is in use (frontend)
netstat -ano | findstr ":3000" >nul
if %errorlevel%==0 (
    echo Frontend is already running on port 3000.
    goto end
)

REM Check if port 5000 is in use (backend)
netstat -ano | findstr ":5000" >nul
if %errorlevel%==0 (
    echo Backend is already running on port 5000.
    goto end
)

REM Start backend
cd /d "D:\projects\inventoryProduction\backend"
start cmd /k "npm run dev"

REM Start frontend
cd /d "D:\projects\inventoryProduction\front"
start cmd /k "npm run dev"

REM Wait 5 seconds for servers to start
timeout /t 15 /nobreak

REM Open Chrome
start chrome http://localhost:3000/

:end
pause
