"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = _interopRequireDefault(require("express"));

var _auth = _interopRequireDefault(require("../middleware/auth.js"));

var _categoriaController = require("../controllers/categoriaController.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var router = _express["default"].Router();

router.use(_auth["default"]);
router.get('/', _categoriaController.obtenerCategorias);
router.get('/:id', _categoriaController.obtenerCategoriaPorId);
router.post('/', _categoriaController.crearCategoria);
router.put('/:id', _categoriaController.actualizarCategoria);
router["delete"]('/:id', _categoriaController.eliminarCategoria);
var _default = router;
exports["default"] = _default;