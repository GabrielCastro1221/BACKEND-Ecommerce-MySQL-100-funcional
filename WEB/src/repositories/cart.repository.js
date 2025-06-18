const dbInstance = require('../config/connection.config');

class CartRepository {
    async addProductInCart(cartId, productId, quantity = 1) {
        const pool = dbInstance.getPool();
        const connection = await pool.getConnection();

        try {
            await connection.beginTransaction();

            const [cartRows] = await connection.query(
                'SELECT id FROM carts WHERE id = ?',
                [cartId]
            );
            if (cartRows.length === 0) {
                throw new Error('Carrito no encontrado');
            }

            const [existingRows] = await connection.query(
                'SELECT quantity FROM cart_products WHERE cart_id = ? AND product_id = ?',
                [cartId, productId]
            );

            if (existingRows.length > 0) {
                const newQuantity = existingRows[0].quantity + quantity;
                await connection.query(
                    'UPDATE cart_products SET quantity = ? WHERE cart_id = ? AND product_id = ?',
                    [newQuantity, cartId, productId]
                );
            } else {
                await connection.query(
                    'INSERT INTO cart_products (cart_id, product_id, quantity) VALUES (?, ?, ?)',
                    [cartId, productId, quantity]
                );
            }

            await connection.commit();

            const [cartProducts] = await connection.query(
                `SELECT p.id, p.title, p.price, cp.quantity
                    FROM cart_products cp
                    JOIN products p ON cp.product_id = p.id
                    WHERE cp.cart_id = ?`,
                [cartId]
            );

            return { message: 'Producto agregado al carrito', products: cartProducts };
        } catch (error) {
            await connection.rollback();
            throw new Error('Error al agregar producto al carrito: ' + error.message);
        } finally {
            connection.release();
        }
    }

    async getProductsInCart(idCarrito) {
        const pool = dbInstance.getPool();
        const connection = await pool.getConnection();

        try {
            const [cartRows] = await connection.query(
                "SELECT id FROM carts WHERE id = ?",
                [idCarrito]
            );
            if (cartRows.length === 0) {
                logger.warn("El carrito no existe");
                return null;
            }

            const [productos] = await connection.query(
                `SELECT 
                        p.id, 
                        p.title, 
                        p.price, 
                        p.image, 
                        cp.quantity
                    FROM cart_products cp
                    JOIN products p ON cp.product_id = p.id
                    WHERE cp.cart_id = ?`,
                [idCarrito]
            );

            return {
                cartId: idCarrito,
                products: productos,
            };
        } catch (error) {
            logger.error("Error al obtener los productos del carrito:", error.message);
            throw new Error("Error al obtener los productos del carrito");
        } finally {
            connection.release();
        }
    }

    async deleteProductInCart(cartId, productId) {
        const pool = dbInstance.getPool();
        const connection = await pool.getConnection();

        try {
            await connection.beginTransaction();

            const [cartRows] = await connection.query(
                "SELECT id FROM carts WHERE id = ?",
                [cartId]
            );
            if (cartRows.length === 0) {
                throw new Error("Carrito no encontrado");
            }

            const [result] = await connection.query(
                "DELETE FROM cart_products WHERE cart_id = ? AND product_id = ?",
                [cartId, productId]
            );

            await connection.commit();

            return {
                message: result.affectedRows > 0
                    ? "Producto eliminado del carrito"
                    : "El producto no estaba en el carrito",
            };
        } catch (error) {
            await connection.rollback();
            throw new Error("Error al eliminar producto del carrito: " + error.message);
        } finally {
            connection.release();
        }
    }

    async emptyCart(cartId) {
        const pool = dbInstance.getPool();
        const connection = await pool.getConnection();

        try {
            await connection.beginTransaction();

            const [cartRows] = await connection.query(
                "SELECT id FROM carts WHERE id = ?",
                [cartId]
            );

            if (cartRows.length === 0) {
                throw new Error("Carrito no encontrado");
            }

            await connection.query(
                "DELETE FROM cart_products WHERE cart_id = ?",
                [cartId]
            );

            await connection.commit();

            return { message: "Carrito vaciado correctamente" };
        } catch (error) {
            await connection.rollback();
            throw new Error("Error al vaciar carrito: " + error.message);
        } finally {
            connection.release();
        }
    }

    async getCartById(cartId) {
        const pool = dbInstance.getPool();
        const connection = await pool.getConnection();

        try {

            const [cartRows] = await connection.query(
                "SELECT id FROM carts WHERE id = ?",
                [cartId]
            );

            if (cartRows.length === 0) {
                throw new Error("Carrito de compras no encontrado");
            }

            const [products] = await connection.query(
                `SELECT 
                        p.id, 
                        p.title, 
                        p.price, 
                        p.image, 
                        cp.quantity 
                    FROM cart_products cp
                    JOIN products p ON cp.product_id = p.id
                    WHERE cp.cart_id = ?`,
                [cartId]
            );

            return {
                id: cartId,
                products: products,
            };
        } catch (error) {
            throw new Error("Error al obtener carrito de compras: " + error.message);
        } finally {
            connection.release();
        }
    }
}

module.exports = new CartRepository();