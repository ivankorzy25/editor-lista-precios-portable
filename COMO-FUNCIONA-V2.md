# 📘 CÓMO FUNCIONA LA V2 - GUÍA COMPLETA

## 🎯 Resumen

La V2 es un sistema **100% basado en Directus CMS** donde:
- ✅ Los productos se gestionan desde Directus Admin
- ✅ Las pestañas se generan automáticamente según categorías
- ✅ Las imágenes y archivos se gestionan desde Directus
- ✅ Los botones abren Directus directamente (sin editores inline)

---

## 🗂️ Estructura en Directus

### Colecciones:

1. **`productos`**
   - `id` (int, auto)
   - `nombre` (string, único)
   - `modelo` (string)
   - `descripcion` (text)
   - `precio` (decimal)
   - `categoria` (string) ← **IMPORTANTE para pestañas**
   - `orden` (int)

2. **`producto_imagenes`**
   - `id` (int, auto)
   - `producto_id` (relación a `productos`)
   - `imagen` (relación a `directus_files`)
   - `orden` (int)
   - `es_principal` (boolean)

3. **`archivos_producto`** ← NUEVA
   - `id` (int, auto)
   - `producto_id` (relación a `productos`)
   - `archivo_id` (relación a `directus_files`)
   - `tipo` (string: pdf, doc, xls, txt, html, json, otro)
   - `descripcion` (text)

---

## 🔄 Flujo de Trabajo

### 1. Agregar un Producto Nuevo

```
1. Abrí Directus: http://localhost:8055
2. Ir a Content → Productos
3. Click en "+" (Crear)
4. Completar:
   - Nombre: "Generador XYZ 5000W"
   - Modelo: "XYZ5000"
   - Descripción: "..."
   - Precio: 500
   - Categoría: "generadores-nafta" ← Elegir de la lista
   - Orden: 10
5. Guardar
```

**Resultado:**
- ✅ El producto aparece automáticamente en la tabla
- ✅ La pestaña "Generadores Nafta" se crea si no existe
- ✅ El producto se muestra en orden según el campo `orden`

### 2. Agregar Imágenes a un Producto

```
1. En Directus, ir a File Library
2. Subir imágenes (drag & drop)
3. Ir a Content → Imágenes Producto
4. Click en "+" (Crear)
5. Completar:
   - Producto: "Generador XYZ 5000W" (seleccionar)
   - Archivo: (seleccionar imagen subida)
   - Orden: 1
   - Es principal: true (para la primera imagen)
6. Guardar
```

**Resultado:**
- ✅ La miniatura aparece en la tabla
- ✅ La imagen se muestra en el carrusel del modal
- ✅ Se puede navegar con flechas

### 3. Agregar PDF o Archivos

```
1. En Directus, ir a File Library
2. Subir archivo PDF
3. Ir a Content → Archivos Producto
4. Click en "+" (Crear)
5. Completar:
   - Producto: "Generador XYZ 5000W"
   - Archivo: (seleccionar PDF subido)
   - Tipo: "pdf"
   - Descripción: "Ficha técnica"
6. Guardar
```

**Resultado:**
- ✅ El botón "Ver PDF" funciona en el modal
- ✅ Se abre el PDF en nueva pestaña

---

## 🖱️ Botones en el Modal

Cuando hacés click en un producto, se abre un modal con:

### 📸 Carrusel de Imágenes
- Muestra todas las imágenes del producto
- Navegación con flechas
- Miniaturas clickeables

### 🔘 Botones de Acceso a Directus:

1. **"Ver PDF"**
   - Si hay un PDF asociado, lo abre en nueva pestaña
   - Si no hay, muestra alerta

2. **"🖼️ Ver/Editar Imágenes en Directus"**
   - Abre Directus en la colección `producto_imagenes`
   - Filtrado automáticamente para ese producto
   - URL: `http://localhost:8055/admin/content/producto_imagenes?filter[producto_id][_eq]=1`

3. **"📎 Ver/Editar Archivos en Directus"**
   - Abre Directus en la colección `archivos_producto`
   - Filtrado automáticamente para ese producto
   - URL: `http://localhost:8055/admin/content/archivos_producto?filter[producto_id][_eq]=1`

---

## 🏷️ Categorías Disponibles

Las pestañas se crean automáticamente según la categoría del producto:

| Categoría | Pestaña que genera | Icono |
|-----------|-------------------|-------|
| `generadores-nafta` | Generadores Nafta | ⚡ |
| `generadores-diesel` | Generadores Diesel | 🔌 |
| `inverter` | Inverter | 🔋 |
| `motores` | Motores | ⚙️ |
| `motocultivadores` | Motocultivadores | 🚜 |
| `construccion` | Construcción | 🏗️ |
| `compresores` | Compresores | 💨 |
| `torres` | Torres Iluminación | 💡 |
| `alquiler` | Alquiler | 🏢 |

**Agregar nueva categoría:**
1. Ir a Directus Admin
2. Settings → Data Model → productos
3. Click en campo `categoria`
4. Agregar nueva opción en las choices
5. Agregar configuración en `script-v2-clean.js` (opcional para icono personalizado)

---

## 🔧 Scripts Útiles

### Configurar permisos públicos:
```bash
node configure-permissions-with-token.js
```

### Agregar campo categoría:
```bash
node add-categoria-field.js
```

### Crear colección archivos:
```bash
node crear-coleccion-archivos.js
```

### Verificar permisos:
```bash
node test-permissions.js
```

---

## 🐛 Troubleshooting

### No se ven productos
1. Verificá permisos públicos: `node test-permissions.js`
2. Abrí consola (F12) para ver errores
3. Verificá que los productos tengan categoría asignada

### No se ven imágenes
1. Verificá que existan en `producto_imagenes`
2. Verificá permisos públicos de `directus_files`
3. Comprobá URL de imagen en consola (F12)

### Botón PDF no funciona
1. Verificá que exista archivo en `archivos_producto`
2. El campo `tipo` debe ser "pdf"
3. El archivo debe estar relacionado al producto correcto

### Pestaña no aparece
1. Verificá que el producto tenga campo `categoria`
2. La categoría debe coincidir con las configuradas
3. Refrescá la página (Ctrl+F5)

---

## 📊 Diagrama de Flujo

```
┌─────────────────────┐
│  index.html se      │
│  carga en navegador │
└──────────┬──────────┘
           │
           v
┌─────────────────────┐
│  script-v2-clean.js │
│  se ejecuta         │
└──────────┬──────────┘
           │
           v
┌─────────────────────┐
│  Fetch productos    │
│  desde Directus API │
└──────────┬──────────┘
           │
           v
┌─────────────────────┐
│  Agrupar por        │
│  categoría          │
└──────────┬──────────┘
           │
           v
┌─────────────────────┐
│  Generar pestañas   │
│  dinámicamente      │
└──────────┬──────────┘
           │
           v
┌─────────────────────┐
│  Renderizar tablas  │
│  con productos      │
└──────────┬──────────┘
           │
           v
┌─────────────────────┐
│  Cargar miniaturas  │
│  en background      │
└─────────────────────┘
```

---

## 🎁 Ventajas de la V2

- ✅ **Sin código hardcodeado**: Todo en base de datos
- ✅ **Gestión centralizada**: Un solo lugar (Directus) para todo
- ✅ **Escalable**: Agregá categorías sin tocar código
- ✅ **Búsqueda y filtros**: Gratis con Directus
- ✅ **API REST completa**: Integración con otros sistemas
- ✅ **Portable**: Carpeta `directus-local/` contiene todo
- ✅ **Backups fáciles**: Copiá la carpeta `directus-local/`

---

## 📝 Próximos Pasos

1. Importar productos de V1 a V2
2. Subir todas las imágenes a Directus
3. Asociar PDFs a productos
4. Configurar campos adicionales (potencia, motor, etc.)
5. Personalizar precios y márgenes

---

**Versión:** 2.0.0
**Fecha:** Noviembre 2025
**Tecnología:** Directus CMS + JavaScript Vanilla
