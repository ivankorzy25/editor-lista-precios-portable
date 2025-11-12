#!/usr/bin/env node

const http = require('http');
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

const PORT = 3001;

// Obtener la ruta base de la aplicación
const appPath = process.pkg ? path.dirname(process.execPath) : __dirname;

console.log('🔧 System API iniciado en puerto', PORT);
console.log('📁 Ruta base:', appPath);

const server = http.createServer((req, res) => {
    // Headers CORS para permitir acceso desde el archivo HTML local
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }

    // Endpoint para abrir carpetas
    if (req.url.startsWith('/open-folder')) {
        const url = new URL(req.url, `http://localhost:${PORT}`);
        const folderParam = url.searchParams.get('path');

        if (!folderParam) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Missing path parameter' }));
            return;
        }

        // Construir ruta absoluta
        const folderPath = path.join(appPath, folderParam);

        // Verificar que la carpeta existe
        if (!fs.existsSync(folderPath)) {
            console.log('❌ Carpeta no existe:', folderPath);
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
                error: 'Folder not found',
                path: folderPath
            }));
            return;
        }

        console.log('📂 Abriendo carpeta:', folderPath);

        // Abrir carpeta en Windows Explorer
        exec(`explorer "${folderPath}"`, (error) => {
            if (error) {
                console.error('❌ Error abriendo carpeta:', error);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({
                    error: 'Failed to open folder',
                    message: error.message
                }));
                return;
            }

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
                success: true,
                path: folderPath,
                message: 'Folder opened successfully'
            }));
        });

        return;
    }

    // Endpoint de health check
    if (req.url === '/health') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            status: 'ok',
            appPath: appPath,
            timestamp: new Date().toISOString()
        }));
        return;
    }

    // 404 para otras rutas
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Not found' }));
});

server.listen(PORT, () => {
    console.log(`✅ System API escuchando en http://localhost:${PORT}`);
});

// Manejar cierre gracefully
process.on('SIGINT', () => {
    console.log('\n⏹️  Cerrando System API...');
    server.close(() => {
        console.log('✅ System API cerrado');
        process.exit(0);
    });
});
