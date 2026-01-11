// carrito-utils.js
// Utilidades generales para el carrito de compras con integración a API

/**
 * Obtiene el carrito del usuario desde la API
 */
async function obtenerCarritoAPI() {
    const usuarioId = localStorage.getItem('usuarioId');
    if (!usuarioId) {
        console.warn('[WARN] No hay usuario logueado');
        return [];
    }
    
    try {
        const response = await fetch(`/api/carrito/${usuarioId}`);
        const data = await response.json();
        
        if (data.success) {
            return data.carrito.map(item => ({
                id: item.producto_id,
                nombre: item.nombre,
                precio: parseFloat(item.precio),
                cantidad: item.cantidad,
                imagen: item.imagen,
                stock: item.stock
            }));
        } else {
            console.error('[ERROR] Error al obtener carrito desde API:', data.error);
            return [];
        }
    } catch (error) {
        console.error('[ERROR] Error al obtener carrito:', error);
        return [];
    }
}

/**
 * Actualiza el ícono del carrito según la cantidad de items
 */
async function actualizarIconoCarrito() {
    try {
        const carrito = await obtenerCarritoAPI();
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
        } else {
            console.warn('[WARN] Elemento cart-icon no encontrado en el DOM');
        }
    } catch (error) {
        console.error('[ERROR] Error al actualizar ícono del carrito [carrito-utils.js - actualizarIconoCarrito()]:', error);
    }
}

/**
 * Verifica si hay sesión iniciada antes de acceder al carrito
 * @param {Event} event - Evento del click
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
 * Guarda el carrito en localStorage para el usuario actual (DEPRECADO - usar API)
 * Mantenido por compatibilidad pero se recomienda usar la API
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
 * Obtiene el carrito del usuario desde localStorage (DEPRECADO - usar obtenerCarritoAPI)
 * Mantenido por compatibilidad
 * @returns {Array} Array con los items del carrito
 */
function obtenerCarritoUsuario() {
    const usuarioId = localStorage.getItem('usuarioId');
    
    if (usuarioId) {
        const carritoGuardado = localStorage.getItem(`carrito_usuario_${usuarioId}`);
        if (carritoGuardado) {
            return JSON.parse(carritoGuardado);
        }
    }
    
    const carritoGeneral = localStorage.getItem('carrito');
    return carritoGeneral ? JSON.parse(carritoGeneral) : [];
}

/**
 * Obtiene el carrito del usuario actual
 * @returns {Array} - Array con los items del carrito
 */
function obtenerCarritoUsuario() {
    return JSON.parse(localStorage.getItem('carrito') || '[]');
}
