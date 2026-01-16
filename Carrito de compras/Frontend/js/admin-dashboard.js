// admin-dashboard.js - JavaScript para el Dashboard de Admin

// Verificar autenticación admin
function verificarAutenticacion() {
    const admin = JSON.parse(localStorage.getItem('admin') || '{}');
    if (!admin.id) {
        window.location.href = '/admin/login';
    }
}

// Ejecutar al cargar
document.addEventListener('DOMContentLoaded', verificarAutenticacion);
