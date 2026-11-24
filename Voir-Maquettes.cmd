@echo off
rem Ouvre les maquettes dans le navigateur (double-clic). Fermer cette fenetre arrete le petit serveur local.
cd /d "%~dp0"
echo Maquettes ForeverCars : http://localhost:5500/docs/maquettes/v3/sommaire.html
echo Ferme cette fenetre quand tu as fini.
start "" cmd /c "timeout /t 2 >nul & start http://localhost:5500/docs/maquettes/v3/sommaire.html"
python -m http.server 5500 --bind 127.0.0.1
if errorlevel 1 (
  echo.
  echo Impossible de lancer le serveur : Python est-il installe, ou le port 5500 deja pris ?
  pause
)
