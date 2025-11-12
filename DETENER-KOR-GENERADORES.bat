@echo off
chcp 65001 >nul
title KOR Generadores - Deteniendo Sistema
color 0C

echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║         KOR GENERADORES - SISTEMA DE GESTIÓN              ║
echo ║                  Deteniendo servicios...                  ║
echo ╚════════════════════════════════════════════════════════════╝
echo.

cd /d "%~dp0\directus-local"

echo [1/1] Deteniendo Directus CMS...
docker-compose down

if errorlevel 1 (
    echo ❌ ERROR: No se pudo detener Directus
    pause
    exit /b 1
)

echo ✅ Directus detenido correctamente

echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║           ✅ SISTEMA DETENIDO                             ║
echo ╚════════════════════════════════════════════════════════════╝
echo.
pause
