// ============================================
// CONFIGURACIÓN
// ============================================

const DIRECTUS_URL = 'http://localhost:8055';
let accessToken = null; // Token de autenticación (opcional si los permisos públicos están activados)
let currentProduct = null; // Producto actualmente seleccionado
let currentProductImages = []; // Imágenes del producto actual
let currentProductFiles = []; // Archivos del producto actual

// ============================================
// SISTEMA DE LOG DISCRETO
// ============================================

const EditorLog = {
    container: null,

    init() {
        this.container = document.getElementById('editorLog');
    },

    add(message, type = 'info') {
        if (!this.container) this.init();
        if (!this.container) return;

        const logEntry = document.createElement('div');
        logEntry.className = `log-message ${type}`;

        const icons = {
            'success': '✓',
            'error': '✗',
            'warning': '⚠',
            'info': 'ℹ'
        };

        const icon = icons[type] || 'ℹ';
        logEntry.innerHTML = `<span>${icon}</span><span>${message}</span>`;

        this.container.appendChild(logEntry);
        this.container.scrollTop = this.container.scrollHeight;

        // Mantener solo los últimos 10 mensajes
        const messages = this.container.querySelectorAll('.log-message');
        if (messages.length > 10) {
            messages[0].remove();
        }
    },

    success(message) { this.add(message, 'success'); },
    error(message) { this.add(message, 'error'); },
    warning(message) { this.add(message, 'warning'); },
    info(message) { this.add(message, 'info'); }
};

// ============================================
// API DE DIRECTUS
// ============================================

const DirectusAPI = {
    // Autenticación (opcional si usamos permisos públicos)
    async login(email, password) {
        try {
            const response = await fetch(`${DIRECTUS_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();
            if (data.data && data.data.access_token) {
                accessToken = data.data.access_token;
                console.log('✅ Autenticado en Directus');
                return true;
            }
            return false;
        } catch (error) {
            console.error('❌ Error de autenticación:', error);
            return false;
        }
    },

    // Headers para las peticiones
    getHeaders() {
        const headers = {
            'Content-Type': 'application/json'
        };
        if (accessToken) {
            headers['Authorization'] = `Bearer ${accessToken}`;
        }
        return headers;
    },

    // === PRODUCTOS ===

    async getProductos() {
        try {
            const response = await fetch(`${DIRECTUS_URL}/items/productos?filter[estado][_eq]=active&sort=orden`, {
                headers: this.getHeaders()
            });
            const data = await response.json();
            return data.data || [];
        } catch (error) {
            console.error('Error al obtener productos:', error);
            return [];
        }
    },

    async getProducto(id) {
        try {
            const response = await fetch(`${DIRECTUS_URL}/items/productos/${id}`, {
                headers: this.getHeaders()
            });
            const data = await response.json();
            return data.data;
        } catch (error) {
            console.error('Error al obtener producto:', error);
            return null;
        }
    },

    async createProducto(producto) {
        try {
            const response = await fetch(`${DIRECTUS_URL}/items/productos`, {
                method: 'POST',
                headers: this.getHeaders(),
                body: JSON.stringify(producto)
            });
            const data = await response.json();
            return data.data;
        } catch (error) {
            console.error('Error al crear producto:', error);
            return null;
        }
    },

    // === IMÁGENES DE PRODUCTO ===

    async getImagenesProducto(productoId) {
        try {
            const response = await fetch(
                `${DIRECTUS_URL}/items/imagenes_producto?filter[producto_id][_eq]=${productoId}&fields=*,archivo_id.*&sort=orden`,
                { headers: this.getHeaders() }
            );
            const data = await response.json();
            return data.data || [];
        } catch (error) {
            console.error('Error al obtener imágenes:', error);
            return [];
        }
    },

    async createImagenProducto(productoId, archivoId, orden = 0, esPrincipal = false) {
        try {
            const response = await fetch(`${DIRECTUS_URL}/items/imagenes_producto`, {
                method: 'POST',
                headers: this.getHeaders(),
                body: JSON.stringify({
                    producto_id: productoId,
                    archivo_id: archivoId,
                    orden: orden,
                    es_principal: esPrincipal
                })
            });
            const data = await response.json();
            return data.data;
        } catch (error) {
            console.error('Error al crear imagen de producto:', error);
            return null;
        }
    },

    async updateImagenProducto(id, updates) {
        try {
            const response = await fetch(`${DIRECTUS_URL}/items/imagenes_producto/${id}`, {
                method: 'PATCH',
                headers: this.getHeaders(),
                body: JSON.stringify(updates)
            });
            const data = await response.json();
            return data.data;
        } catch (error) {
            console.error('Error al actualizar imagen:', error);
            return null;
        }
    },

    async deleteImagenProducto(id) {
        try {
            await fetch(`${DIRECTUS_URL}/items/imagenes_producto/${id}`, {
                method: 'DELETE',
                headers: this.getHeaders()
            });
            return true;
        } catch (error) {
            console.error('Error al eliminar imagen:', error);
            return false;
        }
    },

    // === ARCHIVOS DE PRODUCTO ===

    async getArchivosProducto(productoId) {
        try {
            const response = await fetch(
                `${DIRECTUS_URL}/items/archivos_producto?filter[producto_id][_eq]=${productoId}&fields=*,archivo_id.*`,
                { headers: this.getHeaders() }
            );
            const data = await response.json();
            return data.data || [];
        } catch (error) {
            console.error('Error al obtener archivos:', error);
            return [];
        }
    },

    async createArchivoProducto(productoId, archivoId, tipo, descripcion = '') {
        try {
            const response = await fetch(`${DIRECTUS_URL}/items/archivos_producto`, {
                method: 'POST',
                headers: this.getHeaders(),
                body: JSON.stringify({
                    producto_id: productoId,
                    archivo_id: archivoId,
                    tipo: tipo,
                    descripcion: descripcion
                })
            });
            const data = await response.json();
            return data.data;
        } catch (error) {
            console.error('Error al crear archivo de producto:', error);
            return null;
        }
    },

    async deleteArchivoProducto(id) {
        try {
            await fetch(`${DIRECTUS_URL}/items/archivos_producto/${id}`, {
                method: 'DELETE',
                headers: this.getHeaders()
            });
            return true;
        } catch (error) {
            console.error('Error al eliminar archivo:', error);
            return false;
        }
    },

    // === ARCHIVOS (FILES) ===

    async uploadFile(file) {
        try {
            const formData = new FormData();
            formData.append('file', file);

            const headers = {};
            if (accessToken) {
                headers['Authorization'] = `Bearer ${accessToken}`;
            }

            const response = await fetch(`${DIRECTUS_URL}/files`, {
                method: 'POST',
                headers: headers,
                body: formData
            });
            const data = await response.json();
            return data.data;
        } catch (error) {
            console.error('Error al subir archivo:', error);
            return null;
        }
    },

    async deleteFile(fileId) {
        try {
            await fetch(`${DIRECTUS_URL}/files/${fileId}`, {
                method: 'DELETE',
                headers: this.getHeaders()
            });
            return true;
        } catch (error) {
            console.error('Error al eliminar archivo:', error);
            return false;
        }
    },

    // URL para acceder a un archivo
    getAssetURL(fileId, transformations = '') {
        if (!fileId) return '';
        return `${DIRECTUS_URL}/assets/${fileId}${transformations}`;
    }
};

// ============================================
// CARGA Y RENDERIZADO DE PRODUCTOS
// ============================================

async function loadProductos() {
    console.log('📦 Cargando productos desde Directus...');

    const productos = await DirectusAPI.getProductos();
    console.log(`✅ ${productos.length} productos cargados`);

    renderProductos(productos);
}

function renderProductos(productos) {
    const grid = document.getElementById('productsGrid');
    if (!grid) return;

    grid.innerHTML = '';

    if (productos.length === 0) {
        grid.innerHTML = '<p style="text-align: center; padding: 40px; color: #999;">No hay productos disponibles. <br>Configurá Directus primero (ver SETUP-DIRECTUS.md)</p>';
        return;
    }

    productos.forEach(producto => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.dataset.productId = producto.id;

        // Por ahora sin imagen, después cargaremos la imagen principal
        card.innerHTML = `
            <div class="product-image-placeholder">
                <span style="font-size: 3em;">📦</span>
            </div>
            <h3 class="product-name">${producto.nombre}</h3>
            ${producto.descripcion ? `<p class="product-description">${producto.descripcion.substring(0, 100)}...</p>` : ''}
            <div class="product-actions">
                <button class="btn-view-product" onclick="viewProduct(${producto.id})">Ver Detalles</button>
            </div>
        `;

        grid.appendChild(card);
    });

    // Cargar imágenes principales de cada producto
    productos.forEach(async (producto) => {
        const imagenes = await DirectusAPI.getImagenesProducto(producto.id);
        const imagenPrincipal = imagenes.find(img => img.es_principal) || imagenes[0];

        if (imagenPrincipal && imagenPrincipal.archivo_id) {
            const card = grid.querySelector(`[data-product-id="${producto.id}"]`);
            const placeholder = card.querySelector('.product-image-placeholder');

            const imgURL = DirectusAPI.getAssetURL(imagenPrincipal.archivo_id.id, '?width=400&height=300&fit=cover');
            placeholder.innerHTML = `<img src="${imgURL}" alt="${producto.nombre}" style="width: 100%; height: 200px; object-fit: cover;">`;
        }
    });
}

// ============================================
// VISTA DE PRODUCTO (MODAL CON CARRUSEL)
// ============================================

async function viewProduct(productId) {
    console.log('👁️ Visualizando producto:', productId);

    // Cargar datos del producto
    currentProduct = await DirectusAPI.getProducto(productId);
    if (!currentProduct) {
        EditorLog.error('No se pudo cargar el producto');
        return;
    }

    // Cargar imágenes
    const imagenesData = await DirectusAPI.getImagenesProducto(productId);
    currentProductImages = imagenesData.map(img => ({
        id: img.id,
        fileId: img.archivo_id.id,
        url: DirectusAPI.getAssetURL(img.archivo_id.id),
        orden: img.orden
    }));

    // Mostrar modal con carrusel
    mostrarModalProducto();
}

function mostrarModalProducto() {
    // Actualizar nombre del producto
    const nameElement = document.getElementById('productName');
    if (nameElement) {
        nameElement.textContent = currentProduct.nombre;
    }

    // Inicializar carrusel
    if (currentProductImages.length > 0) {
        initCarousel(currentProductImages);
    }

    // Habilitar botones de edición
    const btnEditImages = document.getElementById('btnEditImages');
    const btnEditFiles = document.getElementById('btnEditFiles');
    if (btnEditImages) btnEditImages.disabled = false;
    if (btnEditFiles) btnEditFiles.disabled = false;
}

// ============================================
// CARRUSEL DE IMÁGENES
// ============================================

let currentImageIndex = 0;

function initCarousel(images) {
    const carousel = document.getElementById('imageCarousel');
    if (!carousel) return;

    carousel.innerHTML = '';

    if (images.length === 0) {
        carousel.innerHTML = '<p style="text-align: center; padding: 40px;">No hay imágenes para este producto</p>';
        return;
    }

    images.forEach((img, index) => {
        const slide = document.createElement('div');
        slide.className = 'carousel-slide';
        if (index === 0) slide.classList.add('active');

        slide.innerHTML = `<img src="${img.url}" alt="Imagen ${index + 1}">`;
        carousel.appendChild(slide);
    });

    currentImageIndex = 0;
    updateCarouselIndicators();
}

function nextImage() {
    if (currentProductImages.length === 0) return;
    currentImageIndex = (currentImageIndex + 1) % currentProductImages.length;
    updateCarousel();
}

function prevImage() {
    if (currentProductImages.length === 0) return;
    currentImageIndex = (currentImageIndex - 1 + currentProductImages.length) % currentProductImages.length;
    updateCarousel();
}

function updateCarousel() {
    const slides = document.querySelectorAll('.carousel-slide');
    slides.forEach((slide, index) => {
        slide.classList.toggle('active', index === currentImageIndex);
    });
    updateCarouselIndicators();
}

function updateCarouselIndicators() {
    // Implementar indicadores si los hay en el HTML
}

// ============================================
// EDITOR DE IMÁGENES
// ============================================

let editorImages = [];

async function openImageEditor() {
    if (!currentProduct) return;

    const modal = document.getElementById('imageEditorModal');
    if (!modal) return;

    // Actualizar nombre del producto
    document.getElementById('editorProductName').textContent = currentProduct.nombre;
    document.getElementById('editorFolderPath').textContent = `Directus - Producto: ${currentProduct.nombre}`;

    // Cargar imágenes
    const imagenesData = await DirectusAPI.getImagenesProducto(currentProduct.id);
    editorImages = imagenesData.map(img => ({
        id: img.id,
        fileId: img.archivo_id.id,
        url: DirectusAPI.getAssetURL(img.archivo_id.id),
        orden: img.orden,
        esPrincipal: img.es_principal
    }));

    // Mostrar modal
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';

    // Renderizar grid
    renderEditorGrid();

    EditorLog.success(`Editor abierto: ${editorImages.length} imágenes`);
}

function closeImageEditor() {
    const modal = document.getElementById('imageEditorModal');
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

function renderEditorGrid() {
    const grid = document.getElementById('editorImagesGrid');
    if (!grid) return;

    grid.innerHTML = '';

    document.getElementById('editorFileCount').textContent = editorImages.length;

    editorImages.forEach((img, index) => {
        const item = document.createElement('div');
        item.className = 'editor-image-item';
        item.dataset.index = index;

        item.innerHTML = `
            <img src="${img.url}" alt="Imagen ${index + 1}">
            <input type="checkbox" class="editor-image-checkbox" data-index="${index}">
            <div class="editor-image-number">${index + 1}</div>
            <div class="editor-image-name">Orden: ${img.orden}</div>
        `;

        grid.appendChild(item);
    });
}

async function deleteSelectedImages() {
    const checkboxes = document.querySelectorAll('.editor-image-checkbox:checked');

    if (checkboxes.length === 0) {
        EditorLog.warning('No has seleccionado ninguna imagen');
        return;
    }

    if (checkboxes.length >= editorImages.length) {
        EditorLog.warning('Debe quedar al menos una imagen');
        return;
    }

    EditorLog.info(`Eliminando ${checkboxes.length} imagen(es)...`);

    const indices = Array.from(checkboxes).map(cb => parseInt(cb.dataset.index));

    for (const index of indices.sort((a, b) => b - a)) {
        const img = editorImages[index];

        // Eliminar de Directus
        await DirectusAPI.deleteImagenProducto(img.id);
        // Opcionalmente eliminar archivo: await DirectusAPI.deleteFile(img.fileId);

        editorImages.splice(index, 1);
    }

    renderEditorGrid();
    EditorLog.success('Imágenes eliminadas');

    // Recargar carrusel
    currentProductImages = [...editorImages];
    initCarousel(currentProductImages);
}

async function addImagesFromExplorer(files) {
    if (!files || files.length === 0) return;

    EditorLog.info(`Subiendo ${files.length} imagen(es)...`);

    for (const file of Array.from(files)) {
        // Subir archivo a Directus
        const fileData = await DirectusAPI.uploadFile(file);

        if (fileData) {
            // Crear relación con producto
            const orden = editorImages.length;
            const imagenProducto = await DirectusAPI.createImagenProducto(
                currentProduct.id,
                fileData.id,
                orden,
                false
            );

            if (imagenProducto) {
                editorImages.push({
                    id: imagenProducto.id,
                    fileId: fileData.id,
                    url: DirectusAPI.getAssetURL(fileData.id),
                    orden: orden,
                    esPrincipal: false
                });
            }
        }
    }

    renderEditorGrid();
    EditorLog.success(`${files.length} imagen(es) subida(s)`);

    // Recargar carrusel
    currentProductImages = [...editorImages];
    initCarousel(currentProductImages);
}

async function openProductFolder() {
    if (!currentProduct) return;

    const folderPath = 'directus-local/uploads/';

    EditorLog.info('Abriendo carpeta de uploads...');

    try {
        const response = await fetch(`http://localhost:3001/open-folder?path=${encodeURIComponent(folderPath)}`);
        const data = await response.json();

        if (data.success) {
            EditorLog.success('Carpeta abierta en el explorador');
        } else {
            EditorLog.error('No se pudo abrir la carpeta');
        }
    } catch (error) {
        EditorLog.warning('System API no disponible');
    }
}

// ============================================
// EDITOR DE ARCHIVOS
// ============================================

let editorFiles = [];

async function openFileEditor() {
    if (!currentProduct) return;

    const modal = document.getElementById('fileEditorModal');
    if (!modal) return;

    // Actualizar nombre del producto
    document.getElementById('fileEditorProductName').textContent = currentProduct.nombre;
    document.getElementById('fileEditorFolderPath').textContent = `Directus - Archivos: ${currentProduct.nombre}`;

    // Cargar archivos
    const archivosData = await DirectusAPI.getArchivosProducto(currentProduct.id);
    editorFiles = archivosData.map(archivo => ({
        id: archivo.id,
        fileId: archivo.archivo_id.id,
        nombre: archivo.archivo_id.filename_download,
        tipo: archivo.tipo,
        url: DirectusAPI.getAssetURL(archivo.archivo_id.id),
        size: formatFileSize(archivo.archivo_id.filesize)
    }));

    // Mostrar modal
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';

    // Renderizar grid
    renderFileEditorGrid();

    logFileEditor(`Editor abierto: ${editorFiles.length} archivos`, 'success');
}

function closeFileEditor() {
    const modal = document.getElementById('fileEditorModal');
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

function renderFileEditorGrid() {
    const grid = document.getElementById('fileEditorGrid');
    if (!grid) return;

    grid.innerHTML = '';

    document.getElementById('fileEditorFileCount').textContent = editorFiles.length;

    if (editorFiles.length === 0) {
        grid.innerHTML = '<p style="text-align: center; color: #999; padding: 40px;">No hay archivos para este producto</p>';
        return;
    }

    editorFiles.forEach((file, index) => {
        const item = document.createElement('div');
        item.className = 'file-editor-item';
        item.dataset.index = index;

        const icon = getFileIcon(file.nombre);

        item.innerHTML = `
            <input type="checkbox" class="file-checkbox" data-index="${index}">
            <div class="file-icon">${icon}</div>
            <div class="file-name">${file.nombre}</div>
            <div class="file-type">${file.tipo}</div>
            <div class="file-size">${file.size}</div>
        `;

        item.addEventListener('click', (e) => {
            if (e.target.type !== 'checkbox') {
                window.open(file.url, '_blank');
            }
        });

        grid.appendChild(item);
    });
}

function getFileIcon(fileName) {
    const ext = fileName.split('.').pop().toLowerCase();
    const icons = {
        'pdf': '📄',
        'doc': '📝',
        'docx': '📝',
        'xls': '📊',
        'xlsx': '📊',
        'txt': '📃',
        'html': '🌐',
        'json': '{ }',
        'zip': '🗜️',
        'rar': '🗜️'
    };
    return icons[ext] || '📄';
}

function formatFileSize(bytes) {
    if (!bytes || bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

async function deleteSelectedFiles() {
    const checkboxes = document.querySelectorAll('.file-checkbox:checked');

    if (checkboxes.length === 0) {
        logFileEditor('No has seleccionado ningún archivo', 'warning');
        return;
    }

    logFileEditor(`Eliminando ${checkboxes.length} archivo(s)...`, 'info');

    const indices = Array.from(checkboxes).map(cb => parseInt(cb.dataset.index));

    for (const index of indices.sort((a, b) => b - a)) {
        const file = editorFiles[index];

        // Eliminar de Directus
        await DirectusAPI.deleteArchivoProducto(file.id);
        // Opcionalmente eliminar archivo: await DirectusAPI.deleteFile(file.fileId);

        editorFiles.splice(index, 1);
    }

    renderFileEditorGrid();
    logFileEditor('Archivos eliminados', 'success');
}

async function addFilesFromFileEditor(files) {
    if (!files || files.length === 0) return;

    logFileEditor(`Subiendo ${files.length} archivo(s)...`, 'info');

    for (const file of Array.from(files)) {
        // Subir archivo a Directus
        const fileData = await DirectusAPI.uploadFile(file);

        if (fileData) {
            // Determinar tipo
            const ext = file.name.split('.').pop().toLowerCase();
            const tipoMap = {
                'pdf': 'pdf',
                'doc': 'doc',
                'docx': 'doc',
                'xls': 'xls',
                'xlsx': 'xls',
                'txt': 'txt',
                'html': 'html',
                'json': 'json'
            };
            const tipo = tipoMap[ext] || 'otro';

            // Crear relación con producto
            const archivoProducto = await DirectusAPI.createArchivoProducto(
                currentProduct.id,
                fileData.id,
                tipo,
                ''
            );

            if (archivoProducto) {
                editorFiles.push({
                    id: archivoProducto.id,
                    fileId: fileData.id,
                    nombre: fileData.filename_download,
                    tipo: tipo,
                    url: DirectusAPI.getAssetURL(fileData.id),
                    size: formatFileSize(fileData.filesize)
                });
            }
        }
    }

    renderFileEditorGrid();
    logFileEditor(`${files.length} archivo(s) subido(s)`, 'success');
}

async function openFilesFolder() {
    if (!currentProduct) return;

    const folderPath = 'directus-local/uploads/';

    logFileEditor('Abriendo carpeta...', 'info');

    try {
        const response = await fetch(`http://localhost:3001/open-folder?path=${encodeURIComponent(folderPath)}`);
        const data = await response.json();

        if (data.success) {
            logFileEditor('Carpeta abierta en el explorador', 'success');
        } else {
            logFileEditor('No se pudo abrir la carpeta', 'error');
        }
    } catch (error) {
        logFileEditor('System API no disponible', 'warning');
    }
}

function logFileEditor(message, type = 'info') {
    const logContainer = document.getElementById('fileEditorLog');
    if (!logContainer) return;

    const logEntry = document.createElement('div');
    logEntry.className = `log-message ${type}`;

    const icons = {
        'success': '✓',
        'error': '✗',
        'warning': '⚠',
        'info': 'ℹ'
    };

    const icon = icons[type] || 'ℹ';
    logEntry.innerHTML = `<span>${icon}</span><span>${message}</span>`;

    logContainer.appendChild(logEntry);
    logContainer.scrollTop = logContainer.scrollHeight;

    const messages = logContainer.querySelectorAll('.log-message');
    if (messages.length > 10) {
        messages[0].remove();
    }
}

// ============================================
// EVENT LISTENERS
// ============================================

document.addEventListener('DOMContentLoaded', async () => {
    console.log('🚀 Iniciando aplicación V2...');

    // Inicializar sistema de log
    EditorLog.init();

    // Cargar productos desde Directus
    await loadProductos();

    // Event listeners para editor de imágenes
    const btnEditImages = document.getElementById('btnEditImages');
    if (btnEditImages) {
        btnEditImages.addEventListener('click', openImageEditor);
    }

    const btnCloseEditor = document.getElementById('btnCloseEditor');
    if (btnCloseEditor) {
        btnCloseEditor.addEventListener('click', closeImageEditor);
    }

    const btnDeleteSelected = document.getElementById('btnDeleteSelected');
    if (btnDeleteSelected) {
        btnDeleteSelected.addEventListener('click', deleteSelectedImages);
    }

    const inputEditorFiles = document.getElementById('inputEditorFiles');
    if (inputEditorFiles) {
        inputEditorFiles.addEventListener('change', function(e) {
            addImagesFromExplorer(this.files);
            this.value = '';
        });
    }

    const btnOpenFolder = document.getElementById('btnOpenFolder');
    if (btnOpenFolder) {
        btnOpenFolder.addEventListener('click', openProductFolder);
    }

    // Event listeners para editor de archivos
    const btnEditFiles = document.getElementById('btnEditFiles');
    if (btnEditFiles) {
        btnEditFiles.addEventListener('click', openFileEditor);
    }

    const btnCloseFileEditor = document.getElementById('btnCloseFileEditor');
    if (btnCloseFileEditor) {
        btnCloseFileEditor.addEventListener('click', closeFileEditor);
    }

    const btnDeleteSelectedFiles = document.getElementById('btnDeleteSelectedFiles');
    if (btnDeleteSelectedFiles) {
        btnDeleteSelectedFiles.addEventListener('click', deleteSelectedFiles);
    }

    const inputFileEditorFiles = document.getElementById('inputFileEditorFiles');
    if (inputFileEditorFiles) {
        inputFileEditorFiles.addEventListener('change', function(e) {
            addFilesFromFileEditor(this.files);
            this.value = '';
        });
    }

    const btnOpenFilesFolder = document.getElementById('btnOpenFilesFolder');
    if (btnOpenFilesFolder) {
        btnOpenFilesFolder.addEventListener('click', openFilesFolder);
    }

    // Cerrar modales al hacer click fuera
    const imageEditorModal = document.getElementById('imageEditorModal');
    if (imageEditorModal) {
        imageEditorModal.addEventListener('click', (e) => {
            if (e.target === imageEditorModal) {
                closeImageEditor();
            }
        });
    }

    const fileEditorModal = document.getElementById('fileEditorModal');
    if (fileEditorModal) {
        fileEditorModal.addEventListener('click', (e) => {
            if (e.target === fileEditorModal) {
                closeFileEditor();
            }
        });
    }

    // Botones del carrusel
    const btnPrev = document.getElementById('btnPrevImage');
    const btnNext = document.getElementById('btnNextImage');
    if (btnPrev) btnPrev.addEventListener('click', prevImage);
    if (btnNext) btnNext.addEventListener('click', nextImage);

    console.log('✅ Aplicación V2 lista');
});
