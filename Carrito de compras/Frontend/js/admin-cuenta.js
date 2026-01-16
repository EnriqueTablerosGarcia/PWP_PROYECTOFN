// admin-cuenta.js
// Verificar autenticación admin
const admin = JSON.parse(localStorage.getItem('admin') || '{}');
if (!admin.id) {
    window.location.href = '/admin/login';
}

// Abrir modal
function openModal(type) {
    if (type === 'password') {
        document.getElementById('passwordModal').classList.add('active');
    } else if (type === 'email') {
        document.getElementById('emailModal').classList.add('active');
    }
}

// Cerrar modal
function closeModal(type) {
    if (type === 'password') {
        document.getElementById('passwordModal').classList.remove('active');
        document.getElementById('passwordForm').reset();
    } else if (type === 'email') {
        document.getElementById('emailModal').classList.remove('active');
        document.getElementById('emailForm').reset();
    }
}

// Cambiar Contraseña
document.getElementById('passwordForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const currentPassword = document.getElementById('currentPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    // Validar que las contraseñas coincidan
    if (newPassword !== confirmPassword) {
        alert('❌ Las contraseñas nuevas no coinciden');
        return;
    }
    
    // Validar longitud mínima
    if (newPassword.length < 6) {
        alert('❌ La contraseña debe tener al menos 6 caracteres');
        return;
    }
    
    try {
        const response = await fetch('/admin/api/cambiar-password', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                adminId: admin.id,
                currentPassword,
                newPassword
            })
        });
        
        const data = await response.json();
        
        if (data.success) {
            alert('✅ Contraseña actualizada exitosamente');
            closeModal('password');
        } else {
            alert('❌ Error: ' + data.error);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('❌ Error al cambiar la contraseña');
    }
});

// Cambiar Correo
document.getElementById('emailForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const newEmail = document.getElementById('newEmail').value;
    const passwordConfirm = document.getElementById('passwordConfirm').value;
    
    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newEmail)) {
        alert('❌ Por favor ingresa un correo válido');
        return;
    }
    
    if (!confirm(`¿Estás seguro de cambiar tu correo a ${newEmail}?\n\nDeberás iniciar sesión nuevamente con el nuevo correo.`)) {
        return;
    }
    
    try {
        const response = await fetch('/admin/api/cambiar-email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                adminId: admin.id,
                newEmail,
                password: passwordConfirm
            })
        });
        
        const data = await response.json();
        
        if (data.success) {
            alert('✅ Correo actualizado exitosamente\n\nSerás redirigido al login para iniciar sesión con tu nuevo correo.');
            localStorage.removeItem('admin');
            window.location.href = '/admin/login';
        } else {
            alert('❌ Error: ' + data.error);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('❌ Error al cambiar el correo');
    }
});

// Cerrar Sesión
function cerrarSesion() {
    if (confirm('¿Estás seguro de cerrar sesión?')) {
        localStorage.removeItem('admin');
        window.location.href = '/admin/login';
    }
}

// Eliminar Cuenta
async function eliminarCuenta() {
    const confirmacion1 = confirm('⚠️ ADVERTENCIA ⚠️\n\n¿Estás seguro de eliminar tu cuenta de administrador?\n\nEsta acción NO SE PUEDE DESHACER.');
    
    if (!confirmacion1) {
        return;
    }
    
    const confirmacion2 = confirm('⚠️ ÚLTIMA CONFIRMACIÓN ⚠️\n\n¿REALMENTE deseas eliminar tu cuenta?\n\nPerderás todos tus privilegios de administrador y no podrás recuperar esta cuenta.');
    
    if (!confirmacion2) {
        alert('✅ Operación cancelada. Tu cuenta se mantiene segura.');
        return;
    }
    
    const password = prompt('Por seguridad, ingresa tu contraseña actual:');
    
    if (!password) {
        alert('❌ Operación cancelada');
        return;
    }
    
    try {
        const response = await fetch('/admin/api/eliminar-cuenta', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                adminId: admin.id,
                password
            })
        });
        
        const data = await response.json();
        
        if (data.success) {
            alert('✅ Cuenta eliminada exitosamente.\n\nHas sido dado de baja del sistema.');
            localStorage.removeItem('admin');
            window.location.href = '/';
        } else {
            alert('❌ Error: ' + data.error);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('❌ Error al eliminar la cuenta');
    }
}

// Cerrar modales al hacer clic fuera
document.getElementById('passwordModal').addEventListener('click', (e) => {
    if (e.target.id === 'passwordModal') {
        closeModal('password');
    }
});

document.getElementById('emailModal').addEventListener('click', (e) => {
    if (e.target.id === 'emailModal') {
        closeModal('email');
    }
});
