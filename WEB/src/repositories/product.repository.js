const dbInstance = require("../config/connection.config");
const { v4: uuidv4 } = require("uuid");
const { logger } = require("../middlewares/logger.middleware");

class ProductRepository {


    async createProduct({
        title,
        price,
        description,
        stock,
        type_product = 'Normal',
        category,
        image,
        thumbnails = [],
        brand,
        offer_percentage = 0
    }) {
        const pool = dbInstance.getPool();
        const connection = await pool.getConnection();

        try {
            await connection.beginTransaction();

            if (!title || !price || !description || !stock || !category || !brand) {
                throw new Error('Todos los campos obligatorios deben ser proporcionados');
            }

            const productId = uuidv4();
            const productCode = uuidv4();

            await connection.query(
                `INSERT INTO products (
                id, title, price, description, image, type_product,
                offer_percentage, code, stock, category, brand
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    productId,
                    title,
                    price,
                    description,
                    image || null,
                    type_product,
                    offer_percentage,
                    productCode,
                    stock,
                    category,
                    brand
                ]
            );

            const [checkProduct] = await connection.query('SELECT id FROM products WHERE id = ?', [productId]);
            if (checkProduct.length === 0) {
                throw new Error('El producto no fue insertado correctamente antes de agregar thumbnails');
            }

            if (thumbnails.length > 0) {
                const thumbnailValues = thumbnails.map(thumb => [
                    uuidv4(),
                    productId,
                    thumb.url,
                    thumb.public_id
                ]);

                await connection.query(
                    'INSERT INTO product_thumbnails (id, product_id, url, public_id) VALUES ?',
                    [thumbnailValues]
                );
            }

            await connection.commit();

            return { message: 'Producto creado con éxito', productId, productCode };
        } catch (error) {
            await connection.rollback();
            throw new Error(`Error al crear producto: ${error.message}`);
        } finally {
            connection.release();
        }
    }


    async getPaginatedProducts({ page = 1, limit = 6, sort = "asc", query = null }) {
        const pool = dbInstance.getPool();
        const connection = await pool.getConnection();

        try {
            const pageValue = parseInt(page, 10) || 1;
            const limitValue = parseInt(limit, 10) || 100;
            const offset = (pageValue - 1) * limitValue;
            const sortOrder = sort === "desc" ? "DESC" : "ASC";

            let whereClause = "";
            const params = [];

            if (query) {
                whereClause = "WHERE category = ?";
                params.push(query);
            }

            const [countResult] = await connection.query(
                `SELECT COUNT(*) AS total FROM products ${whereClause}`,
                params
            );
            const totalProducts = countResult[0].total;
            const totalPages = Math.ceil(totalProducts / limitValue);

            const [products] = await connection.query(
                `SELECT * FROM products ${whereClause} ORDER BY price ${sortOrder} LIMIT ? OFFSET ?`,
                [...params, limitValue, offset]
            );

            const [categoriesResult] = await connection.query(
                "SELECT DISTINCT category FROM products"
            );
            const categorias = categoriesResult.map((row) => row.category);

            return {
                productos: products,
                categorias,
                pagination: {
                    hasPrevPage: pageValue > 1,
                    hasNextPage: pageValue < totalPages,
                    prevPage: pageValue > 1 ? pageValue - 1 : null,
                    nextPage: pageValue < totalPages ? pageValue + 1 : null,
                    currentPage: pageValue,
                    totalPages,
                    limit: limitValue,
                    sort,
                    query,
                },
            };
        } catch (error) {
            throw new Error("Error al paginar productos: " + error.message);
        } finally {
            connection.release();
        }
    }

    async getProductById(id) {
        const pool = dbInstance.getPool();
        const connection = await pool.getConnection();

        try {
            const [product] = await connection.query(
                "SELECT * FROM products WHERE id = ?",
                [id]
            );

            if (!product.length) {
                throw new Error("Producto no encontrado");
            }

            return product[0];
        } catch (error) {
            logger.error("Error al obtener producto:", error.message);
            throw new Error(error.message);
        } finally {
            connection.release();
        }
    }

    async updateProduct(id, updateData) {
        const pool = dbInstance.getPool();
        const connection = await pool.getConnection();

        try {
            await connection.beginTransaction();

            const [productExists] = await connection.query(
                "SELECT * FROM products WHERE id = ?",
                [id]
            );

            if (!productExists.length) {
                throw new Error("Producto no encontrado");
            }

            const fields = Object.keys(updateData)
                .filter((key) => key !== "thumbnails")
                .map((key) => `${key} = ?`)
                .join(", ");

            const values = Object.values(updateData).filter(
                (_, i) => Object.keys(updateData)[i] !== "thumbnails"
            );

            if (fields.length > 0) {
                await connection.query(
                    `UPDATE products SET ${fields} WHERE id = ?`,
                    [...values, id]
                );
            }

            if (Array.isArray(updateData.thumbnails) && updateData.thumbnails.length > 0) {
                await connection.query("DELETE FROM product_thumbnails WHERE product_id = ?", [id]);

                const thumbnailValues = updateData.thumbnails.map((thumb) => [
                    id,
                    thumb.url,
                    thumb.public_id,
                ]);

                await connection.query(
                    "INSERT INTO product_thumbnails (product_id, url, public_id) VALUES ?",
                    [thumbnailValues]
                );
            }

            await connection.commit();

            const [[updatedProduct]] = await connection.query(
                "SELECT * FROM products WHERE id = ?",
                [id]
            );

            const [thumbnails] = await connection.query(
                "SELECT url, public_id FROM product_thumbnails WHERE product_id = ?",
                [id]
            );

            updatedProduct.thumbnails = thumbnails;

            return updatedProduct;
        } catch (error) {
            await connection.rollback();
            logger.error("Error al actualizar producto:", error.message);
            throw new Error(error.message);
        } finally {
            connection.release();
        }
    }

    async deleteProduct(id) {
        const pool = dbInstance.getPool();
        const connection = await pool.getConnection();

        try {
            const [productExists] = await connection.query(
                "SELECT * FROM products WHERE id = ?",
                [id]
            );

            if (!productExists.length) {
                logger.warning("Producto no encontrado");
                return null;
            }

            await connection.query("DELETE FROM products WHERE id = ?", [id]);

            logger.info("Producto eliminado");
            return productExists[0];
        } catch (error) {
            logger.error("Error al eliminar producto:", error.message);
            throw new Error(error.message);
        } finally {
            connection.release();
        }
    }

    async featureProduct(id) {
        const pool = dbInstance.getPool();
        const connection = await pool.getConnection();

        try {
            const [productResult] = await connection.query(
                "SELECT * FROM products WHERE id = ?",
                [id]
            );

            if (!productResult.length) {
                throw new Error("No hay productos destacados disponibles");
            }

            const product = productResult[0];
            const currentType = product.type_product;

            const newType = currentType === "destacado" ? null : "destacado";

            await connection.query(
                "UPDATE products SET type_product = ? WHERE id = ?",
                [newType, id]
            );

            const [[updatedProduct]] = await connection.query(
                "SELECT * FROM products WHERE id = ?",
                [id]
            );

            return updatedProduct;
        } catch (error) {
            logger.error("Error al destacar producto:", error.message);
            throw new Error(error.message);
        } finally {
            connection.release();
        }
    }

    async newArrive(id) {
        const pool = dbInstance.getPool();
        const connection = await pool.getConnection();

        try {
            const [productResult] = await connection.query(
                "SELECT * FROM products WHERE id = ?",
                [id]
            );

            if (!productResult.length) {
                throw new Error("No hay nuevos arribos disponibles");
            }

            const product = productResult[0];
            const currentType = product.type_product;
            const newType = currentType === "nuevo arribo" ? null : "nuevo arribo";

            await connection.query(
                "UPDATE products SET type_product = ? WHERE id = ?",
                [newType, id]
            );

            const [[updatedProduct]] = await connection.query(
                "SELECT * FROM products WHERE id = ?",
                [id]
            );

            return updatedProduct;
        } catch (error) {
            logger.error("Error al actualizar a nuevo arribo:", error.message);
            throw new Error(error.message);
        } finally {
            connection.release();
        }
    }

    async bestSeller(id) {
        const pool = dbInstance.getPool();
        const connection = await pool.getConnection();

        try {
            const [productResult] = await connection.query(
                "SELECT * FROM products WHERE id = ?",
                [id]
            );

            if (!productResult.length) {
                throw new Error("No hay productos más vendidos disponibles");
            }

            const product = productResult[0];
            const currentType = product.type_product;
            const newType = currentType === "mas vendido" ? null : "mas vendido";

            await connection.query(
                "UPDATE products SET type_product = ? WHERE id = ?",
                [newType, id]
            );

            const [[updatedProduct]] = await connection.query(
                "SELECT * FROM products WHERE id = ?",
                [id]
            );

            return updatedProduct;
        } catch (error) {
            logger.error("Error al actualizar a más vendido:", error.message);
            throw new Error(error.message);
        } finally {
            connection.release();
        }
    }
}

module.exports = new ProductRepository();
