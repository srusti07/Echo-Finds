@echo off
echo Starting EcoFinds Application...
echo.
echo Installing dependencies...
cd server
call npm install
cd ../client
call npm install
cd ..
echo.
echo Starting servers...
start "Backend Server" cmd /k "cd server && npm run dev"
timeout /t 3
start "Frontend Server" cmd /k "cd client && npm start"
echo.
echo EcoFinds is starting up...
echo Backend: http://localhost:5000
echo Frontend: http://localhost:3000
pause
