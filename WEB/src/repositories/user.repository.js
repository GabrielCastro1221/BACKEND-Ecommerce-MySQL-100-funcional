const { createHash } = require("../utils/hash.utils");
const { v4: uuidv4 } = require("uuid");
const dbInstance = require('../config/connection.config');

class UserRepository {
    async createUser(userData) {
        const pool = dbInstance.getPool();
        const connection = await pool.getConnection();

        try {
            await connection.beginTransaction();
            const [existing] = await connection.query(
                'SELECT id FROM users WHERE email = ?',
                [userData.email]
            );
            if (existing.length > 0) {
                throw new Error('El usuario ya existe');
            }

            const newUserId = uuidv4();
            const newCartId = uuidv4();
            const newWishlistId = uuidv4();

            const hashedPassword = createHash(userData.password);

            await connection.query('INSERT INTO carts (id) VALUES (?)', [newCartId]);

            await connection.query('INSERT INTO wishlists (id) VALUES (?)', [newWishlistId]);

            await connection.query(
                `INSERT INTO users (
                id, name, last_name, image, email, password, age, cart_id, wishlist_id,
                role, gender, newsletter, phone, address, city
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    newUserId,
                    userData.name,
                    userData.last_name,
                    userData.image || null,
                    userData.email,
                    hashedPassword,
                    userData.age || null,
                    newCartId,
                    newWishlistId,
                    userData.role || 'cliente',
                    userData.gender || null,
                    userData.newsletter || 'no suscrito',
                    userData.phone || null,
                    userData.address || null,
                    userData.city || null
                ]
            );

            await connection.commit();
            return { message: 'Usuario creado exitosamente', userId: newUserId };
        } catch (err) {
            await connection.rollback();
            throw new Error('Error al crear usuario: ' + err.message);
        } finally {
            connection.release();
        }
    }

    async getAllUsers() {
        const pool = dbInstance.getPool();
        const connection = await pool.getConnection();

        try {
            const [users] = await connection.query("SELECT id, name, last_name, image, email, password, age, cart_id, wishlist_id, role, gender, newsletter, phone, address, city FROM users");

            if (users.length === 0) {
                throw new Error("No se encontraron usuarios");
            }

            return users;
        } catch (error) {
            throw new Error(`Error al obtener usuarios: ${error.message}`);
        } finally {
            connection.release();
        }
    }

    async updateUser(id, updateData) {
        const pool = dbInstance.getPool();
        const connection = await pool.getConnection();

        try {
            await connection.beginTransaction();

            const [existingUser] = await connection.query("SELECT id FROM users WHERE id = ?", [id]);
            if (existingUser.length === 0) {
                throw new Error("Usuario no encontrado");
            }

            const fields = Object.keys(updateData).map(key => `${key} = ?`).join(", ");
            const values = Object.values(updateData);

            const query = `UPDATE users SET ${fields} WHERE id = ?`;
            await connection.query(query, [...values, id]);

            await connection.commit();

            const [updatedUser] = await connection.query("SELECT id, name, last_name, email, role, city FROM users WHERE id = ?", [id]);

            return updatedUser[0];
        } catch (error) {
            await connection.rollback();
            throw new Error(`Error al actualizar usuario: ${error.message}`);
        } finally {
            connection.release();
        }
    }

    async deleteUser(id) {
        const pool = dbInstance.getPool();
        const connection = await pool.getConnection();

        try {
            await connection.beginTransaction();

            const [existingUser] = await connection.query("SELECT id FROM users WHERE id = ?", [id]);
            if (existingUser.length === 0) {
                throw new Error("Usuario no encontrado");
            }

            await connection.query("DELETE FROM users WHERE id = ?", [id]);

            await connection.commit();

            return { message: `Usuario con ID ${id} eliminado correctamente` };
        } catch (error) {
            await connection.rollback();
            throw new Error(`Error al eliminar usuario: ${error.message}`);
        } finally {
            connection.release();
        }
    }

    async changeRole(id, newRole) {
        const pool = dbInstance.getPool();
        const connection = await pool.getConnection();

        try {
            await connection.beginTransaction();

            const validRoles = ["admin", "usuario", "cliente"];

            if (!validRoles.includes(newRole)) {
                throw new Error(`Rol inválido. Roles permitidos: ${validRoles.join(", ")}`);
            }

            const [existingUser] = await connection.query("SELECT id FROM users WHERE id = ?", [id]);
            if (existingUser.length === 0) {
                throw new Error("Usuario no encontrado");
            }

            await connection.query("UPDATE users SET role = ? WHERE id = ?", [newRole, id]);

            await connection.commit();

            const [updatedUser] = await connection.query("SELECT id, name, email, role FROM users WHERE id = ?", [id]);

            return updatedUser[0];
        } catch (error) {
            await connection.rollback();
            throw new Error(`Error al cambiar el rol del usuario: ${error.message}`);
        } finally {
            connection.release();
        }
    }
}

module.exports = new UserRepository();