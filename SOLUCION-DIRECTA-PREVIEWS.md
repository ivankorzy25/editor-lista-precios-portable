# 🎯 SOLUCIÓN DIRECTA: Ver Previews de Imágenes

## ✅ Método 1: Table Layout (MÁS FÁCIL)

1. En Directus, ve a **Content** → **Producto Imagenes**
2. Asegúrate de estar en layout **Table** (ícono de tabla arriba derecha)
3. Deberías ver las columnas:
   - id
   - producto_id
   - **imagen** ← miniatura aquí
   - orden
   - es_principal

### Si no ves la miniatura en la columna `imagen`:

1. Click derecho en el header de la columna `imagen`
2. Selecciona **Display Options**
3. Cambia a **Image**
4. Las miniaturas deberían aparecer

---

## ✅ Método 2: File Library (VER TODAS LAS IMÁGENES)

La forma más directa de ver las imágenes:

1. Click en **File Library** 📁 (menú lateral izquierdo)
2. Verás TODAS las imágenes subidas con previews
3. Puedes filtrar por tipo: **Images**
4. Click en cualquier imagen para ver detalles

---

## ✅ Método 3: Abrir Producto Individual

1. En **Content** → **Producto Imagenes**
2. Click en cualquier fila (cualquier producto)
3. Se abre el editor
4. En el campo **`imagen`**, deberías ver el preview de la imagen
5. Si ves solo el UUID, click en el UUID
6. Se abrirá el selector de archivos con preview

---

## ✅ Método 4: Cards con Configuración Manual

Si querés usar Cards obligatoriamente:

1. Ve a **Content** → **Producto Imagenes**
2. URL debería ser: `localhost:8055/admin/content/producto_imagenes`
3. Cambia manualmente la URL a:
   ```
   localhost:8055/admin/content/producto_imagenes?layout=cards
   ```
4. Presiona Enter

5. Si sale el panel lateral "Opciones de diseño":
   - En **"Origen de la imagen"**, NO uses el dropdown
   - En cambio, **escribe manualmente**: `imagen`
   - Presiona Enter o Tab

6. En **"Título"**, escribe: `{{producto_id.nombre}}`
7. En **"Subtítulo"**, escribe: `{{orden}}`

---

## 🔍 Verificar que las Imágenes Existen

### Opción A: Via File Library

1. **File Library** 📁
2. Deberías ver las imágenes subidas
3. Si no hay imágenes, necesitás subirlas primero

### Opción B: Via API

Desde una nueva pestaña del navegador:
```
http://localhost:8055/items/producto_imagenes
```

Deberías ver JSON con los registros. Ejemplo:
```json
{
  "data": [
    {
      "id": 1,
      "producto_id": 1,
      "imagen": "a1b2c3d4-uuid-aqui",
      "orden": 1,
      "es_principal": true
    }
  ]
}
```

Si ves datos, las imágenes están bien asociadas.

---

## 📊 Checklist de Diagnóstico

- [ ] File Library muestra las imágenes subidas
- [ ] Table layout muestra la columna `imagen`
- [ ] Al abrir un producto individual, se ve el campo imagen
- [ ] La API retorna datos en `/items/producto_imagenes`

Si TODO lo anterior funciona, el problema es solo el layout de Cards, y podés usar Table sin problemas.

---

## 💡 Recomendación Personal

**Usa Table Layout** - Es más confiable y muestra toda la información de forma clara:

```
┌────┬──────────────┬──────────┬───────┬─────────────┐
│ ID │ Producto     │ Imagen   │ Orden │ Principal   │
├────┼──────────────┼──────────┼───────┼─────────────┤
│ 1  │ Gen XYZ      │ [IMG]    │ 1     │ ✓           │
│ 2  │ Gen XYZ      │ [IMG]    │ 2     │             │
│ 3  │ Gen ABC      │ [IMG]    │ 1     │ ✓           │
└────┴──────────────┴──────────┴───────┴─────────────┘
```

Cards es más bonito pero Table es más funcional para administración.

---

## 🚀 Siguiente Paso Inmediato

1. Abrí **File Library** 📁
2. ¿Ves las imágenes?
   - **SÍ**: Las imágenes están subidas, el problema es solo el display
   - **NO**: Necesitás subir las imágenes primero

---

**TIP**: Si File Library está vacío, primero subí algunas imágenes:
1. File Library → Click en **+** (arriba derecha)
2. Arrastrá imágenes
3. Subir
4. Luego asocialas en **Producto Imagenes**

