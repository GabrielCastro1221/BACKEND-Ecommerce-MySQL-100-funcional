const mysql = require("mysql2/promise");
const configObject = require("./env.config");
const { logger } = require("../middlewares/logger.middleware");

class Database {
  static #instance;

  constructor() {
    this.pool = mysql.createPool({
      host: configObject.connection.sql_host,
      user: configObject.connection.sql_user,
      password: configObject.connection.sql_pass,
      database: configObject.connection.sql_database,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });

    logger.info("Base de datos MySQL Conexion exitosa!");
  }

  static getInstance() {
    if (!this.#instance) {
      this.#instance = new Database();
    }
    return this.#instance;
  }

  getPool() {
    return this.pool;
  }
}

module.exports = Database.getInstance();
