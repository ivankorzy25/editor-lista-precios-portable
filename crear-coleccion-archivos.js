#!/usr/bin/env node

/**
 * CREAR COLECCIÓN ARCHIVOS_PRODUCTO
 */

const fetch = require('node-fetch');

const DIRECTUS_URL = 'http://localhost:8055';
const ACCESS_TOKEN = 'Dtc8_SXieO8jUv7sbs4Rws5_HHoCHq47';

console.log('🔧 Creando colección archivos_producto...\n');

async function main() {
    try {
        // 1. Crear colección
        console.log('📦 Creando colección...');
        const collectionResponse = await fetch(`${DIRECTUS_URL}/collections`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${ACCESS_TOKEN}`
            },
            body: JSON.stringify({
                collection: 'archivos_producto',
                meta: {
                    icon: 'attach_file',
                    note: 'Archivos (PDFs, docs) asociados a productos'
                },
                schema: {
                    name: 'archivos_producto'
                }
            })
        });

        if (!collectionResponse.ok) {
            const error = await collectionResponse.json();
            if (!error.errors?.[0]?.message?.includes('already exists')) {
                throw new Error(error.errors?.[0]?.message || 'Error desconocido');
            }
            console.log('⚠️  Colección ya existe, continuando...');
        } else {
            console.log('✅ Colección creada');
        }

        // 2. Crear campos
        const campos = [
            {
                field: 'producto_id',
                type: 'integer',
                meta: {
                    interface: 'select-dropdown-m2o',
                    display: 'related-values'
                },
                schema: {
                    is_nullable: false
                }
            },
            {
                field: 'archivo_id',
                type: 'uuid',
                meta: {
                    interface: 'file',
                    special: ['file']
                },
                schema: {
                    is_nullable: false
                }
            },
            {
                field: 'tipo',
                type: 'string',
                meta: {
                    interface: 'select-dropdown',
                    options: {
                        choices: [
                            { text: 'PDF', value: 'pdf' },
                            { text: 'Word', value: 'doc' },
                            { text: 'Excel', value: 'xls' },
                            { text: 'Texto', value: 'txt' },
                            { text: 'HTML', value: 'html' },
                            { text: 'JSON', value: 'json' },
                            { text: 'Otro', value: 'otro' }
                        ]
                    }
                },
                schema: {
                    is_nullable: false
                }
            },
            {
                field: 'descripcion',
                type: 'text',
                meta: {
                    interface: 'input-multiline'
                }
            }
        ];

        console.log('\n📝 Creando campos...');
        for (const campo of campos) {
            const response = await fetch(`${DIRECTUS_URL}/fields/archivos_producto`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${ACCESS_TOKEN}`
                },
                body: JSON.stringify(campo)
            });

            if (response.ok) {
                console.log(`  ✅ Campo "${campo.field}" creado`);
            } else {
                const error = await response.json();
                if (!error.errors?.[0]?.message?.includes('already exists')) {
                    console.log(`  ⚠️  Campo "${campo.field}":`, error.errors?.[0]?.message);
                } else {
                    console.log(`  ⚠️  Campo "${campo.field}" ya existe`);
                }
            }
        }

        // 3. Crear relación con productos
        console.log('\n🔗 Creando relación con productos...');
        const relationResponse = await fetch(`${DIRECTUS_URL}/relations`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${ACCESS_TOKEN}`
            },
            body: JSON.stringify({
                collection: 'archivos_producto',
                field: 'producto_id',
                related_collection: 'productos',
                meta: {
                    one_field: 'archivos'
                }
            })
        });

        if (relationResponse.ok) {
            console.log('✅ Relación creada');
        } else {
            const error = await relationResponse.json();
            if (!error.errors?.[0]?.message?.includes('already exists')) {
                console.log('⚠️  Relación:', error.errors?.[0]?.message);
            } else {
                console.log('⚠️  Relación ya existe');
            }
        }

        // 4. Configurar permisos públicos
        console.log('\n🔓 Configurando permisos públicos...');

        // Obtener política pública
        const policiesResponse = await fetch(`${DIRECTUS_URL}/policies`, {
            headers: { 'Authorization': `Bearer ${ACCESS_TOKEN}` }
        });
        const policiesData = await policiesResponse.json();
        const publicPolicy = policiesData.data.find(p => p.icon === 'public');
        const PUBLIC_POLICY_ID = publicPolicy.id;

        const permissionResponse = await fetch(`${DIRECTUS_URL}/permissions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${ACCESS_TOKEN}`
            },
            body: JSON.stringify({
                collection: 'archivos_producto',
                action: 'read',
                fields: '*',
                permissions: {},
                policy: PUBLIC_POLICY_ID
            })
        });

        if (permissionResponse.ok) {
            console.log('✅ Permisos públicos configurados');
        } else {
            const error = await permissionResponse.json();
            console.log('⚠️  Permisos:', error.errors?.[0]?.message || 'ya configurados');
        }

        console.log('\n✅ ¡Colección archivos_producto lista!');
        console.log('\nAhora podés:');
        console.log(`  1. Ir a ${DIRECTUS_URL}/admin/content/archivos_producto`);
        console.log('  2. Subir PDFs y otros archivos asociados a productos');
        console.log('  3. Los botones en el modal funcionarán correctamente');

    } catch (error) {
        console.error('\n❌ Error:', error.message);
    }
}

main();
