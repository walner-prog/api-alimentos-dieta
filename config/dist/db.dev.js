"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _promise = _interopRequireDefault(require("mysql2/promise"));

var _dotenv = _interopRequireDefault(require("dotenv"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// Este archivo configura la conexión a la base de datos MySQL utilizando mysql2 con promesas.
// Carga las variables de entorno desde un archivo .env para gestionar de manera segura las credenciales
// de la base de datos y crea un pool de conexiones con las configuraciones necesarias.
_dotenv["default"].config();

var db = _promise["default"].createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  connectTimeout: 10000
});

var _default = db;
exports["default"] = _default;