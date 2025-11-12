#!/usr/bin/env node

/**
 * AGREGAR TODOS LOS CAMPOS NECESARIOS A PRODUCTOS
 * Para mostrar información completa sin datos hardcodeados
 */

const fetch = require('node-fetch');

const DIRECTUS_URL = 'http://localhost:8055';
const ACCESS_TOKEN = 'Dtc8_SXieO8jUv7sbs4Rws5_HHoCHq47';

console.log('╔═══════════════════════════════════════════════════════════╗');
console.log('║   AGREGAR CAMPOS COMPLETOS A PRODUCTOS                   ║');
console.log('╚═══════════════════════════════════════════════════════════╝');
console.log('');

const camposNuevos = [
    // PRECIOS
    {
        field: 'precio_con_iva',
        type: 'decimal',
        meta: {
            interface: 'input',
            note: 'Precio final para el cliente (con IVA)',
            group: 'precios'
        },
        schema: {
            numeric_precision: 10,
            numeric_scale: 2
        }
    },
    {
        field: 'precio_sin_iva',
        type: 'decimal',
        meta: {
            interface: 'input',
            note: 'Precio base sin impuestos',
            group: 'precios'
        },
        schema: {
            numeric_precision: 10,
            numeric_scale: 2
        }
    },
    {
        field: 'iva_monto',
        type: 'decimal',
        meta: {
            interface: 'input',
            note: 'Monto del IVA',
            group: 'precios'
        },
        schema: {
            numeric_precision: 10,
            numeric_scale: 2
        }
    },
    {
        field: 'iva_porcentaje',
        type: 'decimal',
        meta: {
            interface: 'input',
            note: 'Porcentaje de IVA (ej: 10.5, 21)',
            group: 'precios'
        },
        schema: {
            numeric_precision: 5,
            numeric_scale: 2,
            default_value: 10.5
        }
    },

    // COSTOS (USO INTERNO)
    {
        field: 'precio_compra_contado',
        type: 'decimal',
        meta: {
            interface: 'input',
            note: 'Precio de compra al contado (INTERNO)',
            group: 'costos'
        },
        schema: {
            numeric_precision: 10,
            numeric_scale: 2
        }
    },
    {
        field: 'bonificacion_porcentaje',
        type: 'decimal',
        meta: {
            interface: 'input',
            note: 'Porcentaje de bonificación (ej: 25)',
            group: 'costos'
        },
        schema: {
            numeric_precision: 5,
            numeric_scale: 2,
            default_value: 25
        }
    },
    {
        field: 'descuento_contado_porcentaje',
        type: 'decimal',
        meta: {
            interface: 'input',
            note: 'Descuento adicional por pago contado (ej: 8)',
            group: 'costos'
        },
        schema: {
            numeric_precision: 5,
            numeric_scale: 2,
            default_value: 8
        }
    },
    {
        field: 'margen_ganancia',
        type: 'decimal',
        meta: {
            interface: 'input',
            note: 'Margen de ganancia en USD',
            group: 'costos'
        },
        schema: {
            numeric_precision: 10,
            numeric_scale: 2
        }
    },
    {
        field: 'margen_ganancia_porcentaje',
        type: 'decimal',
        meta: {
            interface: 'input',
            note: 'Porcentaje de ganancia',
            group: 'costos'
        },
        schema: {
            numeric_precision: 5,
            numeric_scale: 2
        }
    },

    // OPCIONES DE PAGO
    {
        field: 'pago_contado_precio1',
        type: 'decimal',
        meta: {
            interface: 'input',
            note: 'Opción de pago contado 1',
            group: 'pagos'
        },
        schema: {
            numeric_precision: 10,
            numeric_scale: 2
        }
    },
    {
        field: 'pago_contado_precio2',
        type: 'decimal',
        meta: {
            interface: 'input',
            note: 'Opción de pago contado 2',
            group: 'pagos'
        },
        schema: {
            numeric_precision: 10,
            numeric_scale: 2
        }
    },
    {
        field: 'pago_contado_precio3',
        type: 'decimal',
        meta: {
            interface: 'input',
            note: 'Opción de pago contado 3',
            group: 'pagos'
        },
        schema: {
            numeric_precision: 10,
            numeric_scale: 2
        }
    },
    {
        field: 'pago_financiado_precio1',
        type: 'decimal',
        meta: {
            interface: 'input',
            note: 'Opción de pago financiado 1',
            group: 'pagos'
        },
        schema: {
            numeric_precision: 10,
            numeric_scale: 2
        }
    },
    {
        field: 'pago_financiado_precio2',
        type: 'decimal',
        meta: {
            interface: 'input',
            note: 'Opción de pago financiado 2',
            group: 'pagos'
        },
        schema: {
            numeric_precision: 10,
            numeric_scale: 2
        }
    },
    {
        field: 'pago_financiado_precio3',
        type: 'decimal',
        meta: {
            interface: 'input',
            note: 'Opción de pago financiado 3',
            group: 'pagos'
        },
        schema: {
            numeric_precision: 10,
            numeric_scale: 2
        }
    },

    // ESPECIFICACIONES TÉCNICAS
    {
        field: 'combustible',
        type: 'string',
        meta: {
            interface: 'select-dropdown',
            options: {
                choices: [
                    { text: 'Nafta', value: 'nafta' },
                    { text: 'Diesel', value: 'diesel' },
                    { text: 'Gas', value: 'gas' },
                    { text: 'Eléctrico', value: 'electrico' }
                ]
            },
            group: 'especificaciones'
        }
    },
    {
        field: 'insonorizado',
        type: 'boolean',
        meta: {
            interface: 'boolean',
            note: 'Tiene carcasa insonorizada',
            group: 'especificaciones'
        },
        schema: {
            default_value: false
        }
    },
    {
        field: 'cabina',
        type: 'boolean',
        meta: {
            interface: 'boolean',
            note: 'Incluye cabina',
            group: 'especificaciones'
        },
        schema: {
            default_value: false
        }
    },
    {
        field: 'tablero_transfer',
        type: 'boolean',
        meta: {
            interface: 'boolean',
            note: 'Tiene tablero de transferencia',
            group: 'especificaciones'
        },
        schema: {
            default_value: false
        }
    },
    {
        field: 'tipo_dolar',
        type: 'string',
        meta: {
            interface: 'select-dropdown',
            options: {
                choices: [
                    { text: 'BNA', value: 'BNA' },
                    { text: 'Blue', value: 'Blue' },
                    { text: 'MEP', value: 'MEP' },
                    { text: 'CCL', value: 'CCL' }
                ]
            },
            group: 'especificaciones'
        },
        schema: {
            default_value: 'BNA'
        }
    },

    // INFORMACIÓN ADICIONAL
    {
        field: 'accesorios',
        type: 'text',
        meta: {
            interface: 'input-multiline',
            note: 'Lista de accesorios incluidos',
            group: 'adicional'
        }
    },
    {
        field: 'garantia',
        type: 'string',
        meta: {
            interface: 'input',
            note: 'Período de garantía (ej: 12 meses)',
            group: 'adicional'
        }
    },
    {
        field: 'financiacion',
        type: 'string',
        meta: {
            interface: 'input',
            note: 'Opciones de financiación (ej: Cheques 0-30-60-90)',
            group: 'adicional'
        }
    },

    // ESPECIFICACIONES TÉCNICAS DETALLADAS
    {
        field: 'potencia',
        type: 'string',
        meta: {
            interface: 'input',
            note: 'Potencia (ej: 3000 W)',
            group: 'especificaciones'
        }
    },
    {
        field: 'tension',
        type: 'string',
        meta: {
            interface: 'input',
            note: 'Tensión (ej: 220V-12V/AVR)',
            group: 'especificaciones'
        }
    },
    {
        field: 'motor',
        type: 'string',
        meta: {
            interface: 'input',
            note: 'Motor (ej: 6,5 HP)',
            group: 'especificaciones'
        }
    },
    {
        field: 'arranque',
        type: 'string',
        meta: {
            interface: 'select-dropdown',
            options: {
                choices: [
                    { text: 'Manual', value: 'Manual' },
                    { text: 'Eléctrico', value: 'Electrico' },
                    { text: 'Ambos', value: 'Ambos' }
                ]
            },
            group: 'especificaciones'
        }
    },
    {
        field: 'peso',
        type: 'string',
        meta: {
            interface: 'input',
            note: 'Peso (ej: 46,5 Kg)',
            group: 'especificaciones'
        }
    }
];

async function crearCampo(campo) {
    try {
        const response = await fetch(`${DIRECTUS_URL}/fields/productos`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${ACCESS_TOKEN}`
            },
            body: JSON.stringify(campo)
        });

        if (response.ok) {
            return { success: true, campo: campo.field };
        } else {
            const error = await response.json();
            if (error.errors?.[0]?.message?.includes('already exists')) {
                return { success: true, campo: campo.field, exists: true };
            }
            return { success: false, campo: campo.field, error: error.errors?.[0]?.message };
        }
    } catch (error) {
        return { success: false, campo: campo.field, error: error.message };
    }
}

async function main() {
    console.log('📝 Creando campos en colección productos...\n');

    let creados = 0;
    let existentes = 0;
    let errores = 0;

    for (const campo of camposNuevos) {
        const result = await crearCampo(campo);

        if (result.success) {
            if (result.exists) {
                console.log(`  ⚠️  ${campo.field} (ya existe)`);
                existentes++;
            } else {
                console.log(`  ✅ ${campo.field}`);
                creados++;
            }
        } else {
            console.log(`  ❌ ${campo.field}: ${result.error}`);
            errores++;
        }
    }

    console.log('\n╔═══════════════════════════════════════════════════════════╗');
    console.log('║                  RESUMEN                                  ║');
    console.log('╚═══════════════════════════════════════════════════════════╝');
    console.log(`  ✅ Campos creados: ${creados}`);
    console.log(`  ⚠️  Campos existentes: ${existentes}`);
    console.log(`  ❌ Errores: ${errores}`);
    console.log('');

    if (creados > 0 || existentes > 0) {
        console.log('🎉 Campos listos! Ahora podés:');
        console.log('  1. Ir a Directus y completar los datos del producto');
        console.log('  2. El frontend mostrará toda la información automáticamente');
        console.log('');
    }
}

main();
