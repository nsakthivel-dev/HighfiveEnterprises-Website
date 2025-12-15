@echo off
echo Building Highfive Enterprises Website...
echo ======================================

echo Installing dependencies...
pnpm install

echo.
echo Building client and server...
pnpm build:win

echo.
echo Build completed successfully!
echo Output files are in the 'dist' folder.
pause