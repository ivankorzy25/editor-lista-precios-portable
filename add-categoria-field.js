#!/usr/bin/env node

/**
 * AGREGAR CAMPO CATEGORIA A PRODUCTOS
 */

const fetch = require('node-fetch');

const DIRECTUS_URL = 'http://localhost:8055';
const ACCESS_TOKEN = 'Dtc8_SXieO8jUv7sbs4Rws5_HHoCHq47';

console.log('🔧 Agregando campo "categoria" a productos...\n');

async function main() {
    try {
        // Crear campo categoria
        const response = await fetch(`${DIRECTUS_URL}/fields/productos`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${ACCESS_TOKEN}`
            },
            body: JSON.stringify({
                field: 'categoria',
                type: 'string',
                meta: {
                    interface: 'select-dropdown',
                    options: {
                        choices: [
                            { text: 'Generadores Nafta', value: 'generadores-nafta' },
                            { text: 'Generadores Diesel', value: 'generadores-diesel' },
                            { text: 'Inverter', value: 'inverter' },
                            { text: 'Motores', value: 'motores' },
                            { text: 'Motocultivadores', value: 'motocultivadores' },
                            { text: 'Construcción', value: 'construccion' },
                            { text: 'Compresores', value: 'compresores' },
                            { text: 'Torres Iluminación', value: 'torres' },
                            { text: 'Alquiler', value: 'alquiler' }
                        ]
                    },
                    width: 'half',
                    note: 'Categoría del producto para agrupar en pestañas'
                },
                schema: {
                    default_value: 'generadores-nafta'
                }
            })
        });

        if (response.ok) {
            console.log('✅ Campo "categoria" creado exitosamente!\n');

            // Actualizar el producto existente con categoría
            const updateResponse = await fetch(`${DIRECTUS_URL}/items/productos/1`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${ACCESS_TOKEN}`
                },
                body: JSON.stringify({
                    categoria: 'generadores-nafta'
                })
            });

            if (updateResponse.ok) {
                console.log('✅ Producto "Logus GL3300AM" actualizado con categoría "generadores-nafta"');
                console.log('');
                console.log('🎉 Todo listo! Refrescá la página (Ctrl+Shift+R)');
            }
        } else {
            const error = await response.json();
            if (error.errors?.[0]?.message?.includes('already exists')) {
                console.log('⚠️  El campo "categoria" ya existe');
                console.log('');
                console.log('Actualizando producto con categoría...');

                // Actualizar producto
                const updateResponse = await fetch(`${DIRECTUS_URL}/items/productos/1`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${ACCESS_TOKEN}`
                    },
                    body: JSON.stringify({
                        categoria: 'generadores-nafta'
                    })
                });

                if (updateResponse.ok) {
                    console.log('✅ Producto actualizado con categoría');
                }
            } else {
                console.error('❌ Error:', error.errors?.[0]?.message);
            }
        }

    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

main();
