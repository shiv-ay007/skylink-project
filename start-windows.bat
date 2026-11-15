@echo off
cd /d "%~dp0"
start "SkyLink Backend" /D "%~dp0backend" cmd /k npm run dev
start "SkyLink Frontend" /D "%~dp0frontend" cmd /k npm run dev
start "SkyLink Admin Panel" /D "%~dp0admin-panel" cmd /k npm run dev
echo Backend http://localhost:5000
echo Website http://localhost:5173
echo Admin http://localhost:5174
