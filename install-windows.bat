@echo off
setlocal
cd /d "%~dp0"
echo === Preparing environment files (existing secrets are kept) ===
node scripts\setup-env.mjs
if errorlevel 1 exit /b 1
echo === Installing backend dependencies ===
call npm --prefix backend install
if errorlevel 1 exit /b 1
echo === Installing frontend dependencies ===
call npm --prefix frontend install
if errorlevel 1 exit /b 1
echo === Installing admin-panel dependencies ===
call npm --prefix admin-panel install
if errorlevel 1 exit /b 1
echo.
echo All dependencies installed. Start MongoDB before seeding.
echo cd backend ^&^& npm run seed:site
pause
