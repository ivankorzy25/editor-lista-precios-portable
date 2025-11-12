# 🚀 INICIO RÁPIDO - V2

## ✅ ¿Qué se completó?

He creado completamente la **VERSIÓN 2** del editor con arquitectura profesional usando Directus CMS.

### Archivos Creados

```
EDITOR PORTATIL LISTA DE PRECIOS V2/
├── ✅ README.md                    # Documentación principal completa
├── ✅ ARQUITECTURA-V2.md            # Arquitectura técnica detallada
├── ✅ SETUP-DIRECTUS.md             # Guía de configuración paso a paso
├── ✅ directus-schema.json          # Esquema de base de datos
├── ✅ setup-directus-auto.js        # Script de setup automático
├── ✅ script.js                     # JavaScript con API de Directus
├── ✅ index.html                    # Interfaz visual (copiada de V1)
├── ✅ styles.css                    # Estilos (copiados de V1)
├── ✅ auto-login.js                 # Login automático
├── ✅ launcher.js                   # Launcher portable
├── ✅ system-api.js                 # API para abrir carpetas
├── ✅ package.json                  # Configuración actualizada
├── ✅ .gitignore                    # Archivos ignorados
└── ✅ directus-local/               # Carpeta Directus (si existe de V1)
```

### Git Inicializado

- ✅ Repositorio git creado
- ✅ Commit inicial: `feat: Inicialización V2 con arquitectura Directus CMS`
- ✅ Tag: `v2.0.0`

## 🎯 Diferencias Clave V1 vs V2

| Concepto | V1 | V2 |
|----------|----|----|
| **Datos** | Estáticos en HTML | Base de datos Directus |
| **Imágenes** | Carpetas dispersas | Directus Files centralizado |
| **Gestión** | Manual en código | Interfaz admin profesional |
| **API** | No existe | API REST completa |
| **Búsqueda** | No | Búsqueda avanzada Directus |
| **Multi-usuario** | No | Sí, con permisos granulares |
| **Escalabilidad** | ~50 productos | Miles de productos |
| **Versionado** | Git del código | Historial de cambios en Directus |

## 📋 PRÓXIMOS PASOS

### 1️⃣ Instalar Dependencias

```bash
cd "EDITOR PORTATIL LISTA DE PRECIOS V2"
npm install
```

### 2️⃣ Verificar/Crear Directus Local

**Si copiaste directus-local de V1:**
```bash
cd directus-local
docker-compose up -d
```

**Si NO existe directus-local, crear uno nuevo:**

Crear archivo `directus-local/docker-compose.yml`:

```yaml
version: '3'
services:
  directus:
    image: directus/directus:latest
    ports:
      - 8055:8055
    volumes:
      - ./database:/directus/database
      - ./uploads:/directus/uploads
      - ./extensions:/directus/extensions
    environment:
      KEY: '255d861b-5ea1-5996-9aa3-922530ec40b1'
      SECRET: '6116487b-cda1-52c2-b5b5-c8022c45e263'
      ADMIN_EMAIL: 'admin@example.com'
      ADMIN_PASSWORD: 'kor2025'
      DB_CLIENT: 'sqlite3'
      DB_FILENAME: '/directus/database/data.db'
      WEBSOCKETS_ENABLED: 'true'
      CORS_ENABLED: 'true'
      CORS_ORIGIN: '*'
      PUBLIC_URL: 'http://localhost:8055'
```

Crear carpetas:
```bash
cd directus-local
mkdir database uploads extensions
```

Iniciar:
```bash
docker-compose up -d
```

### 3️⃣ Configurar Directus (Automático)

```bash
node setup-directus-auto.js
```

Este script creará:
- ✅ Colección `productos`
- ✅ Colección `imagenes_producto`
- ✅ Colección `archivos_producto`
- ✅ Relaciones entre colecciones
- ✅ Productos de prueba (opcional)

### 4️⃣ Configurar Permisos Públicos

1. Abrir http://localhost:8055
2. Login: `admin@generadores.ar` / `kor2025`
3. Ir a **Settings** → **Roles & Permissions**
4. Click en **Public**
5. Para cada colección (`productos`, `imagenes_producto`, `archivos_producto`):
   - ✅ Activar **Read**
   - ✅ Seleccionar todos los campos
6. Para `directus_files`:
   - ✅ Activar **Read**
7. **Guardar**

### 5️⃣ Probar la Aplicación

Abrir `index.html` en el navegador.

**Deberías ver:**
- Grid de productos cargados desde Directus
- Click en producto → modal con carrusel
- Botones "Editar Imágenes" y "Editar Archivos" funcionando

## 🎨 Funcionalidades Disponibles

### Desde la Aplicación (index.html)

1. **Ver Catálogo**: Grid de productos con imágenes
2. **Ver Producto**: Modal con carrusel de imágenes
3. **Editar Imágenes**:
   - Subir nuevas imágenes
   - Eliminar imágenes
   - Abrir carpeta de uploads
4. **Editar Archivos**:
   - Subir PDFs, docs, etc.
   - Eliminar archivos
   - Abrir carpeta de uploads

### Desde Directus Admin (http://localhost:8055)

1. **Gestión de Productos**:
   - Crear/Editar/Eliminar productos
   - Cambiar estado (activo/inactivo)
   - Ordenar productos
   - Buscar y filtrar

2. **Gestión de Imágenes**:
   - Subir imágenes a File Library
   - Asociar imágenes a productos
   - Definir orden en carrusel
   - Marcar imagen principal

3. **Gestión de Archivos**:
   - Subir archivos (PDF, DOC, XLS, etc.)
   - Asociar archivos a productos
   - Categorizar por tipo

## 📊 Flujo de Trabajo Recomendado

### Para Agregar un Nuevo Producto:

**Opción A: Desde Directus Admin (Recomendado)**

1. Ir a http://localhost:8055
2. Content → Productos → Create Item
3. Llenar datos del producto
4. Guardar
5. File Library → Upload imágenes
6. Content → Imágenes Producto → Create Item
7. Asociar imagen con producto
8. Repetir para todas las imágenes

**Opción B: Desde la Aplicación**

1. Crear producto vía API o Directus Admin primero
2. Abrir index.html
3. Click en el producto
4. "Editar Imágenes" → Subir imágenes
5. "Editar Archivos" → Subir PDFs

## 🔄 Migración de Datos V1 → V2

Si tenés productos en la V1, necesitarás:

1. **Exportar productos de V1**:
   - Extraer datos del HTML
   - O crear JSON con los ~200 productos

2. **Importar en V2**:
   ```bash
   # Crear script de migración (próximamente)
   node migrate-v1-to-v2.js
   ```

3. **Copiar archivos**:
   - Imágenes: Copiar a `directus-local/uploads/`
   - PDFs: Copiar a `directus-local/uploads/`

4. **Crear relaciones en Directus**:
   - Via script o manualmente
   - Asociar cada imagen/archivo con su producto

## 🎁 Crear Ejecutable Portable

Una vez todo configurado y probado:

```bash
# Instalar pkg globalmente
npm install -g pkg

# Crear ejecutable
npm run build
```

Esto genera `KOR-Generadores-V2.exe` que incluye todo.

## 📚 Documentación

- **[README.md](README.md)**: Documentación general
- **[ARQUITECTURA-V2.md](ARQUITECTURA-V2.md)**: Detalles técnicos
- **[SETUP-DIRECTUS.md](SETUP-DIRECTUS.md)**: Setup manual detallado
- **[Directus Docs](https://docs.directus.io/)**: Documentación oficial

## ❓ Preguntas Frecuentes

### ¿Por qué usar Directus?

- ✅ CMS profesional y completo
- ✅ API REST automática
- ✅ Interfaz admin incluida
- ✅ Búsqueda y filtros avanzados
- ✅ Sistema de permisos
- ✅ Historial de cambios
- ✅ Escalable a miles de productos

### ¿Es portable?

Sí, toda la carpeta V2 es portable:
- Directus corre en Docker
- Base de datos SQLite local
- Todos los archivos en `directus-local/`
- Ejecutable único con pkg

### ¿Qué pasa con la V1?

La V1 sigue funcionando. La V2 es una nueva implementación que:
- Usa la misma interfaz visual (index.html)
- Cambia el motor backend a Directus
- Permite gestión profesional de contenido

Podés mantener ambas versiones o migrar completamente a V2.

### ¿Cómo hago backup?

```bash
# Backup completo
cp -r directus-local directus-local-backup-$(date +%Y%m%d)

# Restaurar
cd directus-local
docker-compose down
cp -r ../directus-local-backup-YYYYMMDD/* ./
docker-compose up -d
```

## 🐛 Troubleshooting

### No se cargan productos

1. ✅ Verificar Directus: http://localhost:8055/server/health
2. ✅ Verificar permisos públicos en Directus Admin
3. ✅ Abrir consola del navegador (F12) y ver errores
4. ✅ Verificar que existan productos en Content → Productos

### Error de CORS

Editar `directus-local/docker-compose.yml`:
```yaml
CORS_ENABLED: 'true'
CORS_ORIGIN: '*'
```

Reiniciar: `docker-compose restart`

### Directus no inicia

```bash
cd directus-local
docker-compose logs -f
```

Ver errores y resolver.

## ✨ Próximas Mejoras

- [ ] Script de migración automática V1 → V2
- [ ] Importador masivo de productos CSV/Excel
- [ ] Panel de estadísticas
- [ ] Sistema de categorías avanzado
- [ ] Búsqueda en tiempo real
- [ ] Filtros por categoría/precio
- [ ] Exportador de catálogo PDF

---

**¡La V2 está lista para usar!** 🎉

Seguí los pasos de arriba y en minutos tendrás un sistema de catálogo profesional con Directus.
