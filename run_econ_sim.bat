@echo off
netstat -ano | findstr :3000 >nul
if %errorlevel% equ 0 (
    start http://localhost:3000
) else (
    start /min "EconSim Server" python -m http.server 3000 --directory "C:\Users\hp\.gemini\antigravity\scratch\cbse-economics-sim"
    timeout /t 1 >nul
    start http://localhost:3000
)
