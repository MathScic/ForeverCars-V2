@echo off
rem Lance l'application du garage (back-office) sur ce PC (double-clic).
rem Version de demonstration : donnees fictives, rien n'est envoye au site pour l'instant.
cd /d "%~dp0"
echo Installation des dependances (rapide si deja faite)...
call pnpm install --frozen-lockfile
if errorlevel 1 goto erreur
echo Ouverture de l'application ForeverCars (premiere fois : environ 30 secondes)...
echo Ferme cette fenetre pour quitter l'application.
call pnpm dev:desktop
if errorlevel 1 goto erreur
goto fin
:erreur
echo.
echo Le lancement a echoue. Copie le message ci-dessus et envoie-le a Claude.
pause
:fin
