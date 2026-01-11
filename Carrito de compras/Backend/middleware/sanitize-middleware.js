// sanitize-middleware.js
// Middleware para sanitizar inputs en el backend
// Previene SQL Injection y XSS

/**
 * Detecta patrones de inyección SQL
 */
function contieneInyeccionSQL(texto) {
    if (!texto || typeof texto !== 'string') return false;
    
    const patronesPeligrosos = [
        /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|EXECUTE|UNION|DECLARE|SCRIPT)\b)/gi,
        /(--|\#|\/\*|\*\/)/g,
        /('|"|;|\||&|<|>)/g,
        /(\bOR\b.*=.*)/gi,
        /(\bAND\b.*=.*)/gi
    ];
    
    return patronesPeligrosos.some(patron => patron.test(texto));
}

/**
 * Detecta emojis
 */
function contieneEmojis(texto) {
    if (!texto) return false;
    const emojiRegex = /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{2600}-\u{26FF}]/gu;
    return emojiRegex.test(texto);
}

/**
 * Sanitiza un string
 */
function sanitizarString(texto) {
    if (!texto || typeof texto !== 'string') return texto;
    
    return texto
        .replace(/[<>]/g, '')
        .replace(/['"`;]/g, '')
        .replace(/--/g, '')
        .replace(/\/\*/g, '')
        .replace(/\*\//g, '')
        .replace(/\\/g, '')
        .trim();
}

/**
 * Middleware para sanitizar el body de las peticiones
 */
export function sanitizeBody(req, res, next) {
    if (req.body) {
        Object.keys(req.body).forEach(key => {
            const valor = req.body[key];
            
            if (typeof valor === 'string') {
                // Detectar emojis
                if (contieneEmojis(valor)) {
                    console.log(`[SANITIZE-MIDDLEWARE] Emojis detectados en campo: ${key}`);
                    return res.status(400).json({
                        success: false,
                        error: `El campo "${key}" no puede contener emojis`
                    });
                }
                
                // Detectar inyección SQL
                if (contieneInyeccionSQL(valor)) {
                    console.log(`[SANITIZE-MIDDLEWARE] Posible inyección SQL detectada en campo: ${key}`);
                    console.log(`[SANITIZE-MIDDLEWARE] Valor sospechoso: ${valor}`);
                    return res.status(400).json({
                        success: false,
                        error: `El campo "${key}" contiene caracteres no permitidos`
                    });
                }
                
                // Sanitizar el valor
                req.body[key] = sanitizarString(valor);
            }
        });
    }
    
    next();
}

/**
 * Middleware para validar parámetros de URL
 */
export function sanitizeParams(req, res, next) {
    if (req.params) {
        Object.keys(req.params).forEach(key => {
            const valor = req.params[key];
            
            if (typeof valor === 'string') {
                if (contieneInyeccionSQL(valor)) {
                    console.log(`[SANITIZE-MIDDLEWARE] Posible inyección SQL en parámetro: ${key}`);
                    return res.status(400).json({
                        success: false,
                        error: `Parámetro inválido detectado`
                    });
                }
            }
        });
    }
    
    next();
}

/**
 * Middleware combinado (body + params)
 */
export function sanitizeAll(req, res, next) {
    sanitizeBody(req, res, () => {
        sanitizeParams(req, res, next);
    });
}
