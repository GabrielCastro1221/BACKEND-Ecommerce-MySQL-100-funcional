const TicketRepository = require("../../repositories/ticket.repository");
const { logger } = require("../../middlewares/logger.middleware");

class SocketTicket {
    constructor(io) {
        this.io = io;
        this.initSocketEvents();
    }

    initSocketEvents() {
        this.io.on("connection", (socket) => {
            logger.info("WebSocket de tickets conectado");

            this.sendAllTickets(socket);

            socket.on("getAllTickets", () => this.sendAllTickets(socket));

            socket.on("createTicket", async (ticketData) => {
                try {
                    const newTicket = await TicketRepository.createTicket(ticketData);
                    this.io.emit("ticketCreated", newTicket);
                } catch (error) {
                    logger.error("Error al crear ticket:", error.message);
                    socket.emit("error", "Error al crear ticket");
                }
            });

            socket.on("updateTicketStatus", async ({ id, status }) => {
                try {
                    const updated = await TicketRepository.updateTicketStatus(id, status);
                    this.io.emit("ticketStatusUpdated", { id, status });
                } catch (error) {
                    logger.error("Error al actualizar estado del ticket:", error.message);
                    socket.emit("error", "Error al actualizar estado");
                }
            });

            socket.on("deleteTicket", async (id) => {
                try {
                    const result = await TicketRepository.deleteTicket(id);
                    this.io.emit("ticketDeleted", { id, ...result });
                } catch (error) {
                    logger.error("Error al eliminar ticket:", error.message);
                    socket.emit("error", "Error al eliminar ticket");
                }
            });

            socket.on("getTicketById", async (id) => {
                try {
                    const ticket = await TicketRepository.getTicketById(id);
                    socket.emit("ticketDetail", ticket);
                } catch (error) {
                    logger.error("Error al obtener ticket por ID:", error.message);
                    socket.emit("error", "Error al obtener ticket");
                }
            });
        });
    }

    async sendAllTickets(socket) {
        try {
            const tickets = await TicketRepository.getTickets();
            socket.emit("ticketsList", tickets);
        } catch (error) {
            logger.error("Error al obtener tickets:", error.message);
            socket.emit("error", "Error al obtener la lista de tickets.");
        }
    }
}

module.exports = SocketTicket;
