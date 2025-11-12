# 🎨 CHANGELOG: Modal Compacto + Lightbox

## 📅 Fecha: Noviembre 2025
## 📌 Versión: 2.2

---

## 🎯 Objetivo

Reorganizar el modal de productos para:
1. ✅ Reducir sección de imágenes a la mitad
2. ✅ Ampliar sección de descripciones e información
3. ✅ Agregar previsualizador tipo MercadoLibre (lightbox con zoom)
4. ✅ Mostrar toda la información sin necesidad de scroll

---

## 🔄 Cambios en Layout

### Antes vs Después

| Elemento | Antes | Después |
|----------|-------|---------|
| Columna izquierda (imágenes) | 550px | 320px |
| Imagen principal | 500x400px | 280x200px |
| Miniaturas | 80x80px | 50x50px |
| Columna derecha (info) | 50% ancho | 70% ancho |
| Scroll en modal | ✅ Necesario | ❌ No necesario |

### Distribución de Espacio

```
┌────────────────────────────────────────────────────┐
│  MODAL COMPACTO                                    │
├──────────┬─────────────────────────────────────────┤
│          │  PRECIOS PÚBLICOS                       │
│  Imagen  │  - Precio con IVA                       │
│  280x200 │  - Precio sin IVA                       │
│          │  - IVA incluido                         │
│  [Click  ├─────────────────────────────────────────┤
│   para   │  COSTOS (Uso Interno)                   │
│   zoom]  │  - Precio compra                        │
│          │  - Bonificaciones                       │
│  🖼️🖼️🖼️   │  - Margen ganancia                      │
│  Mini    ├─────────────────────────────────────────┤
│          │  ESPECIFICACIONES (2 columnas)          │
│          │  ⛽ Combustible  🔊 Insonorizado         │
│          │  🏠 Cabina      🎛️ Tablero              │
│          ├─────────────────────────────────────────┤
│          │  INFORMACIÓN ADICIONAL                  │
│          │  🎁 Accesorios  ✅ Garantía             │
│          │  💳 Financiación                        │
└──────────┴─────────────────────────────────────────┘
     30%                    70%
```

---

## 💡 Funcionalidad Lightbox

### Características

✅ **Apertura**: Click en imagen principal del modal
✅ **Imágenes HD**: 1920x1080px (alta resolución)
✅ **Navegación**: Flechas laterales (← →)
✅ **Contador**: Muestra "1 / 5" en la parte inferior
✅ **Cierre múltiple**:
   - Click en X (esquina superior derecha)
   - Click fuera de la imagen
   - Tecla ESC

✅ **Navegación con teclado**:
   - ← Imagen anterior
   - → Imagen siguiente
   - ESC Cerrar

✅ **Efectos visuales**:
   - Fondo negro semitransparente (95%)
   - Botones con hover naranja (#fd6600)
   - Transiciones suaves
   - Cursor zoom-out

### Ejemplo de Uso

```javascript
// Al hacer click en imagen principal
mainImg.onclick = () => {
    abrirLightbox(imagenes, currentIndex, nombreProducto);
};

// Función abrirLightbox()
// - Muestra imagen en alta resolución
// - Configura navegación
// - Maneja eventos de teclado
// - Contador de imágenes
```

---

## 📁 Archivos Modificados

### 1. `styles-modal-compact.css` (NUEVO)

**Propósito**: Layout compacto del modal

**Principales estilos**:
```css
.modal-body {
    grid-template-columns: 320px 1fr !important; /* Antes: 550px 1fr */
}

.product-detail-img {
    max-width: 280px !important; /* Antes: 500px */
    max-height: 200px !important;
    cursor: pointer !important; /* Indica que es clickeable */
}

.carousel-thumbnail {
    width: 50px !important; /* Antes: 80px */
    height: 50px !important;
}

.modal-right {
    display: block !important; /* Mejor control sin grid */
    overflow-y: auto !important;
    max-height: 85vh !important;
}
```

**Estilos del Lightbox**:
```css
.lightbox {
    display: none; /* flex al abrir */
    background-color: rgba(0, 0, 0, 0.95);
    align-items: center;
    justify-content: center;
}

.lightbox-img {
    max-width: 90%;
    max-height: 90vh;
    object-fit: contain;
}

.lightbox-close {
    position: absolute;
    top: 20px;
    right: 40px;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background: rgba(0, 0, 0, 0.5);
}

.lightbox-close:hover {
    background: rgba(253, 102, 0, 0.9); /* Naranja KOR */
}
```

---

### 2. `script-v2-clean.js`

**Líneas modificadas**: 405-531

**Función `cargarCarrusel()` actualizada**:
```javascript
// Agregar click en imagen principal
mainImg.onclick = () => {
    abrirLightbox(imagenes, currentIndex, nombreProducto);
};
```

**Nueva función `abrirLightbox()`**:
```javascript
function abrirLightbox(imagenes, indiceInicial, nombreProducto) {
    // Elementos del lightbox
    const lightbox = document.getElementById('imageLightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxCounter = document.getElementById('lightboxCounter');

    let currentIndex = indiceInicial;

    // Función para mostrar imagen en HD
    const mostrarImagen = (index) => {
        lightboxImg.src = DirectusAPI.getAssetURL(
            imagenes[index].imagen,
            '?width=1920&height=1080&fit=contain' // HD
        );
        lightboxCounter.textContent = `${index + 1} / ${imagenes.length}`;
    };

    // Mostrar lightbox
    lightbox.style.display = 'flex';
    mostrarImagen(currentIndex);

    // Navegación con botones
    lightboxPrev.onclick = (e) => {
        e.stopPropagation();
        currentIndex = (currentIndex - 1 + imagenes.length) % imagenes.length;
        mostrarImagen(currentIndex);
    };

    // Navegación con teclado
    const handleKeyboard = (e) => {
        if (e.key === 'Escape') cerrar();
        else if (e.key === 'ArrowLeft') lightboxPrev.click();
        else if (e.key === 'ArrowRight') lightboxNext.click();
    };

    document.addEventListener('keydown', handleKeyboard);
}
```

---

### 3. `index.html`

**Cambios**:
```html
<!-- Línea 9: Nuevo CSS incluido -->
<link rel="stylesheet" href="styles-modal-compact.css?v=1.0">

<!-- Línea 365: Script actualizado -->
<script src="script-v2-clean.js?v=2.2"></script>
```

El lightbox ya existía en el HTML (líneas 257-263), solo se activó con JavaScript.

---

## 🎨 Secciones con Colores Diferenciados

Para mejor visualización, cada sección tiene su color:

| Sección | Color | Gradiente |
|---------|-------|-----------|
| **Precios** | 🔴 Rojo | `#fd6600` → `#e05500` |
| **Especificaciones** | 🔵 Azul | `#007bff` → `#0056b3` |
| **Información Adicional** | 🟢 Verde | `#28a745` → `#1e7e34` |

---

## 📊 Optimizaciones de Font Sizes

Para que quepa más información sin scroll:

| Elemento | Antes | Después |
|----------|-------|---------|
| Título producto | 1.2em | 1em |
| Especificaciones | 0.7em | 0.65em |
| Precio principal | 1.8em | 1.5em |
| Descripciones | 0.9em | 0.8em |
| Miniaturas | 80px | 50px |

---

## 📱 Responsive

### Breakpoints

**1200px o menos**:
- Columna izquierda: 280px
- Imagen principal: 240x180px

**992px o menos** (tablets):
- Layout vertical (1 columna)
- Imagen principal: 200x150px
- Specs en 1 columna

---

## 🚀 Cómo Probar

1. **Refrescar navegador**: `Ctrl + Shift + R` (limpiar caché)
2. Abrir cualquier producto haciendo click en la tabla
3. **Modal compacto**: La imagen ahora es más pequeña, info más grande
4. **Click en imagen**: Se abre lightbox con zoom
5. **Navegar**: Usar flechas laterales o teclado (← →)
6. **Cerrar**: Click en X, fuera de imagen, o ESC

---

## ✅ Checklist de Funcionalidades

- [x] Sección de imágenes reducida a ~30%
- [x] Sección de info ampliada a ~70%
- [x] Imagen principal clickeable
- [x] Lightbox con imágenes HD
- [x] Navegación con flechas laterales
- [x] Navegación con teclado
- [x] Contador de imágenes
- [x] Múltiples formas de cerrar
- [x] Efectos hover en botones
- [x] Todo visible sin scroll
- [x] Responsive design

---

## 🎁 Ventajas

✅ **Más información visible**: Sin scroll necesario
✅ **Mejor UX**: Zoom profesional tipo ecommerce
✅ **Imágenes HD**: 1920x1080 en lightbox
✅ **Navegación intuitiva**: Flechas + teclado
✅ **Accesibilidad**: ESC para cerrar
✅ **Performance**: CSS optimizado con `!important`
✅ **Consistencia**: Colores KOR (#fd6600)

---

## 🔜 Posibles Mejoras Futuras

- [ ] Zoom adicional con rueda del mouse
- [ ] Gestos táctiles (swipe) en móviles
- [ ] Thumbnails en el lightbox
- [ ] Transición animada de entrada/salida
- [ ] Lazy loading de imágenes HD
- [ ] Botón de descarga de imagen

---

**Versión:** 2.2
**Autor:** Claude Code
**Fecha:** Noviembre 2025
**Estado:** ✅ Completado y testeado
