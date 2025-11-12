#!/usr/bin/env node

/**
 * FIX INDEX.HTML - Reemplazar productos hardcodeados con grid dinámico
 */

const fs = require('fs');

const INDEX_PATH = 'index.html';

console.log('🔧 Arreglando index.html...\n');

// Leer archivo
const content = fs.readFileSync(INDEX_PATH, 'utf-8');
const lines = content.split('\n');

console.log(`📄 Total de líneas: ${lines.length}`);

// Encontrar las líneas donde empieza y termina el <main>
let mainStart = -1;
let mainEnd = -1;

for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('<main class="tabs-content">')) {
        mainStart = i;
    }
    if (lines[i].includes('</main>') && mainStart !== -1 && mainEnd === -1) {
        mainEnd = i;
        break;
    }
}

console.log(`📍 <main> encontrado en línea ${mainStart + 1}`);
console.log(`📍 </main> encontrado en línea ${mainEnd + 1}`);

if (mainStart === -1 || mainEnd === -1) {
    console.error('❌ No se encontró <main class="tabs-content">');
    process.exit(1);
}

// Crear nuevo contenido para el main
const newMainContent = [
    '',
    '        <!-- Grid de Productos (cargados desde Directus) -->',
    '        <div class="products-container">',
    '            <div class="products-header">',
    '                <h2>Catálogo de Productos</h2>',
    '                <p class="subtitle">Productos cargados desde Directus CMS</p>',
    '            </div>',
    '            <div id="productsGrid" class="products-grid">',
    '                <!-- Los productos se cargarán dinámicamente desde Directus -->',
    '                <div style="text-align: center; padding: 40px; color: #999;">',
    '                    <p>📦 Cargando productos desde Directus...</p>',
    '                </div>',
    '            </div>',
    '        </div>',
    ''
];

// Construir nuevo archivo
const newLines = [
    ...lines.slice(0, mainStart + 1), // Todo hasta <main> (inclusive)
    ...newMainContent,                 // Nuevo contenido del main
    ...lines.slice(mainEnd)            // Desde </main> hasta el final
];

const newContent = newLines.join('\n');

// Backup del archivo original
const backupPath = 'index.html.backup-before-v2';
if (!fs.existsSync(backupPath)) {
    fs.writeFileSync(backupPath, content);
    console.log(`\n💾 Backup creado: ${backupPath}`);
}

// Escribir nuevo archivo
fs.writeFileSync(INDEX_PATH, newContent);

console.log(`\n✅ index.html actualizado!`);
console.log(`📉 Líneas removidas: ${(mainEnd - mainStart - 1)}`);
console.log(`📈 Líneas agregadas: ${newMainContent.length}`);
console.log(`📄 Total de líneas nuevo archivo: ${newLines.length}`);
console.log('\n🎉 Ahora refrescá la página (Ctrl+F5) para ver los productos de Directus!');
