// carrito-page.js
// Lógica específica de la página del carrito (index.ejs) - Versión con API

let carrito = [];

/**
 * Cargar carrito desde la API
 */
async function cargarCarrito() {
    const usuarioId = localStorage.getItem('usuarioId');
    if (!usuarioId) {
        window.location.href = '/login';
        return;
    }
    
    carrito = await obtenerCarritoAPI();
    actualizarCarrito();
    await actualizarIconoCarrito();
}

/**
 * Agrega un producto al carrito (DEPRECADO - usar API directamente desde principal-page)
 */
async function agregarAlCarrito(id, nombre, precio) {
    const usuarioId = localStorage.getItem('usuarioId');
    if (!usuarioId) {
        alert('Debes iniciar sesión para agregar productos al carrito');
        window.location.href = '/login';
        return;
    }

    try {
        const response = await fetch('/api/carrito/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                usuarioId: parseInt(usuarioId),
                productoId: id,
                cantidad: 1
            })
        });
        
        const data = await response.json();
        
        if (data.success) {
            await cargarCarrito();
        } else {
            alert('Error al agregar al carrito: ' + data.error);
        }
    } catch (error) {
        console.error('[ERROR] Error al agregar al carrito:', error);
        alert('Error al agregar al carrito');
    }
}

/**
 * Vacía completamente el carrito
 */
async function vaciarCarrito() {
    if (carrito.length === 0) {
        alert('El carrito está vacío, primero agrega productos antes de vaciar.');
        return;
    }
    
    const usuarioId = localStorage.getItem('usuarioId');
    if (!usuarioId) {
        return;
    }
    
    try {
        const response = await fetch('/api/carrito/clear', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                usuarioId: parseInt(usuarioId)
            })
        });
        
        const data = await response.json();
        
        if (data.success) {
            await cargarCarrito();
            alert('Carrito vaciado exitosamente');
        } else {
            alert('Error al vaciar carrito: ' + data.error);
        }
    } catch (error) {
        console.error('[ERROR] Error al vaciar carrito:', error);
        alert('Error al vaciar carrito');
    }
}

/**
 * Actualiza la visualización del carrito en la página
 */
function actualizarCarrito() {
    const carritoItems = document.getElementById('carrito-items');
    const totalElement = document.getElementById('total');

    if (!carritoItems || !totalElement) return;

    carritoItems.innerHTML = '';
    let total = 0;

    if (carrito.length === 0) {
        carritoItems.innerHTML = '<p style="text-align: center; color: #666;">Tu carrito está vacío</p>';
    } else {
        carrito.forEach(producto => {
            const productoDiv = document.createElement('div');
            productoDiv.className = 'carrito-item';
            productoDiv.innerHTML = `
                <p><strong>${producto.nombre}</strong> x${producto.cantidad} - <span style="color: #0084ff;">$${(producto.precio * producto.cantidad).toFixed(2)}</span></p>
            `;
            carritoItems.appendChild(productoDiv);
            total += producto.precio * producto.cantidad;
        });
    }

    totalElement.textContent = `$${total.toFixed(2)}`;
}

/**
 * Procede al pago creando una venta en la BD
 */
async function procederAlPago(evento) {
    evento.preventDefault();
    if (carrito.length === 0) {
        alert('El carrito está vacío, agrega productos antes de proceder al pago.');
        return;
    }
    
    const usuarioId = localStorage.getItem('usuarioId');
    if (!usuarioId) {
        window.location.href = '/login';
        return;
    }
    
    try {
        const response = await fetch('/api/ventas/crear', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                usuarioId: parseInt(usuarioId)
            })
        });
        
        const data = await response.json();
        
        if (data.success) {
            // Guardar información de la venta para mostrar en el ticket
            localStorage.setItem('ultimaVentaId', data.ventaId);
            localStorage.setItem('totalActual', data.total);
            window.location.href = '/ticket';
        } else {
            alert('Error al procesar la compra: ' + data.error);
        }
    } catch (error) {
        console.error('[ERROR] Error al procesar compra:', error);
        alert('Error al procesar la compra');
    }
}

/**
 * Actualiza la UI del topbar según el estado de sesión
 */
function actualizarTopbarSesion() {
    const usuarioNombre = localStorage.getItem('usuarioNombre');
    const linkLogin = document.getElementById('link-login');
    const linkCrear = document.getElementById('link-crear');
    const linkUsuario = document.getElementById('link-usuario');

    if (usuarioNombre) {
        if (linkLogin) linkLogin.style.display = 'none';
        if (linkCrear) linkCrear.style.display = 'none';
        if (linkUsuario) linkUsuario.style.display = 'inline-flex';
    } else {
        if (linkLogin) linkLogin.style.display = 'inline-block';
        if (linkCrear) linkCrear.style.display = 'inline-block';
        if (linkUsuario) linkUsuario.style.display = 'none';
    }
}

// Inicializar página del carrito
document.addEventListener('DOMContentLoaded', async function() {
    // Verificar sesión
    const usuarioNombre = localStorage.getItem('usuarioNombre');
    if (!usuarioNombre) {
        alert('Primero tienes que iniciar sesión para ver el carrito');
        window.location.href = '/principal';
        return;
    }

    // Cargar carrito desde API
    await cargarCarrito();

    // Actualizar UI
    actualizarTopbarSesion();
});
