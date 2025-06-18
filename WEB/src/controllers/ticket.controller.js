const TicketRepository = require("../repositories/ticket.repository");
const MailerController = require("../services/mailer/nodemailer.service");

class TicketManager {
    async createTicket(req, res) {
        try {
            const ticketData = req.body;
            const result = await TicketRepository.createTicket(ticketData);

            const user = await TicketRepository.findUserByCartId(ticketData.cart_id);
            if (!user || !user.email) throw new Error("Usuario no encontrado o sin email");

            ticketData.purchase_datetime = new Date(ticketData.purchase_datetime);

            const ticketDetail = await TicketRepository.getTicketById(ticketData.id);
            const cartProducts = ticketDetail.products || [];

            await MailerController.SendPurchaseConfirmation(user.email, ticketData, cartProducts);

            res.status(201).json(result);
        } catch (error) {
            console.error("Error al crear ticket:", error.message, error.stack);
            res.status(500).json({ error: error.message });
        }
    }


    async getAllTickets(req, res) {
        try {
            const tickets = await TicketRepository.getTickets();
            res.json(tickets);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async getTicketById(req, res) {
        try {
            const { id } = req.params;
            const ticket = await TicketRepository.getTicketById(id);
            res.json(ticket);
        } catch (error) {
            res.status(404).json({ error: error.message });
        }
    }

    async deleteTicket(req, res) {
        try {
            const { id } = req.params;
            const result = await TicketRepository.deleteTicket(id);
            res.json(result);
        } catch (error) {
            res.status(404).json({ error: error.message });
        }
    }

    async updateStatus(req, res) {
        try {
            const { id } = req.params;
            const { status } = req.body;
            const result = await TicketRepository.updateTicketStatus(id, status);
            res.json(result);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async markAsPaid(req, res) {
        try {
            const { id } = req.params;
            const result = await TicketRepository.payTicket(id);
            res.json(result);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async cancelTicket(req, res) {
        try {
            const { id } = req.params;
            const result = await TicketRepository.payCancel(id);
            res.json(result);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async processTicket(req, res) {
        try {
            const { id } = req.params;
            const result = await TicketRepository.payProcess(id);
            res.json(result);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
}

module.exports = new TicketManager();
