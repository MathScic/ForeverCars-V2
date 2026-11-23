@echo off
rem Lance la nouvelle version du site ForeverCars sur ce PC (double-clic), pour la verifier avant Vercel.
cd /d "%~dp0"
echo Installation des dependances (rapide si deja faite)...
call pnpm install --frozen-lockfile
if errorlevel 1 goto erreur
echo Construction du site (environ 1 minute)...
call pnpm --filter site build
if errorlevel 1 goto erreur
echo.
echo Le site s'ouvre dans le navigateur : http://localhost:3000
echo Ferme cette fenetre pour l'arreter.
start "" cmd /c "timeout /t 4 >nul & start http://localhost:3000"
call pnpm --filter site start
if errorlevel 1 goto erreur
goto fin
:erreur
echo.
echo Le lancement a echoue. Copie le message ci-dessus et envoie-le a Claude.
pause
:fin
