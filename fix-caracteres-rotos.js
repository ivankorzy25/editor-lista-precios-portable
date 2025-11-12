#!/usr/bin/env node

/**
 * ARREGLAR CARACTERES ROTOS EN PRODUCTOS
 * Busca y corrige problemas de encoding UTF-8
 */

const fetch = require('node-fetch');

const DIRECTUS_URL = 'http://localhost:8055';
const ACCESS_TOKEN = 'Dtc8_SXieO8jUv7sbs4Rws5_HHoCHq47';

console.log('╔═══════════════════════════════════════════════════════════╗');
console.log('║   ARREGLAR CARACTERES ROTOS (ENCODING UTF-8)             ║');
console.log('╚═══════════════════════════════════════════════════════════╝');
console.log('');

// Mapa de caracteres rotos comunes
const caracteresRotos = {
    'b�sico': 'básico',
    'f�cil': 'fácil',
    '�': 'í',
    'electr�nico': 'electrónico',
    'autom�tico': 'automático',
    'hidr�ulico': 'hidráulico',
    'neum�tico': 'neumático',
    'port�til': 'portátil',
    'm�vil': 'móvil',
    '�nico': 'único',
    'pr�ctico': 'práctico'
};

async function getProductos() {
    try {
        const response = await fetch(`${DIRECTUS_URL}/items/productos?fields=*`, {
            headers: {
                'Authorization': `Bearer ${ACCESS_TOKEN}`
            }
        });

        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }

        const data = await response.json();
        return data.data || [];
    } catch (error) {
        console.error('❌ Error obteniendo productos:', error.message);
        return [];
    }
}

async function actualizarProducto(id, campos) {
    try {
        const response = await fetch(`${DIRECTUS_URL}/items/productos/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${ACCESS_TOKEN}`
            },
            body: JSON.stringify(campos)
        });

        return response.ok;
    } catch (error) {
        console.error(`❌ Error actualizando producto ${id}:`, error.message);
        return false;
    }
}

function arreglarTexto(texto) {
    if (!texto) return texto;

    let textoArreglado = texto;

    // Reemplazar caracteres rotos conocidos
    for (const [roto, correcto] of Object.entries(caracteresRotos)) {
        textoArreglado = textoArreglado.replace(new RegExp(roto, 'gi'), correcto);
    }

    // Reemplazar el carácter � genérico
    textoArreglado = textoArreglado.replace(/�/g, '');

    return textoArreglado;
}

async function main() {
    console.log('📦 Obteniendo productos...\n');

    const productos = await getProductos();
    console.log(`✅ Encontrados ${productos.length} productos\n`);

    let corregidos = 0;
    let sinProblemas = 0;

    for (const producto of productos) {
        const camposConProblemas = {};
        let tieneProblemas = false;

        // Revisar campos de texto
        const camposARevisar = [
            'nombre', 'modelo', 'descripcion',
            'accesorios', 'garantia', 'financiacion',
            'potencia', 'tension', 'motor', 'peso'
        ];

        for (const campo of camposARevisar) {
            if (producto[campo] && typeof producto[campo] === 'string') {
                const original = producto[campo];
                const arreglado = arreglarTexto(original);

                if (original !== arreglado) {
                    camposConProblemas[campo] = arreglado;
                    tieneProblemas = true;
                    console.log(`🔧 Producto: ${producto.nombre || producto.id}`);
                    console.log(`   Campo: ${campo}`);
                    console.log(`   Antes: "${original}"`);
                    console.log(`   Después: "${arreglado}"\n`);
                }
            }
        }

        if (tieneProblemas) {
            const actualizado = await actualizarProducto(producto.id, camposConProblemas);
            if (actualizado) {
                corregidos++;
                console.log(`   ✅ Producto ${producto.id} actualizado\n`);
            }
        } else {
            sinProblemas++;
        }
    }

    console.log('╔═══════════════════════════════════════════════════════════╗');
    console.log('║                  RESUMEN                                  ║');
    console.log('╚═══════════════════════════════════════════════════════════╝');
    console.log(`  ✅ Productos corregidos: ${corregidos}`);
    console.log(`  👌 Productos sin problemas: ${sinProblemas}`);
    console.log('');

    if (corregidos > 0) {
        console.log('✨ ¡Caracteres corregidos! Refrescá el navegador (Ctrl+Shift+R)');
    } else {
        console.log('👍 No se encontraron problemas de encoding');
    }
}

main();
