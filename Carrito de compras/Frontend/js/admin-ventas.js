// admin-ventas.js - JavaScript para Gestión de Ventas

// Verificar autenticación admin
const admin = JSON.parse(localStorage.getItem('admin') || '{}');
if (!admin.id) {
    window.location.href = '/admin/login';
}

let ventas = [];
let ventasFiltradas = [];

// Cargar ventas
async function cargarVentas() {
    try {
        const response = await fetch('/api/ventas');
        const data = await response.json();
        
        if (data.success) {
            ventas = data.ventas;
            ventasFiltradas = ventas;
            renderVentas();
            calcularEstadisticas();
        }
    } catch (error) {
        console.error('Error al cargar ventas:', error);
    }
}

// Renderizar tabla
function renderVentas() {
    const tbody = document.getElementById('ventasBody');
    tbody.innerHTML = '';
    
    if (ventasFiltradas.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 40px;">No hay ventas para mostrar</td></tr>';
        return;
    }
    
    ventasFiltradas.forEach(venta => {
        const fecha = new Date(venta.fecha).toLocaleString('es-MX');
        
        tbody.innerHTML += `
            <tr>
                <td><strong>#${venta.id}</strong></td>
                <td>${venta.nombre_usuario}</td>
                <td>${venta.email}</td>
                <td><strong>$${parseFloat(venta.total).toFixed(2)}</strong></td>
                <td>${fecha}</td>
                <td>
                    <button class="btn-view" onclick="verDetalle(${venta.id})">👁️ Ver Detalle</button>
                </td>
            </tr>
        `;
    });
}

// Calcular estadísticas
function calcularEstadisticas() {
    const total = ventasFiltradas.length;
    const ingresos = ventasFiltradas.reduce((sum, v) => sum + parseFloat(v.total), 0);
    const promedio = total > 0 ? ingresos / total : 0;
    
    document.getElementById('totalVentas').textContent = total;
    document.getElementById('ingresosTotales').textContent = '$' + ingresos.toFixed(2);
    document.getElementById('promedioVenta').textContent = '$' + promedio.toFixed(2);
}

// Ver detalle de venta
async function verDetalle(ventaId) {
    try {
        const response = await fetch(`/api/ventas/${ventaId}/detalle`);
        const data = await response.json();
        
        if (data.success) {
            const { venta, detalles } = data;
            
            document.getElementById('ventaIdDetalle').textContent = venta.id;
            
            const fecha = new Date(venta.fecha).toLocaleString('es-MX');
            document.getElementById('detalleHeader').innerHTML = `
                <p><strong>Usuario:</strong> ${venta.nombre_usuario}</p>
                <p><strong>Email:</strong> ${venta.email}</p>
                <p><strong>Fecha:</strong> ${fecha}</p>
                <p><strong>Total:</strong> $${parseFloat(venta.total).toFixed(2)}</p>
            `;
            
            const detalleBody = document.getElementById('detalleBody');
            detalleBody.innerHTML = '';
            
            detalles.forEach(detalle => {
                detalleBody.innerHTML += `
                    <tr>
                        <td>${detalle.nombre}</td>
                        <td>${detalle.cantidad}</td>
                        <td>$${parseFloat(detalle.precio_unitario).toFixed(2)}</td>
                        <td><strong>$${parseFloat(detalle.subtotal).toFixed(2)}</strong></td>
                    </tr>
                `;
            });
            
            document.getElementById('detalleModal').classList.add('active');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error al cargar detalle');
    }
}

// Cerrar modal
function cerrarDetalle() {
    document.getElementById('detalleModal').classList.remove('active');
}

// Filtrar ventas
function filtrarVentas() {
    const fechaDesde = document.getElementById('fechaDesde').value;
    const fechaHasta = document.getElementById('fechaHasta').value;
    
    ventasFiltradas = ventas.filter(venta => {
        const fechaVenta = new Date(venta.fecha).toISOString().split('T')[0];
        
        if (fechaDesde && fechaVenta < fechaDesde) return false;
        if (fechaHasta && fechaVenta > fechaHasta) return false;
        
        return true;
    });
    
    renderVentas();
    calcularEstadisticas();
}

// Limpiar filtros
function limpiarFiltros() {
    document.getElementById('fechaDesde').value = '';
    document.getElementById('fechaHasta').value = '';
    ventasFiltradas = ventas;
    renderVentas();
    calcularEstadisticas();
}

// Cerrar modal al hacer clic fuera
document.getElementById('detalleModal').addEventListener('click', (e) => {
    if (e.target.id === 'detalleModal') {
        cerrarDetalle();
    }
});

// Cargar ventas al iniciar
cargarVentas();
