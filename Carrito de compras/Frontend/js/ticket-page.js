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

    if (!productosTicket || !totalTicket) {
        console.error('[ERROR] Elementos del ticket no encontrados en el DOM');
        alert('Error al cargar el ticket. Por favor, recarga la página.');
        return;
    }

    // Limpiar contenido previo
    productosTicket.innerHTML = '';

    if (carritoActual.length > 0) {
        // Agrupar productos por ID para evitar duplicados
        const productosAgrupados = {};
        
        carritoActual.forEach(producto => {
            const id = producto.producto_id || producto.id || producto.nombre;
            if (productosAgrupados[id]) {
                // Si ya existe, sumar la cantidad
                productosAgrupados[id].cantidad = parseInt(productosAgrupados[id].cantidad) + parseInt(producto.cantidad);
            } else {
                // Si no existe, agregarlo (crear copia para evitar referencias)
                productosAgrupados[id] = { 
                    ...producto,
                    cantidad: parseInt(producto.cantidad)
                };
            }
        });

        // Crear contenedor único con título
        const contenedor = document.createElement('div');
        contenedor.className = 'info-box';
        contenedor.innerHTML = '<div class="section-title">Productos:</div>';

        // Agregar cada producto al contenedor
        Object.values(productosAgrupados).forEach(producto => {
            // Determinar imagen según nombre del producto
            let imagenProducto = 'original';
            if (producto.nombre.toLowerCase().includes('gouda')) {
                imagenProducto = 'gouda';
            } else if (producto.nombre.toLowerCase().includes('mozzarella')) {
                imagenProducto = 'mozzarella';
            }
            
            const precio = parseFloat(producto.precio);
            const subtotal = precio * producto.cantidad;
            
            const itemProducto = document.createElement('div');
            itemProducto.className = 'producto-item';
            itemProducto.style.marginBottom = '15px';
            itemProducto.innerHTML = `
                <img src="/img/babybel-${imagenProducto}.png" 
                     alt="${producto.nombre}" 
                     class="producto-img"
                     onerror="this.src='/img/default-cheese.png'">
                <div>
                    <p class="producto-nombre">${producto.nombre}</p>
                    <p>Cantidad: ${producto.cantidad}</p>
                    <p>Precio unitario: $${precio.toFixed(2)}</p>
                    <p><strong>Subtotal: $${subtotal.toFixed(2)}</strong></p>
                </div>
            `;
            contenedor.appendChild(itemProducto);
        });

        productosTicket.appendChild(contenedor);
        totalTicket.textContent = totalActual;
    } else {
        productosTicket.innerHTML = '<div class="info-box"><p>No hay productos en el carrito</p></div>';
        console.warn('[WARN] Carrito vacío al mostrar ticket');
    }
}

/**
 * Confirma la compra y redirige a página de confirmación
 */
function confirmarCompra() {
    const carritoActual = JSON.parse(localStorage.getItem('carritoActual') || '[]');
    const totalActual = localStorage.getItem('totalActual') || '0.00';
    
    if (carritoActual.length === 0) {
        alert('No hay productos para confirmar');
        window.location.href = '/principal';
        return;
    }

    // Confirmación final
    if (!confirm(`¿Confirmar que recibiste tu compra por $${totalActual}?`)) {
        return;
    }

    // Guardar para página de confirmación
    localStorage.setItem('carritoComprado', JSON.stringify(carritoActual));
    localStorage.setItem('totalCompra', totalActual);
    
    // Ahora sí limpiar todo el carrito temporal y datos de pago
    localStorage.removeItem('carritoActual');
    localStorage.removeItem('totalActual');
    localStorage.removeItem('datosPago');

    alert('✓ ¡Compra confirmada exitosamente!');
    window.location.href = '/confirmacion';
}

/**
 * Mostrar datos del pago en el ticket
 */
function mostrarDatosPago() {
    const datosPago = JSON.parse(localStorage.getItem('datosPago') || '{}');
    
    if (datosPago.nombreTitular) {
        document.getElementById('nombre-titular').textContent = datosPago.nombreTitular;
        document.getElementById('tarjeta-numero').textContent = datosPago.numeroTarjeta || '****';
        document.getElementById('fecha-pago').textContent = datosPago.fechaPago || new Date().toLocaleString('es-MX');
        document.getElementById('venta-id').textContent = datosPago.ventaId || 'N/A';
    } else {
        // Si no hay datos de pago, ocultar la sección
        const infoPago = document.getElementById('info-pago');
        if (infoPago) {
            infoPago.style.display = 'none';
        }
    }
}

// Inicializar página de ticket
document.addEventListener('DOMContentLoaded', function() {
    mostrarDatosPago();
    mostrarProductosTicket();
});
