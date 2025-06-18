const ProductRepository = require("../../repositories/product.repository");
const { logger } = require("../../middlewares/logger.middleware");

class SocketProduct {
    constructor(io) {
        this.io = io;
        this.initSocketEvents();
    }

    initSocketEvents() {
        this.io.on("connection", async (socket) => {
            logger.info("WebSocket de productos conectado");

            await this.emitPaginatedProducts(socket, {
                page: 1,
                limit: 6,
                sort: "asc",
                query: null,
            });

            socket.on("featureProd", async (id) => {
                try {
                    await ProductRepository.featureProduct(id);
                    this.io.emit("productFeatured", { id });
                    await this.emitPaginatedProducts();
                } catch (error) {
                    logger.error("Error al destacar producto:", error.message);
                    socket.emit("error", "Error al destacar el producto");
                }
            });

            socket.on("newArrive", async (id) => {
                try {
                    await ProductRepository.newArrive(id);
                    this.io.emit("productNewArrival", { id });
                    await this.emitPaginatedProducts();
                } catch (error) {
                    logger.error("Error al marcar nuevo arribo:", error.message);
                    socket.emit("error", "Error al marcar como nuevo arribo");
                }
            });

            socket.on("bestSeller", async (id) => {
                try {
                    await ProductRepository.bestSeller(id);
                    this.io.emit("productBestSeller", { id });
                    await this.emitPaginatedProducts();
                } catch (error) {
                    logger.error("Error al marcar más vendido:", error.message);
                    socket.emit("error", "Error al marcar como más vendido");
                }
            });

            socket.on("deleteProd", async (id) => {
                try {
                    await ProductRepository.deleteProduct(id);
                    this.io.emit("productDeleted", { id });
                    await this.emitPaginatedProducts();
                } catch (error) {
                    logger.error("Error al eliminar producto:", error.message);
                    socket.emit("error", "Error al eliminar producto");
                }
            });

            socket.on("getPaginatedProducts", async (params) => {
                try {
                    await this.emitPaginatedProducts(socket, params);
                } catch (error) {
                    logger.error("Error al obtener productos paginados:", error.message);
                    socket.emit("error", "Error al obtener productos paginados");
                }
            });

            socket.on("getProductById", async (id) => {
                try {
                    const prod = await ProductRepository.getProductById(id);
                    socket.emit("productDetail", prod);
                } catch (error) {
                    logger.error("Error al obtener producto por ID:", error.message);
                    socket.emit("error", "Error al obtener producto por ID");
                }
            });

            socket.on("updateProduct", async ({ id, updateData }) => {
                try {
                    const updatedProduct = await ProductRepository.updateProduct(id, updateData);
                    this.io.emit("productUpdated", updatedProduct);
                    await this.emitPaginatedProducts();
                } catch (error) {
                    logger.error("Error al actualizar producto:", error.message);
                    socket.emit("error", "Error al actualizar producto");
                }
            });
        });
    }

    async emitPaginatedProducts(targetSocket = null, queryParams = { page: 1, limit: 6, sort: "asc", query: null }) {
        try {
            const result = await ProductRepository.getPaginatedProducts(queryParams);

            const payload = {
                productos: result.productos.map((producto) => ({
                    id: producto._id,
                    type_product: producto.type_product,
                    ...producto,
                })),
                categorias: result.categorias,
                pagination: result.pagination,
            };

            if (targetSocket) {
                targetSocket.emit("products", payload);
            } else {
                this.io.emit("products", payload);
            }
        } catch (error) {
            logger.error("Error al emitir productos paginados:", error.message);
            if (targetSocket) {
                targetSocket.emit("error", "Error al obtener productos paginados");
            }
        }
    }
}

module.exports = SocketProduct;
