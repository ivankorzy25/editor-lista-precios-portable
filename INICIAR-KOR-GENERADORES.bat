@echo off
chcp 65001 >nul
title KOR Generadores - Iniciando Sistema
color 0A

echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║         KOR GENERADORES - SISTEMA DE GESTIÓN              ║
echo ║                  Iniciando servicios...                   ║
echo ╚════════════════════════════════════════════════════════════╝
echo.

:: Ir al directorio del proyecto
cd /d "%~dp0"

:: 1. Verificar Docker
echo [1/5] Verificando Docker...
docker --version >nul 2>&1
if errorlevel 1 (
    echo ❌ ERROR: Docker no está instalado o no está en el PATH
    echo.
    echo 💡 Soluciones:
    echo    - Instalar Docker Desktop desde: https://www.docker.com/products/docker-desktop
    echo    - O asegurarse de que Docker esté corriendo
    pause
    exit /b 1
)
echo ✅ Docker instalado

:: 2. Verificar que Docker esté corriendo
echo.
echo [2/5] Verificando que Docker esté corriendo...
docker ps >nul 2>&1
if errorlevel 1 (
    echo ⚠️  Docker no está corriendo, intentando iniciar...
    echo    Esto puede tomar unos segundos...

    :: Intentar iniciar Docker Desktop
    start "" "C:\Program Files\Docker\Docker\Docker Desktop.exe"

    :: Esperar hasta 60 segundos
    set /a intentos=0
    :wait_docker
    timeout /t 5 /nobreak >nul
    docker ps >nul 2>&1
    if errorlevel 1 (
        set /a intentos+=1
        if %intentos% LSS 12 (
            echo    Esperando Docker... (%intentos%/12^)
            goto wait_docker
        ) else (
            echo ❌ ERROR: Docker no se pudo iniciar después de 60 segundos
            echo    Por favor, inicia Docker Desktop manualmente y vuelve a ejecutar este script
            pause
            exit /b 1
        )
    )
)
echo ✅ Docker corriendo

:: 3. Levantar Directus
echo.
echo [3/5] Levantando Directus CMS...
cd directus-local
docker-compose up -d
if errorlevel 1 (
    echo ❌ ERROR: No se pudo levantar Directus
    pause
    exit /b 1
)
echo ✅ Directus levantado

:: 4. Esperar a que Directus esté listo
echo.
echo [4/5] Esperando a que Directus esté listo...
set /a intentos=0
:wait_directus
timeout /t 2 /nobreak >nul
curl -s http://localhost:8055/server/health >nul 2>&1
if errorlevel 1 (
    set /a intentos+=1
    if %intentos% LSS 15 (
        echo    Esperando Directus... (%intentos%/15^)
        goto wait_directus
    ) else (
        echo ⚠️  Directus tardó más de lo esperado, pero continuando...
    )
) else (
    echo ✅ Directus listo
)

:: 5. Abrir navegador
echo.
echo [5/5] Abriendo aplicación en el navegador...
cd ..
start "" "msedge.exe" "file:///%CD:\=/%/index.html"
echo ✅ Sistema iniciado

echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║           ✅ SISTEMA LISTO PARA USAR                      ║
echo ╚════════════════════════════════════════════════════════════╝
echo.
echo 📋 Información:
echo    - Directus: http://localhost:8055
echo    - Usuario: admin@generadores.ar
echo    - Contraseña: kor2025
echo.
echo 💡 Esta ventana se puede cerrar sin afectar el sistema
echo.
pause
