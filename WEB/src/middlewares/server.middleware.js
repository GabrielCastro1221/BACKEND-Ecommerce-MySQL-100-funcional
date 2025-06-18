const { logger } = require("../middlewares/logger.middleware");
const configObject = require("../config/env.config");
require("../config/connection.config"); // inicializa la BD
const { Server } = require("socket.io");

const socketModules = [
  require("../services/sockets/user.socket.service"),
  require("../services/sockets/product.socket.service"),
  require("../services/sockets/ticket.socket.service")
];

const serverListenMiddleware = (app) => {
  const port = configObject.server.port;

  const httpServer = app.listen(port, () => {
    logger.info(`Servidor escuchando en el puerto ${port}`);
    logger.info(`Pagina web ejecutándose en la URL http://localhost:${port}`);
  });

  const io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  socketModules.forEach((SocketClass) => new SocketClass(io));
};

module.exports = serverListenMiddleware;
