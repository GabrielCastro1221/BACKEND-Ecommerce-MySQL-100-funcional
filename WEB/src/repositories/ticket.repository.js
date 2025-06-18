const dbInstance = require("../config/connection.config");

class TicketRepository {
    async createTicket(data) {
        const pool = dbInstance.getPool();
        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();

            const [result] = await connection.query(
                `INSERT INTO tickets_online (id, code, shipping, subtotal, amount, purchaser_id, cart_id, purchase_datetime, status)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    data.id,
                    data.code,
                    data.shipping,
                    data.subtotal,
                    data.amount,
                    data.purchaser_id,
                    data.cart_id,
                    data.purchase_datetime,
                    data.status || 'en proceso',
                ]
            );

            await connection.commit();
            return { message: 'Ticket creado', id: data.id };
        } catch (error) {
            await connection.rollback();
            throw new Error("Error al crear ticket: " + error.message);
        } finally {
            connection.release();
        }
    }

    async findUserByCartId(cartId) {
        const pool = dbInstance.getPool();
        const [rows] = await pool.query(
            `SELECT * FROM users WHERE cart_id = ?`,
            [cartId]
        );
        return rows[0] || null;
    }

    async addTicketToUser(userId, ticketId) {
        const pool = dbInstance.getPool();
        const connection = await pool.getConnection();

        try {
            await connection.beginTransaction();

            const [userRows] = await connection.query(
                `SELECT * FROM users WHERE id = ?`,
                [userId]
            );
            if (userRows.length === 0) return null;

            await connection.commit();
            return userRows[0];
        } catch (error) {
            await connection.rollback();
            throw new Error("Error al asociar ticket al usuario: " + error.message);
        } finally {
            connection.release();
        }
    }

    async getTickets() {
        const pool = dbInstance.getPool();
        const [rows] = await pool.query(
            `SELECT t.*, u.name, u.last_name, u.email FROM tickets_online t
       JOIN users u ON t.purchaser_id = u.id`
        );
        return rows;
    }

    async getTicketById(id) {
        const pool = dbInstance.getPool();
        const connection = await pool.getConnection();
        try {
            const [ticketRows] = await connection.query(
                `SELECT t.*, u.name, u.last_name, u.email, u.phone, u.address, u.city
         FROM tickets_online t
         JOIN users u ON t.purchaser_id = u.id
         WHERE t.id = ?`,
                [id]
            );

            if (ticketRows.length === 0) throw new Error("Ticket no encontrado");

            const [products] = await connection.query(
                `SELECT tp.*, p.image FROM ticket_products tp
         JOIN products p ON tp.product_id = p.id
         WHERE tp.ticket_id = ? AND tp.store_type = 'online'`,
                [id]
            );

            return {
                ...ticketRows[0],
                products,
            };
        } catch (error) {
            throw new Error("Error al obtener ticket: " + error.message);
        } finally {
            connection.release();
        }
    }

    async deleteTicket(id) {
        const pool = dbInstance.getPool();
        const [result] = await pool.query(
            `DELETE FROM tickets_online WHERE id = ?`,
            [id]
        );

        if (result.affectedRows === 0) throw new Error("Ticket no encontrado");
        return { message: "Ticket eliminado" };
    }

    async updateTicketStatus(id, status) {
        const pool = dbInstance.getPool();
        const [result] = await pool.query(
            `UPDATE tickets_online SET status = ? WHERE id = ?`,
            [status, id]
        );
        if (result.affectedRows === 0) throw new Error("Ticket no encontrado");
        return { message: `Estado del ticket actualizado a '${status}'` };
    }

    async payTicket(id) {
        return await this.updateTicketStatus(id, "pagado");
    }

    async payCancel(id) {
        return await this.updateTicketStatus(id, "cancelado");
    }

    async payProcess(id) {
        return await this.updateTicketStatus(id, "en proceso");
    }
}

module.exports = new TicketRepository();