"use strict";

var _express = _interopRequireDefault(require("express"));

var _bodyParser = _interopRequireDefault(require("body-parser"));

var _cors = _interopRequireDefault(require("cors"));

var _dotenv = _interopRequireDefault(require("dotenv"));

var _index = _interopRequireDefault(require("./routes/index.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// Este archivo configura y ejecuta el servidor Express, estableciendo los middlewares necesarios,
// cargando las rutas desde un archivo centralizado y escuchando en el puerto especificado.
// Cargar rutas desde el archivo centralizado
_dotenv["default"].config();

var app = (0, _express["default"])();
var PORT = process.env.PORT || 3000;
app.use((0, _cors["default"])());
app.use(_bodyParser["default"].json()); // Usar rutas

app.use('/api', _index["default"]); // Inicia el servidor

app.listen(PORT, function () {
  console.log("Server running on port ".concat(PORT));
});