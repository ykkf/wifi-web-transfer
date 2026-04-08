@echo off
cd /d "%~dp0"

echo ==================================================
echo   Wi-Fi Web Transfer - Starting...
echo ==================================================
echo.

node -v > nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed.
    echo Please install from: https://nodejs.org/
    pause
    exit /b
)

if not exist "node_modules" (
    echo Installing packages... Please wait...
    call npm install
    if %errorlevel% neq 0 (
        echo [ERROR] npm install failed.
        pause
        exit /b
    )
    echo Done!
    echo.
)

echo Starting server...
echo.
start "" http://localhost:8080
node server.js

pause
