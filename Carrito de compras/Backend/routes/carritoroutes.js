import { Router } from 'express';
import * as carritoController from '../controllers/carritocontroller.js';

const router = Router();

// Agregar producto al carrito
router.post('/add', carritoController.addToCarrito);

// Actualizar cantidad de producto en carrito
router.put('/update', carritoController.updateCarrito);

// Eliminar producto del carrito
router.delete('/remove', carritoController.removeFromCarrito);

// Vaciar carrito
router.delete('/clear', carritoController.clearCarrito);

// Obtener total del carrito (DEBE IR ANTES de /:usuarioId para evitar conflicto)
router.get('/:usuarioId/total', carritoController.getTotal);

// Obtener carrito de un usuario
router.get('/:usuarioId', carritoController.getCarrito);

export default router;
