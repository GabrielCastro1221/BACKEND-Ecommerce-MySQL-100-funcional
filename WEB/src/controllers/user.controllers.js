const UserRepository = require("../repositories/user.repository");
const { logger } = require("../middlewares/logger.middleware");
const MailerController = require("../services/mailer/nodemailer.service");

class UserManager {
    async createUser(req, res) {
        try {
            const userData = req.body;
            await UserRepository.createUser(userData);
            await MailerController.userRegister(userData);
            await MailerController.notifyAdminOnUserRegister(userData.email);
            res.status(200).json({ message: 'Usuario creado con éxito', user: userData });
        } catch (error) {
            logger.error(`Error al crear usuario: ${error.message}`);
            res.status(500).json({ message: 'Error al crear usuario', error: error.message });
        }
    }

    async getAllUsers(req, res) {
        try {
            const user = await UserRepository.getAllUsers();
            res.status(200).json({ message: 'Usuarios', users: user });
        } catch (error) {
            logger.error(`Error al obtener usuarios: ${error.message}`);
            return res.status(500).json({ message: "Error interno del servidor", error: error.message });
        }
    }

    async updateUser(req, res) {
        try {
            const { id } = req.params;
            const updateData = req.body;

            const updatedUser = await UserRepository.updateUser(id, updateData);

            res.status(200).json({ message: "Usuario actualizado con éxito", user: updatedUser });
        } catch (error) {
            logger.error(`Error al actualizar usuario: ${error.message}`);
            return res.status(500).json({ message: "Error interno del servidor", error: error.message });
        }
    }

    async deleteUser(req, res) {
        try {
            const { id } = req.params;

            const result = await UserRepository.deleteUser(id);

            res.status(200).json({ message: result.message });
        } catch (error) {
            logger.error(`Error al eliminar usuario: ${error.message}`);
            return res.status(500).json({ message: "Error interno del servidor", error: error.message });
        }
    }

    async changeRole(req, res) {
        try {
            const { id } = req.params;
            const { newRole } = req.body;

            const updatedUser = await UserRepository.changeRole(id, newRole);

            res.status(200).json({ message: "Rol actualizado con éxito", user: updatedUser });
        } catch (error) {
            logger.error(`Error al cambiar rol de usuario: ${error.message}`);
            return res.status(500).json({ message: "Error interno del servidor", error: error.message });
        }
    }
}

module.exports = new UserManager();