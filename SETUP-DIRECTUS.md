# SETUP DIRECTUS - CONFIGURACIÓN PASO A PASO

## Requisitos Previos

- Docker Desktop instalado y corriendo
- Node.js instalado (para launcher.js y system-api.js)
- Carpeta V2 con todos los archivos copiados

## Paso 1: Copiar Directus Local

Necesitás la carpeta `directus-local` de la V1 o crear una nueva:

### Opción A: Copiar de V1 (si ya tenés uno configurado)
```bash
# Desde la carpeta EDITOR LISTA DE PRECIOS PORTABLE
cp -r directus-local "../EDITOR PORTATIL LISTA DE PRECIOS V2/"
```

### Opción B: Crear uno nuevo desde cero
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

      ADMIN_EMAIL: 'admin@generadores.ar'
      ADMIN_PASSWORD: 'kor2025'

      DB_CLIENT: 'sqlite3'
      DB_FILENAME: '/directus/database/data.db'

      WEBSOCKETS_ENABLED: 'true'

      # CORS para permitir acceso desde file://
      CORS_ENABLED: 'true'
      CORS_ORIGIN: '*'
      CORS_METHODS: 'GET,POST,PATCH,DELETE'
      CORS_ALLOWED_HEADERS: 'Content-Type,Authorization'
      CORS_EXPOSED_HEADERS: 'Content-Range'
      CORS_CREDENTIALS: 'true'
      CORS_MAX_AGE: '18000'

      # Configuración de archivos
      STORAGE_LOCATIONS: 'local'
      STORAGE_LOCAL_DRIVER: 'local'
      STORAGE_LOCAL_ROOT: '/directus/uploads'

      # Public URL
      PUBLIC_URL: 'http://localhost:8055'
```

Crear carpetas necesarias:
```bash
cd "EDITOR PORTATIL LISTA DE PRECIOS V2/directus-local"
mkdir database uploads extensions
```

## Paso 2: Iniciar Directus

Desde la carpeta V2, ejecutar:

```bash
cd directus-local
docker-compose up -d
```

O usar el launcher.js:
```bash
node launcher.js
```

Esperar a que Directus esté listo (aprox. 30-60 segundos).

## Paso 3: Acceder a Directus Admin

1. Abrir navegador en: http://localhost:8055
2. Login:
   - Email: `admin@generadores.ar`
   - Password: `kor2025`

## Paso 4: Importar Esquema

### Opción A: Importación Manual via UI

1. En Directus Admin, ir a **Settings** > **Data Model**
2. Crear colección `productos`:
   - Click en "+" (New Collection)
   - Nombre: `productos`
   - Primary Key: `id` (integer, auto increment)
   - Agregar campos según `directus-schema.json`

3. Crear colección `imagenes_producto`:
   - Primary Key: `id`
   - Campo `producto_id`: Many-to-One a `productos`
   - Campo `archivo_id`: File (relación a `directus_files`)
   - Campo `orden`: Integer
   - Campo `es_principal`: Boolean

4. Crear colección `archivos_producto`:
   - Primary Key: `id`
   - Campo `producto_id`: Many-to-One a `productos`
   - Campo `archivo_id`: File (relación a `directus_files`)
   - Campo `tipo`: String (dropdown)
   - Campo `descripcion`: Text

### Opción B: Importación Automática via API

Ejecutar el siguiente script Node.js:

```javascript
// setup-directus.js
const fetch = require('node-fetch');

const DIRECTUS_URL = 'http://localhost:8055';
const EMAIL = 'admin@example.com';
const PASSWORD = 'kor2025';

async function setupDirectus() {
    // 1. Login
    const loginRes = await fetch(`${DIRECTUS_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: EMAIL, password: PASSWORD })
    });
    const { data: { access_token } } = await loginRes.json();

    // 2. Crear colecciones (leer de directus-schema.json)
    const schema = require('./directus-schema.json');

    // ... código para crear colecciones via API

    console.log('✅ Esquema importado exitosamente');
}

setupDirectus().catch(console.error);
```

## Paso 5: Configurar Permisos Públicos (Importante para la app)

Para que la aplicación pueda leer datos sin autenticación:

1. En Directus Admin, ir a **Settings** > **Roles & Permissions**
2. Click en **Public** role
3. Para cada colección (`productos`, `imagenes_producto`, `archivos_producto`):
   - Activar permiso de **Read** (lectura)
   - En "Field Permissions", seleccionar todos los campos
4. Para `directus_files`:
   - Activar permiso de **Read**

**Nota**: Si querés que solo usuarios autenticados puedan crear/editar/eliminar, dejá solo Read público y los demás permisos solo para Admin.

## Paso 6: Crear Productos de Prueba

### Via Directus Admin:

1. Ir a **Content** > **Productos**
2. Click en "+" (Create Item)
3. Llenar datos:
   - Nombre: "Generador KOR 5000W"
   - Descripción: "Generador portátil de 5000W..."
   - Categoría: "generadores"
   - Estado: "active"
   - Orden: 1
4. Guardar

### Via API:

```bash
curl -X POST http://localhost:8055/items/productos \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Generador KOR 5000W",
    "descripcion": "Generador portátil de 5000W con arranque eléctrico",
    "categoria": "generadores",
    "estado": "active",
    "orden": 1
  }'
```

## Paso 7: Subir Imágenes de Productos

### Via Directus Admin:

1. Ir a **File Library**
2. Subir imágenes (drag & drop o click "Upload")
3. Ir a **Content** > **Imágenes Producto**
4. Click "+" (Create Item)
5. Seleccionar:
   - Producto: "Generador KOR 5000W"
   - Archivo: (seleccionar imagen subida)
   - Orden: 1
   - Es principal: true
6. Guardar

### Via API:

```javascript
// 1. Subir imagen
const formData = new FormData();
formData.append('file', imagenFile);

const uploadRes = await fetch('http://localhost:8055/files', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${access_token}` },
    body: formData
});
const { data: { id: fileId } } = await uploadRes.json();

// 2. Crear relación con producto
await fetch('http://localhost:8055/items/imagenes_producto', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${access_token}`
    },
    body: JSON.stringify({
        producto_id: 1,
        archivo_id: fileId,
        orden: 1,
        es_principal: true
    })
});
```

## Paso 8: Verificar API

Testear endpoints desde navegador o Postman:

1. **Listar productos**:
   ```
   GET http://localhost:8055/items/productos
   ```

2. **Obtener producto con imágenes**:
   ```
   GET http://localhost:8055/items/productos/1?fields=*,imagenes.archivo_id.*
   ```

3. **Obtener imágenes de un producto**:
   ```
   GET http://localhost:8055/items/imagenes_producto?filter[producto_id][_eq]=1&fields=*,archivo_id.*
   ```

4. **Ver imagen**:
   ```
   GET http://localhost:8055/assets/{file-uuid}
   ```

## Paso 9: Actualizar script.js

El nuevo `script.js` ya está configurado para usar la API de Directus. Ver archivo `script.js` en V2.

## Paso 10: Probar Aplicación

1. Abrir `index.html` en navegador
2. Debería cargar productos desde Directus automáticamente
3. Click en un producto → debería mostrar carrusel con imágenes de Directus
4. Click en "Editar Imágenes" → debería abrir editor conectado con Directus
5. Click en "Editar Archivos" → debería abrir editor de archivos

## Troubleshooting

### Error: CORS
Si hay error de CORS, verificar en `docker-compose.yml`:
```yaml
CORS_ENABLED: 'true'
CORS_ORIGIN: '*'
```

### Error: Directus no inicia
```bash
# Ver logs
cd directus-local
docker-compose logs -f

# Reiniciar
docker-compose restart
```

### Error: No se pueden subir archivos
Verificar permisos de carpeta `directus-local/uploads/`:
```bash
chmod -R 777 directus-local/uploads/
```

### Base de datos corrupta
```bash
# Backup
cp directus-local/database/data.db directus-local/database/data.db.backup

# Resetear (CUIDADO: borra datos)
rm directus-local/database/data.db
docker-compose restart
```

## Migración de Datos V1 → V2

Ver archivo `MIGRACION-DATOS.md` (próximamente) para script que migra datos automáticamente de V1 a V2.

## Respaldo y Restauración

### Backup:
```bash
# Copiar toda la carpeta directus-local
cp -r directus-local directus-local-backup-2025-11-12
```

### Restaurar:
```bash
# Detener Directus
cd directus-local
docker-compose down

# Restaurar carpeta
rm -rf database uploads
cp -r ../directus-local-backup-2025-11-12/database ./
cp -r ../directus-local-backup-2025-11-12/uploads ./

# Reiniciar
docker-compose up -d
```

## Distribución Portable

Para crear ejecutable portable con pkg:

```bash
npm install -g pkg
pkg launcher.js --targets node18-win-x64 --output "KOR-Generadores-V2.exe"
```

Distribuir carpeta completa con:
- KOR-Generadores-V2.exe
- directus-local/
- index.html, styles.css, script.js
- system-api.js, auto-login.js
- assets (imágenes, logos)

## Siguientes Pasos

1. Crear script de migración de datos V1 → V2
2. Agregar más productos de prueba
3. Personalizar interfaz de Directus Admin (logo, colores)
4. Configurar backups automáticos
5. Documentar workflow de uso diario
