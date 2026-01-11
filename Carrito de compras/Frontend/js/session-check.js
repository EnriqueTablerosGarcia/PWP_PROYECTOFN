// session-check.js
// Validaciones de sesión para páginas protegidas
// Verifica si el usuario tiene una sesión activa antes de permitir acceso

/**
 * Verifica si hay una sesión activa del usuario
 * @returns {boolean} - true si hay sesión, false si no
 */
function verificarSesion() {
    const usuario = JSON.parse(localStorage.getItem('usuario'));
    if (!usuario || !usuario.id) {
        alert('Debes iniciar sesión para acceder a esta página');
        window.location.href = '/login';
        return false;
    }
    return true;
}

/**
 * Verifica sesión antes de acceder al carrito
 * @param {Event} evento - Evento del click
 */
function verificarSesionCarrito(evento) {
    evento.preventDefault();
    const usuario = JSON.parse(localStorage.getItem('usuario'));
    
    if (!usuario || !usuario.id) {
        alert('Primero tienes que iniciar sesión para ver el carrito');
        window.location.href = '/login';
        return;
    }
    
    window.location.href = '/carrito';
}

/**
 * Verifica sesión al cargar la página (para páginas protegidas)
 */
document.addEventListener('DOMContentLoaded', function() {
    // Solo verificar en páginas que no sean login, register o principal
    const paginasPublicas = ['/login', '/register', '/principal', '/', '/index'];
    const paginaActual = window.location.pathname;
    
    if (!paginasPublicas.includes(paginaActual)) {
        verificarSesion();
    }
});
