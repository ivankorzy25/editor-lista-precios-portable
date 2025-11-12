#!/usr/bin/env node

/**
 * CONFIGURAR PERMISOS PÚBLICOS CON TOKEN
 */

const fetch = require('node-fetch');

const DIRECTUS_URL = 'http://localhost:8055';
const ACCESS_TOKEN = 'Dtc8_SXieO8jUv7sbs4Rws5_HHoCHq47';

console.log('╔═══════════════════════════════════════════════════════════╗');
console.log('║   CONFIGURAR PERMISOS PÚBLICOS CON TOKEN                 ║');
console.log('╚═══════════════════════════════════════════════════════════╝');
console.log('');

async function main() {
    try {
        // 1. Obtener política pública
        console.log('📋 Obteniendo políticas...');
        const policiesResponse = await fetch(`${DIRECTUS_URL}/policies`, {
            headers: { 'Authorization': `Bearer ${ACCESS_TOKEN}` }
        });

        if (!policiesResponse.ok) {
            throw new Error(`Error obteniendo políticas: ${policiesResponse.status}`);
        }

        const policiesData = await policiesResponse.json();
        const publicPolicy = policiesData.data.find(p => p.name === '$t:public_label' || p.icon === 'public');

        if (!publicPolicy) {
            throw new Error('No se encontró la política pública');
        }

        const PUBLIC_POLICY_ID = publicPolicy.id;
        console.log(`✅ Política pública encontrada (ID: ${PUBLIC_POLICY_ID})\n`);

        // 2. Obtener permisos actuales
        console.log('📋 Obteniendo permisos actuales...');
        const permissionsResponse = await fetch(`${DIRECTUS_URL}/permissions`, {
            headers: { 'Authorization': `Bearer ${ACCESS_TOKEN}` }
        });

        if (!permissionsResponse.ok) {
            throw new Error(`Error obteniendo permisos: ${permissionsResponse.status}`);
        }

        const permissionsData = await permissionsResponse.json();
        const existingPermissions = permissionsData.data || [];
        console.log(`✅ ${existingPermissions.length} permisos existentes encontrados\n`);

        // 2. Colecciones que necesitan permisos públicos
        const collections = ['productos', 'producto_imagenes', 'directus_files'];

        console.log('🔓 Configurando permisos de lectura pública...\n');

        for (const collection of collections) {
            // Verificar si ya existe permiso público para esta colección
            const existingPermission = existingPermissions.find(
                p => p.policy === PUBLIC_POLICY_ID && p.collection === collection && p.action === 'read'
            );

            if (existingPermission) {
                console.log(`  ⚠️  Permiso público para "${collection}" ya existe (ID: ${existingPermission.id})`);

                // Actualizar para asegurar que todos los campos estén disponibles
                const updateResponse = await fetch(`${DIRECTUS_URL}/permissions/${existingPermission.id}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${ACCESS_TOKEN}`
                    },
                    body: JSON.stringify({
                        fields: '*',
                        permissions: {}
                    })
                });

                if (updateResponse.ok) {
                    console.log(`  ✅ Permiso actualizado para "${collection}" - todos los campos accesibles`);
                } else {
                    const errorData = await updateResponse.json();
                    console.log(`  ⚠️  Error actualizando "${collection}":`, errorData.errors?.[0]?.message);
                }
            } else {
                // Crear nuevo permiso público
                console.log(`  📝 Creando permiso público para "${collection}"...`);
                const createResponse = await fetch(`${DIRECTUS_URL}/permissions`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${ACCESS_TOKEN}`
                    },
                    body: JSON.stringify({
                        collection: collection,
                        action: 'read',
                        fields: '*',
                        permissions: {},
                        policy: PUBLIC_POLICY_ID
                    })
                });

                if (createResponse.ok) {
                    const createdData = await createResponse.json();
                    console.log(`  ✅ Permiso creado para "${collection}" (ID: ${createdData.data.id})`);
                } else {
                    const errorData = await createResponse.json();
                    console.log(`  ❌ Error creando permiso para "${collection}":`, errorData.errors?.[0]?.message);
                }
            }
        }

        console.log('\n╔═══════════════════════════════════════════════════════════╗');
        console.log('║              ✅ CONFIGURACIÓN COMPLETADA                  ║');
        console.log('╚═══════════════════════════════════════════════════════════╝');
        console.log('');
        console.log('🔍 Verificando permisos configurados...\n');

        // Verificar que los permisos funcionan
        const testResults = [];
        for (const collection of collections) {
            const testUrl = collection === 'directus_files'
                ? `${DIRECTUS_URL}/files`
                : `${DIRECTUS_URL}/items/${collection}`;

            try {
                const testResponse = await fetch(testUrl);
                if (testResponse.ok) {
                    const testData = await testResponse.json();
                    const count = testData.data ? testData.data.length : 0;
                    console.log(`  ✅ ${collection}: Acceso público OK (${count} items)`);
                    testResults.push(true);
                } else {
                    console.log(`  ❌ ${collection}: Error ${testResponse.status}`);
                    testResults.push(false);
                }
            } catch (error) {
                console.log(`  ❌ ${collection}: ${error.message}`);
                testResults.push(false);
            }
        }

        const allWorking = testResults.every(r => r);

        console.log('');
        if (allWorking) {
            console.log('🎉 ¡PERFECTO! Todos los permisos funcionan correctamente.');
            console.log('');
            console.log('Próximos pasos:');
            console.log('  1. Refrescá index.html (F5)');
            console.log('  2. Deberías ver productos cargándose desde Directus');
            console.log('  3. La consola debería mostrar "X productos cargados"');
            console.log('');
        } else {
            console.log('⚠️  Algunos permisos no funcionan. Verificá en Directus Admin.');
            console.log('');
        }

    } catch (error) {
        console.error('\n❌ Error:', error.message);
        console.log('');
        process.exit(1);
    }
}

main();
