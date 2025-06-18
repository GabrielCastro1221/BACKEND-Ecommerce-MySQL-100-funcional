const WishlistRepository = require("../repositories/wishlist.repository");

class WishlistManager {
    async addProductInWishlist(req, res) {
        const { wid: wishlistId, pid: productId } = req.params;

        try {
            const result = await WishlistRepository.addProductInWishlist(wishlistId, productId);

            res.status(200).json({
                message: result.message,
                products: result.products,
            });
        } catch (error) {
            res.status(500).json({
                message: "Error al agregar producto a la wishlist",
                error: error.message,
            });
        }
    }

    async getProductsInWishlist(req, res) {
        const { wid: wishlistId } = req.params;

        try {
            const result = await WishlistRepository.getProductsInWishlist(wishlistId);

            if (!result) {
                return res.status(404).json({ message: "Wishlist no encontrada" });
            }

            res.status(200).json(result);
        } catch (error) {
            res.status(500).json({
                message: "Error al obtener productos de la wishlist",
                error: error.message,
            });
        }
    }

    async deleteProductInWishlist(req, res) {
        const { wid: wishlistId, pid: productId } = req.params;

        try {
            const result = await WishlistRepository.deleteProductInWishlist(wishlistId, productId);

            res.status(200).json(result);
        } catch (error) {
            res.status(500).json({
                message: "Error al eliminar producto de la wishlist",
                error: error.message,
            });
        }
    }

    async emptyWishlist(req, res) {
        const { wid: wishlistId } = req.params;

        try {
            const result = await WishlistRepository.emptyWishlist(wishlistId);

            res.status(200).json(result);
        } catch (error) {
            res.status(500).json({
                message: "Error al vaciar wishlist",
                error: error.message,
            });
        }
    }

    async getWishlistById(req, res) {
        const { wid: wishlistId } = req.params;

        try {
            const result = await WishlistRepository.getWishlistById(wishlistId);

            res.status(200).json(result);
        } catch (error) {
            res.status(500).json({
                message: "Error al obtener wishlist",
                error: error.message,
            });
        }
    }
}

module.exports = new WishlistManager();
