// ticket-page.js
// Lógica de la página del ticket de compra

/**
 * Muestra los productos en el ticket
 */
function mostrarProductosTicket() {
    const carritoActual = JSON.parse(localStorage.getItem('carritoActual') || '[]');
    const totalActual = localStorage.getItem('totalActual') || '0.00';
    
    const productosTicket = document.getElementById('productos-ticket');
    const totalTicket = document.getElementById('total-ticket');

    if (!productosTicket || !totalTicket) return;

    if (carritoActual.length > 0) {
        carritoActual.forEach(producto => {
            const cajaProducto = document.createElement('div');
            cajaProducto.className = 'info-box';
            
            // Determinar imagen según nombre del producto
            let imagenProducto = 'original';
            if (producto.nombre.toLowerCase().includes('gouda')) {
                imagenProducto = 'gouda';
            } else if (producto.nombre.toLowerCase().includes('mozzarella')) {
                imagenProducto = 'mozzarella';
            }
            
            cajaProducto.innerHTML = `
                <div class="section-title">Producto:</div>
                <div class="producto-item">
                    <img src="../img/babybel-${imagenProducto}.png" 
                         alt="${producto.nombre}" 
                         class="producto-img"
                         onerror="this.src='../img/default-cheese.png'">
                    <div>
                        <p class="producto-nombre">${producto.nombre}</p>
                        <p>Cantidad: ${producto.cantidad}</p>
                        <p>Precio unitario: $${producto.precio.toFixed(2)}</p>
                        <p><strong>Subtotal: $${(producto.precio * producto.cantidad).toFixed(2)}</strong></p>
                    </div>
                </div>
            `;
            productosTicket.appendChild(cajaProducto);
        });

        totalTicket.textContent = totalActual;
    } else {
        productosTicket.innerHTML = '<div class="info-box"><p>No hay productos en el carrito</p></div>';
    }
}

/**
 * Confirma la compra y redirige a página de confirmación
 */
function confirmarCompra() {
    const carritoActual = JSON.parse(localStorage.getItem('carritoActual') || '[]');
    const totalActual = localStorage.getItem('totalActual') || '0.00';
    
    if (carritoActual.length === 0) {
        alert('No hay productos para comprar');
        window.location.href = '/carrito';
        return;
    }

    // Guardar para página de confirmación
    localStorage.setItem('carritoComprado', JSON.stringify(carritoActual));
    localStorage.setItem('totalCompra', totalActual);
    
    // Limpiar carrito temporal
    localStorage.removeItem('carritoActual');
    localStorage.removeItem('totalActual');

    window.location.href = '/confirmacion';
}

// Inicializar página de ticket
document.addEventListener('DOMContentLoaded', function() {
    mostrarProductosTicket();
});
