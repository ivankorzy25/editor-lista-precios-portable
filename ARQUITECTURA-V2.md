# ARQUITECTURA V2 - EDITOR PORTÁTIL LISTA DE PRECIOS

## Cambio de Paradigma

### V1 (Anterior)
- ❌ Datos estáticos en HTML
- ❌ Archivos dispersos en carpetas sin estructura
- ❌ Directus no se usaba como CMS real
- ❌ Gestión manual de archivos

### V2 (Nuevo)
- ✅ Directus como CMS central
- ✅ Todos los datos gestionados en base de datos
- ✅ API REST de Directus para todo
- ✅ Estructura portable completa
- ✅ Gestión profesional de contenido

## Esquema de Base de Datos Directus

### Colección: `productos`
```json
{
  "id": "integer (auto)",
  "nombre": "string (required, unique)",
  "descripcion": "text (optional)",
  "categoria": "string (optional)",
  "precio": "decimal (optional)",
  "estado": "string (active/inactive)",
  "orden": "integer (para ordenamiento)",
  "fecha_creacion": "timestamp (auto)",
  "fecha_modificacion": "timestamp (auto)"
}
```

### Colección: `imagenes_producto`
```json
{
  "id": "integer (auto)",
  "producto_id": "many-to-one → productos",
  "archivo_id": "many-to-one → directus_files",
  "orden": "integer (para ordenamiento en carrusel)",
  "es_principal": "boolean (imagen destacada)",
  "fecha_subida": "timestamp (auto)"
}
```

### Colección: `archivos_producto`
```json
{
  "id": "integer (auto)",
  "producto_id": "many-to-one → productos",
  "archivo_id": "many-to-one → directus_files",
  "tipo": "string (pdf, doc, xls, txt, html, json)",
  "descripcion": "text (optional)",
  "fecha_subida": "timestamp (auto)"
}
```

### Colección nativa: `directus_files`
Directus ya maneja esta colección automáticamente:
- Almacena archivos físicos
- Guarda metadata (tamaño, tipo MIME, etc.)
- Genera thumbnails automáticamente
- Ubicación: `directus-local/uploads/`

## Flujo de Datos

### Cargar Productos en el Index
```
Usuario abre index.html
→ JavaScript hace fetch a Directus API: GET /items/productos
→ Directus responde con array de productos
→ JavaScript renderiza cards de productos
```

### Ver Imágenes de un Producto
```
Usuario hace click en producto
→ JavaScript hace fetch: GET /items/imagenes_producto?filter[producto_id][_eq]={id}
→ Directus responde con imágenes relacionadas
→ JavaScript muestra carrusel con las imágenes
```

### Editar Imágenes de un Producto
```
Usuario abre Editor de Imágenes
→ JavaScript hace fetch: GET /items/imagenes_producto?filter[producto_id][_eq]={id}
→ Usuario arrastra para reordenar
→ JavaScript hace PATCH /items/imagenes_producto/{id} con nuevo orden
→ Usuario sube nueva imagen
→ JavaScript hace POST /files (sube archivo)
→ JavaScript hace POST /items/imagenes_producto (crea relación)
```

### Editar Archivos de un Producto
```
Usuario abre Editor de Archivos
→ JavaScript hace fetch: GET /items/archivos_producto?filter[producto_id][_eq]={id}
→ Usuario sube nuevo PDF
→ JavaScript hace POST /files (sube archivo)
→ JavaScript hace POST /items/archivos_producto (crea relación)
→ Usuario elimina archivo
→ JavaScript hace DELETE /items/archivos_producto/{id}
→ JavaScript hace DELETE /files/{archivo_id}
```

## Estructura de Archivos V2

```
EDITOR PORTATIL LISTA DE PRECIOS V2/
├── index.html              # Interfaz visual (sin cambios mayores)
├── styles.css              # Estilos (sin cambios)
├── script.js               # NUEVO: Usa API de Directus
├── auto-login.js           # Login automático
├── launcher.js             # Inicia Docker, Directus, System API
├── system-api.js           # API para abrir carpetas
├── package.json            # Dependencias Node.js
├── .gitignore              # Archivos ignorados
├── directus-local/         # Instancia Directus portable
│   ├── docker-compose.yml  # Configuración Docker
│   ├── uploads/            # Todos los archivos (imágenes, PDFs)
│   └── database/           # Base de datos SQLite/PostgreSQL
├── ARQUITECTURA-V2.md      # Este documento
├── SETUP-DIRECTUS.md       # Instrucciones de configuración
└── directus-schema.json    # Esquema para importar en Directus
```

## API Endpoints de Directus

### Autenticación
```
POST http://localhost:8055/auth/login
Body: { "email": "admin@example.com", "password": "kor2025" }
Response: { "data": { "access_token": "...", "refresh_token": "..." } }
```

### Productos
```
GET    /items/productos                    # Listar todos
GET    /items/productos/{id}               # Obtener uno
POST   /items/productos                    # Crear
PATCH  /items/productos/{id}               # Actualizar
DELETE /items/productos/{id}               # Eliminar
```

### Imágenes de Producto
```
GET    /items/imagenes_producto?filter[producto_id][_eq]={id}
POST   /items/imagenes_producto
PATCH  /items/imagenes_producto/{id}
DELETE /items/imagenes_producto/{id}
```

### Archivos de Producto
```
GET    /items/archivos_producto?filter[producto_id][_eq]={id}
POST   /items/archivos_producto
DELETE /items/archivos_producto/{id}
```

### Subir Archivos
```
POST   /files
Content-Type: multipart/form-data
Body: FormData con el archivo
Response: { "data": { "id": "uuid", "filename_download": "...", ... } }
```

### Descargar Archivos
```
GET    /assets/{file_id}
GET    /assets/{file_id}?width=300&height=300  # Con transformación
```

## Ventajas de V2

1. **Gestión Profesional**: Directus es un CMS completo con interfaz admin
2. **Búsqueda y Filtros**: Directus tiene búsqueda y filtros avanzados
3. **Permisos**: Control de acceso granular por colección
4. **Versionado**: Directus guarda historial de cambios
5. **API REST**: Todo accesible vía API estándar
6. **Thumbnails Automáticos**: Directus genera miniaturas
7. **Validaciones**: Reglas de validación en base de datos
8. **Portable**: Todo en una carpeta, fácil de distribuir
9. **Escalable**: Soporta cientos/miles de productos sin problema
10. **Multi-usuario**: Varios usuarios pueden administrar contenido

## Próximos Pasos

1. Configurar Directus con el esquema (ver SETUP-DIRECTUS.md)
2. Migrar productos existentes del HTML a Directus
3. Migrar imágenes y archivos a directus-local/uploads/
4. Probar CRUD completo de productos
5. Probar gestión de imágenes y archivos
6. Crear ejecutable portable con pkg

## Notas Técnicas

- **Autenticación**: El script auto-login.js maneja login automático
- **CORS**: Directus configurado para permitir acceso desde file://
- **Portabilidad**: Directus usa SQLite o PostgreSQL en Docker
- **Backup**: Copiar carpeta directus-local/ completa
- **Actualización**: docker-compose pull para actualizar Directus
