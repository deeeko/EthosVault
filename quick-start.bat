@echo off
echo.
echo 🚀 EthosVault Setup
echo ===================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Node.js is not installed. Please install Node.js 18+ first.
    echo    Download from: https://nodejs.org/
    pause
    exit /b 1
)

echo ✅ Node.js detected
node --version
echo.

REM Check if we're in the right directory
if not exist "package.json" (
    echo ❌ Please run this script from the ethosvault directory
    pause
    exit /b 1
)

echo 📦 Installing dependencies...
echo.

REM Install dependencies
call npm install

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ✅ Dependencies installed successfully!
    echo.
    echo 🎉 Setup complete! You can now:
    echo.
    echo    1. Start development server:  npm run dev
    echo    2. Build for production:      npm run build
    echo    3. Start production server:   npm start
    echo.
    echo 📝 Next steps:
    echo    - Open http://localhost:3000 in your browser
    echo    - Read SETUP.md for customization guide
    echo    - Check CHANGELOG.md for all features
    echo.
    echo Happy coding! 🚀
) else (
    echo.
    echo ❌ Installation failed. Please check the error messages above.
)

echo.
pause
