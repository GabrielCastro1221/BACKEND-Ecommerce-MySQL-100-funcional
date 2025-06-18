const { logger } = require("../middlewares/logger.middleware");

class ViewsManager {
    async renderIndex(req, res) {
        try {
            res.render("index");
        } catch (error) {
            logger.error("Error al renderizar la pagina principal");
            res.status(500).json({ message: "Internal server error", error: error.message });
        }
    }

    async renderHome(req, res) {
        try {
            res.render("home");
        } catch (error) {
            logger.error("Error al renderizar la pagina de inicio");
            res.status(500).json({ message: "Internal server error", error: error.message });
        }
    }

    async renderStore(req, res) {
        try {
            res.render("store");
        } catch (error) {
            logger.error("Error al renderizar la pagina de la tienda");
            res.status(500).json({ message: "Internal server error", error: error.message });
        }
    }

    async renderProductDetail(req, res) {
        try {
            res.render("productDetail");
        } catch (error) {
            logger.error("Error al renderizar la pagina de detalle del producto");
            res.status(500).json({ message: "Internal server error", error: error.message });
        }
    }

    async renderCart(req, res) {
        try {
            res.render("cart");
        } catch (error) {
            logger.error("Error al renderizar la pagina del carrito de compras");
            res.status(500).json({ message: "Internal server error", error: error.message });
        }
    }

    async renderTicket(req, res) {
        try {
            res.render("ticket");
        } catch (error) {
            logger.error("Error al renderizar la pagina del ticket de compra");
            res.status(500).json({ message: "Internal server error", error: error.message });
        }
    }

    async renderWishlist(req, res) {
        try {
            res.render("wishlist");
        } catch (error) {
            logger.error("Error al renderizar la pagina de la lista de deseos");
            res.status(500).json({ message: "Internal server error", error: error.message });
        }
    }

    async renderProfileUser(req, res) {
        try {
            res.render("profileUser");
        } catch (error) {
            logger.error("Error al renderizar la pagina del perfil de usuario");
            res.status(500).json({ message: "Internal server error", error: error.message });
        }
    }

    async renderProfileAdmin(req, res) {
        try {
            res.render("profileAdmin");
        } catch (error) {
            logger.error("Error al renderizar la pagina del perfil de administrador");
            res.status(500).json({ message: "Internal server error", error: error.message });
        }
    }
}

module.exports = new ViewsManager();