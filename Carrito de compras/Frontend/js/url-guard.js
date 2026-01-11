// url-guard.js
// Protección contra manipulación de URLs
// Detecta cambios no autorizados y redirige a la ruta correcta

/**
 * Rutas válidas del sistema
 */
const rutasValidas = [
    '/',
    '/login',
    '/register',
    '/crearCuenta',
    '/principal',
    '/carrito',
    '/usuario',
    '/ticket',
    '/confirmacion',
    '/cambContra',
    '/cambCorreo',
    '/productos'
];

/**
 * Rutas que requieren autenticación
 */
const rutasProtegidas = [
    '/carrito',
    '/usuario',
    '/ticket',
    '/confirmacion',
    '/cambContra',
    '/cambCorreo'
];

/**
 * Verifica si una ruta es válida
 * @param {string} ruta - Ruta a verificar
 * @returns {boolean} - true si es válida, false si no
 */
function esRutaValida(ruta) {
    // Limpiar la ruta (remover query params y hash)
    const rutaLimpia = ruta.split('?')[0].split('#')[0];
    
    // Verificar si es una ruta válida o una ruta de API
    return rutasValidas.includes(rutaLimpia) || rutaLimpia.startsWith('/api/');
}

/**
 * Verifica si una ruta requiere autenticación
 * @param {string} ruta - Ruta a verificar
 * @returns {boolean} - true si requiere auth, false si no
 */
function requiereAutenticacion(ruta) {
    const rutaLimpia = ruta.split('?')[0].split('#')[0];
    return rutasProtegidas.includes(rutaLimpia);
}

/**
 * Obtiene la ruta correcta según el estado de autenticación
 * @param {string} rutaIntentada - Ruta que el usuario intentó acceder
 * @returns {string} - Ruta a la que debe ser redirigido
 */
function obtenerRutaCorrecta(rutaIntentada) {
    const rutaLimpia = rutaIntentada.split('?')[0].split('#')[0];
    
    // Si la ruta no es válida, redirigir a principal
    if (!esRutaValida(rutaLimpia)) {
        return '/principal';
    }
    
    // Si requiere autenticación, verificar sesión
    if (requiereAutenticacion(rutaLimpia)) {
        const usuario = JSON.parse(localStorage.getItem('usuario') || 'null');
        if (!usuario || !usuario.id) {
            return '/login';
        }
    }
    
    return rutaLimpia;
}

/**
 * Detecta si la URL ha sido manipulada de forma sospechosa o está malformada
 * @param {string} url - URL a verificar
 * @returns {boolean} - true si es sospechosa, false si no
 */
function esURLSospechosa(url) {
    const patronesSospechosos = [
        /<script/gi,
        /javascript:/gi,
        /data:text\/html/gi,
        /\.\.\//g,              // Path traversal
        /%00/g,                 // Null byte
        /%2e%2e/gi,            // Encoded ..
        /file:\/\//gi,         // File protocol
        /vbscript:/gi,         // VBScript
        /<iframe/gi,           // iframe injection
        /on\w+=/gi,            // Event handlers
        /%[0-9A-F][^0-9A-F]/gi, // Encoding malformado (ej: %C3%9L en vez de %C3%91)
        /%((?![0-9A-F]{2})|$)/gi // % no seguido de 2 dígitos hexadecimales
    ];
    
    // Verificar caracteres no permitidos en URLs
    try {
        // Intentar decodificar la URL para detectar encoding malformado
        decodeURIComponent(url);
    } catch (e) {
        // Si falla la decodificación, la URL está malformada
        console.log('[URL-GUARD] URL malformada detectada:', url);
        return true;
    }
    
    return patronesSospechosos.some(patron => patron.test(url));
}

/**
 * Guarda la ruta actual antes de cualquier redirección
 */
let rutaAnterior = window.location.pathname;

/**
 * Monitorea cambios en la URL y valida que sean legítimos
 */
function monitorearURL() {
    const rutaActual = window.location.pathname;
    
    // Primero, verificar si la URL completa está malformada
    if (esURLSospechosa(window.location.href)) {
        console.log('[URL-GUARD] URL malformada detectada, redirigiendo...');
        alert('URL inválida detectada. Serás redirigido a la página principal.');
        window.location.replace('/principal');
        return;
    }
    
    // Si la ruta cambió
    if (rutaActual !== rutaAnterior) {
        console.log('[URL-GUARD] Cambio de ruta detectado:', rutaAnterior, '->', rutaActual);
        
        // Verificar si la ruta es válida
        if (!esRutaValida(rutaActual)) {
            alert(`La página "${rutaActual}" no existe.\n\nSerás redirigido a la página principal.`);
            window.location.replace('/principal');
            return;
        }
        
        // Verificar autenticación si es necesario
        if (requiereAutenticacion(rutaActual)) {
            const usuario = JSON.parse(localStorage.getItem('usuario') || 'null');
            if (!usuario || !usuario.id) {
                alert(`Esta página requiere iniciar sesión.\n\nSerás redirigido al login.`);
                window.location.replace('/login');
                return;
            }
        }
        
        rutaAnterior = rutaActual;
    }
}

/**
 * Protege contra manipulación de query parameters
 * @param {URLSearchParams} params - Parámetros de la URL
 * @returns {boolean} - true si son seguros, false si no
 */
function validarQueryParams(params) {
    for (let [key, value] of params) {
        // Verificar cada parámetro
        if (esURLSospechosa(value)) {
            alert(`Parámetro inválido detectado. La página será recargada.`);
            return false;
        }
        
        // Verificar inyección en parámetros
        if (/<script/gi.test(value) || /javascript:/gi.test(value)) {
            alert(`Parámetro inválido detectado. La página será recargada.`);
            return false;
        }
    }
    return true;
}

/**
 * Valida la URL completa al cargar la página
 */
function validarURLInicial() {
    const urlActual = window.location.href;
    const rutaActual = window.location.pathname;
    const params = new URLSearchParams(window.location.search);
    
    console.log('[URL-GUARD] Validando URL inicial:', urlActual);
    
    // Validar URL sospechosa
    if (esURLSospechosa(urlActual)) {
        alert('URL inválida detectada.\n\nSerás redirigido a la página principal.');
        window.location.replace('/principal');
        return false;
    }
    
    // Validar ruta
    if (!esRutaValida(rutaActual)) {
        alert(`La página "${rutaActual}" no existe.\n\nSerás redirigido a la página principal.`);
        window.location.replace('/principal');
        return false;
    }
    
    // Validar query parameters
    if (!validarQueryParams(params)) {
        window.location.replace(rutaActual); // Remover parámetros maliciosos
        return false;
    }
    
    // Validar autenticación
    if (requiereAutenticacion(rutaActual)) {
        const usuario = JSON.parse(localStorage.getItem('usuario') || 'null');
        if (!usuario || !usuario.id) {
            alert(`Debes iniciar sesión para acceder a esta página.\n\nSerás redirigido al login.`);
            window.location.replace('/login');
            return false;
        }
    }
    
    return true;
}

/**
 * Previene navegación hacia atrás después de logout
 */
function prevenirNavegacionPostLogout() {
    const usuario = JSON.parse(localStorage.getItem('usuario') || 'null');
    const rutaActual = window.location.pathname;
    
    if (!usuario && requiereAutenticacion(rutaActual)) {
        alert('Sesión no válida.\n\nSerás redirigido al login.');
        window.location.replace('/login');
        
        // Prevenir usar el botón "Atrás"
        history.pushState(null, null, location.href);
        window.onpopstate = function() {
            history.go(1);
        };
    }
}

// Validar URL al cargar la página
document.addEventListener('DOMContentLoaded', function() {
    // Validar inmediatamente al cargar
    if (esURLSospechosa(window.location.href)) {
        console.log('[URL-GUARD] URL malformada al cargar página, redirigiendo...');
        alert('URL inválida detectada. Serás redirigido a la página principal.');
        window.location.replace('/principal');
        return;
    }
    
    validarURLInicial();
    prevenirNavegacionPostLogout();
    
    // Monitorear cambios de URL cada 500ms
    setInterval(monitorearURL, 500);
});

// Validar también cuando cambia el hash
window.addEventListener('hashchange', function() {
    if (esURLSospechosa(window.location.hash)) {
        alert('URL inválida detectada.');
        window.location.hash = '';
    }
});

// Prevenir manipulación de history
const originalPushState = history.pushState;
const originalReplaceState = history.replaceState;

history.pushState = function(state, title, url) {
    if (url && esURLSospechosa(url)) {
        alert('Navegación bloqueada por seguridad.');
        return;
    }
    return originalPushState.apply(history, arguments);
};

history.replaceState = function(state, title, url) {
    if (url && esURLSospechosa(url)) {
        alert('Navegación bloqueada por seguridad.');
        return;
    }
    return originalReplaceState.apply(history, arguments);
};
