// session-check.js
// Script simple para verificar sesión antes de acceder al carrito
// Usado en páginas de configuración (cambContra, cambCorreo)

function verificarSesionCarrito(evento) {
    evento.preventDefault();
    const usuarioNombre = localStorage.getItem('usuarioNombre');
    
    if (!usuarioNombre) {
        alert('Primero tienes que iniciar sesión para ver el carrito');
        return;
    }
    
    window.location.href = '/carrito';
}
