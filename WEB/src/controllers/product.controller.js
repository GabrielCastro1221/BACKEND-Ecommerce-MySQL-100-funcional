const ProductRepository = require("../repositories/product.repository");
const { logger } = require("../middlewares/logger.middleware");

class ProductManager {
    async createProd(req, res) {
        try {
            if (!req.files || Object.keys(req.files).length === 0) {
                throw new Error("No se subieron imágenes");
            }

            const image = req.files.image?.[0]?.path || req.files.image?.[0]?.secure_url;

            const thumbnails = req.files.thumbnails
                ? req.files.thumbnails.map((file) => ({
                    url: file.path || file.secure_url,
                    public_id: file.filename || file.public_id,
                }))
                : [];

            const newProd = {
                ...req.body,
                image,
                thumbnails,
            };

            await ProductRepository.createProduct(newProd);
            res.status(201).json({ message: "Producto creado con éxito!", producto: newProd });
        } catch (error) {
            logger.error("Error al crear producto:", error.message);
            res.status(500).json({ message: "Error interno", error: error.message });
        }
    }

    async getPaginatedProducts(req, res) {
        try {
            const { page, limit, sort, query } = req.query;

            const result = await ProductRepository.getPaginatedProducts({
                page,
                limit,
                sort,
                query,
            });

            res.status(200).json(result);
        } catch (error) {
            logger.error("Error al obtener productos paginados:", error.message);
            res.status(500).json({ message: "Error interno", error: error.message });
        }
    }

    async getProductById(req, res) {
        try {
            const { id } = req.params;
            const product = await ProductRepository.getProductById(id);

            res.status(200).json(product);
        } catch (error) {
            logger.error("Error al obtener producto:", error.message);
            res.status(404).json({ message: "Producto no encontrado", error: error.message });
        }
    }

    async updateProduct(req, res) {
        try {
            const { id } = req.params;
            const updateData = { ...req.body };

            if (req.files && Object.keys(req.files).length > 0) {
                if (req.files.image && req.files.image.length > 0) {
                    updateData.image = req.files.image[0].path || req.files.image[0].secure_url;
                }

                if (req.files.thumbnails && req.files.thumbnails.length > 0) {
                    updateData.thumbnails = req.files.thumbnails.map((file) => ({
                        url: file.path || file.secure_url,
                        public_id: file.filename || file.public_id,
                    }));
                }
            }

            const updatedProduct = await ProductRepository.updateProduct(id, updateData);

            res.status(200).json({
                message: "Producto actualizado con éxito",
                producto: updatedProduct,
            });
        } catch (error) {
            logger.error("Error al actualizar producto:", error.message);
            res.status(500).json({ message: "Error interno", error: error.message });
        }
    }

    async deleteProduct(req, res) {
        try {
            const { id } = req.params;

            const deletedProduct = await ProductRepository.deleteProduct(id);

            if (!deletedProduct) {
                return res.status(404).json({ message: "Producto no encontrado" });
            }

            res.status(200).json({
                message: "Producto eliminado con éxito",
                producto: deletedProduct,
            });
        } catch (error) {
            logger.error("Error al eliminar producto:", error.message);
            res.status(500).json({ message: "Error interno", error: error.message });
        }
    }

    async featureProduct(req, res) {
        try {
            const { id } = req.params;

            const updatedProduct = await ProductRepository.featureProduct(id);

            res.status(200).json({
                message: "Estado de destacado actualizado correctamente",
                producto: updatedProduct,
            });
        } catch (error) {
            logger.error("Error al destacar producto:", error.message);
            res.status(500).json({ message: "Error interno", error: error.message });
        }
    }

    async newArrive(req, res) {
        try {
            const { id } = req.params;
            const updatedProduct = await ProductRepository.newArrive(id);

            res.status(200).json({
                message: "Estado de nuevo arribo actualizado correctamente",
                producto: updatedProduct,
            });
        } catch (error) {
            logger.error("Error al marcar nuevo arribo:", error.message);
            res.status(500).json({ message: "Error interno", error: error.message });
        }
    }

    async bestSeller(req, res) {
        try {
            const { id } = req.params;
            const updatedProduct = await ProductRepository.bestSeller(id);

            res.status(200).json({
                message: "Estado de más vendido actualizado correctamente",
                producto: updatedProduct,
            });
        } catch (error) {
            logger.error("Error al marcar como más vendido:", error.message);
            res.status(500).json({ message: "Error interno", error: error.message });
        }
    }
}

module.exports = new ProductManager();
