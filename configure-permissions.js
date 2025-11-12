#!/usr/bin/env node

/**
 * CONFIGURAR PERMISOS PÚBLICOS EN DIRECTUS
 *
 * Este script configura automáticamente los permisos de lectura pública
 * para las colecciones necesarias en Directus.
 *
 * Uso:
 *   node configure-permissions.js
 */

const fetch = require('node-fetch');

const DIRECTUS_URL = 'http://localhost:8055';
const ADMIN_EMAIL = 'admin@generadores.ar';
const ADMIN_PASSWORD = 'kor2025';

console.log('╔═══════════════════════════════════════════════════════════╗');
console.log('║   CONFIGURAR PERMISOS PÚBLICOS DE DIRECTUS               ║');
console.log('╚═══════════════════════════════════════════════════════════╝');
console.log('');

async function main() {
    try {
        // 1. Login
        console.log('🔐 Autenticando...');
        const loginResponse = await fetch(`${DIRECTUS_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: ADMIN_EMAIL,
                password: ADMIN_PASSWORD
            })
        });

        if (!loginResponse.ok) {
            throw new Error(`Error de autenticación: ${loginResponse.status}`);
        }

        const loginData = await loginResponse.json();
        const accessToken = loginData.data.access_token;
        console.log('✅ Autenticación exitosa\n');

        // 2. Obtener permisos actuales
        console.log('📋 Obteniendo permisos actuales...');
        const permissionsResponse = await fetch(`${DIRECTUS_URL}/permissions`, {
            headers: { 'Authorization': `Bearer ${accessToken}` }
        });

        if (!permissionsResponse.ok) {
            throw new Error(`Error obteniendo permisos: ${permissionsResponse.status}`);
        }

        const permissionsData = await permissionsResponse.json();
        const existingPermissions = permissionsData.data || [];

        // 3. Colecciones que necesitan permisos públicos
        const collections = ['productos', 'producto_imagenes', 'directus_files'];

        console.log('🔓 Configurando permisos de lectura pública...\n');

        for (const collection of collections) {
            // Verificar si ya existe permiso público para esta colección
            const existingPermission = existingPermissions.find(
                p => p.role === null && p.collection === collection && p.action === 'read'
            );

            if (existingPermission) {
                console.log(`  ⚠️  Permiso público para "${collection}" ya existe (ID: ${existingPermission.id})`);

                // Actualizar para asegurar que todos los campos estén disponibles
                const updateResponse = await fetch(`${DIRECTUS_URL}/permissions/${existingPermission.id}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${accessToken}`
                    },
                    body: JSON.stringify({
                        fields: '*',
                        permissions: {}
                    })
                });

                if (updateResponse.ok) {
                    console.log(`  ✅ Permiso actualizado para "${collection}"`);
                } else {
                    console.log(`  ⚠️  No se pudo actualizar "${collection}"`);
                }
            } else {
                // Crear nuevo permiso público
                const createResponse = await fetch(`${DIRECTUS_URL}/permissions`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${accessToken}`
                    },
                    body: JSON.stringify({
                        role: null, // null = Public role
                        collection: collection,
                        action: 'read',
                        fields: '*',
                        permissions: {}
                    })
                });

                if (createResponse.ok) {
                    console.log(`  ✅ Permiso creado para "${collection}"`);
                } else {
                    const errorData = await createResponse.json();
                    console.log(`  ❌ Error creando permiso para "${collection}":`, errorData.errors?.[0]?.message);
                }
            }
        }

        console.log('\n╔═══════════════════════════════════════════════════════════╗');
        console.log('║              ✅ PERMISOS CONFIGURADOS                     ║');
        console.log('╚═══════════════════════════════════════════════════════════╝');
        console.log('');
        console.log('Próximos pasos:');
        console.log('  1. Refrescá la página index.html (F5)');
        console.log('  2. Abrí la consola (F12) y verificá que diga "X productos cargados"');
        console.log('  3. Deberías ver los productos de Directus en la página');
        console.log('');

    } catch (error) {
        console.error('\n❌ Error:', error.message);
        console.log('\nVerificá que:');
        console.log('  - Directus esté corriendo (http://localhost:8055)');
        console.log('  - Las credenciales sean correctas');
        console.log('');
        process.exit(1);
    }
}

main();
