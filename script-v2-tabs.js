// ============================================
// CONFIGURACIÓN DE DIRECTUS V2 CON PESTAÑAS DINÁMICAS
// ============================================

const DIRECTUS_URL = 'http://localhost:8055';

// Verificación de autenticación al cargar
(function checkAuth() {
    const isAuthenticated = sessionStorage.getItem('authenticated') === 'true';

    if (isAuthenticated) {
        const loginScreen = document.getElementById('loginScreen');
        const mainContent = document.getElementById('mainContent');

        if (loginScreen) loginScreen.style.display = 'none';
        if (mainContent) mainContent.style.display = 'block';

        console.log('✅ Sesión verificada - acceso concedido');
    }
})();

// ============================================
// SISTEMA DE LOG DISCRETO
// ============================================

const EditorLog = {
    container: null,

    init() {
        this.container = document.getElementById('editorLogContainer');
    },

    log(message, type = 'info') {
        console.log(`[${type.toUpperCase()}] ${message}`);

        if (!this.container) return;

        const logEntry = document.createElement('div');
        logEntry.className = `log-entry log-${type}`;
        logEntry.textContent = `${new Date().toLocaleTimeString()} - ${message}`;

        this.container.appendChild(logEntry);

        // Auto-eliminar después de 5 segundos
        setTimeout(() => {
            logEntry.style.opacity = '0';
            setTimeout(() => logEntry.remove(), 300);
        }, 5000);
    }
};

// ============================================
// API DE DIRECTUS
// ============================================

const DirectusAPI = {
    getHeaders() {
        return {
            'Content-Type': 'application/json'
        };
    },

    async getProductos() {
        try {
            const response = await fetch(`${DIRECTUS_URL}/items/productos?sort=orden,nombre`, {
                headers: this.getHeaders()
            });
            const data = await response.json();
            return data.data || [];
        } catch (error) {
            console.error('Error al obtener productos:', error);
            return [];
        }
    },

    async getImagenesProducto(productoId) {
        try {
            const response = await fetch(
                `${DIRECTUS_URL}/items/producto_imagenes?filter[producto_id][_eq]=${productoId}&fields=*,imagen.*&sort=orden`,
                { headers: this.getHeaders() }
            );
            const data = await response.json();
            return data.data || [];
        } catch (error) {
            console.error('Error al obtener imágenes:', error);
            return [];
        }
    },

    getAssetURL(fileId, transformations = '') {
        if (!fileId) return '';
        return `${DIRECTUS_URL}/assets/${fileId}${transformations}`;
    }
};

// ============================================
// CONFIGURACIÓN DE CATEGORÍAS
// ============================================

const CATEGORIAS_CONFIG = {
    'generadores-nafta': {
        nombre: 'Generadores Nafta',
        icono: '⚡',
        descripcion: 'Generadores Nafteros - 3000 RPM'
    },
    'generadores-diesel': {
        nombre: 'Generadores Diesel',
        icono: '🔌',
        descripcion: 'Generadores Diesel de alta potencia'
    },
    'inverter': {
        nombre: 'Inverter',
        icono: '🔋',
        descripcion: 'Generadores Inverter silenciosos'
    },
    'motores': {
        nombre: 'Motores',
        icono: '⚙️',
        descripcion: 'Motores y repuestos'
    },
    'motocultivadores': {
        nombre: 'Motocultivadores',
        icono: '🚜',
        descripcion: 'Motocultivadores y maquinaria agrícola'
    },
    'construccion': {
        nombre: 'Construcción',
        icono: '🏗️',
        descripcion: 'Equipos de construcción'
    },
    'compresores': {
        nombre: 'Compresores',
        icono: '💨',
        descripcion: 'Compresores de aire'
    },
    'torres': {
        nombre: 'Torres Iluminación',
        icono: '💡',
        descripcion: 'Torres de iluminación'
    },
    'alquiler': {
        nombre: 'Alquiler',
        icono: '🏢',
        descripcion: 'Equipos en alquiler'
    }
};

// ============================================
// CARGA Y RENDERIZADO DE PRODUCTOS
// ============================================

let productosGlobal = [];

async function loadProductos() {
    console.log('📦 Cargando productos desde Directus...');

    const productos = await DirectusAPI.getProductos();
    productosGlobal = productos;

    console.log(`✅ ${productos.length} productos cargados`);

    if (productos.length === 0) {
        mostrarMensajeVacio();
        return;
    }

    // Agrupar productos por categoría
    const productosPorCategoria = agruparPorCategoria(productos);

    // Renderizar pestañas y contenido
    renderizarTabs(productosPorCategoria);
}

function agruparPorCategoria(productos) {
    const grupos = {};

    productos.forEach(producto => {
        const categoria = producto.categoria || 'otros';
        if (!grupos[categoria]) {
            grupos[categoria] = [];
        }
        grupos[categoria].push(producto);
    });

    return grupos;
}

function renderizarTabs(productosPorCategoria) {
    const tabsNav = document.querySelector('.tabs-nav');
    const tabsContent = document.querySelector('.tabs-content');

    if (!tabsNav || !tabsContent) {
        console.error('No se encontraron contenedores de tabs');
        return;
    }

    // Limpiar tabs existentes
    tabsNav.innerHTML = '';
    tabsContent.innerHTML = '';

    let isFirst = true;

    // Crear tabs para cada categoría
    Object.keys(productosPorCategoria).forEach(categoriaKey => {
        const productos = productosPorCategoria[categoriaKey];
        const config = CATEGORIAS_CONFIG[categoriaKey] || {
            nombre: categoriaKey.charAt(0).toUpperCase() + categoriaKey.slice(1),
            icono: '📦',
            descripcion: categoriaKey
        };

        // Crear botón de tab
        const tabButton = document.createElement('button');
        tabButton.className = 'tab-button' + (isFirst ? ' active' : '');
        tabButton.dataset.tab = categoriaKey;
        tabButton.textContent = config.nombre;
        tabButton.addEventListener('click', () => activarTab(categoriaKey));
        tabsNav.appendChild(tabButton);

        // Crear contenido de tab
        const tabSection = document.createElement('section');
        tabSection.id = categoriaKey;
        tabSection.className = 'tab-content' + (isFirst ? ' active' : '');
        tabSection.innerHTML = renderizarTablaProductos(config, productos);
        tabsContent.appendChild(tabSection);

        isFirst = false;
    });
}

function renderizarTablaProductos(config, productos) {
    return `
        <div class="section-header">
            <h2>${config.icono} ${config.descripcion}</h2>
            <p class="promo internal-only">Bonificación 25% - Contado descuento 8% - FINANCIACION CON CHEQUES 0-30-60-90</p>
            <p class="click-info">💡 Click en cualquier fila para ver detalles completos del producto</p>
        </div>
        <div class="table-container">
            <table>
                <thead>
                    <tr>
                        <th>Imagen</th>
                        <th>Modelo</th>
                        <th>Descripción</th>
                        <th>Precio</th>
                        <th class="internal-only">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    ${productos.map(p => renderizarFilaProducto(p)).join('')}
                </tbody>
            </table>
        </div>
    `;
}

function renderizarFilaProducto(producto) {
    const precio = producto.precio ? `USD ${producto.precio}` : 'Consultar';

    return `
        <tr class="clickable-product" data-product-id="${producto.id}" onclick="viewProduct(${producto.id})">
            <td class="product-thumbnail-cell">
                <div id="thumb-${producto.id}" class="product-thumbnail-placeholder">📦</div>
            </td>
            <td><strong>${producto.nombre}</strong></td>
            <td>${producto.descripcion || '-'}</td>
            <td class="price">${precio}</td>
            <td class="internal-only">
                <button class="btn-small" onclick="event.stopPropagation(); editarProducto(${producto.id})">✏️</button>
            </td>
        </tr>
    `;
}

function activarTab(tabId) {
    // Desactivar todos los tabs
    document.querySelectorAll('.tab-button').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });

    // Activar el tab seleccionado
    const button = document.querySelector(`[data-tab="${tabId}"]`);
    const content = document.getElementById(tabId);

    if (button) button.classList.add('active');
    if (content) content.classList.add('active');
}

async function cargarImagenesMiniaturas() {
    for (const producto of productosGlobal) {
        const imagenes = await DirectusAPI.getImagenesProducto(producto.id);

        if (imagenes.length > 0 && imagenes[0].imagen) {
            const thumbnail = document.getElementById(`thumb-${producto.id}`);
            if (thumbnail) {
                const imgURL = DirectusAPI.getAssetURL(imagenes[0].imagen.id, '?width=100&height=100&fit=cover');
                thumbnail.innerHTML = `<img src="${imgURL}" alt="${producto.nombre}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 4px;">`;
            }
        }
    }
}

function mostrarMensajeVacio() {
    const tabsContent = document.querySelector('.tabs-content');
    if (tabsContent) {
        tabsContent.innerHTML = `
            <div style="text-align: center; padding: 60px 20px;">
                <h2 style="color: #999;">📦 No hay productos disponibles</h2>
                <p style="color: #666; margin-top: 20px;">
                    Agregá productos desde Directus Admin:<br>
                    <a href="http://localhost:8055" target="_blank" style="color: #fd6600;">http://localhost:8055</a>
                </p>
            </div>
        `;
    }
}

// ============================================
// VISTA DE PRODUCTO (MODAL)
// ============================================

async function viewProduct(productId) {
    console.log('👁️ Visualizando producto:', productId);

    const producto = productosGlobal.find(p => p.id === productId);
    if (!producto) {
        console.error('Producto no encontrado:', productId);
        return;
    }

    const imagenes = await DirectusAPI.getImagenesProducto(productId);

    // Mostrar modal
    const modal = document.getElementById('productModal');
    if (modal) {
        modal.style.display = 'block';

        // Cargar nombre del producto
        const modalName = document.getElementById('modalProductName');
        if (modalName) modalName.textContent = producto.nombre;

        // Cargar especificaciones básicas
        const modalSpecs = document.getElementById('modalProductSpecs');
        if (modalSpecs) modalSpecs.textContent = producto.descripcion || '';

        // Cargar precio
        const modalListPrice = document.getElementById('modalListPrice');
        if (modalListPrice) modalListPrice.textContent = producto.precio ? `USD ${producto.precio}` : 'Consultar';

        // Cargar imágenes en el carrusel
        if (imagenes.length > 0) {
            cargarCarrusel(imagenes, producto.nombre);
        }
    }
}

function cargarCarrusel(imagenes, nombreProducto) {
    const mainImg = document.getElementById('modalProductImg');
    const thumbnailsContainer = document.getElementById('carouselThumbnails');

    if (!mainImg || !thumbnailsContainer) return;

    let currentIndex = 0;

    // Cargar imagen principal
    if (imagenes[0] && imagenes[0].imagen) {
        mainImg.src = DirectusAPI.getAssetURL(imagenes[0].imagen.id, '?width=800&height=600&fit=contain');
        mainImg.alt = nombreProducto;
    }

    // Cargar miniaturas
    thumbnailsContainer.innerHTML = '';
    imagenes.forEach((img, index) => {
        if (img.imagen) {
            const thumb = document.createElement('img');
            thumb.src = DirectusAPI.getAssetURL(img.imagen.id, '?width=100&height=100&fit=cover');
            thumb.alt = `${nombreProducto} - imagen ${index + 1}`;
            thumb.className = 'carousel-thumbnail' + (index === 0 ? ' active' : '');
            thumb.onclick = () => {
                currentIndex = index;
                mainImg.src = DirectusAPI.getAssetURL(img.imagen.id, '?width=800&height=600&fit=contain');
                document.querySelectorAll('.carousel-thumbnail').forEach(t => t.classList.remove('active'));
                thumb.classList.add('active');
            };
            thumbnailsContainer.appendChild(thumb);
        }
    });

    // Navegación con flechas
    const prevBtn = document.getElementById('carouselPrev');
    const nextBtn = document.getElementById('carouselNext');

    if (prevBtn) {
        prevBtn.onclick = () => {
            currentIndex = (currentIndex - 1 + imagenes.length) % imagenes.length;
            document.querySelectorAll('.carousel-thumbnail')[currentIndex].click();
        };
    }

    if (nextBtn) {
        nextBtn.onclick = () => {
            currentIndex = (currentIndex + 1) % imagenes.length;
            document.querySelectorAll('.carousel-thumbnail')[currentIndex].click();
        };
    }
}

// ============================================
// CERRAR MODAL
// ============================================

document.addEventListener('click', (e) => {
    if (e.target.classList.contains('close-modal') || e.target.classList.contains('modal')) {
        const modal = document.getElementById('productModal');
        if (modal) modal.style.display = 'none';
    }
});

// ============================================
// INICIALIZACIÓN
// ============================================

document.addEventListener('DOMContentLoaded', async () => {
    console.log('🚀 Iniciando aplicación V2 con tabs dinámicos...');

    EditorLog.init();

    await loadProductos();

    // Cargar miniaturas después de renderizar (para no bloquear)
    setTimeout(() => {
        cargarImagenesMiniaturas();
    }, 500);
});
