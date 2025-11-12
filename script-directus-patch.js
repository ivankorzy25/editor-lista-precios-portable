// ============================================
// PATCH DIRECTUS - Integración con Directus CMS
// ============================================
// Este script reemplaza las funciones del editor de imágenes
// para que funcionen con Directus en lugar del sistema de archivos local

// ============================================
// CONFIGURACIÓN Y VARIABLES GLOBALES
// ============================================

const DIRECTUS_URL = 'http://localhost:8055';
let directusToken = '';
let currentProductId = null;
let editorImageRecords = []; // Array de objetos completos desde Directus {id, imagen, orden, producto_id}

// Variables que sincronizamos con script.js
// Estas variables YA EXISTEN en script.js, aquí solo las referenciamos
// para asegurarnos de que estén disponibles cuando las necesitemos

// ============================================
// AUTENTICACIÓN CON DIRECTUS
// ============================================

/**
 * Login automático a Directus
 * Se ejecuta al cargar la página
 */
async function loginDirectus() {
    try {
        const response = await fetch(`${DIRECTUS_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: 'admin@generadores.ar',
                password: 'kor2025'
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        directusToken = data.data.access_token;
        console.log('✅ Directus conectado correctamente');
        return true;
    } catch (error) {
        console.error('❌ Error conectando a Directus:', error);
        console.warn('⚠️ No se pudo conectar a Directus. Verifica que esté corriendo en localhost:8055');
        return false;
    }
}

// ============================================
// GESTIÓN DE PRODUCTOS
// ============================================

/**
 * Obtener o crear producto en Directus
 * @param {string} productName - Nombre del producto
 * @returns {number|null} - ID del producto en Directus
 */
async function getOrCreateProductId(productName) {
    try {
        // Buscar producto por nombre
        const searchResponse = await fetch(
            `${DIRECTUS_URL}/items/productos?filter[nombre][_eq]=${encodeURIComponent(productName)}`,
            { headers: { 'Authorization': `Bearer ${directusToken}` } }
        );
        const searchData = await searchResponse.json();

        if (searchData.data && searchData.data.length > 0) {
            console.log(`✅ Producto encontrado: ${productName} (ID: ${searchData.data[0].id})`);
            return searchData.data[0].id;
        }

        // Crear producto si no existe
        console.log(`📝 Creando producto: ${productName}`);
        const createResponse = await fetch(`${DIRECTUS_URL}/items/productos`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${directusToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                nombre: productName,
                orden: 999
            })
        });
        const createData = await createResponse.json();
        console.log(`✅ Producto creado: ${productName} (ID: ${createData.data.id})`);
        return createData.data.id;
    } catch (error) {
        console.error('❌ Error obteniendo/creando producto:', error);
        return null;
    }
}

// ============================================
// CARGA DE IMÁGENES DESDE DIRECTUS
// ============================================

/**
 * Cargar imágenes del producto desde Directus
 * Actualiza editorImageRecords y editorImages (de script.js)
 */
async function loadImagesFromDirectus() {
    try {
        const response = await fetch(
            `${DIRECTUS_URL}/items/producto_imagenes?filter[producto_id][_eq]=${currentProductId}&sort=orden`,
            { headers: { 'Authorization': `Bearer ${directusToken}` } }
        );
        const data = await response.json();

        // Guardar registros completos
        editorImageRecords = data.data || [];

        // Convertir a URLs para el editor (array de strings que usa script.js)
        // IMPORTANTE: Incluir token en la URL para que Directus permita el acceso
        window.editorImages = editorImageRecords.map(record =>
            `${DIRECTUS_URL}/assets/${record.imagen}?access_token=${directusToken}`
        );

        console.log(`✅ ${editorImageRecords.length} imágenes cargadas desde Directus`);

        // Llamar a la función de script.js para renderizar la grilla
        if (typeof renderEditorGrid === 'function') {
            renderEditorGrid();
        }

        // Actualizar contador
        const fileCountElement = document.getElementById('editorFileCount');
        if (fileCountElement) {
            fileCountElement.textContent = window.editorImages.length;
        }
    } catch (error) {
        console.error('❌ Error cargando imágenes:', error);
        window.editorImages = [];
        if (typeof renderEditorGrid === 'function') {
            renderEditorGrid();
        }
    }
}

/**
 * Cargar imágenes del producto para mostrar en el modal (carrusel)
 * @param {string} productName - Nombre del producto
 * @returns {Array<string>} - Array de URLs de imágenes
 */
async function loadProductImagesFromDirectus(productName) {
    try {
        const productId = await getOrCreateProductId(productName);
        if (!productId) return [];

        const response = await fetch(
            `${DIRECTUS_URL}/items/producto_imagenes?filter[producto_id][_eq]=${productId}&sort=orden`,
            { headers: { 'Authorization': `Bearer ${directusToken}` } }
        );
        const data = await response.json();

        if (data.data && data.data.length > 0) {
            console.log(`✅ ${data.data.length} imágenes encontradas para ${productName}`);
            // IMPORTANTE: Incluir token en la URL
            return data.data.map(img => `${DIRECTUS_URL}/assets/${img.imagen}?access_token=${directusToken}`);
        }

        console.log(`ℹ️ No hay imágenes en Directus para ${productName}`);
        return [];
    } catch (error) {
        console.error('❌ Error cargando imágenes del producto:', error);
        return [];
    }
}

// ============================================
// REEMPLAZO: openImageEditor
// ============================================

/**
 * Abrir editor de imágenes (reemplaza la función original de script.js)
 * Carga las imágenes desde Directus en lugar del sistema de archivos
 */
window.openImageEditor = async function() {
    try {
        console.log('🔍 Abriendo editor de imágenes...');

        const modal = document.getElementById('imageEditorModal');

        // Verificar que existe el modal y currentProductData (de script.js)
        if (!modal) {
            console.error('❌ Modal del editor no encontrado');
            if (window.EditorLog) EditorLog.error('Modal del editor no encontrado');
            return;
        }

        if (!window.currentProductData) {
            console.error('❌ No hay producto seleccionado');
            if (window.EditorLog) EditorLog.error('No hay producto seleccionado. Selecciona un producto primero');
            return;
        }

        console.log(`📦 Producto seleccionado: ${window.currentProductData.name}`);

        // Actualizar información del producto en el editor
        const productNameElement = document.getElementById('editorProductName');
        const folderPathElement = document.getElementById('editorFolderPath');

        if (productNameElement) {
            productNameElement.textContent = window.currentProductData.name;
        }

        if (folderPathElement) {
            folderPathElement.textContent = `Directus - ${window.currentProductData.name}`;
        }

        // Mostrar modal
        console.log('📂 Mostrando modal...');
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';

        // Obtener ID del producto en Directus
        console.log('🔄 Obteniendo ID del producto en Directus...');
        currentProductId = await getOrCreateProductId(window.currentProductData.name);

        if (!currentProductId) {
            console.error('❌ No se pudo obtener el ID del producto');
            alert('❌ Error: No se pudo obtener el ID del producto en Directus');
            return;
        }

        console.log(`✅ Producto ID: ${currentProductId}`);

        // Cargar imágenes desde Directus
        console.log('📸 Cargando imágenes desde Directus...');
        await loadImagesFromDirectus();
        console.log('✅ Editor abierto correctamente');

    } catch (error) {
        console.error('❌ ERROR en openImageEditor:', error);
        alert(`❌ Error abriendo el editor: ${error.message}`);
    }
};

// ============================================
// REEMPLAZO: deleteSelectedImages
// ============================================

/**
 * Eliminar imágenes seleccionadas (reemplaza la función original)
 * Elimina de Directus y actualiza la interfaz
 */
window.deleteSelectedImages = async function() {
    const checkboxes = document.querySelectorAll('.editor-image-checkbox:checked');

    if (checkboxes.length === 0) {
        alert('⚠️ No has seleccionado ninguna imagen para eliminar.');
        return;
    }

    if (checkboxes.length >= window.editorImages.length) {
        alert('⚠️ No puedes eliminar todas las imágenes. Debe quedar al menos una.');
        return;
    }

    const confirmed = confirm(`¿Estás seguro de eliminar ${checkboxes.length} imagen(es)?`);
    if (!confirmed) return;

    // Obtener índices seleccionados (ordenar de mayor a menor para no afectar índices al eliminar)
    const indices = Array.from(checkboxes)
        .map(cb => parseInt(cb.dataset.index))
        .sort((a, b) => b - a);

    try {
        // Eliminar de Directus
        for (const index of indices) {
            const record = editorImageRecords[index];
            if (record && record.id) {
                await fetch(`${DIRECTUS_URL}/items/producto_imagenes/${record.id}`, {
                    method: 'DELETE',
                    headers: { 'Authorization': `Bearer ${directusToken}` }
                });
                console.log(`🗑️ Imagen eliminada: ${record.id}`);
            }
        }

        alert(`✅ ${indices.length} imagen(es) eliminada(s) de Directus`);

        // Recargar imágenes desde Directus
        await loadImagesFromDirectus();
    } catch (error) {
        console.error('❌ Error eliminando imágenes:', error);
        alert(`❌ Error: ${error.message}`);
    }
};

// ============================================
// REEMPLAZO: addFilesFromExplorer
// ============================================

/**
 * Agregar archivos desde el explorador (reemplaza la función original)
 * Sube los archivos a Directus y los asocia al producto
 */
window.addFilesFromExplorer = async function(files) {
    if (!files || files.length === 0) return;

    if (!currentProductId) {
        alert('❌ Error: Producto no identificado');
        return;
    }

    try {
        alert(`📤 Subiendo ${files.length} archivo(s) a Directus...`);

        for (let i = 0; i < files.length; i++) {
            const file = files[i];

            // 1. Subir archivo a Directus
            const formData = new FormData();
            formData.append('file', file);

            const uploadResponse = await fetch(`${DIRECTUS_URL}/files`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${directusToken}` },
                body: formData
            });

            if (!uploadResponse.ok) {
                throw new Error(`Error subiendo ${file.name}: ${uploadResponse.statusText}`);
            }

            const fileData = await uploadResponse.json();
            const fileId = fileData.data.id;

            console.log(`✅ Archivo subido: ${file.name} (ID: ${fileId})`);

            // 2. Crear relación producto-imagen
            await fetch(`${DIRECTUS_URL}/items/producto_imagenes`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${directusToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    producto_id: currentProductId,
                    imagen: fileId,
                    orden: window.editorImages.length + i,
                    descripcion: file.name
                })
            });

            console.log(`🔗 Imagen asociada al producto: ${file.name}`);
        }

        alert(`✅ ${files.length} imagen(es) agregada(s) exitosamente`);

        // Recargar imágenes desde Directus
        await loadImagesFromDirectus();
    } catch (error) {
        console.error('❌ Error subiendo imágenes:', error);
        alert(`❌ Error: ${error.message}`);
    }
};

// ============================================
// REEMPLAZO: saveImageChanges
// ============================================

/**
 * Guardar cambios (reemplaza la función original)
 * Actualiza el orden de las imágenes en Directus y cierra el editor
 */
window.saveImageChanges = async function() {
    if (!currentProductId) {
        alert('❌ Error: Producto no identificado');
        return;
    }

    try {
        console.log('💾 Guardando orden de imágenes en Directus...');

        // Actualizar orden en Directus
        for (let i = 0; i < editorImageRecords.length; i++) {
            const record = editorImageRecords[i];
            if (record && record.id && record.orden !== i) {
                await fetch(`${DIRECTUS_URL}/items/producto_imagenes/${record.id}`, {
                    method: 'PATCH',
                    headers: {
                        'Authorization': `Bearer ${directusToken}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ orden: i })
                });
                console.log(`📊 Orden actualizado: ID ${record.id} -> posición ${i}`);
            }
        }

        // Actualizar carrusel del modal con las imágenes de Directus
        window.currentProductImages = [...window.editorImages];

        // Reinicializar carrusel (función de script.js)
        if (typeof initCarousel === 'function') {
            initCarousel(window.currentProductImages);
        }

        // Cerrar editor (función de script.js)
        if (typeof closeImageEditor === 'function') {
            closeImageEditor();
        }

        alert('✅ Cambios guardados en Directus correctamente');
    } catch (error) {
        console.error('❌ Error guardando cambios:', error);
        alert(`❌ Error: ${error.message}`);
    }
};

// ============================================
// REEMPLAZO: handleDrop (Drag & Drop)
// ============================================

/**
 * Manejar drop de imágenes (reemplaza la función original)
 * Mantiene sincronizados editorImages y editorImageRecords
 */
window.handleDrop = function(e) {
    e.preventDefault();

    const dropIndex = parseInt(this.dataset.index);
    const draggedIndex = window.draggedIndex; // Variable de script.js

    if (draggedIndex !== null && draggedIndex !== dropIndex) {
        // Reordenar editorImages (array de URLs)
        const draggedItem = window.editorImages[draggedIndex];
        window.editorImages.splice(draggedIndex, 1);
        window.editorImages.splice(dropIndex, 0, draggedItem);

        // Reordenar editorImageRecords (array de objetos completos)
        const draggedRecord = editorImageRecords[draggedIndex];
        editorImageRecords.splice(draggedIndex, 1);
        editorImageRecords.splice(dropIndex, 0, draggedRecord);

        // Re-renderizar grilla (función de script.js)
        if (typeof renderEditorGrid === 'function') {
            renderEditorGrid();
        }
    }
};

// ============================================
// INTERCEPTAR fillModal
// ============================================

/**
 * Interceptar la función fillModal para cargar imágenes desde Directus
 * cuando se abre un producto en el modal
 */
function interceptFillModal() {
    // Guardar referencia a la función original
    const originalFillModal = window.fillModal;

    if (!originalFillModal) {
        console.warn('⚠️ fillModal no está definida todavía, reintentando...');
        setTimeout(interceptFillModal, 100);
        return;
    }

    // Reemplazar con versión extendida
    window.fillModal = function(productData) {
        // Llamar a la función original primero
        originalFillModal(productData);

        // Cargar imágenes desde Directus en segundo plano
        (async () => {
            try {
                const directusImages = await loadProductImagesFromDirectus(productData.name);

                if (directusImages.length > 0) {
                    console.log(`✅ Usando ${directusImages.length} imágenes de Directus`);

                    // Actualizar imágenes del producto (variable de script.js)
                    window.currentProductImages = directusImages;

                    // Reinicializar carrusel (función de script.js)
                    if (typeof initCarousel === 'function') {
                        initCarousel(window.currentProductImages);
                    }
                } else {
                    console.log('ℹ️ No hay imágenes en Directus, usando imágenes del HTML');
                }
            } catch (error) {
                console.error('❌ Error cargando imágenes de Directus:', error);
            }
        })();
    };

    console.log('✅ fillModal interceptada correctamente');
}

// ============================================
// INICIALIZACIÓN
// ============================================

/**
 * Inicializar el patch de Directus
 * Se ejecuta automáticamente al cargar el script
 */
(async function initDirectusPatch() {
    console.log('🔌 Inicializando Directus Patch...');

    // 1. Login a Directus
    const connected = await loginDirectus();

    if (!connected) {
        console.error('❌ No se pudo conectar a Directus. El editor funcionará en modo local.');
        return;
    }

    // 2. Interceptar fillModal cuando esté disponible
    interceptFillModal();

    // 3. Re-vincular el botón "Editar Imágenes" para asegurar que use la nueva función
    // Esperar un poco para que script.js termine de cargar
    setTimeout(function() {
        const btnEditImages = document.getElementById('btnEditImages');
        if (btnEditImages) {
            // Remover event listeners anteriores clonando el botón
            const newBtn = btnEditImages.cloneNode(true);
            btnEditImages.parentNode.replaceChild(newBtn, btnEditImages);

            // Vincular a la nueva función
            newBtn.addEventListener('click', window.openImageEditor);
            console.log('✅ Botón "Editar Imágenes" re-vinculado correctamente');
        } else {
            console.warn('⚠️ Botón "Editar Imágenes" no encontrado');
        }
    }, 500);

    console.log('✅ Directus Patch cargado correctamente');
    console.log('📋 Funciones reemplazadas:');
    console.log('   - openImageEditor');
    console.log('   - deleteSelectedImages');
    console.log('   - addFilesFromExplorer');
    console.log('   - saveImageChanges');
    console.log('   - handleDrop');
    console.log('   - fillModal (interceptada)');
})();
