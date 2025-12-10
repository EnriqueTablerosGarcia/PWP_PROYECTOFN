import config from '../config/dbconfig.js';
import * as ProductModel from '../models/productmodel.js';

// Obtener todos los productos
export const getAllProducts = async (req, res) => {
    try {
        const productos = await ProductModel.getAllProducts();
        res.json(productos);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al obtener productos" });
    }
};

// Obtener producto por ID
export const getProductById = async (req, res) => {
    try {
        const producto = await ProductModel.getProductById(req.params.id);
        if (producto) {
            res.json(producto);
        } else {
            res.status(404).json({ error: "Producto no encontrado" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al obtener producto" });
    }
};
