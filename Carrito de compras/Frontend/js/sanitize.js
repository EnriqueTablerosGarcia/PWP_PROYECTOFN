// sanitize.js
// Utilidades para prevenir inyección de código (SQL Injection, XSS)
// y validar inputs maliciosos

/**
 * Detecta si un texto contiene emojis
 * @param {string} texto - Texto a validar
 * @returns {boolean} - true si contiene emojis, false si no
 */
function contieneEmojis(texto) {
    if (!texto) return false;
    
    // Regex para detectar emojis (incluye todos los rangos Unicode de emojis)
    const emojiRegex = /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F700}-\u{1F77F}]|[\u{1F780}-\u{1F7FF}]|[\u{1F800}-\u{1F8FF}]|[\u{1F900}-\u{1F9FF}]|[\u{1FA00}-\u{1FA6F}]|[\u{1FA70}-\u{1FAFF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{1F191}-\u{1F251}]|[\u{1F004}]|[\u{1F0CF}]|[\u{1F170}-\u{1F171}]|[\u{1F17E}-\u{1F17F}]|[\u{1F18E}]|[\u{3030}]|[\u{2B50}]|[\u{2B55}]|[\u{2934}-\u{2935}]|[\u{2B05}-\u{2B07}]|[\u{2B1B}-\u{2B1C}]|[\u{3297}]|[\u{3299}]|[\u{303D}]|[\u{00A9}]|[\u{00AE}]|[\u{2122}]|[\u{23F0}-\u{23F3}]|[\u{23F8}-\u{23FA}]/gu;
    
    return emojiRegex.test(texto);
}

/**
 * Detecta patrones de inyección SQL
 * @param {string} texto - Texto a validar
 * @returns {boolean} - true si contiene patrones sospechosos, false si no
 */
function contieneInyeccionSQL(texto) {
    if (!texto || typeof texto !== 'string') return false;
    
    const patronesPeligrosos = [
        /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|EXECUTE|UNION|DECLARE)\b)/gi,
        /(--|\#|\/\*|\*\/)/g,  // Comentarios SQL
        /('|"|;|\||&)/g,        // Caracteres especiales SQL
        /(\bOR\b.*=.*)/gi,      // OR 1=1
        /(\bAND\b.*=.*)/gi,     // AND 1=1
        /<script[^>]*>.*?<\/script>/gi,  // Scripts
        /<iframe[^>]*>/gi,      // iframes
        /javascript:/gi,         // javascript: protocol
        /on\w+\s*=/gi           // onclick, onerror, etc.
    ];
    
    return patronesPeligrosos.some(patron => patron.test(texto));
}

/**
 * Detecta intentos de Cross-Site Scripting (XSS)
 * @param {string} texto - Texto a validar
 * @returns {boolean} - true si contiene patrones XSS, false si no
 */
function contieneXSS(texto) {
    if (!texto || typeof texto !== 'string') return false;
    
    const patronesXSS = [
        /<script[^>]*>.*?<\/script>/gi,
        /<iframe[^>]*>/gi,
        /<embed[^>]*>/gi,
        /<object[^>]*>/gi,
        /javascript:/gi,
        /on\w+\s*=/gi,
        /<img[^>]*onerror/gi,
        /<svg[^>]*onload/gi,
        /eval\s*\(/gi,
        /alert\s*\(/gi,
        /prompt\s*\(/gi,
        /confirm\s*\(/gi
    ];
    
    return patronesXSS.some(patron => patron.test(texto));
}

/**
 * Sanitiza un texto removiendo caracteres peligrosos
 * @param {string} texto - Texto a sanitizar
 * @returns {string} - Texto sanitizado
 */
function sanitizarTexto(texto) {
    if (!texto || typeof texto !== 'string') return '';
    
    return texto
        .replace(/[<>]/g, '')           // Remover < >
        .replace(/['"`;]/g, '')         // Remover comillas y punto y coma
        .replace(/--/g, '')             // Remover comentarios SQL
        .replace(/\/\*/g, '')           // Remover inicio comentario
        .replace(/\*\//g, '')           // Remover fin comentario
        .replace(/\\/g, '')             // Remover backslash
        .trim();
}

/**
 * Valida un input completo (emojis, SQL injection, XSS)
 * @param {string} texto - Texto a validar
 * @param {string} nombreCampo - Nombre del campo para el mensaje de error
 * @returns {object} - {valido: boolean, error: string}
 */
function validarInput(texto, nombreCampo = 'El campo') {
    if (!texto) {
        return { valido: false, error: `${nombreCampo} no puede estar vacío` };
    }
    
    if (contieneEmojis(texto)) {
        return { 
            valido: false, 
            error: `${nombreCampo} no puede contener emojis` 
        };
    }
    
    if (contieneInyeccionSQL(texto)) {
        return { 
            valido: false, 
            error: `${nombreCampo} contiene caracteres no permitidos` 
        };
    }
    
    if (contieneXSS(texto)) {
        return { 
            valido: false, 
            error: `${nombreCampo} contiene caracteres no permitidos` 
        };
    }
    
    return { valido: true, error: null };
}

/**
 * Valida que un correo electrónico sea seguro
 * @param {string} email - Email a validar
 * @returns {object} - {valido: boolean, error: string}
 */
function validarEmailSeguro(email) {
    // Primero validar formato básico
    const emailPattern = /^[a-zA-Z0-9._-]+@(gmail\.com|hotmail\.com)$/;
    
    if (!email) {
        return { valido: false, error: 'El correo no puede estar vacío' };
    }
    
    if (contieneEmojis(email)) {
        return { 
            valido: false, 
            error: 'El correo no puede contener emojis' 
        };
    }
    
    if (contieneInyeccionSQL(email) || contieneXSS(email)) {
        return { 
            valido: false, 
            error: 'El correo contiene caracteres no permitidos' 
        };
    }
    
    if (!emailPattern.test(email)) {
        return { 
            valido: false, 
            error: 'Solo se permiten correos de @gmail.com o @hotmail.com' 
        };
    }
    
    return { valido: true, error: null };
}

/**
 * Valida que una contraseña sea segura (sin emojis ni código malicioso)
 * @param {string} password - Contraseña a validar
 * @returns {object} - {valido: boolean, error: string}
 */
function validarPasswordSeguro(password) {
    if (!password) {
        return { valido: false, error: 'La contraseña no puede estar vacía' };
    }
    
    if (password.length < 6) {
        return { valido: false, error: 'La contraseña debe tener al menos 6 caracteres' };
    }
    
    if (contieneEmojis(password)) {
        return { 
            valido: false, 
            error: 'La contraseña no puede contener emojis' 
        };
    }
    
    if (contieneInyeccionSQL(password) || contieneXSS(password)) {
        return { 
            valido: false, 
            error: 'La contraseña contiene caracteres no permitidos' 
        };
    }
    
    return { valido: true, error: null };
}
