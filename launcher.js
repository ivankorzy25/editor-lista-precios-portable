#!/usr/bin/env node

const { exec, spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const http = require('http');

const DIRECTUS_URL = 'http://localhost:8055';
const MAX_DOCKER_WAIT = 60000; // 60 segundos
const MAX_DIRECTUS_WAIT = 60000; // 60 segundos

console.log('╔════════════════════════════════════════════════════════════╗');
console.log('║           KOR GENERADORES - INICIANDO SISTEMA             ║');
console.log('╚════════════════════════════════════════════════════════════╝');
console.log('');

// Verificar Docker instalado
function checkDockerInstalled() {
    return new Promise((resolve) => {
        exec('docker --version', (error) => {
            if (error) {
                console.log('❌ Docker no está instalado');
                console.log('   Descargalo de: https://www.docker.com/products/docker-desktop');
                console.log('');
                process.exit(1);
            }
            console.log('✅ Docker instalado');
            resolve();
        });
    });
}

// Verificar Docker corriendo
function checkDockerRunning() {
    return new Promise((resolve) => {
        exec('docker ps', (error) => {
            if (error) {
                console.log('⚠️  Docker no está corriendo, iniciando...');
                resolve(false);
            } else {
                console.log('✅ Docker corriendo');
                resolve(true);
            }
        });
    });
}

// Iniciar Docker Desktop
function startDockerDesktop() {
    return new Promise((resolve) => {
        const dockerPath = 'C:\\Program Files\\Docker\\Docker\\Docker Desktop.exe';

        if (!fs.existsSync(dockerPath)) {
            console.log('❌ No se encontró Docker Desktop en la ruta esperada');
            process.exit(1);
        }

        console.log('🚀 Iniciando Docker Desktop...');
        spawn(dockerPath, [], { detached: true, stdio: 'ignore' }).unref();

        // Esperar a que Docker esté listo
        const startTime = Date.now();
        const checkInterval = setInterval(() => {
            exec('docker ps', (error) => {
                if (!error) {
                    clearInterval(checkInterval);
                    console.log('✅ Docker Desktop listo');
                    resolve();
                } else if (Date.now() - startTime > MAX_DOCKER_WAIT) {
                    clearInterval(checkInterval);
                    console.log('❌ Timeout esperando Docker Desktop');
                    console.log('   Abrí Docker Desktop manualmente y volvé a ejecutar el launcher');
                    process.exit(1);
                }
            });
        }, 2000);
    });
}

// Iniciar System API
function startSystemAPI() {
    return new Promise((resolve) => {
        const appPath = process.pkg ? path.dirname(process.execPath) : __dirname;
        const apiPath = path.join(appPath, 'system-api.js');

        if (!fs.existsSync(apiPath)) {
            console.log('⚠️  System API no encontrado, continuando sin él...');
            resolve();
            return;
        }

        console.log('🔧 Iniciando System API...');

        const systemAPI = spawn('node', [apiPath], {
            detached: true,
            stdio: 'ignore'
        });

        systemAPI.unref();

        // Esperar un momento para que se inicie
        setTimeout(() => {
            console.log('✅ System API iniciado (puerto 3001)');
            resolve();
        }, 1000);
    });
}

// Iniciar Directus
function startDirectus() {
    return new Promise((resolve, reject) => {
        // Obtener la ruta correcta: si es pkg usa execPath, si no usa __dirname
        const appPath = process.pkg ? path.dirname(process.execPath) : __dirname;
        const directusPath = path.join(appPath, 'directus-local');

        if (!fs.existsSync(directusPath)) {
            console.log('❌ No se encontró la carpeta directus-local');
            reject(new Error('Directus folder not found'));
            return;
        }

        console.log('🚀 Iniciando Directus...');

        const dockerCompose = spawn('docker-compose', ['up', '-d'], {
            cwd: directusPath,
            shell: true,
            stdio: 'pipe'
        });

        dockerCompose.on('close', (code) => {
            if (code === 0) {
                console.log('✅ Directus iniciado');
                resolve();
            } else {
                console.log('❌ Error al iniciar Directus');
                reject(new Error('Failed to start Directus'));
            }
        });
    });
}

// Verificar salud de Directus
function checkDirectusHealth() {
    return new Promise((resolve) => {
        console.log('⏳ Esperando a que Directus esté listo...');

        const startTime = Date.now();
        const checkInterval = setInterval(() => {
            const req = http.get(`${DIRECTUS_URL}/server/health`, (res) => {
                if (res.statusCode === 200) {
                    clearInterval(checkInterval);
                    console.log('✅ Directus listo');
                    resolve();
                }
            });

            req.on('error', () => {
                if (Date.now() - startTime > MAX_DIRECTUS_WAIT) {
                    clearInterval(checkInterval);
                    console.log('⚠️  Timeout esperando Directus, pero continuando...');
                    resolve();
                }
            });

            req.end();
        }, 2000);
    });
}

// Abrir navegador
function openBrowser() {
    // Obtener la ruta correcta: si es pkg usa execPath, si no usa __dirname
    const appPath = process.pkg ? path.dirname(process.execPath) : __dirname;
    const htmlPath = path.join(appPath, 'index.html');
    const fileUrl = `file:///${htmlPath.replace(/\\/g, '/')}`;

    console.log('🌐 Abriendo navegador...');

    exec(`start msedge "${fileUrl}"`, (error) => {
        if (error) {
            console.log('⚠️  No se pudo abrir Edge, intentando con navegador por defecto...');
            exec(`start "" "${fileUrl}"`);
        }
    });

    console.log('');
    console.log('✅ Sistema iniciado correctamente');
    console.log('');
    console.log('📱 Aplicación: ' + fileUrl);
    console.log('🔧 Directus Admin: http://localhost:8055');
    console.log('👤 Login: admin / kor2025');
    console.log('');
    console.log('Presioná cualquier tecla para salir...');
}

// Proceso principal
async function main() {
    try {
        await checkDockerInstalled();

        const dockerRunning = await checkDockerRunning();
        if (!dockerRunning) {
            await startDockerDesktop();
        }

        await startSystemAPI();
        await startDirectus();
        await checkDirectusHealth();
        openBrowser();

        // Esperar input para cerrar
        if (process.stdin.isTTY) {
            process.stdin.setRawMode(true);
            process.stdin.resume();
            process.stdin.on('data', () => process.exit(0));
        }

    } catch (error) {
        console.log('');
        console.log('❌ Error:', error.message);
        console.log('');
        console.log('Presioná cualquier tecla para salir...');

        if (process.stdin.isTTY) {
            process.stdin.setRawMode(true);
            process.stdin.resume();
            process.stdin.on('data', () => process.exit(1));
        }
    }
}

main();
