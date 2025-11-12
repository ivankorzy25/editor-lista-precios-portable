#!/usr/bin/env node

/**
 * VERIFICAR PERMISOS PÚBLICOS DE DIRECTUS
 *
 * Este script prueba si los permisos públicos están configurados correctamente.
 *
 * Uso:
 *   node test-permissions.js
 */

const fetch = require('node-fetch');

const DIRECTUS_URL = 'http://localhost:8055';

console.log('╔═══════════════════════════════════════════════════════════╗');
console.log('║     VERIFICAR PERMISOS PÚBLICOS DE DIRECTUS              ║');
console.log('╚═══════════════════════════════════════════════════════════╝');
console.log('');

async function testEndpoint(name, url) {
    try {
        const response = await fetch(url);

        if (response.ok) {
            const data = await response.json();
            const count = data.data ? data.data.length : 0;
            console.log(`  ✅ ${name}: OK (${count} items)`);
            return true;
        } else {
            console.log(`  ❌ ${name}: Error ${response.status} ${response.statusText}`);
            return false;
        }
    } catch (error) {
        console.log(`  ❌ ${name}: ${error.message}`);
        return false;
    }
}

async function main() {
    console.log('🔍 Probando acceso público a las colecciones...\n');

    const tests = [
        {
            name: 'productos',
            url: `${DIRECTUS_URL}/items/productos`
        },
        {
            name: 'producto_imagenes',
            url: `${DIRECTUS_URL}/items/producto_imagenes`
        },
        {
            name: 'directus_files',
            url: `${DIRECTUS_URL}/files`
        }
    ];

    let allPassed = true;

    for (const test of tests) {
        const passed = await testEndpoint(test.name, test.url);
        if (!passed) {
            allPassed = false;
        }
    }

    console.log('');

    if (allPassed) {
        console.log('╔═══════════════════════════════════════════════════════════╗');
        console.log('║          ✅ TODOS LOS PERMISOS ESTÁN OK                  ║');
        console.log('╚═══════════════════════════════════════════════════════════╝');
        console.log('');
        console.log('🎉 ¡Perfecto! Los permisos públicos están configurados.');
        console.log('');
        console.log('Próximos pasos:');
        console.log('  1. Abrí index.html');
        console.log('  2. Deberías ver los productos de Directus cargándose');
        console.log('  3. La consola (F12) debería mostrar "X productos cargados"');
        console.log('');
    } else {
        console.log('╔═══════════════════════════════════════════════════════════╗');
        console.log('║       ⚠️  ALGUNOS PERMISOS NO ESTÁN CONFIGURADOS         ║');
        console.log('╚═══════════════════════════════════════════════════════════╝');
        console.log('');
        console.log('❌ Hay colecciones que devuelven error 403 (Forbidden).');
        console.log('');
        console.log('Solución:');
        console.log('  1. Abrí Directus: http://localhost:8055');
        console.log('  2. Ir a Settings → Roles & Permissions → Public');
        console.log('  3. Activar el ojo (👁️) para las colecciones que tienen ❌');
        console.log('  4. Guardar (✓)');
        console.log('  5. Volver a ejecutar este script para verificar');
        console.log('');
        console.log('Ver guía completa: CONFIGURAR-PERMISOS.md');
        console.log('');
    }
}

main().catch(error => {
    console.error('\n❌ Error:', error.message);
    console.log('\nVerificá que Directus esté corriendo: http://localhost:8055/server/health');
    console.log('');
    process.exit(1);
});
