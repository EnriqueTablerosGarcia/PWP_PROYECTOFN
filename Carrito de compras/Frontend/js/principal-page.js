// principal-page.js
// Lógica de la página principal con productos

/**
 * Configura los controles de cantidad (+/-)
 */
function configurarControlesCantidad() {
    // Botón más (+)
    document.querySelectorAll('.btn-mas').forEach(boton => {
        boton.onclick = function() {
            const nombreProducto = this.getAttribute('data-producto');
            const entrada = document.querySelector(`.cantidad-input[data-producto="${nombreProducto}"]`);
            const stock = parseInt(entrada.getAttribute('data-stock'));
            const valorActual = parseInt(entrada.value);
            
            if (valorActual < stock) {
                entrada.value = valorActual + 1;
            } else {
                alert(`Stock máximo disponible: ${stock} unidades`);
            }
        };
    });
    
    // Botón menos (-)
    document.querySelectorAll('.btn-menos').forEach(boton => {
        boton.onclick = function() {
            const nombreProducto = this.getAttribute('data-producto');
            const entrada = document.querySelector(`.cantidad-input[data-producto="${nombreProducto}"]`);
            const valorActual = parseInt(entrada.value);
            
            if (valorActual > 1) {
                entrada.value = valorActual - 1;
            }
        };
    });
    
    // Validar input manual
    document.querySelectorAll('.cantidad-input').forEach(entrada => {
        entrada.addEventListener('input', function() {
            const stock = parseInt(this.getAttribute('data-stock'));
            let valor = parseInt(this.value);
            
            if (isNaN(valor) || valor < 1) {
                this.value = 1;
            } else if (valor > stock) {
                this.value = stock;
                alert(`Stock máximo disponible: ${stock} unidades`);
            }
        });
    });
}

/**
 * Configura los botones "Agregar al Carrito"
 */
function configurarBotonesAgregar() {
    const botones = document.querySelectorAll('.btn-agregar');
    
    botones.forEach(boton => {
        boton.textContent = 'Agregar al Carrito';
        boton.onclick = function() {
            const nombreProducto = this.getAttribute('data-producto');
            const precio = parseFloat(this.getAttribute('data-precio'));
            const stockDisponible = parseInt(this.getAttribute('data-stock'));
            
            // Obtener cantidad del input
            const inputCantidad = document.querySelector(`.cantidad-input[data-producto="${nombreProducto}"]`);
            const cantidadDeseada = parseInt(inputCantidad.value);
            
            // Obtener carrito actual
            let carrito = obtenerCarritoUsuario();
            
            // Verificar stock
            const productoExistente = carrito.find(producto => producto.nombre === nombreProducto);
            const cantidadEnCarrito = productoExistente ? productoExistente.cantidad : 0;
            const cantidadTotal = cantidadEnCarrito + cantidadDeseada;
            
            if (cantidadTotal > stockDisponible) {
                const disponible = stockDisponible - cantidadEnCarrito;
                alert(`No hay suficiente stock. Solo puedes agregar ${disponible} unidades más. Stock disponible: ${stockDisponible}`);
                return;
            }
            
            // Agregar o actualizar producto
            if (productoExistente) {
                productoExistente.cantidad = cantidadTotal;
            } else {
                carrito.push({
                    nombre: nombreProducto,
                    precio: precio,
                    cantidad: cantidadDeseada
                });
            }
            
            // Guardar carrito
            guardarCarritoUsuario(carrito);
            actualizarIconoCarrito();
            
            // Resetear input
            inputCantidad.value = 1;
        };
    });
}

/**
 * Inicializa la UI según el estado de sesión
 */
function inicializarUIPrincipal() {
    const usuarioLogueado = localStorage.getItem('usuarioNombre');
    const cantidadControls = document.querySelectorAll('.cantidad-controls');
    const botones = document.querySelectorAll('.btn-agregar');

    if (usuarioLogueado) {
        // Usuario con sesión activa
        document.getElementById('link-login').style.display = 'none';
        document.getElementById('link-crear').style.display = 'none';
        document.getElementById('link-usuario').style.display = 'block';
        
        // Mostrar controles de cantidad
        cantidadControls.forEach(control => {
            control.style.display = 'flex';
        });
        
        configurarBotonesAgregar();
        configurarControlesCantidad();
    } else {
        // Usuario sin sesión
        botones.forEach(boton => {
            boton.onclick = function() {
                window.location.href = '/login';
            };
        });
    }
}

// Inicializar cuando cargue la página
document.addEventListener('DOMContentLoaded', function() {
    inicializarUIPrincipal();
    actualizarIconoCarrito();
});
