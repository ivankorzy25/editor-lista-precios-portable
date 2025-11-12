@echo off
chcp 65001 >nul
title Crear Acceso Directo - KOR Generadores

echo.
echo Creando acceso directo en el Escritorio...
echo.

set "SCRIPT_DIR=%~dp0"
set "DESKTOP=%USERPROFILE%\Desktop"

:: Crear acceso directo usando PowerShell
powershell -Command "$WshShell = New-Object -ComObject WScript.Shell; $Shortcut = $WshShell.CreateShortcut('%DESKTOP%\KOR Generadores.lnk'); $Shortcut.TargetPath = '%SCRIPT_DIR%KOR-Generadores.exe'; $Shortcut.WorkingDirectory = '%SCRIPT_DIR%'; $Shortcut.IconLocation = '%SystemRoot%\System32\SHELL32.dll,165'; $Shortcut.Description = 'Iniciar Sistema KOR Generadores'; $Shortcut.Save()"

if errorlevel 1 (
    echo ❌ ERROR: No se pudo crear el acceso directo
    pause
    exit /b 1
)

echo ✅ Acceso directo creado en el Escritorio
echo.
echo 📋 Ahora puedes:
echo    1. Hacer doble clic en "KOR Generadores" en el Escritorio
echo    2. O ejecutar KOR-Generadores.exe desde aquí
echo.
pause
