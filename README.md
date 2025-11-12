# EDITOR PORTÁTIL LISTA DE PRECIOS V2

**Sistema de catálogo portable con Directus CMS**

## 🎯 ¿Qué es la V2?

La V2 es un rediseño completo de la arquitectura donde **Directus funciona como CMS real**, administrando todos los productos, imágenes y archivos en una base de datos profesional.

### Diferencias V1 vs V2

| Aspecto | V1 (Anterior) | V2 (Nuevo) |
|---------|---------------|------------|
| **Datos** | Estáticos en HTML | Base de datos Directus |
| **Imágenes** | Carpetas dispersas | Directus Files centralizad o |
| **Gestión** | Manual en código | Interfaz admin Directus |
| **Búsqueda** | No disponible | Búsqueda avanzada Directus |
| **API** | No | API REST completa |
| **Escalabilidad** | Limitada | Profesional |

## 🚀 Inicio Rápido

### Prerrequisitos

- Docker Desktop instalado y corriendo
- Node.js instalado (v16 o superior)
- Windows 10/11

### Paso 1: Iniciar Directus

```bash
# Opción A: Usar el launcher
node launcher.js

# Opción B: Manual
cd directus-local
docker-compose up -d
```

Esperar a que Directus esté listo (30-60 segundos).

### Paso 2: Configurar Directus

```bash
# Ejecutar setup automático
node setup-directus-auto.js
```

Este script creará automáticamente:
- ✅ Colección `productos`
- ✅ Colección `imagenes_producto`
- ✅ Colección `archivos_producto`
- ✅ Relaciones entre colecciones
- ✅ Datos de prueba (opcional)

### Paso 3: Configurar Permisos Públicos

1. Abrir Directus Admin: http://localhost:8055
2. Login: `admin@example.com` / `kor2025`
3. Ir a **Settings** > **Roles & Permissions**
4. Click en **Public**
5. Para cada colección activar permiso **Read**
6. Guardar

### Paso 4: Abrir la Aplicación

Simplemente abrir `index.html` en el navegador. La aplicación cargará productos desde Directus automáticamente.

## 📁 Estructura de Archivos

```
EDITOR PORTATIL LISTA DE PRECIOS V2/
├── index.html                    # Interfaz visual
├── styles.css                    # Estilos
├── script.js                     # JavaScript con API de Directus
├── auto-login.js                 # Login automático
├── launcher.js                   # Inicia Docker + Directus + System API
├── system-api.js                 # API para abrir carpetas
├── setup-directus-auto.js        # Setup automático de Directus
├── package.json                  # Dependencias Node.js
├── .gitignore                    # Archivos ignorados
├── directus-local/               # Instancia Directus portable
│   ├── docker-compose.yml        # Configuración Docker
│   ├── uploads/                  # Archivos subidos
│   └── database/                 # Base de datos SQLite
├── ARQUITECTURA-V2.md            # Documentación arquitectura
├── SETUP-DIRECTUS.md             # Guía de configuración detallada
└── directus-schema.json          # Esquema de colecciones
```

## 🎨 Uso de la Aplicación

### Ver Productos

Al abrir `index.html`, se cargan automáticamente todos los productos activos desde Directus.

### Ver Detalles de un Producto

Click en "Ver Detalles" de cualquier producto abre un modal con:
- Carrusel de imágenes
- Botón "Editar Imágenes"
- Botón "Editar Archivos"

### Editar Imágenes

1. Click en "✏️ Editar Imágenes"
2. Funciones disponibles:
   - **📁 Agregar Imágenes**: Subir nuevas imágenes desde PC
   - **🗑️ Eliminar Seleccionadas**: Eliminar imágenes marcadas
   - **📂 Abrir Carpeta**: Abrir carpeta de uploads en Explorer
3. Los cambios se guardan automáticamente en Directus

### Editar Archivos

1. Click en "📎 Editar Archivos"
2. Funciones disponibles:
   - **📁 Agregar Archivos**: Subir PDFs, docs, etc.
   - **🗑️ Eliminar Seleccionados**: Eliminar archivos marcados
   - **📂 Abrir Carpeta**: Abrir carpeta de uploads en Explorer
3. Los cambios se guardan automáticamente en Directus

## 🔧 Administración Avanzada con Directus

### Acceder al Panel Admin

- URL: http://localhost:8055
- Login: `admin@example.com` / `kor2025`

### Gestionar Productos

1. En Directus Admin, ir a **Content** > **Productos**
2. Funciones disponibles:
   - Crear nuevo producto
   - Editar producto existente
   - Cambiar estado (activo/inactivo)
   - Cambiar orden de visualización
   - Eliminar producto

### Gestionar Imágenes de Producto

1. Ir a **File Library** y subir imágenes
2. Ir a **Content** > **Imágenes Producto**
3. Crear nueva relación:
   - Seleccionar producto
   - Seleccionar archivo de imagen
   - Definir orden en carrusel
   - Marcar como principal (opcional)

### Búsqueda y Filtros

Directus incluye búsqueda y filtros avanzados en todas las colecciones:
- Buscar productos por nombre
- Filtrar por categoría
- Filtrar por estado
- Ordenar por cualquier campo

## 📊 API REST de Directus

La V2 expone una API REST completa para integración externa:

### Listar Productos

```bash
GET http://localhost:8055/items/productos
```

### Obtener Producto con Imágenes

```bash
GET http://localhost:8055/items/productos/1?fields=*,imagenes.archivo_id.*
```

### Crear Producto

```bash
POST http://localhost:8055/items/productos
Content-Type: application/json

{
  "nombre": "Nuevo Producto",
  "descripcion": "Descripción del producto",
  "categoria": "generadores",
  "estado": "active",
  "orden": 10
}
```

Ver [ARQUITECTURA-V2.md](ARQUITECTURA-V2.md) para documentación completa de API.

## 💾 Backup y Restauración

### Hacer Backup

```bash
# Copiar toda la carpeta directus-local
cp -r directus-local directus-local-backup-$(date +%Y%m%d)
```

### Restaurar Backup

```bash
# Detener Directus
cd directus-local
docker-compose down

# Restaurar archivos
rm -rf database uploads
cp -r ../directus-local-backup-YYYYMMDD/database ./
cp -r ../directus-local-backup-YYYYMMDD/uploads ./

# Reiniciar
docker-compose up -d
```

## 🐛 Troubleshooting

### Error: Directus no inicia

```bash
# Ver logs
cd directus-local
docker-compose logs -f

# Reiniciar
docker-compose restart
```

### Error: No se cargan productos

1. Verificar que Directus esté corriendo: http://localhost:8055/server/health
2. Verificar permisos públicos en Settings > Roles & Permissions
3. Abrir consola del navegador (F12) y ver errores

### Error: CORS

Si hay error de CORS, editar `directus-local/docker-compose.yml`:

```yaml
environment:
  CORS_ENABLED: 'true'
  CORS_ORIGIN: '*'
```

Luego reiniciar: `docker-compose restart`

### Error: No se pueden subir archivos

```bash
# Verificar permisos de carpeta uploads
chmod -R 777 directus-local/uploads/
```

## 📚 Documentación Adicional

- [ARQUITECTURA-V2.md](ARQUITECTURA-V2.md) - Arquitectura detallada y flujo de datos
- [SETUP-DIRECTUS.md](SETUP-DIRECTUS.md) - Configuración manual paso a paso
- [Documentación oficial de Directus](https://docs.directus.io/)

## 🆚 Migración de V1 a V2

Si tenés datos en V1, podés migrarlos a V2:

1. Exportar productos de V1 (desde el HTML)
2. Importarlos en Directus vía script o manualmente
3. Copiar imágenes y archivos a `directus-local/uploads/`
4. Crear relaciones en Directus

(Script de migración automática en desarrollo)

## 🎁 Distribución Portable

Para distribuir la aplicación completa:

1. Crear ejecutable:
   ```bash
   npm install -g pkg
   pkg launcher.js --targets node18-win-x64 --output "KOR-Generadores-V2.exe"
   ```

2. Incluir en la distribución:
   - `KOR-Generadores-V2.exe`
   - Carpeta `directus-local/`
   - `index.html`, `styles.css`, `script.js`
   - `system-api.js`, `auto-login.js`
   - Logos e imágenes estáticas

3. El usuario solo ejecuta `KOR-Generadores-V2.exe`

## 🔄 Actualizaciones

Para actualizar Directus a la última versión:

```bash
cd directus-local
docker-compose pull
docker-compose up -d
```

## 📞 Soporte

Para problemas o preguntas:
- Revisar documentación en `ARQUITECTURA-V2.md` y `SETUP-DIRECTUS.md`
- Revisar logs de Directus: `docker-compose logs -f`
- Consultar documentación oficial: https://docs.directus.io/

## 📝 Licencia

Proyecto interno - KOR Generadores

---

**Versión:** 2.0.0
**Fecha:** Noviembre 2025
**Powered by:** Directus CMS + Docker
