@echo off
chcp 65001 >nul
title Quitar del Inicio de Windows - KOR Generadores

echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║     QUITAR KOR GENERADORES DEL INICIO DE WINDOWS          ║
echo ╚════════════════════════════════════════════════════════════╝
echo.

set "STARTUP=%APPDATA%\Microsoft\Windows\Start Menu\Programs\Startup"
set "SHORTCUT=%STARTUP%\KOR Generadores.lnk"

if exist "%SHORTCUT%" (
    del "%SHORTCUT%"
    echo ✅ Sistema quitado del inicio de Windows
    echo.
    echo 💡 Ahora ya no se iniciará automáticamente al encender tu PC
) else (
    echo ℹ️  El sistema no estaba en el inicio de Windows
)

echo.
pause
