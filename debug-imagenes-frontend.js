#!/usr/bin/env node

/**
 * DEBUGEAR POR QUÉ NO SE VEN LAS IMÁGENES EN EL FRONTEND
 */

const fetch = require('node-fetch');

const DIRECTUS_URL = 'http://localhost:8055';

console.log('╔═══════════════════════════════════════════════════════════╗');
console.log('║   DEBUG: IMÁGENES EN FRONTEND                             ║');
console.log('╚═══════════════════════════════════════════════════════════╝');
console.log('');

async function testPublicAccess() {
    console.log('🔍 Probando acceso público (sin token)...\n');

    try {
        // Test 1: Productos
        console.log('1️⃣ Test: GET /items/productos');
        const productosResp = await fetch(`${DIRECTUS_URL}/items/productos`);
        console.log(`   Status: ${productosResp.status} ${productosResp.statusText}`);

        if (productosResp.ok) {
            const data = await productosResp.json();
            console.log(`   ✅ OK - ${data.data.length} productos encontrados`);

            if (data.data.length > 0) {
                console.log(`   📦 Primer producto: ${data.data[0].nombre}`);
            }
        } else {
            console.log('   ❌ FALLO - Sin acceso público');
        }
        console.log('');

        // Test 2: Imágenes de productos
        console.log('2️⃣ Test: GET /items/producto_imagenes');
        const imagenesResp = await fetch(`${DIRECTUS_URL}/items/producto_imagenes?fields=*`);
        console.log(`   Status: ${imagenesResp.status} ${imagenesResp.statusText}`);

        if (imagenesResp.ok) {
            const data = await imagenesResp.json();
            console.log(`   ✅ OK - ${data.data.length} imágenes encontradas`);

            if (data.data.length > 0) {
                console.log(`   🖼️ Primera imagen:`);
                console.log(`      - producto_id: ${data.data[0].producto_id}`);
                console.log(`      - imagen: ${data.data[0].imagen}`);
                console.log(`      - orden: ${data.data[0].orden}`);
            }
        } else {
            console.log('   ❌ FALLO - Sin acceso público');
            const error = await imagenesResp.json();
            console.log(`   Error: ${JSON.stringify(error)}`);
        }
        console.log('');

        // Test 3: Archivos
        console.log('3️⃣ Test: GET /items/archivos_producto');
        const archivosResp = await fetch(`${DIRECTUS_URL}/items/archivos_producto`);
        console.log(`   Status: ${archivosResp.status} ${archivosResp.statusText}`);

        if (archivosResp.ok) {
            const data = await archivosResp.json();
            console.log(`   ✅ OK - ${data.data.length} archivos encontrados`);
        } else {
            console.log('   ❌ FALLO - Sin acceso público');
        }
        console.log('');

        // Test 4: Asset de una imagen
        if (imagenesResp.ok) {
            const imagenesData = await imagenesResp.json();
            if (imagenesData.data.length > 0) {
                const primeraImagen = imagenesData.data[0].imagen;

                console.log('4️⃣ Test: GET /assets/:id (primera imagen)');
                console.log(`   URL: ${DIRECTUS_URL}/assets/${primeraImagen}`);

                const assetResp = await fetch(`${DIRECTUS_URL}/assets/${primeraImagen}`);
                console.log(`   Status: ${assetResp.status} ${assetResp.statusText}`);

                if (assetResp.ok) {
                    const contentType = assetResp.headers.get('content-type');
                    console.log(`   ✅ OK - Tipo: ${contentType}`);
                } else {
                    console.log('   ❌ FALLO - Asset no accesible públicamente');
                }
                console.log('');
            }
        }

    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

async function checkDirectusFiles() {
    console.log('📁 Verificando archivos en directus_files...\n');

    try {
        const response = await fetch(`${DIRECTUS_URL}/files`);

        if (response.ok) {
            const data = await response.json();
            console.log(`✅ ${data.data.length} archivos en File Library`);

            if (data.data.length > 0) {
                console.log('\n📋 Primeros 3 archivos:');
                data.data.slice(0, 3).forEach((file, i) => {
                    console.log(`   ${i + 1}. ${file.filename_download || file.title || 'Sin nombre'}`);
                    console.log(`      - ID: ${file.id}`);
                    console.log(`      - Tipo: ${file.type}`);
                });
            }
        } else {
            console.log('❌ No se puede acceder a /files');
        }
        console.log('');
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

async function testScriptURL() {
    console.log('🌐 Probando URL que usa el script...\n');

    try {
        // La URL que usa DirectusAPI.getImagenesProducto(1)
        const url = `${DIRECTUS_URL}/items/producto_imagenes?filter[producto_id][_eq]=1&fields=id,producto_id,imagen,orden,es_principal`;

        console.log(`📍 URL: ${url}`);
        console.log('');

        const response = await fetch(url);
        console.log(`Status: ${response.status} ${response.statusText}`);

        if (response.ok) {
            const data = await response.json();
            console.log(`✅ ${data.data.length} imágenes del producto 1`);

            if (data.data.length > 0) {
                console.log('\n🖼️ Imágenes encontradas:');
                data.data.forEach((img, i) => {
                    console.log(`   ${i + 1}. Imagen ID: ${img.imagen}`);
                    console.log(`      - Orden: ${img.orden}`);
                    console.log(`      - Principal: ${img.es_principal}`);
                    console.log(`      - Asset URL: ${DIRECTUS_URL}/assets/${img.imagen}`);
                });
            }
        } else {
            console.log('❌ FALLO');
            const error = await response.text();
            console.log(`Error: ${error}`);
        }
        console.log('');
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

async function main() {
    await testPublicAccess();
    await checkDirectusFiles();
    await testScriptURL();

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('');
    console.log('📊 DIAGNÓSTICO:');
    console.log('');
    console.log('Si todos los tests pasaron (✅):');
    console.log('  → El problema está en el frontend (JavaScript)');
    console.log('  → Abrí la consola del navegador (F12) para ver errores');
    console.log('');
    console.log('Si algún test falló (❌):');
    console.log('  → Problema de permisos en Directus');
    console.log('  → Ejecutá: node configure-permissions-with-token.js');
    console.log('');
}

main();
