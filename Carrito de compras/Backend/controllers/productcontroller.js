import Product from "../models/productmodel.js";

export const create = async (req, res) => {
    try {
        const product = req.body;
        // Aquí iría la lógica para crear el producto en la BD
        res.status(201).json({ message: "Producto creado", product });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al crear producto" });
    }
};
