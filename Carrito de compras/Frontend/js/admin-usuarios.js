// admin-usuarios.js - JavaScript para Gestión de Usuarios

// Verificar autenticación admin
const admin = JSON.parse(localStorage.getItem('admin') || '{}');
if (!admin.id) {
    window.location.href = '/admin/login';
}

let usuarios = [];
let usuariosFiltrados = [];

// Cargar usuarios
async function cargarUsuarios() {
    try {
        const response = await fetch('/admin/api/usuarios');
        const data = await response.json();
        
        if (data.success) {
            usuarios = data.usuarios;
            usuariosFiltrados = usuarios;
            renderUsuarios();
        }
    } catch (error) {
        console.error('Error al cargar usuarios:', error);
    }
}

// Renderizar tabla
function renderUsuarios() {
    const tbody = document.getElementById('usuariosBody');
    tbody.innerHTML = '';
    
    document.getElementById('totalUsuarios').textContent = usuariosFiltrados.length;
    
    if (usuariosFiltrados.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 40px;">No se encontraron usuarios</td></tr>';
        return;
    }
    
    usuariosFiltrados.forEach(usuario => {
        const fecha = new Date(usuario.created_at).toLocaleDateString('es-MX');
        const isAdmin = usuario.rol === 'admin';
        
        // Botones de acción
        let actionButtons = `<button class="btn-view" onclick="verHistorial(${usuario.id})">📊 Ver Historial</button>`;
        
        // Si es admin, mostrar botón para quitar admin
        if (isAdmin) {
            actionButtons += `<button class="btn-remove-admin" onclick="cambiarRol(${usuario.id}, 'usuario')">⬇️ Quitar Admin</button>`;
        } else {
            // Si es usuario normal, mostrar botones para hacer admin y eliminar
            actionButtons += `<button class="btn-admin" onclick="cambiarRol(${usuario.id}, 'admin')">⭐ Hacer Admin</button>`;
            actionButtons += `<button class="btn-delete" onclick="eliminarUsuario(${usuario.id})">🗑️ Eliminar</button>`;
        }
        
        tbody.innerHTML += `
            <tr>
                <td>${usuario.id}</td>
                <td><strong>${usuario.nombre}</strong></td>
                <td>${usuario.email}</td>
                <td>${isAdmin ? '<span class="admin-badge">👑 ADMIN</span>' : '<span class="user-badge">👤 Usuario</span>'}</td>
                <td>${fecha}</td>
                <td>${actionButtons}</td>
            </tr>
        `;
    });
}

// Buscar usuarios
function buscarUsuarios() {
    const search = document.getElementById('searchInput').value.toLowerCase();
    
    usuariosFiltrados = usuarios.filter(usuario => 
        usuario.nombre.toLowerCase().includes(search) ||
        usuario.email.toLowerCase().includes(search)
    );
    
    renderUsuarios();
}

// Limpiar búsqueda
function limpiarBusqueda() {
    document.getElementById('searchInput').value = '';
    usuariosFiltrados = usuarios;
    renderUsuarios();
}

// Ver historial de compras
async function verHistorial(usuarioId) {
    try {
        const usuario = usuarios.find(u => u.id === usuarioId);
        
        document.getElementById('userInfo').innerHTML = `
            <p><strong>Nombre:</strong> ${usuario.nombre}</p>
            <p><strong>Email:</strong> ${usuario.email}</p>
            <p><strong>Fecha Registro:</strong> ${new Date(usuario.created_at).toLocaleDateString('es-MX')}</p>
        `;
        
        const response = await fetch(`/api/ventas/usuario/${usuarioId}`);
        const data = await response.json();
        
        const historialBody = document.getElementById('historialBody');
        historialBody.innerHTML = '';
        
        if (data.success && data.ventas.length > 0) {
            data.ventas.forEach(venta => {
                const fecha = new Date(venta.fecha).toLocaleString('es-MX');
                
                historialBody.innerHTML += `
                    <tr>
                        <td><strong>#${venta.id}</strong></td>
                        <td>$${parseFloat(venta.total).toFixed(2)}</td>
                        <td>${fecha}</td>
                        <td>
                            <button class="btn-view" onclick="verDetalleVenta(${venta.id})">Ver Detalle</button>
                        </td>
                    </tr>
                `;
            });
        } else {
            historialBody.innerHTML = '<tr><td colspan="4" style="text-align: center; padding: 30px;">No hay compras registradas</td></tr>';
        }
        
        document.getElementById('historialModal').classList.add('active');
    } catch (error) {
        console.error('Error:', error);
        alert('Error al cargar historial');
    }
}

// Ver detalle de venta (redirige a admin-ventas)
function verDetalleVenta(ventaId) {
    window.location.href = `/admin/ventas?venta=${ventaId}`;
}

// Cerrar modal
function cerrarHistorial() {
    document.getElementById('historialModal').classList.remove('active');
}

// Eliminar usuario
async function eliminarUsuario(id) {
    if (!confirm('¿Estás seguro de eliminar este usuario? Esta acción no se puede deshacer.')) return;
    
    try {
        const response = await fetch('/eliminar-cuenta', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id })
        });
        
        const data = await response.json();
        
        if (data.success) {
            alert('Usuario eliminado exitosamente');
            cargarUsuarios();
        } else {
            alert('Error: ' + data.message);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error al eliminar usuario');
    }
}

// Cambiar rol de usuario (otorgar o quitar admin)
async function cambiarRol(id, nuevoRol) {
    const usuario = usuarios.find(u => u.id === id);
    const mensaje = nuevoRol === 'admin' 
        ? `¿Otorgar permisos de ADMINISTRADOR a ${usuario.nombre}?`
        : `¿Quitar permisos de administrador a ${usuario.nombre}?`;
    
    if (!confirm(mensaje)) return;
    
    try {
        const response = await fetch(`/admin/api/usuarios/${id}/cambiar-rol`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ rol: nuevoRol })
        });
        
        const data = await response.json();
        
        if (data.success) {
            const mensajeExito = nuevoRol === 'admin'
                ? `✅ ${usuario.nombre} ahora es ADMINISTRADOR`
                : `✅ Permisos de administrador removidos de ${usuario.nombre}`;
            alert(mensajeExito);
            cargarUsuarios();
        } else {
            alert('Error: ' + data.error);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error al cambiar el rol del usuario');
    }
}

// Cerrar modal al hacer clic fuera
document.getElementById('historialModal').addEventListener('click', (e) => {
    if (e.target.id === 'historialModal') {
        cerrarHistorial();
    }
});

// Cargar usuarios al iniciar
cargarUsuarios();
