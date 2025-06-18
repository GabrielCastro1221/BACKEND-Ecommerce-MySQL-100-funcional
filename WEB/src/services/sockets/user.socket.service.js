const UserRepository = require("../../repositories/user.repository");
const { logger } = require("../../middlewares/logger.middleware");

class SocketUser {
    constructor(io) {
        this.io = io;
        this.initSocketEvents();
    }

    initSocketEvents() {
        this.io.on("connection", (socket) => {
            logger.info("WebSocket de usuarios conectado");

            this.sendAllUsers(socket);

            socket.on("getAllUsers", () => this.sendAllUsers(socket));

            socket.on("createUser", async (userData) => {
                try {
                    const newUser = await UserRepository.createUser(userData);
                    this.io.emit("userCreated", newUser);
                } catch (error) {
                    logger.error("Error al crear usuario:", error.message);
                    socket.emit("error", "Error al crear usuario");
                }
            });

            socket.on("updateUser", async ({ id, updateData }) => {
                try {
                    const updatedUser = await UserRepository.updateUser(id, updateData);
                    this.io.emit("userUpdated", updatedUser);
                } catch (error) {
                    logger.error("Error al actualizar usuario:", error.message);
                    socket.emit("error", "Error al actualizar usuario");
                }
            });

            socket.on("deleteUser", async (id) => {
                try {
                    const result = await UserRepository.deleteUser(id);
                    this.io.emit("userDeleted", { id, ...result });
                } catch (error) {
                    logger.error("Error al eliminar usuario:", error.message);
                    socket.emit("error", "Error al eliminar usuario");
                }
            });

            socket.on("changeRole", async ({ id, newRole }) => {
                try {
                    const updatedUser = await UserRepository.changeRole(id, newRole);
                    this.io.emit("roleChanged", updatedUser);
                } catch (error) {
                    logger.error("Error al cambiar rol:", error.message);
                    socket.emit("error", "Error al cambiar rol del usuario");
                }
            });
        });
    }

    async sendAllUsers(socket) {
        try {
            const users = await UserRepository.getAllUsers();
            socket.emit("usersList", users);
        } catch (error) {
            logger.error("Error al obtener usuarios:", error.message);
            socket.emit("error", "Error al obtener la lista de usuarios.");
        }
    }
}

module.exports = SocketUser;
