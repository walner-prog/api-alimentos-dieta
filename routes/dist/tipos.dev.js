"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = _interopRequireDefault(require("express"));

var _auth = _interopRequireDefault(require("../middleware/auth.js"));

var _TipoController = _interopRequireDefault(require("../controllers/TipoController.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var router = _express["default"].Router(); // Middleware de autenticación


router.use(_auth["default"]); // Rutas

router.get('/', _TipoController["default"].getAll);
router.get('/:id', _TipoController["default"].getById);
router.post('/', _TipoController["default"].create);
router.put('/:id', _TipoController["default"].update);
router["delete"]('/:id', _TipoController["default"]["delete"]);
var _default = router;
exports["default"] = _default;