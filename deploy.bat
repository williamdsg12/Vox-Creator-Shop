@echo off
title Deploy GitHub - Vox Creator Shop

echo.
echo ===============================
echo     ENVIANDO PARA O GITHUB
echo ===============================
echo.

git add .

set /p mensagem="Mensagem do commit: "

if "%mensagem%"=="" set mensagem=Atualizacao

git commit -m "%mensagem%"

git push origin main

echo.
echo ===============================
echo     DEPLOY FINALIZADO
echo ===============================
pause