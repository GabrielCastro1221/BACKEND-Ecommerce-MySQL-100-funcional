const CartRepository = require("../repositories/cart.repository");

class CartManager {
    async addProductInCart(req, res) {
        const { cid: cartId, pid: productId } = req.params;
        const { quantity = 1 } = req.body;

        try {
            const result = await CartRepository.addProductInCart(
                cartId,
                productId,
                quantity
            );

            res.status(200).json({
                message: result.message,
                products: result.products,
            });
        } catch (error) {
            res.status(500).json({
                message: "Error al agregar producto al carrito",
                error: error.message,
            });
        }
    }

    async getProductsInCart(req, res) {
        const { cid: cartId } = req.params;

        try {
            const cart = await CartRepository.getProductsInCart(cartId);

            if (!cart) {
                return res.status(404).json({
                    message: "Carrito no encontrado",
                });
            }

            res.status(200).json(cart);
        } catch (error) {
            res.status(500).json({
                message: "Error al obtener los productos del carrito",
                error: error.message,
            });
        }
    }

    async deleteProductInCart(req, res) {
        const { cid: cartId, pid: productId } = req.params;

        try {
            const result = await CartRepository.deleteProductInCart(cartId, productId);

            res.status(200).json(result);
        } catch (error) {
            res.status(500).json({
                message: "Error al eliminar producto del carrito",
                error: error.message,
            });
        }
    }

    async emptyCart(req, res) {
        const { cid: cartId } = req.params;

        try {
            const result = await CartRepository.emptyCart(cartId);

            res.status(200).json(result);
        } catch (error) {
            res.status(500).json({
                message: "Error al vaciar el carrito",
                error: error.message,
            });
        }
    }

    async getCartById(req, res) {
        const { cid: cartId } = req.params;

        try {
            const result = await CartRepository.getCartById(cartId);

            res.status(200).json(result);
        } catch (error) {
            res.status(500).json({
                message: "Error al obtener el carrito de compras",
                error: error.message,
            });
        }
    }

}

module.exports = new CartManager();
