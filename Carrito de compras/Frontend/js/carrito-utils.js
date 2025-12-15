// carrito-utils.js
// Utilidades generales para el carrito de compras

/**
 * Actualiza el ícono del carrito según la cantidad de items
 */
function actualizarIconoCarrito() {
    const carrito = JSON.parse(localStorage.getItem('carrito') || '[]');
    const totalProductos = carrito.reduce((suma, producto) => suma + producto.cantidad, 0);
    const iconoCarrito = document.getElementById('cart-icon');
    
    if (iconoCarrito) {
        if (totalProductos > 0) {
            iconoCarrito.src = '/img/carritolleno.png';
            iconoCarrito.alt = 'Carrito Cargado';
        } else {
            iconoCarrito.src = '/img/Carritoicono.png';
            iconoCarrito.alt = 'Carrito Vacío';
        }
    }
}

/**
 * Verifica si hay sesión iniciada antes de acceder al carrito
 * @param {Event} event - Evento del click
 */
function verificarSesionCarrito(evento) {
    evento.preventDefault();
    const usuarioNombre = localStorage.getItem('usuarioNombre');
    
    if (!usuarioNombre) {
        alert('Primero tienes que iniciar sesión para ver el carrito');
        return;
    }
    
    window.location.href = '/carrito';
}

/**
 * Guarda el carrito en localStorage para el usuario actual
 * @param {Array} carrito - Array con los items del carrito
 */
function guardarCarritoUsuario(carrito) {
    localStorage.setItem('carrito', JSON.stringify(carrito));
    
    const usuarioId = localStorage.getItem('usuarioId');
    if (usuarioId) {
        localStorage.setItem(`carrito_usuario_${usuarioId}`, JSON.stringify(carrito));
    }
}

/**
 * Obtiene el carrito del usuario actual
 * @returns {Array} - Array con los items del carrito
 */
function obtenerCarritoUsuario() {
    return JSON.parse(localStorage.getItem('carrito') || '[]');
}
