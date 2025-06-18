const express = require("express");
const bodyParser = require("./middlewares/bodyParser.middleware");
const handlebarsMiddleware = require("./middlewares/handlebars.middleware");
const setupRoutes = require("./middlewares/routes.middleware");
const serverMiddleware = require("./middlewares/server.middleware");

const app = express();

bodyParser(app);
handlebarsMiddleware(app);
setupRoutes(app);
serverMiddleware(app);