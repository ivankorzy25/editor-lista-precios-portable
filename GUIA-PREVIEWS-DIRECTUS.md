# 🖼️ GUÍA: Configurar Previews de Imágenes en Directus

## 🎯 Problema

En la colección `producto_imagenes`, solo se ven iconos de cajas 📦 en lugar de las imágenes reales.

---

## ✅ Solución: Configurar Display Template

### Paso 1: Ir a Configuración del Campo

1. Abre Directus: `http://localhost:8055`
2. Ve a **Settings** ⚙️ (esquina inferior izquierda)
3. Click en **Data Model**
4. Selecciona la colección **`producto_imagenes`**
5. Click en el campo **`imagen`** (el que tiene la relación a `directus_files`)

---

### Paso 2: Configurar Display

En la pestaña **Display**, configura:

#### Opción A: Display como Image (Recomendado)

```
Interface: File
Display: Image
```

**Opciones avanzadas**:
- **Circle**: No (dejar cuadrado)
- **Width**: 100px
- **Height**: 100px

#### Opción B: Display como Related Values

```
Display: Related Values
Display Template: {{imagen.title}} - {{imagen.type}}
```

Pero esto solo muestra texto, no la imagen.

---

### Paso 3: Configurar la Vista de Colección

1. Estando en **Content** → **Producto Imagenes**
2. Click en el ícono de opciones (3 puntos) arriba a la derecha
3. Selecciona **Layout Options**
4. Cambia el layout:
   - **Cards**: Mejor para ver imágenes
   - **Grid**: Segunda opción

---

### Paso 4: Configurar Card Layout (Recomendado)

Si elegiste **Cards**:

1. Click en **Layout Options** nuevamente
2. En **Card Layout**, configura:
   - **Image Source**: Selecciona `imagen`
   - **Title**: Selecciona `producto_id.nombre`
   - **Subtitle**: Selecciona `orden`

Ahora verás las imágenes como tarjetas con preview.

---

## 🎨 Opción Alternativa: Configurar desde Colección

### Método Rápido

1. En **Content** → **Producto Imagenes**
2. Click en el ícono **Cards** (arriba derecha, junto a Grid)
3. Se abrirá un panel lateral
4. Configura:

```
┌─────────────────────────────────────┐
│ CARD OPTIONS                        │
├─────────────────────────────────────┤
│ Image Source: imagen                │
│ Title: producto_id (Productos)      │
│ Subtitle: orden                     │
│ Image Fit: Cover                    │
└─────────────────────────────────────┘
```

---

## 📊 Vista Table con Thumbnail

Si preferís la vista **Table**:

1. Click en **Table** layout
2. Click en **⚙️** (opciones de columna)
3. Asegúrate que la columna `imagen` esté visible
4. La columna debería mostrar una miniatura automáticamente

---

## 🔧 Configuración Avanzada del Campo `imagen`

### Ir a Data Model

1. **Settings** → **Data Model** → **producto_imagenes**
2. Campo **`imagen`**

### Configurar Interface

```
Field Type: UUID
Interface: File
Special: File
```

### Configurar Display

```
Display: Image
Display Options:
  - Circle: false
  - Fit: cover
  - Width: 100
  - Height: 100
```

### Configurar Relationship

```
Related Collection: directus_files
Display Template: {{title}} ({{type}})
```

---

## 🖼️ Ejemplo Visual Esperado

### Antes (Iconos de Cajas)
```
┌─────┬─────┬─────┬─────┐
│ 📦  │ 📦  │ 📦  │ 📦  │
│ ID:1│ ID:2│ ID:3│ ID:4│
└─────┴─────┴─────┴─────┘
```

### Después (Imágenes Reales)
```
┌─────────┬─────────┬─────────┬─────────┐
│ [IMG]   │ [IMG]   │ [IMG]   │ [IMG]   │
│ Gen 1   │ Gen 2   │ Gen 3   │ Gen 4   │
│ Orden:1 │ Orden:2 │ Orden:3 │ Orden:4 │
└─────────┴─────────┴─────────┴─────────┘
```

---

## 🚀 Configuración Rápida por URL

Para aplicar layout de cards directamente:

```
http://localhost:8055/admin/content/producto_imagenes?layout=cards
```

---

## ⚡ Script de Configuración Automática

Crear un script para configurar el display automáticamente:

```javascript
// configure-display.js
const COLLECTION = 'producto_imagenes';
const FIELD = 'imagen';

const displayConfig = {
    display: 'image',
    display_options: {
        circle: false,
        fit: 'cover'
    }
};

// Actualizar via API
fetch(`${DIRECTUS_URL}/fields/${COLLECTION}/${FIELD}`, {
    method: 'PATCH',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ACCESS_TOKEN}`
    },
    body: JSON.stringify({ meta: displayConfig })
});
```

---

## 🔍 Verificar Imágenes Subidas

Para ver las imágenes en **File Library**:

1. Ve a **File Library** (📁 en el menú lateral)
2. Deberías ver todas las imágenes subidas
3. Click en cualquier imagen para ver detalles
4. Verifica que el campo **Type** sea `image/jpeg` o `image/png`

---

## 💡 Tips Adicionales

### Ver Imagen Individual

1. En **Producto Imagenes**, click en cualquier registro
2. El campo `imagen` debería mostrar un preview
3. Click en el preview para abrir en tamaño completo

### Filtrar por Producto

Para ver solo imágenes de un producto específico:

```
URL: /admin/content/producto_imagenes?filter[producto_id][_eq]=1
```

O usa el filtro visual:
1. Click en **Filter** (icono de embudo)
2. Agrega regla: `producto_id` → `equals` → `1`

---

## ⚙️ Troubleshooting

### No se ven las imágenes

1. **Verificar permisos públicos**:
   ```bash
   node test-permissions.js
   ```

2. **Verificar que las imágenes existen**:
   - Ve a **File Library**
   - Busca las imágenes subidas

3. **Regenerar thumbnails** (si es necesario):
   ```bash
   # Desde directus-local/
   docker-compose exec directus npx directus thumbnails generate
   ```

### Imágenes muy grandes/pequeñas

Ajusta el tamaño en **Display Options**:
- Width: 150px (para más grande)
- Width: 50px (para más pequeño)

---

## 📋 Checklist Final

- [ ] Campo `imagen` configurado con Display: Image
- [ ] Layout de colección en Cards o Grid
- [ ] Card Options configurado (Image Source = imagen)
- [ ] File Library muestra las imágenes
- [ ] Permisos públicos configurados
- [ ] Imágenes visibles en frontend

---

## 🎯 Resultado Esperado

Después de configurar, en **Content** → **Producto Imagenes** deberías ver:

```
┌───────────────────┬───────────────────┬───────────────────┐
│ [Imagen Preview]  │ [Imagen Preview]  │ [Imagen Preview]  │
│ Generador XYZ     │ Generador ABC     │ Motor 123         │
│ Orden: 1          │ Orden: 2          │ Orden: 1          │
│ ⭐ Principal      │                   │                   │
└───────────────────┴───────────────────┴───────────────────┘
```

---

**Nota**: Si después de estos pasos aún no se ven las imágenes, puede ser que necesites recargar Directus con `Ctrl+Shift+R`.

---

**Autor**: Claude Code
**Fecha**: Noviembre 2025
**Directus Version**: 10.x
