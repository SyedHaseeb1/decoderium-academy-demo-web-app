@echo off
rem Starts a local web server for the GILEAP Academy UI prototype and opens it in the browser.
rem Needs Python. Close this window to stop the server.
cd /d "%~dp0"
where python >nul 2>nul
if errorlevel 1 (
  echo Python was not found. Install Python from python.org, or upload this folder to any web host.
  pause
  exit /b 1
)
start "" http://localhost:5200/
python -m http.server 5200
