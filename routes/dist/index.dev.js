"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = _interopRequireDefault(require("express"));

var _libros = _interopRequireDefault(require("./libros.js"));

var _alimentos = _interopRequireDefault(require("./alimentos.js"));

var _categorias = _interopRequireDefault(require("./categorias.js"));

var _tipos = _interopRequireDefault(require("./tipos.js"));

var _dietas = _interopRequireDefault(require("./dietas.js"));

var _dietas_alimentos = _interopRequireDefault(require("./dietas_alimentos.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// Este archivo define y registra las rutas principales del sistema, agrupando rutas específicas para 
// libros, alimentos, categorías, tipos, dietas y la relación entre dietas y alimentos. 
// Utiliza Express Router para modularizar las rutas y facilitar su gestión.
var router = _express["default"].Router(); // Registrar rutas


router.use('/libros', _libros["default"]);
router.use('/alimentos', _alimentos["default"]);
router.use('/categorias', _categorias["default"]);
router.use('/tipos', _tipos["default"]);
router.use('/dietas', _dietas["default"]);
router.use('/dieta_alimentos', _dietas_alimentos["default"]);
var _default = router;
exports["default"] = _default;