@echo off
rem Serveur IA LOCAL de test pour la maquette du back-office (double-clic).
cd /d "%~dp0"
if "%ANTHROPIC_API_KEY%"=="" (
  echo Collez votre cle API Anthropic ^(elle commence par sk-ant-^), puis Entree.
  echo Elle reste dans cette fenetre et n est enregistree nulle part.
  set /p ANTHROPIC_API_KEY=Cle API : 
)
cls
call pnpm install --frozen-lockfile >nul
call pnpm --filter @forevercars/ia-locale start
pause
