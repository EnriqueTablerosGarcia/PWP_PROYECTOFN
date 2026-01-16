import { Router } from 'express';
import * as ventasController from '../controllers/ventascontroller.js';

const router = Router();

// Crear una nueva venta desde el carrito
router.post('/crear', ventasController.crearVenta);

// Obtener todas las ventas (admin) - DEBE IR ANTES de las rutas con parámetros
router.get('/', ventasController.getAllVentas);

// Obtener ventas de un usuario específico
router.get('/usuario/:usuarioId', ventasController.getVentasByUser);

// Obtener detalle de una venta específica
router.get('/:ventaId/detalle', ventasController.getDetalleVenta);

export default router;
