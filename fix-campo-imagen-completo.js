#!/usr/bin/env node

/**
 * ARREGLAR CAMPO IMAGEN PARA QUE APAREZCA EN "ORIGEN DE LA IMAGEN"
 * El problema es que Directus no detecta el campo como imagen válida
 */

const fetch = require('node-fetch');

const DIRECTUS_URL = 'http://localhost:8055';
const ACCESS_TOKEN = 'Dtc8_SXieO8jUv7sbs4Rws5_HHoCHq47';

console.log('╔═══════════════════════════════════════════════════════════╗');
console.log('║   ARREGLAR CAMPO IMAGEN - CONFIGURACIÓN COMPLETA         ║');
console.log('╚═══════════════════════════════════════════════════════════╝');
console.log('');

async function crearRelacionConDirectusFiles() {
    console.log('🔗 Creando relación Many-to-One con directus_files...\n');

    try {
        const response = await fetch(`${DIRECTUS_URL}/relations`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${ACCESS_TOKEN}`
            },
            body: JSON.stringify({
                collection: 'producto_imagenes',
                field: 'imagen',
                related_collection: 'directus_files',
                meta: {
                    many_collection: 'producto_imagenes',
                    many_field: 'imagen',
                    one_collection: 'directus_files',
                    one_field: null,
                    junction_field: null,
                    sort_field: null
                },
                schema: {
                    on_delete: 'SET NULL'
                }
            })
        });

        if (response.ok) {
            console.log('✅ Relación creada correctamente\n');
            return true;
        } else {
            const error = await response.json();
            if (error.errors?.[0]?.message?.includes('already exists') ||
                error.errors?.[0]?.extensions?.code === 'RECORD_NOT_UNIQUE') {
                console.log('⚠️  La relación ya existe\n');
                return true;
            }
            console.error('❌ Error:', error.errors?.[0]?.message);
            return false;
        }
    } catch (error) {
        console.error('❌ Error:', error.message);
        return false;
    }
}

async function actualizarCampoImagen() {
    console.log('🔧 Actualizando campo imagen con configuración correcta...\n');

    try {
        const response = await fetch(`${DIRECTUS_URL}/fields/producto_imagenes/imagen`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${ACCESS_TOKEN}`
            },
            body: JSON.stringify({
                type: 'uuid',
                meta: {
                    interface: 'file-image',
                    special: ['file'],
                    options: {
                        folder: null
                    },
                    display: 'image',
                    display_options: {
                        circle: false
                    },
                    readonly: false,
                    hidden: false,
                    width: 'half',
                    note: 'Archivo de imagen del producto'
                },
                schema: {
                    is_nullable: false
                }
            })
        });

        if (response.ok) {
            console.log('✅ Campo imagen actualizado correctamente\n');
            return true;
        } else {
            const error = await response.json();
            console.error('❌ Error:', error.errors?.[0]?.message);
            return false;
        }
    } catch (error) {
        console.error('❌ Error:', error.message);
        return false;
    }
}

async function actualizarPresetCards() {
    console.log('🎨 Configurando preset de tarjetas...\n');

    try {
        // Primero obtener el ID del usuario actual
        const userResponse = await fetch(`${DIRECTUS_URL}/users/me`, {
            headers: { 'Authorization': `Bearer ${ACCESS_TOKEN}` }
        });
        const userData = await userResponse.json();
        const userId = userData.data.id;

        // Buscar preset existente
        const presetsResponse = await fetch(
            `${DIRECTUS_URL}/presets?filter[collection][_eq]=producto_imagenes&filter[user][_eq]=${userId}`,
            { headers: { 'Authorization': `Bearer ${ACCESS_TOKEN}` } }
        );
        const presetsData = await presetsResponse.json();

        const presetData = {
            collection: 'producto_imagenes',
            layout: 'cards',
            layout_query: {
                cards: {
                    sort: ['orden'],
                    page: 1
                }
            },
            layout_options: {
                cards: {
                    icon: 'box',
                    title: '{{imagen.title}}',
                    subtitle: 'Orden: {{orden}}',
                    size: 4,
                    imageFit: 'crop',
                    imageSource: 'imagen'
                }
            },
            user: userId
        };

        let response;
        if (presetsData.data && presetsData.data.length > 0) {
            // Actualizar preset existente
            const presetId = presetsData.data[0].id;
            response = await fetch(`${DIRECTUS_URL}/presets/${presetId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${ACCESS_TOKEN}`
                },
                body: JSON.stringify(presetData)
            });
        } else {
            // Crear nuevo preset
            response = await fetch(`${DIRECTUS_URL}/presets`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${ACCESS_TOKEN}`
                },
                body: JSON.stringify(presetData)
            });
        }

        if (response.ok) {
            console.log('✅ Preset de tarjetas configurado\n');
            return true;
        } else {
            const error = await response.json();
            console.error('❌ Error:', error.errors?.[0]?.message || JSON.stringify(error));
            return false;
        }
    } catch (error) {
        console.error('❌ Error:', error.message);
        return false;
    }
}

async function verificarConfiguracion() {
    console.log('🔍 Verificando configuración final...\n');

    try {
        // Verificar campo
        const fieldResponse = await fetch(`${DIRECTUS_URL}/fields/producto_imagenes/imagen`, {
            headers: { 'Authorization': `Bearer ${ACCESS_TOKEN}` }
        });
        const fieldData = await fieldResponse.json();

        console.log('📋 Configuración del campo imagen:');
        console.log(`   - Interface: ${fieldData.data.meta.interface}`);
        console.log(`   - Special: ${JSON.stringify(fieldData.data.meta.special)}`);
        console.log(`   - Display: ${fieldData.data.meta.display}`);
        console.log('');

        // Verificar relación
        const relationsResponse = await fetch(
            `${DIRECTUS_URL}/relations?filter[collection][_eq]=producto_imagenes&filter[field][_eq]=imagen`,
            { headers: { 'Authorization': `Bearer ${ACCESS_TOKEN}` } }
        );
        const relationsData = await relationsResponse.json();

        if (relationsData.data && relationsData.data.length > 0) {
            console.log('✅ Relación con directus_files existe');
            console.log(`   - Related collection: ${relationsData.data[0].related_collection}`);
        } else {
            console.log('❌ No se encontró relación con directus_files');
        }
        console.log('');

    } catch (error) {
        console.error('❌ Error verificando:', error.message);
    }
}

async function main() {
    console.log('Iniciando configuración completa...\n');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    // Paso 1: Crear relación
    const relacionOk = await crearRelacionConDirectusFiles();

    // Paso 2: Actualizar campo
    const campoOk = await actualizarCampoImagen();

    // Paso 3: Configurar preset
    const presetOk = await actualizarPresetCards();

    // Paso 4: Verificar
    await verificarConfiguracion();

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    console.log('╔═══════════════════════════════════════════════════════════╗');
    console.log('║                  PRÓXIMOS PASOS                           ║');
    console.log('╚═══════════════════════════════════════════════════════════╝');
    console.log('');
    console.log('1. Refrescá Directus con Ctrl+Shift+R');
    console.log('2. Ve a Contenido → Producto Imagenes');
    console.log('3. Las tarjetas deberían mostrar las imágenes ahora');
    console.log('');
    console.log('Si aún no aparecen:');
    console.log('  - Escribí manualmente "imagen" en el campo "Origen de la imagen"');
    console.log('  - O usá el layout de Tabla que es más confiable');
    console.log('');

    if (relacionOk && campoOk) {
        console.log('✅ ¡Configuración completada exitosamente!');
    } else {
        console.log('⚠️  Algunas configuraciones fallaron, revisá los errores arriba');
    }
    console.log('');
}

main();
