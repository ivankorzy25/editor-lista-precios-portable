#!/usr/bin/env node

/**
 * FIX TABS HTML - Dejar tabs vacíos para llenado dinámico
 */

const fs = require('fs');

const INDEX_PATH = 'index.html';

console.log('🔧 Arreglando tabs en index.html...\n');

let content = fs.readFileSync(INDEX_PATH, 'utf-8');

// Reemplazar el contenido de tabs-nav (hardcodeado) con vacío + mensaje
const tabsNavPattern = /<nav class="tabs-nav">[\s\S]*?<\/nav>/;
const newTabsNav = `<nav class="tabs-nav">
            <!-- Las pestañas se generarán dinámicamente desde Directus -->
            <div style="padding: 20px; color: #999; text-align: center;">📦 Cargando categorías...</div>
        </nav>`;

content = content.replace(tabsNavPattern, newTabsNav);

// Reemplazar el contenido de tabs-content con vacío + mensaje
const tabsContentPattern = /<main class="tabs-content">[\s\S]*?<\/main>/;
const newTabsContent = `<main class="tabs-content">
            <!-- El contenido se generará dinámicamente desde Directus -->
            <div style="padding: 60px 20px; text-align: center;">
                <h2 style="color: #999;">⏳ Cargando productos desde Directus...</h2>
                <p style="color: #666; margin-top: 20px;">
                    Si ves este mensaje por más de 5 segundos, verificá la consola (F12)
                </p>
            </div>
        </main>`;

content = content.replace(tabsContentPattern, newTabsContent);

// Escribir archivo
fs.writeFileSync(INDEX_PATH, content);

console.log('✅ Tabs limpiados y listos para carga dinámica!');
console.log('');
console.log('Ahora refrescá la página (Ctrl+Shift+R) para ver las pestañas dinámicas.');
