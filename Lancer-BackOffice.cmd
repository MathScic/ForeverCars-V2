@echo off
rem Lance l'ebauche du back-office ForeverCars (double-clic).
cd /d "%~dp0"
set ELECTRON_RUN_AS_NODE=
echo Installation des dependances (rapide si deja faite)...
call pnpm install --frozen-lockfile
if errorlevel 1 goto erreur
echo Construction et lancement du back-office...
call pnpm --filter desktop start
if errorlevel 1 goto erreur
goto fin
:erreur
echo.
echo Le lancement a echoue. Copie le message ci-dessus et envoie-le a Claude.
pause
:fin
