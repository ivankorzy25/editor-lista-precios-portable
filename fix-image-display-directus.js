#!/usr/bin/env node

/**
 * CONFIGURAR DISPLAY DE IMÁGENES EN DIRECTUS
 * Para que el campo "imagen" aparezca en "Origen de la imagen"
 */

const fetch = require('node-fetch');

const DIRECTUS_URL = 'http://localhost:8055';
const ACCESS_TOKEN = 'Dtc8_SXieO8jUv7sbs4Rws5_HHoCHq47';

console.log('╔═══════════════════════════════════════════════════════════╗');
console.log('║   CONFIGURAR DISPLAY DE IMÁGENES EN DIRECTUS             ║');
console.log('╚═══════════════════════════════════════════════════════════╝');
console.log('');

async function configurarCampoImagen() {
    try {
        console.log('🔧 Configurando campo "imagen" en producto_imagenes...\n');

        // Actualizar metadata del campo imagen
        const response = await fetch(`${DIRECTUS_URL}/fields/producto_imagenes/imagen`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${ACCESS_TOKEN}`
            },
            body: JSON.stringify({
                meta: {
                    interface: 'file-image',
                    display: 'image',
                    display_options: {
                        circle: false
                    },
                    special: ['file'],
                    width: 'half'
                }
            })
        });

        if (response.ok) {
            console.log('✅ Campo "imagen" configurado correctamente\n');
        } else {
            const error = await response.json();
            console.error('❌ Error:', error.errors?.[0]?.message || 'Desconocido');
        }
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

async function configurarLayoutCards() {
    try {
        console.log('🎨 Configurando layout de Cards para la colección...\n');

        // Configurar preset de la colección para usar cards
        const response = await fetch(`${DIRECTUS_URL}/presets`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${ACCESS_TOKEN}`
            },
            body: JSON.stringify({
                collection: 'producto_imagenes',
                layout: 'cards',
                layout_query: {
                    cards: {
                        imageField: 'imagen',
                        title: '{{ producto_id.nombre }}',
                        subtitle: 'Orden: {{ orden }}'
                    }
                },
                layout_options: {
                    cards: {
                        imageField: 'imagen',
                        title: '{{ producto_id.nombre }}',
                        subtitle: 'Orden: {{ orden }}',
                        imageFit: 'cover'
                    }
                }
            })
        });

        if (response.ok) {
            console.log('✅ Layout de Cards configurado\n');
        } else {
            const error = await response.json();
            // Es normal que falle si ya existe un preset
            if (error.errors?.[0]?.message?.includes('already exists')) {
                console.log('⚠️  Preset ya existe, actualizando...\n');

                // Obtener presets existentes
                const presetsResp = await fetch(`${DIRECTUS_URL}/presets?filter[collection][_eq]=producto_imagenes`, {
                    headers: { 'Authorization': `Bearer ${ACCESS_TOKEN}` }
                });

                const presetsData = await presetsResp.json();

                if (presetsData.data && presetsData.data.length > 0) {
                    const presetId = presetsData.data[0].id;

                    // Actualizar preset existente
                    const updateResp = await fetch(`${DIRECTUS_URL}/presets/${presetId}`, {
                        method: 'PATCH',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${ACCESS_TOKEN}`
                        },
                        body: JSON.stringify({
                            layout: 'cards',
                            layout_options: {
                                cards: {
                                    imageField: 'imagen',
                                    title: '{{ producto_id.nombre }}',
                                    subtitle: 'Orden: {{ orden }}',
                                    imageFit: 'cover'
                                }
                            }
                        })
                    });

                    if (updateResp.ok) {
                        console.log('✅ Preset actualizado correctamente\n');
                    }
                }
            } else {
                console.error('❌ Error:', error.errors?.[0]?.message);
            }
        }
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

async function verificarRelacion() {
    try {
        console.log('🔗 Verificando relación con directus_files...\n');

        const response = await fetch(`${DIRECTUS_URL}/relations/producto_imagenes`, {
            headers: { 'Authorization': `Bearer ${ACCESS_TOKEN}` }
        });

        if (response.ok) {
            const data = await response.json();
            const imagenRelation = data.data.find(r => r.field === 'imagen');

            if (imagenRelation) {
                console.log('✅ Relación encontrada:');
                console.log(`   - Campo: ${imagenRelation.field}`);
                console.log(`   - Related Collection: ${imagenRelation.related_collection}`);
                console.log('');
            } else {
                console.log('⚠️  No se encontró relación del campo "imagen"\n');
            }
        }
    } catch (error) {
        console.error('❌ Error verificando relación:', error.message);
    }
}

async function main() {
    await verificarRelacion();
    await configurarCampoImagen();
    await configurarLayoutCards();

    console.log('╔═══════════════════════════════════════════════════════════╗');
    console.log('║                  INSTRUCCIONES                            ║');
    console.log('╚═══════════════════════════════════════════════════════════╝');
    console.log('');
    console.log('1. Refrescá Directus (Ctrl+Shift+R)');
    console.log('2. Ve a Content → Producto Imagenes');
    console.log('3. El layout debería estar en Cards automáticamente');
    console.log('4. Si no aparece, click en "Cards" arriba a la derecha');
    console.log('5. Ahora "imagen" debería aparecer en "Origen de la imagen"');
    console.log('');
    console.log('Si aún no funciona, ve a:');
    console.log('Settings → Data Model → producto_imagenes → imagen');
    console.log('Y verifica que:');
    console.log('  - Interface: File Image');
    console.log('  - Display: Image');
    console.log('  - Special: [file]');
    console.log('');
}

main();
