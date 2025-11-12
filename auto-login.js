// ============================================
// SCRIPT DE AUTO-LOGIN PARA DESARROLLO
// ============================================
// Este script automatiza el login y activa el modo interno
// Usuario: admin | Contraseña: kor2025
// Modo Interno: 2323

(function() {
    'use strict';

    console.log('%c🤖 AUTO-LOGIN ACTIVADO', 'color: #4CAF50; font-size: 16px; font-weight: bold;');

    // Función para realizar auto-login
    function performAutoLogin() {
        // Establecer autenticación
        sessionStorage.setItem('authenticated', 'true');
        console.log('✅ Sesión autenticada automáticamente');

        // Activar modo interno
        localStorage.setItem('internalMode', 'true');
        sessionStorage.setItem('internalPassword', '2323');
        console.log('✅ Modo interno activado automáticamente');

        // Agregar clase al body si ya existe
        if (document.body) {
            document.body.classList.add('internal-mode');
        } else {
            // Si el body aún no existe, esperar a que cargue
            document.addEventListener('DOMContentLoaded', function() {
                document.body.classList.add('internal-mode');

                // Activar el checkbox del modo interno
                const toggle = document.getElementById('internalModeSwitch');
                if (toggle) {
                    toggle.checked = true;
                    console.log('✅ Toggle de modo interno activado');
                }
            });
        }

        console.log('%c✨ Sistema listo para trabajar', 'color: #fd6600; font-size: 14px; font-weight: bold;');
        console.log('👤 Usuario: admin');
        console.log('🔓 Modo: Uso Interno');
    }

    // Ejecutar auto-login inmediatamente
    performAutoLogin();

    // También interceptar cualquier intento de logout para reactivar
    const originalRemoveItem = Storage.prototype.removeItem;
    Storage.prototype.removeItem = function(key) {
        if (key === 'authenticated' || key === 'internalMode') {
            console.log('⚠️ Intento de logout detectado - manteniendo sesión activa');
            return; // No permitir cerrar sesión
        }
        return originalRemoveItem.apply(this, arguments);
    };

    console.log('🛡️ Protección de sesión activada');
})();
