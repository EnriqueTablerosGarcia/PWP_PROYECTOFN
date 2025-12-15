// usuario-page.js
// Lógica de la página de información del usuario

let usuario = null;

/**
 * Carga los datos del usuario desde el servidor o localStorage
 */
function cargarDatosUsuario() {
    const usuarioEmail = localStorage.getItem('usuarioEmail');
    if (usuarioEmail) {
        const cuadro = document.querySelector('.cuadro');
        if (cuadro) {
            cuadro.textContent = usuarioEmail;
        }
    } else {
        window.location.href = '/login';
    }
}

/**
 * Cierra la sesión del usuario
 */
function cerrarSesion() {
    const usuario = JSON.parse(localStorage.getItem('usuario'));
    const usuarioId = usuario ? usuario.id : localStorage.getItem('usuarioId');
    
    // Guardar carrito antes de cerrar sesión
    const carritoActual = localStorage.getItem('carrito');
    if (carritoActual && usuarioId) {
        localStorage.setItem(`carrito_usuario_${usuarioId}`, carritoActual);
    }
    
    // Limpiar datos de sesión
    localStorage.removeItem('usuario');
    localStorage.removeItem('usuarioNombre');
    localStorage.removeItem('usuarioEmail');
    localStorage.removeItem('usuarioId');
    localStorage.removeItem('carrito');
    
    alert('Sesión cerrada exitosamente. Tu carrito se ha guardado.');
    window.location.replace('/principal');
    
    // Prevenir navegación hacia atrás
    history.pushState(null, null, location.href);
    window.onpopstate = function() {
        history.go(1);
    };
}

/**
 * Elimina la cuenta del usuario con confirmación doble
 */
function eliminarCuenta() {
    const usuario = JSON.parse(localStorage.getItem('usuario'));
    
    if (!usuario || !usuario.id) {
        alert('No hay sesión activa');
        window.location.href = '/login';
        return;
    }

    // Primera confirmación
    if (confirm('¿Estás seguro de que quieres eliminar tu cuenta?\n\nEsta acción eliminará permanentemente:\n- Tus datos personales\n- Tu historial de compras\n- Tu carrito guardado\n\n¿Deseas continuar?')) {
        // Segunda confirmación
        if (confirm('ÚLTIMA CONFIRMACIÓN\n\n¿Realmente deseas eliminar tu cuenta de forma PERMANENTE?\n\nEsta acción NO SE PUEDE DESHACER.')) {
            const usuarioId = usuario.id;
            const carrito = obtenerCarritoUsuario();
            localStorage.setItem(`carrito_usuario_${usuarioId}`, JSON.stringify(carrito));

            // Enviar solicitud al servidor
            fetch('/eliminar-cuenta', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id: usuario.id })
            })
            .then(respuesta => respuesta.json())
            .then(datos => {
                if (datos.success) {
                    // Limpiar todo localStorage
                    localStorage.removeItem('usuario');
                    localStorage.removeItem('usuarioNombre');
                    localStorage.removeItem('usuarioEmail');
                    localStorage.removeItem('usuarioId');
                    localStorage.removeItem('carrito');
                    localStorage.removeItem('carritoActual');
                    localStorage.removeItem('totalActual');
                    localStorage.removeItem('carritoComprado');
                    localStorage.removeItem('totalCompra');
                    localStorage.removeItem(`carrito_usuario_${usuarioId}`);
                    
                    alert('Tu cuenta ha sido eliminada exitosamente.\n\nTodos tus datos han sido borrados del sistema.');
                    window.location.replace('/principal');
                    
                    // Prevenir navegación hacia atrás
                    history.pushState(null, null, location.href);
                    window.onpopstate = function() {
                        history.go(1);
                    };
                } else {
                    alert('Error al eliminar la cuenta: ' + datos.message);
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Error al eliminar la cuenta. Por favor intenta de nuevo.');
            });
        } else {
            alert('Eliminación de cuenta cancelada. Tu cuenta se mantiene activa.');
        }
    } else {
        alert('Eliminación de cuenta cancelada.');
    }
}

// Inicializar página de usuario
document.addEventListener('DOMContentLoaded', function() {
    cargarDatosUsuario();
    actualizarIconoCarrito();
});
