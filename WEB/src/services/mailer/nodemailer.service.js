const nodemailer = require("nodemailer");
const configObject = require("../../config/env.config");
const { logger } = require("../../middlewares/logger.middleware");

class MailerController {
    constructor() {
        this.transporter = nodemailer.createTransport({
            service: configObject.mailer.email_service,
            auth: {
                user: configObject.mailer.mailer_user,
                pass: configObject.mailer.mailer_pass,
            },
        });
    }

    async userRegister(userData) {
        try {
            const {
                name,
                last_name,
                email,
                age,
                role,
                gender,
                phone,
                address,
                city,
            } = userData;

            const Opt = {
                from: configObject.mailer.email_from,
                to: email,
                subject: "Pet-Shop - ¡Bienvenido a nuestra plataforma!",
                html: `
                    <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6; max-width: 600px; margin: 0             auto; border: 1px solid #ddd; padding: 20px; border-radius: 10px;">
                        <div style="text-align: center; margin-bottom: 20px;">
                        <h1 style="color: #0D1936;">Pet-Shop</h1>
                        </div>
                        <h2 style="color: #0D1936;">¡Bienvenido, ${name}!</h2>
                        <p>Nos alegra que te hayas registrado en nuestra plataforma. Aquí están tus datos de registro:</p>
                        <p><strong>Nombre completo:</strong> ${name} ${last_name}</p>
                        <p><strong>Email:</strong> ${email}</p>
                        <p><strong>Edad:</strong> ${age || 'No especificada'}</p>
                        <p><strong>Rol:</strong> ${role || 'cliente'}</p>
                        <p><strong>Género:</strong> ${gender || 'No especificado'}</p>
                        <p><strong>Teléfono:</strong> ${phone || 'No especificado'}</p>
                        <p><strong>Dirección:</strong> ${address || 'No especificada'}, ${city || ''}</p>
                        <p>Estamos aquí para ofrecerte los mejores productos y servicios para tus mascotas.</p>
                        <h3 style="color: #0D1936;">¡Gracias por confiar en Pet-Shop!</h3>
                        <p>Si necesitas ayuda, no dudes en contactarnos.</p>
                    </div>
                    `,
            };

            await this.transporter.sendMail(Opt);
            logger.info("Correo de bienvenida enviado exitosamente a " + email);
        } catch (error) {
            logger.error("Error al enviar correo de bienvenida:", error.message);
        }
    }

    async notifyAdminOnUserRegister(userEmail) {
        try {
            const adminEmail = configObject.mailer.mailer_user;

            const Opt = {
                from: configObject.mailer.email_from,
                to: adminEmail,
                subject: "Pet-Shop - Nuevo usuario registrado en la plataforma",
                html: `
                    <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6; max-width: 600px; margin: 0             auto; border: 1px solid #ddd; padding: 20px; border-radius: 10px;">
                    <div style="text-align: center; margin-bottom: 20px;">
                        <h1 style="color: #0D1936;">Pet-Shop</h1>
                    </div>
                    <h2 style="color: #0D1936;">¡Se ha registrado un nuevo usuario!</h2>
                    <p>Un nuevo usuario se ha registrado en la plataforma Pet-Shop.</p>
                    <p><strong>Email del usuario:</strong> ${userEmail}</p>
                    <h3 style="color: #0D1936;">¡Recuerda gestionar la cuenta si es necesario!</h3>
                    </div>
                    `,
            };

            await this.transporter.sendMail(Opt);

            logger.info(
                `Correo de notificación enviado exitosamente al administrador (${adminEmail}) sobre el registro del usuario (${userEmail}).`
            );
        } catch (error) {
            logger.error(
                "Error al enviar correo de notificación al administrador:",
                error.message
            );
        }
    }

    async SendPurchaseConfirmation(userEmail, ticketData, cartProducts = []) {
        try {
            const formattedDate = new Date(ticketData.purchase_datetime).toLocaleDateString("es-MX", {
                day: "2-digit",
                month: "long",
                year: "numeric",
            });

            const productListHtml = cartProducts.map(prod => `
            <div style="margin-bottom: 10px;">
                <p><strong>${prod.title}</strong> - Cantidad: ${prod.quantity} - Precio: $${prod.price}</p>
            </div>
        `).join("");

            const Opt = {
                from: configObject.mailer.email_from,
                to: userEmail,
                subject: `Pet-Shop - Confirmación de tu compra (#${ticketData.code})`,
                html: `
                <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; padding: 20px; border-radius: 10px;">
                    <div style="text-align: center; margin-bottom: 20px;">
                        <h1 style="color: #0D1936;">Pet-Shop</h1>
                    </div>
                    <h2 style="color: #0D1936;">¡Gracias por tu compra!</h2>
                    <p>Tu compra ha sido confirmada. Aquí están los detalles:</p>
                    <p><strong>Código de compra:</strong> ${ticketData.code}</p>
                    <p><strong>Fecha:</strong> ${formattedDate}</p>
                    <p><strong>Subtotal:</strong> $${ticketData.subtotal}</p>
                    <p><strong>Envío:</strong> $${ticketData.shipping}</p>
                    <p><strong>Total:</strong> $${ticketData.amount}</p>
                    <h3>Productos:</h3>
                    ${productListHtml}
                    <p>¡Gracias por confiar en Pet-Shop!</p>
                    <h3 style="color: #0D1936;">Si necesitas ayuda, no dudes en contactarnos.</h3>
                </div>
            `,
            };

            await this.transporter.sendMail(Opt);
            logger.info(`Correo de confirmación de compra enviado exitosamente a ${userEmail}.`);
        } catch (error) {
            logger.error("Error al enviar correo de confirmación de compra:", error.message);
        }
    }

}

module.exports = new MailerController();
