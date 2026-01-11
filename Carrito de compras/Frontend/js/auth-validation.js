// auth-validation.js
// Validaciones de autenticación: login y registro
// Incluye protección contra emojis, SQL Injection y XSS

/**
 * Valida que el correo sea de @gmail.com o @hotmail.com
 * @param {string} email - Correo electrónico a validar
 * @returns {boolean} - true si es válido, false si no
 */
function validarCorreo(email) {
    const emailPattern = /^[a-zA-Z0-9._-]+@(gmail\.com|hotmail\.com)$/;
    return emailPattern.test(email);
}

/**
 * Inicializa la validación del formulario de login
 */
function inicializarValidacionLogin() {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(evento) {
            const email = document.getElementById('emailLogin').value;
            const password = document.getElementById('passwordLogin').value;
            
            // Validar correo con sanitize.js (si está disponible)
            if (typeof validarEmailSeguro === 'function') {
                const resultadoEmail = validarEmailSeguro(email);
                if (!resultadoEmail.valido) {
                    evento.preventDefault();
                    alert(resultadoEmail.error);
                    return false;
                }
            } else {
                // Validación básica si sanitize.js no está cargado
                if (!validarCorreo(email)) {
                    evento.preventDefault();
                    alert('Solo se permiten correos de @gmail.com o @hotmail.com');
                    return false;
                }
            }
            
            // Validar contraseña (si sanitize.js está disponible)
            if (typeof validarPasswordSeguro === 'function') {
                const resultadoPassword = validarPasswordSeguro(password);
                if (!resultadoPassword.valido) {
                    evento.preventDefault();
                    alert(resultadoPassword.error);
                    return false;
                }
            }
        });
    }
}

/**
 * Inicializa la validación del formulario de registro
 */
function inicializarValidacionRegistro() {
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', function(evento) {
            const email = document.getElementById('emailRegister').value;
            const password = document.getElementById('passwordRegister').value;
            
            // Validar correo con sanitize.js (si está disponible)
            if (typeof validarEmailSeguro === 'function') {
                const resultadoEmail = validarEmailSeguro(email);
                if (!resultadoEmail.valido) {
                    evento.preventDefault();
                    alert(resultadoEmail.error);
                    return false;
                }
            } else {
                // Validación básica si sanitize.js no está cargado
                if (!validarCorreo(email)) {
                    evento.preventDefault();
                    alert('Solo se permiten correos de @gmail.com o @hotmail.com');
                    return false;
                }
            }
            
            // Validar contraseña (si sanitize.js está disponible)
            if (typeof validarPasswordSeguro === 'function') {
                const resultadoPassword = validarPasswordSeguro(password);
                if (!resultadoPassword.valido) {
                    evento.preventDefault();
                    alert(resultadoPassword.error);
                    return false;
                }
            }
        });
    }
}

// Inicializar validaciones cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    inicializarValidacionLogin();
    inicializarValidacionRegistro();
});
