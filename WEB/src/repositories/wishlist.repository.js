const dbInstance = require("../config/connection.config");

class WishlistRepository {
    async addProductInWishlist(wishlistId, productId) {
        const pool = dbInstance.getPool();
        const connection = await pool.getConnection();

        try {
            await connection.beginTransaction();

            const [wishlistRows] = await connection.query(
                'SELECT id FROM wishlists WHERE id = ?',
                [wishlistId]
            );
            if (wishlistRows.length === 0) {
                throw new Error('Wishlist no encontrada');
            }

            const [existingRows] = await connection.query(
                'SELECT * FROM wishlist_products WHERE wishlist_id = ? AND product_id = ?',
                [wishlistId, productId]
            );

            if (existingRows.length === 0) {
                await connection.query(
                    'INSERT INTO wishlist_products (wishlist_id, product_id) VALUES (?, ?)',
                    [wishlistId, productId]
                );
            }

            await connection.commit();

            const [wishlistProducts] = await connection.query(
                `SELECT p.id, p.title, p.price, p.image
                 FROM wishlist_products wp
                 JOIN products p ON wp.product_id = p.id
                 WHERE wp.wishlist_id = ?`,
                [wishlistId]
            );

            return {
                message: 'Producto agregado a la wishlist',
                products: wishlistProducts
            };
        } catch (error) {
            await connection.rollback();
            throw new Error('Error al agregar producto a la wishlist: ' + error.message);
        } finally {
            connection.release();
        }
    }

    async getProductsInWishlist(idWishlist) {
        const pool = dbInstance.getPool();
        const connection = await pool.getConnection();

        try {
            const [wishlistRows] = await connection.query(
                "SELECT id FROM wishlists WHERE id = ?",
                [idWishlist]
            );
            if (wishlistRows.length === 0) {
                logger.warn("La wishlist no existe");
                return null;
            }

            const [productos] = await connection.query(
                `SELECT 
                p.id, 
                p.title, 
                p.price, 
                p.image
             FROM wishlist_products wp
             JOIN products p ON wp.product_id = p.id
             WHERE wp.wishlist_id = ?`,
                [idWishlist]
            );

            return {
                wishlistId: idWishlist,
                products: productos,
            };
        } catch (error) {
            logger.error("Error al obtener los productos de la wishlist:", error.message);
            throw new Error("Error al obtener los productos de la wishlist");
        } finally {
            connection.release();
        }
    }

    async deleteProductInWishlist(wishlistId, productId) {
        const pool = dbInstance.getPool();
        const connection = await pool.getConnection();

        try {
            await connection.beginTransaction();

            const [wishlistRows] = await connection.query(
                "SELECT id FROM wishlists WHERE id = ?",
                [wishlistId]
            );
            if (wishlistRows.length === 0) {
                throw new Error("Wishlist no encontrada");
            }

            const [result] = await connection.query(
                "DELETE FROM wishlist_products WHERE wishlist_id = ? AND product_id = ?",
                [wishlistId, productId]
            );

            await connection.commit();

            return {
                message: result.affectedRows > 0
                    ? "Producto eliminado de la wishlist"
                    : "El producto no estaba en la wishlist",
            };
        } catch (error) {
            await connection.rollback();
            throw new Error("Error al eliminar producto de la wishlist: " + error.message);
        } finally {
            connection.release();
        }
    }

    async emptyWishlist(wishlistId) {
        const pool = dbInstance.getPool();
        const connection = await pool.getConnection();

        try {
            await connection.beginTransaction();

            const [wishlistRows] = await connection.query(
                "SELECT id FROM wishlists WHERE id = ?",
                [wishlistId]
            );

            if (wishlistRows.length === 0) {
                throw new Error("Wishlist no encontrada");
            }

            await connection.query(
                "DELETE FROM wishlist_products WHERE wishlist_id = ?",
                [wishlistId]
            );

            await connection.commit();

            return { message: "Wishlist vaciada correctamente" };
        } catch (error) {
            await connection.rollback();
            throw new Error("Error al vaciar wishlist: " + error.message);
        } finally {
            connection.release();
        }
    }

    async getWishlistById(wishlistId) {
        const pool = dbInstance.getPool();
        const connection = await pool.getConnection();

        try {
            const [wishlistRows] = await connection.query(
                "SELECT id FROM wishlists WHERE id = ?",
                [wishlistId]
            );

            if (wishlistRows.length === 0) {
                throw new Error("Wishlist no encontrada");
            }

            const [products] = await connection.query(
                `SELECT 
                p.id, 
                p.title, 
                p.price, 
                p.image
             FROM wishlist_products wp
             JOIN products p ON wp.product_id = p.id
             WHERE wp.wishlist_id = ?`,
                [wishlistId]
            );

            return {
                id: wishlistId,
                products: products,
            };
        } catch (error) {
            throw new Error("Error al obtener wishlist: " + error.message);
        } finally {
            connection.release();
        }
    }
}

module.exports = new WishlistRepository();
