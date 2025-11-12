====================================================================
KOR GENERADORES - SISTEMA PORTABLE
====================================================================

✅ SISTEMA LISTO PARA USAR

====================================================================
ARCHIVOS PRINCIPALES
====================================================================

⭐ KOR-Generadores.exe   **<< EJECUTABLE RECOMENDADO >>**
   - APLICACIÓN EJECUTABLE TRADICIONAL (.exe)
   - Arranca TODO el sistema automáticamente
   - Verifica Docker, inicia Directus, abre el navegador
   - DOBLE CLICK Y LISTO - La forma más profesional de usar el sistema
   - Muestra una consola con el progreso de inicio

📂 INICIAR-KOR-GENERADORES.bat
   - Versión alternativa en script .bat
   - Hace lo mismo que el .exe
   - Útil si necesitás editar el comportamiento

📂 INICIAR-KOR-GENERADORES-SILENCIOSO.vbs
   - Versión silenciosa sin ventana de consola
   - Para inicio automático de Windows

📂 DETENER-KOR-GENERADORES.bat
   - Detiene Directus correctamente
   - Ejecutá esto cuando termines de trabajar

📂 CREAR-ACCESO-DIRECTO.bat
   - Crea un acceso directo en el Escritorio
   - Una sola vez, después usás el acceso directo

📂 AGREGAR-AL-INICIO-WINDOWS.bat
   - Hace que el sistema se inicie automáticamente al encender la PC
   - Te pregunta si estás seguro antes de hacerlo

📂 QUITAR-DEL-INICIO-WINDOWS.bat
   - Quita el inicio automático de Windows

====================================================================
CÓMO USAR EL SISTEMA
====================================================================

FORMA MÁS SIMPLE (RECOMENDADA):
--------------------------------

1. Doble click en: KOR-Generadores.exe
   → Eso es todo. El ejecutable hace todo automáticamente.

2. Esperá 10-15 segundos a que se abra el navegador

3. Login: admin / kor2025

4. Listo para trabajar!


PRIMERA VEZ (OPCIONAL):
-----------------------

1. Ejecutá: CREAR-ACCESO-DIRECTO.bat
   → Crea un acceso directo del .exe en tu Escritorio

2. (Opcional) Ejecutá: AGREGAR-AL-INICIO-WINDOWS.bat
   → Para que se inicie solo al prender la PC


TODOS LOS DÍAS:
---------------

OPCIÓN A: Doble click en: KOR-Generadores.exe
OPCIÓN B: Doble click en el acceso directo del Escritorio
OPCIÓN C: Ejecutá: INICIAR-KOR-GENERADORES-SILENCIOSO.vbs

(Cualquiera de las tres opciones hace lo mismo)

AL TERMINAR:
------------

1. Cerrá el navegador

2. (Opcional) Ejecutá: DETENER-KOR-GENERADORES.bat
   → Para liberar recursos

====================================================================
QUÉ HACE EL SISTEMA AL INICIARSE
====================================================================

1. ✅ Verifica que Docker esté instalado
2. ✅ Verifica si Docker está corriendo (lo inicia si no lo está)
3. ✅ Espera hasta 60 segundos a que Docker arranque completamente
4. ✅ Levanta Directus con docker-compose
5. ✅ Espera a que Directus esté listo (chequea endpoint de salud)
6. ✅ Abre Microsoft Edge con la aplicación

TODO AUTOMÁTICO. NO TENÉS QUE HACER NADA.

====================================================================
ESTADO ACTUAL
====================================================================

✅ Directus: Corriendo en http://localhost:8055
✅ Login: admin@generadores.ar / kor2025
✅ Base de datos: directus-local/database/data.db (SQLite)
✅ Imágenes: directus-local/uploads/

📦 PRODUCTOS: 1
   - Logus GL3300AM (ID: 1)

📸 IMÁGENES: 10 fotos vinculadas al producto

====================================================================
FUNCIONALIDADES DEL EDITOR
====================================================================

✅ Ver todos los productos
✅ Buscar productos
✅ Click en un producto para ver detalles
✅ Click en "✏️ Editar Imágenes" para abrir el editor
✅ Ver todas las imágenes del producto
✅ Agregar nuevas imágenes
✅ Reordenar imágenes con drag & drop
✅ Seleccionar múltiples imágenes con checkbox
✅ Eliminar imágenes seleccionadas
✅ Guardar cambios en Directus

====================================================================
REQUISITOS DEL SISTEMA
====================================================================

✅ Docker Desktop instalado
✅ Puerto 8055 disponible
✅ Microsoft Edge (o cualquier navegador moderno)
✅ Node.js (solo si necesitás usar scripts de verificación)

====================================================================
REINICIAR LA PC
====================================================================

Si reiniciás la PC:

OPCIÓN A: Con inicio automático (si ejecutaste AGREGAR-AL-INICIO-WINDOWS.bat)
   → El sistema se inicia solo al encender Windows
   → No tenés que hacer nada

OPCIÓN B: Sin inicio automático
   → Doble click en el acceso directo del Escritorio
   → O ejecutá: INICIAR-KOR-GENERADORES-SILENCIOSO.vbs

====================================================================
TROUBLESHOOTING
====================================================================

❌ "Docker no está instalado"
   → Instalá Docker Desktop desde: https://www.docker.com/products/docker-desktop

❌ "Docker no está corriendo"
   → El script lo inicia automáticamente
   → Si falla, abrí Docker Desktop manualmente y ejecutá el script de nuevo

❌ "No se pudo conectar a Directus"
   → Esperá 20-30 segundos más, Directus tarda en arrancar
   → Refrescá el navegador (F5 o Ctrl+R)

❌ "No se ven las imágenes"
   → Verificá que Directus esté corriendo: docker ps
   → Ejecutá: cd directus-local && node verificar-datos.js
   → Deberías ver 1 producto con 10 imágenes

❌ El sistema no arranca al encender la PC
   → Ejecutá: AGREGAR-AL-INICIO-WINDOWS.bat
   → O creá el acceso directo y arrastralo a la carpeta de Inicio

====================================================================
SCRIPTS DE VERIFICACIÓN (OPCIONALES)
====================================================================

Para verificar que todo funcione correctamente:

cd directus-local
node verificar-datos.js

Debería mostrar:
- ✅ Login OK
- 📦 PRODUCTOS: 1
- 📸 IMÁGENES: 10

====================================================================
ARCHIVOS DEL SISTEMA
====================================================================

index.html                         - Aplicación principal
indexv1.html                       - Copia de seguridad
script.js                          - Lógica de la aplicación
script-directus-patch.js           - Integración con Directus
styles.css                         - Estilos

directus-local/
  ├── database/                    - Base de datos SQLite
  ├── uploads/                     - Archivos subidos
  ├── docker-compose.yml           - Configuración de Docker
  ├── .env                         - Variables de entorno
  ├── setup-directus.js            - Script de inicialización
  ├── agregar-gl3300am.js          - Script para cargar producto
  └── verificar-datos.js           - Script de verificación

====================================================================
IMPORTANTE
====================================================================

⚠️ NO BORRES:
   - La carpeta directus-local/database/ (es tu base de datos)
   - La carpeta directus-local/uploads/ (son tus archivos)
   - Los archivos .bat y .vbs (son los launchers)

⚠️ NO EJECUTES:
   - git clean -fd (borra archivos no versionados)
   - docker-compose down -v (borra volúmenes de datos)

✅ SÍ PODÉS:
   - Mover toda la carpeta "recupero" a otro lugar
   - Crear más accesos directos
   - Agregar más productos e imágenes
   - Editar, reordenar y eliminar imágenes

====================================================================
RESPALDO RECOMENDADO
====================================================================

Para hacer un backup de tu trabajo:

1. Detené el sistema: DETENER-KOR-GENERADORES.bat

2. Copiá estas carpetas:
   - directus-local/database/
   - directus-local/uploads/

3. Guardá la copia en otro disco o en la nube

4. Para restaurar, simplemente pegá las carpetas de vuelta

====================================================================
SOPORTE
====================================================================

Todo funciona correctamente. El sistema está probado y listo.

Si tenés algún problema, ejecutá:
   cd directus-local && node verificar-datos.js

Esto te mostrará el estado actual de la base de datos.

====================================================================

🎉 ¡LISTO PARA USAR!

Ejecutá: INICIAR-KOR-GENERADORES-SILENCIOSO.vbs
Y empezá a trabajar.

====================================================================
