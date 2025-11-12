// ============================================
// EDITOR DE LISTA DE PRECIOS V2 - DIRECTUS
// Versión limpia y simple
// ============================================

const DIRECTUS_URL = 'http://localhost:8055';

// ============================================
// AUTO-LOGIN
// ============================================

(function checkAuth() {
    const isAuthenticated = sessionStorage.getItem('authenticated') === 'true';

    if (isAuthenticated) {
        const loginScreen = document.getElementById('loginScreen');
        const mainContent = document.getElementById('mainContent');

        if (loginScreen) loginScreen.style.display = 'none';
        if (mainContent) mainContent.style.display = 'block';

        console.log('✅ Sesión verificada');
    }
})();

// ============================================
// API DE DIRECTUS
// ============================================

const DirectusAPI = {
    async getProductos() {
        try {
            const response = await fetch(`${DIRECTUS_URL}/items/productos?sort=orden,nombre`);
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
                `${DIRECTUS_URL}/items/producto_imagenes?filter[producto_id][_eq]=${productoId}&fields=*,imagen.*&sort=orden`
            );
            const data = await response.json();
            return data.data || [];
        } catch (error) {
            console.error('Error al obtener imágenes:', error);
            return [];
        }
    },

    async getArchivosProducto(productoId) {
        try {
            const response = await fetch(
                `${DIRECTUS_URL}/items/archivos_producto?filter[producto_id][_eq]=${productoId}&fields=*,archivo_id.*`
            );
            const data = await response.json();
            return data.data || [];
        } catch (error) {
            console.error('Error al obtener archivos:', error);
            return [];
        }
    },

    getAssetURL(fileId, transformations = '') {
        if (!fileId) return '';
        return `${DIRECTUS_URL}/assets/${fileId}${transformations}`;
    },

    // URLs para abrir Directus en secciones específicas
    getDirectusImagenesURL(productoId) {
        return `${DIRECTUS_URL}/admin/content/producto_imagenes?filter[producto_id][_eq]=${productoId}`;
    },

    getDirectusArchivosURL(productoId) {
        return `${DIRECTUS_URL}/admin/content/archivos_producto?filter[producto_id][_eq]=${productoId}`;
    },

    getDirectusProductoURL(productoId) {
        return `${DIRECTUS_URL}/admin/content/productos/${productoId}`;
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
        descripción: 'Compresores de aire'
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
// CARGA Y RENDERIZADO
// ============================================

let productosGlobal = [];
let currentProductId = null;

async function loadProductos() {
    console.log('📦 Cargando productos desde Directus...');

    const productos = await DirectusAPI.getProductos();
    productosGlobal = productos;

    console.log(`✅ ${productos.length} productos cargados`);

    if (productos.length === 0) {
        mostrarMensajeVacio();
        return;
    }

    const productosPorCategoria = agruparPorCategoria(productos);
    renderizarTabs(productosPorCategoria);

    // Cargar miniaturas después
    setTimeout(() => cargarImagenesMiniaturas(), 500);
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

    if (!tabsNav || !tabsContent) return;

    tabsNav.innerHTML = '';
    tabsContent.innerHTML = '';

    let isFirst = true;

    Object.keys(productosPorCategoria).forEach(categoriaKey => {
        const productos = productosPorCategoria[categoriaKey];
        const config = CATEGORIAS_CONFIG[categoriaKey] || {
            nombre: categoriaKey.charAt(0).toUpperCase() + categoriaKey.slice(1),
            icono: '📦',
            descripcion: categoriaKey
        };

        // Botón de tab
        const tabButton = document.createElement('button');
        tabButton.className = 'tab-button' + (isFirst ? ' active' : '');
        tabButton.dataset.tab = categoriaKey;
        tabButton.textContent = config.nombre;
        tabButton.addEventListener('click', () => activarTab(categoriaKey));
        tabsNav.appendChild(tabButton);

        // Contenido de tab
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
                        <th>IMAGEN</th>
                        <th>MODELO</th>
                        <th>DESCRIPCIÓN</th>
                        <th>PRECIO</th>
                        <th class="internal-only">ACCIONES</th>
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
                <button class="btn-small" onclick="event.stopPropagation(); abrirDirectusProducto(${producto.id})" title="Editar en Directus">✏️</button>
            </td>
        </tr>
    `;
}

function activarTab(tabId) {
    document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));

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
                const imgURL = DirectusAPI.getAssetURL(imagenes[0].imagen, '?width=100&height=100&fit=cover');
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
                    <a href="${DIRECTUS_URL}" target="_blank" style="color: #fd6600;">${DIRECTUS_URL}</a>
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

    currentProductId = productId;
    const producto = productosGlobal.find(p => p.id === productId);

    if (!producto) {
        console.error('Producto no encontrado:', productId);
        return;
    }

    const imagenes = await DirectusAPI.getImagenesProducto(productId);
    const archivos = await DirectusAPI.getArchivosProducto(productId);

    // Mostrar modal
    const modal = document.getElementById('productModal');
    if (!modal) return;

    modal.style.display = 'block';

    // Cargar información básica
    const modalName = document.getElementById('modalProductName');
    if (modalName) modalName.textContent = producto.nombre;

    const modalSpecs = document.getElementById('modalProductSpecs');
    if (modalSpecs) modalSpecs.textContent = producto.descripcion || '';

    const modalListPrice = document.getElementById('modalListPrice');
    if (modalListPrice) modalListPrice.textContent = producto.precio ? `USD ${producto.precio}` : 'Consultar';

    // Cargar carrusel de imágenes
    if (imagenes.length > 0) {
        cargarCarrusel(imagenes, producto.nombre);
    } else {
        const mainImg = document.getElementById('modalProductImg');
        if (mainImg) {
            mainImg.src = '';
            mainImg.alt = 'Sin imagen';
        }
    }

    // Configurar botones de acceso a Directus
    configurarBotonesDirectus(productId, archivos);
}

function cargarCarrusel(imagenes, nombreProducto) {
    const mainImg = document.getElementById('modalProductImg');
    const thumbnailsContainer = document.getElementById('carouselThumbnails');

    if (!mainImg || !thumbnailsContainer) return;

    let currentIndex = 0;

    // Imagen principal (imagen es el UUID directamente)
    if (imagenes[0] && imagenes[0].imagen) {
        mainImg.src = DirectusAPI.getAssetURL(imagenes[0].imagen, '?width=800&height=600&fit=contain');
        mainImg.alt = nombreProducto;
    }

    // Miniaturas
    thumbnailsContainer.innerHTML = '';
    imagenes.forEach((img, index) => {
        if (img.imagen) {
            const thumb = document.createElement('img');
            thumb.src = DirectusAPI.getAssetURL(img.imagen, '?width=100&height=100&fit=cover');
            thumb.alt = `${nombreProducto} - imagen ${index + 1}`;
            thumb.className = 'carousel-thumbnail' + (index === 0 ? ' active' : '');
            thumb.onclick = () => {
                currentIndex = index;
                mainImg.src = DirectusAPI.getAssetURL(img.imagen, '?width=800&height=600&fit=contain');
                document.querySelectorAll('.carousel-thumbnail').forEach(t => t.classList.remove('active'));
                thumb.classList.add('active');
            };
            thumbnailsContainer.appendChild(thumb);
        }
    });

    // Navegación
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

function configurarBotonesDirectus(productoId, archivos) {
    // Buscar PDFs en los archivos
    const pdfFile = archivos.find(a => a.tipo === 'pdf' || a.archivo_id?.type?.includes('pdf'));

    // Botón Ver PDF
    const btnViewPDF = document.getElementById('btnViewPDF');
    if (btnViewPDF) {
        btnViewPDF.onclick = () => {
            if (pdfFile && pdfFile.archivo_id) {
                window.open(DirectusAPI.getAssetURL(pdfFile.archivo_id.id), '_blank');
            } else {
                alert('No hay PDF asociado a este producto');
            }
        };
    }

    // Botón Editar Imágenes → Abrir Directus
    const btnEditImages = document.getElementById('btnEditImages');
    if (btnEditImages) {
        btnEditImages.textContent = '🖼️ Ver/Editar Imágenes en Directus';
        btnEditImages.onclick = () => {
            window.open(DirectusAPI.getDirectusImagenesURL(productoId), '_blank');
        };
    }

    // Botón Editar Archivos → Abrir Directus
    const btnEditFiles = document.getElementById('btnEditFiles');
    if (btnEditFiles) {
        btnEditFiles.textContent = '📎 Ver/Editar Archivos en Directus';
        btnEditFiles.onclick = () => {
            window.open(DirectusAPI.getDirectusArchivosURL(productoId), '_blank');
        };
    }
}

// ============================================
// ABRIR DIRECTUS EN PRODUCTO ESPECÍFICO
// ============================================

function abrirDirectusProducto(productoId) {
    window.open(DirectusAPI.getDirectusProductoURL(productoId), '_blank');
}

// ============================================
// CERRAR MODAL
// ============================================

document.addEventListener('click', (e) => {
    if (e.target.classList.contains('close-modal')) {
        const modal = document.getElementById('productModal');
        if (modal) modal.style.display = 'none';
    }

    // Cerrar modal al hacer click fuera
    if (e.target.classList.contains('modal')) {
        e.target.style.display = 'none';
    }
});

// ============================================
// INICIALIZACIÓN
// ============================================

document.addEventListener('DOMContentLoaded', async () => {
    console.log('🚀 Iniciando aplicación V2 - Directus CMS');

    await loadProductos();
});
