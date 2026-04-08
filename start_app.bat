@echo off
cd /d "%~dp0"

echo ==================================================
echo   Wi-Fi Web Transfer - Starting...
echo ==================================================
echo.

REM Check Node.js
node -v > nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed.
    echo Please install from: https://nodejs.org/
    pause
    exit /b
)

REM Install packages if needed
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

REM Open firewall port 8080 for iPad/phone access
echo Opening firewall port 8080...
netsh advfirewall firewall delete rule name="WiFiTransfer" > nul 2>&1
netsh advfirewall firewall add rule name="WiFiTransfer" dir=in action=allow protocol=tcp localport=8080 > nul 2>&1
if %errorlevel% neq 0 (
    echo [WARNING] Could not open firewall automatically.
    echo If iPad cannot connect, right-click this file
    echo and select "Run as administrator".
    echo.
)

echo Starting server...
echo.
start "" http://localhost:8080
node server.js

pause
