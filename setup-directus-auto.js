#!/usr/bin/env node

/**
 * SETUP AUTOMÁTICO DE DIRECTUS V2
 *
 * Este script configura automáticamente las colecciones y relaciones
 * necesarias en Directus para el catálogo de productos.
 *
 * Uso:
 *   node setup-directus-auto.js
 */

const fetch = require('node-fetch');
const readline = require('readline');

const DIRECTUS_URL = 'http://localhost:8055';
let accessToken = null;

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function question(query) {
    return new Promise(resolve => rl.question(query, resolve));
}

console.log('╔═══════════════════════════════════════════════════════════╗');
console.log('║     SETUP AUTOMÁTICO DE DIRECTUS V2                      ║');
console.log('║     KOR GENERADORES - Catálogo de Productos              ║');
console.log('╚═══════════════════════════════════════════════════════════╝');
console.log('');

async function login() {
    console.log('🔐 Autenticación en Directus...');
    console.log('');

    const email = await question('Email de admin (default: admin@generadores.ar): ') || 'admin@generadores.ar';
    const password = await question('Password (default: kor2025): ') || 'kor2025';

    try {
        const response = await fetch(`${DIRECTUS_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (data.data && data.data.access_token) {
            accessToken = data.data.access_token;
            console.log('✅ Autenticación exitosa\n');
            return true;
        } else {
            console.log('❌ Error de autenticación:', data.errors?.[0]?.message || 'Credenciales incorrectas');
            return false;
        }
    } catch (error) {
        console.log('❌ Error conectando a Directus:', error.message);
        console.log('   Asegurate de que Directus esté corriendo en http://localhost:8055');
        return false;
    }
}

async function createCollection(collectionData) {
    try {
        const response = await fetch(`${DIRECTUS_URL}/collections`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            },
            body: JSON.stringify(collectionData)
        });

        const data = await response.json();

        if (response.ok) {
            return { success: true, data };
        } else {
            return { success: false, error: data.errors?.[0]?.message || 'Error desconocido' };
        }
    } catch (error) {
        return { success: false, error: error.message };
    }
}

async function createField(collection, fieldData) {
    try {
        const response = await fetch(`${DIRECTUS_URL}/fields/${collection}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            },
            body: JSON.stringify(fieldData)
        });

        const data = await response.json();

        if (response.ok) {
            return { success: true, data };
        } else {
            return { success: false, error: data.errors?.[0]?.message || 'Error desconocido' };
        }
    } catch (error) {
        return { success: false, error: error.message };
    }
}

async function createRelation(relationData) {
    try {
        const response = await fetch(`${DIRECTUS_URL}/relations`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            },
            body: JSON.stringify(relationData)
        });

        const data = await response.json();

        if (response.ok) {
            return { success: true, data };
        } else {
            return { success: false, error: data.errors?.[0]?.message || 'Error desconocido' };
        }
    } catch (error) {
        return { success: false, error: error.message };
    }
}

async function setupProductosCollection() {
    console.log('📦 Creando colección "productos"...');

    // Crear colección
    let result = await createCollection({
        collection: 'productos',
        meta: {
            icon: 'shopping_cart',
            display_template: '{{nombre}}',
            note: 'Catálogo de productos'
        },
        schema: {
            name: 'productos'
        }
    });

    if (!result.success) {
        if (result.error.includes('already exists')) {
            console.log('⚠️  La colección "productos" ya existe, continuando...');
        } else {
            console.log('❌ Error creando colección:', result.error);
            return false;
        }
    } else {
        console.log('✅ Colección "productos" creada');
    }

    // Crear campos
    const fields = [
        {
            field: 'nombre',
            type: 'string',
            meta: {
                interface: 'input',
                required: true,
                width: 'full',
                note: 'Nombre del producto (único)'
            },
            schema: {
                is_unique: true,
                is_nullable: false
            }
        },
        {
            field: 'descripcion',
            type: 'text',
            meta: {
                interface: 'input-multiline',
                width: 'full'
            }
        },
        {
            field: 'categoria',
            type: 'string',
            meta: {
                interface: 'select-dropdown',
                options: {
                    choices: [
                        { text: 'Generadores', value: 'generadores' },
                        { text: 'Herramientas', value: 'herramientas' },
                        { text: 'Accesorios', value: 'accesorios' },
                        { text: 'Repuestos', value: 'repuestos' }
                    ]
                }
            }
        },
        {
            field: 'precio',
            type: 'decimal',
            meta: {
                interface: 'input',
                note: 'Precio en moneda local'
            },
            schema: {
                numeric_precision: 10,
                numeric_scale: 2
            }
        },
        {
            field: 'estado',
            type: 'string',
            meta: {
                interface: 'select-dropdown',
                options: {
                    choices: [
                        { text: 'Activo', value: 'active' },
                        { text: 'Inactivo', value: 'inactive' }
                    ]
                },
                default_value: 'active'
            },
            schema: {
                default_value: 'active',
                is_nullable: false
            }
        },
        {
            field: 'orden',
            type: 'integer',
            meta: {
                interface: 'input',
                note: 'Orden de visualización'
            },
            schema: {
                default_value: 0
            }
        }
    ];

    for (const field of fields) {
        result = await createField('productos', field);
        if (!result.success && !result.error.includes('already exists')) {
            console.log(`  ❌ Error creando campo "${field.field}":`, result.error);
        } else {
            console.log(`  ✅ Campo "${field.field}" creado`);
        }
    }

    return true;
}

async function setupImagenesProductoCollection() {
    console.log('\n🖼️  Creando colección "imagenes_producto"...');

    // Crear colección
    let result = await createCollection({
        collection: 'imagenes_producto',
        meta: {
            icon: 'image',
            note: 'Imágenes asociadas a productos'
        },
        schema: {
            name: 'imagenes_producto'
        }
    });

    if (!result.success) {
        if (result.error.includes('already exists')) {
            console.log('⚠️  La colección "imagenes_producto" ya existe, continuando...');
        } else {
            console.log('❌ Error creando colección:', result.error);
            return false;
        }
    } else {
        console.log('✅ Colección "imagenes_producto" creada');
    }

    // Crear campos
    const fields = [
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
                interface: 'file-image',
                special: ['file']
            },
            schema: {
                is_nullable: false
            }
        },
        {
            field: 'orden',
            type: 'integer',
            meta: {
                interface: 'input',
                note: 'Orden en el carrusel'
            },
            schema: {
                default_value: 0
            }
        },
        {
            field: 'es_principal',
            type: 'boolean',
            meta: {
                interface: 'boolean',
                note: 'Imagen principal del producto'
            },
            schema: {
                default_value: false
            }
        }
    ];

    for (const field of fields) {
        result = await createField('imagenes_producto', field);
        if (!result.success && !result.error.includes('already exists')) {
            console.log(`  ❌ Error creando campo "${field.field}":`, result.error);
        } else {
            console.log(`  ✅ Campo "${field.field}" creado`);
        }
    }

    // Crear relación con productos
    result = await createRelation({
        collection: 'imagenes_producto',
        field: 'producto_id',
        related_collection: 'productos',
        meta: {
            one_field: 'imagenes',
            sort_field: 'orden'
        }
    });

    if (result.success) {
        console.log('  ✅ Relación con "productos" creada');
    } else if (!result.error.includes('already exists')) {
        console.log('  ⚠️  Error creando relación:', result.error);
    }

    return true;
}

async function setupArchivosProductoCollection() {
    console.log('\n📎 Creando colección "archivos_producto"...');

    // Crear colección
    let result = await createCollection({
        collection: 'archivos_producto',
        meta: {
            icon: 'attach_file',
            note: 'Archivos (PDFs, docs) asociados a productos'
        },
        schema: {
            name: 'archivos_producto'
        }
    });

    if (!result.success) {
        if (result.error.includes('already exists')) {
            console.log('⚠️  La colección "archivos_producto" ya existe, continuando...');
        } else {
            console.log('❌ Error creando colección:', result.error);
            return false;
        }
    } else {
        console.log('✅ Colección "archivos_producto" creada');
    }

    // Crear campos
    const fields = [
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

    for (const field of fields) {
        result = await createField('archivos_producto', field);
        if (!result.success && !result.error.includes('already exists')) {
            console.log(`  ❌ Error creando campo "${field.field}":`, result.error);
        } else {
            console.log(`  ✅ Campo "${field.field}" creado`);
        }
    }

    // Crear relación con productos
    result = await createRelation({
        collection: 'archivos_producto',
        field: 'producto_id',
        related_collection: 'productos',
        meta: {
            one_field: 'archivos'
        }
    });

    if (result.success) {
        console.log('  ✅ Relación con "productos" creada');
    } else if (!result.error.includes('already exists')) {
        console.log('  ⚠️  Error creando relación:', result.error);
    }

    return true;
}

async function createSampleData() {
    console.log('\n📝 ¿Deseas crear datos de prueba? (s/n): ');
    const answer = await question('> ');

    if (answer.toLowerCase() !== 's' && answer.toLowerCase() !== 'si') {
        return;
    }

    console.log('\n🌱 Creando productos de ejemplo...');

    const productos = [
        {
            nombre: 'Generador KOR 5000W',
            descripcion: 'Generador portátil de 5000W con arranque eléctrico',
            categoria: 'generadores',
            estado: 'active',
            orden: 1
        },
        {
            nombre: 'Generador KOR 3000W',
            descripcion: 'Generador compacto de 3000W ideal para uso doméstico',
            categoria: 'generadores',
            estado: 'active',
            orden: 2
        },
        {
            nombre: 'Kit de Herramientas Profesional',
            descripcion: 'Set completo de herramientas para mantenimiento',
            categoria: 'herramientas',
            estado: 'active',
            orden: 3
        }
    ];

    for (const producto of productos) {
        try {
            const response = await fetch(`${DIRECTUS_URL}/items/productos`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
                body: JSON.stringify(producto)
            });

            if (response.ok) {
                console.log(`  ✅ Producto "${producto.nombre}" creado`);
            }
        } catch (error) {
            console.log(`  ⚠️  Error creando "${producto.nombre}"`);
        }
    }
}

async function main() {
    // Login
    const loggedIn = await login();
    if (!loggedIn) {
        console.log('\nNo se pudo conectar a Directus. Abortando setup.');
        rl.close();
        process.exit(1);
    }

    // Setup colecciones
    await setupProductosCollection();
    await setupImagenesProductoCollection();
    await setupArchivosProductoCollection();

    // Datos de prueba
    await createSampleData();

    console.log('\n╔═══════════════════════════════════════════════════════════╗');
    console.log('║                    ✅ SETUP COMPLETADO                    ║');
    console.log('╚═══════════════════════════════════════════════════════════╝');
    console.log('');
    console.log('Próximos pasos:');
    console.log('  1. Abrí Directus Admin: http://localhost:8055');
    console.log('  2. Revisá las colecciones creadas');
    console.log('  3. Configurá permisos públicos para lectura (ver SETUP-DIRECTUS.md)');
    console.log('  4. Abrí index.html para ver la aplicación');
    console.log('');

    rl.close();
}

main().catch(error => {
    console.error('\n❌ Error fatal:', error);
    rl.close();
    process.exit(1);
});
