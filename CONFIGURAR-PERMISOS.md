# 🔓 CONFIGURAR PERMISOS PÚBLICOS - GUÍA VISUAL

## ⚠️ IMPORTANTE
Sin estos permisos, vas a seguir viendo el error 403 y la página no va a cargar productos de Directus.

## 📋 Pasos (5 clicks, 2 minutos)

### 1. Abrir Directus Admin
- URL: http://localhost:8055
- Ya deberías estar logueado

### 2. Ir a Settings (⚙️)
- En la barra lateral izquierda, hasta abajo
- Click en el ícono de **engranaje** (⚙️)
- O buscar la palabra **"Settings"**

### 3. Abrir Roles & Permissions
- En el menú de Settings, click en **"Roles & Permissions"**
- Vas a ver una lista de roles (Admin, Public, etc.)

### 4. Editar el rol Public
- Click en la fila **"Public"**
- Se abre una pantalla con una tabla de colecciones

### 5. Activar permisos de lectura
Para cada una de estas colecciones, activá el ícono del **ojo** (👁️):

| Colección | Permiso a Activar |
|-----------|-------------------|
| `productos` | 👁️ (ojo) = Read |
| `producto_imagenes` | 👁️ (ojo) = Read |
| `directus_files` | 👁️ (ojo) = Read |

**Cómo se ve:**
- Antes: ⚪ (círculo vacío) o ❌ (sin permiso)
- Después: 👁️ (ojo azul/activo) = ✅

### 6. Guardar
- Click en el **checkmark** (✓) arriba a la derecha
- O click en **"Save"**

## ✅ Verificar que funcionó

1. Volvé a `index.html`
2. Presioná **F5** para refrescar
3. Abrí la consola (F12)
4. Deberías ver:
   ```
   📦 Cargando productos desde Directus...
   ✅ 1 productos cargados (antes decía 0)
   ```
5. En la página deberías ver el producto **"Logus GL3300AM"** con sus 10 imágenes

## 🐛 Si sigue sin funcionar

1. Verificá que el ojo (👁️) esté **azul/activo** para las 3 colecciones
2. Refrescá la página de Directus (F5)
3. Guardá de nuevo
4. Volvé a index.html y refrescá (F5)

## 📸 Capturas de Referencia

**Paso 2: Settings**
```
┌─────────────────┐
│ Directus        │
├─────────────────┤
│ Content         │
│ User Directory  │
│ File Library    │
│ Documentation   │
│ ⚙️ Settings     │ ← CLICK ACÁ
└─────────────────┘
```

**Paso 3: Roles & Permissions**
```
Settings Menu:
├─ Project Settings
├─ Data Model
├─ Roles & Permissions  ← CLICK ACÁ
├─ Presets
└─ Webhooks
```

**Paso 4-5: Activar permisos**
```
Public Role Permissions:

Collection         | Read | Create | Update | Delete
-------------------|------|--------|--------|--------
productos          |  👁️  |   ❌   |   ❌   |   ❌
producto_imagenes  |  👁️  |   ❌   |   ❌   |   ❌
directus_files     |  👁️  |   ❌   |   ❌   |   ❌

⚠️ Solo activar el ojo (👁️) en la columna "Read"
```

## 🎯 ¿Por qué es necesario?

La API de Directus por defecto es **privada**. Sin permisos públicos de lectura:
- ❌ GET requests devuelven 403 Forbidden
- ❌ La página no puede cargar productos
- ❌ Los archivos no se pueden mostrar

Con permisos públicos de lectura:
- ✅ La aplicación puede leer productos
- ✅ Puede leer imágenes asociadas
- ✅ Puede mostrar archivos
- 🔒 Pero NO puede crear/editar/eliminar (seguro)

---

**Siguiente paso después de configurar:** [README.md](README.md) → "Uso de la Aplicación"
