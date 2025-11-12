@echo off
chcp 65001 >nul
title Agregar al Inicio de Windows - KOR Generadores

echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║     AGREGAR KOR GENERADORES AL INICIO DE WINDOWS          ║
echo ╚════════════════════════════════════════════════════════════╝
echo.
echo ⚠️  ADVERTENCIA: Esto hará que el sistema se inicie
echo    automáticamente cada vez que enciendas tu PC.
echo.
echo    Directus consumirá recursos de Docker en segundo plano.
echo.
choice /C SN /M "¿Deseas continuar? (S=Sí, N=No)"
if errorlevel 2 goto cancelar
if errorlevel 1 goto continuar

:continuar
echo.
echo Agregando al inicio de Windows...

set "SCRIPT_DIR=%~dp0"
set "STARTUP=%APPDATA%\Microsoft\Windows\Start Menu\Programs\Startup"

:: Crear acceso directo en la carpeta de inicio
powershell -Command "$WshShell = New-Object -ComObject WScript.Shell; $Shortcut = $WshShell.CreateShortcut('%STARTUP%\KOR Generadores.lnk'); $Shortcut.TargetPath = '%SCRIPT_DIR%INICIAR-KOR-GENERADORES-SILENCIOSO.vbs'; $Shortcut.WorkingDirectory = '%SCRIPT_DIR%'; $Shortcut.IconLocation = '%SystemRoot%\System32\SHELL32.dll,165'; $Shortcut.Description = 'Iniciar Sistema KOR Generadores'; $Shortcut.Save()"

if errorlevel 1 (
    echo ❌ ERROR: No se pudo agregar al inicio
    pause
    exit /b 1
)

echo.
echo ✅ Sistema agregado al inicio de Windows
echo.
echo 📋 Ahora el sistema se iniciará automáticamente cuando enciendas tu PC
echo.
echo 💡 Para quitarlo del inicio:
echo    - Ejecuta: QUITAR-DEL-INICIO-WINDOWS.bat
echo    - O borra el acceso directo de: %STARTUP%
echo.
pause
exit /b 0

:cancelar
echo.
echo ❌ Operación cancelada
echo.
pause
exit /b 0
