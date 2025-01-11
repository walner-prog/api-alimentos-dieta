"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = _interopRequireDefault(require("express"));

var _promise = _interopRequireDefault(require("mysql2/promise"));

var _dotenv = _interopRequireDefault(require("dotenv"));

var _auth = _interopRequireDefault(require("../middleware/auth.js"));

var _joi = _interopRequireDefault(require("joi"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

// Librería para validación
_dotenv["default"].config();

var router = _express["default"].Router(); // Crear una conexión pool para un mejor manejo de conexiones


var db = _promise["default"].createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  connectTimeout: 10000
}); // Middleware para proteger todas las rutas


router.use(_auth["default"]); // Esquema de validación para los datos de los alimentos en la dieta

var dietaAlimentoSchema = _joi["default"].object({
  dieta_id: _joi["default"].number().required(),
  alimento_id: _joi["default"].number().required(),
  cantidad: _joi["default"].number().required()
}); // Ruta para obtener todos los alimentos relacionados con una dieta específica


router.get('/:id', function _callee(req, res) {
  var id, _ref, _ref2, alimentos;

  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          id = req.params.id;
          _context.prev = 1;
          _context.next = 4;
          return regeneratorRuntime.awrap(db.query("SELECT a.id, a.nombre, a.descripcion, a.calorias, a.categoria_id, a.tipo_id, a.proteinas, a.carbohidratos,\n                    a.grasas, a.fibra, a.azucar, a.colesterol, a.vitamina_a, a.vitamina_c, a.vitamina_d, \n                    a.hierro, a.calcio, a.magnesio, a.potasio, a.zinc, a.indice_glucemico, a.densidad_nutricional, \n                    a.porcion, a.alergias, a.origen, da.cantidad\n             FROM dieta_alimentos da\n             INNER JOIN alimentos a ON da.alimento_id = a.id\n             WHERE da.dieta_id = ?", [id]));

        case 4:
          _ref = _context.sent;
          _ref2 = _slicedToArray(_ref, 1);
          alimentos = _ref2[0];

          if (!(alimentos.length === 0)) {
            _context.next = 9;
            break;
          }

          return _context.abrupt("return", res.status(404).json({
            message: 'No se encontraron alimentos para esta dieta'
          }));

        case 9:
          // Devolver los alimentos relacionados
          res.json({
            alimentos: alimentos
          });
          _context.next = 15;
          break;

        case 12:
          _context.prev = 12;
          _context.t0 = _context["catch"](1);
          res.status(500).json({
            message: 'Error al obtener los alimentos relacionados',
            error: _context.t0.message
          });

        case 15:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[1, 12]]);
}); // Ruta para agregar un nuevo alimento a la dieta

router.post('/', function _callee2(req, res) {
  var _dietaAlimentoSchema$, error, _req$body, dieta_id, alimento_id, cantidad, _ref3, _ref4, dieta, _ref5, _ref6, alimento, _ref7, _ref8, result;

  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _dietaAlimentoSchema$ = dietaAlimentoSchema.validate(req.body), error = _dietaAlimentoSchema$.error;

          if (!error) {
            _context2.next = 3;
            break;
          }

          return _context2.abrupt("return", res.status(400).json({
            message: error.details[0].message
          }));

        case 3:
          _req$body = req.body, dieta_id = _req$body.dieta_id, alimento_id = _req$body.alimento_id, cantidad = _req$body.cantidad;
          _context2.prev = 4;
          _context2.next = 7;
          return regeneratorRuntime.awrap(db.query('SELECT * FROM dietas WHERE id = ?', [dieta_id]));

        case 7:
          _ref3 = _context2.sent;
          _ref4 = _slicedToArray(_ref3, 1);
          dieta = _ref4[0];

          if (!(dieta.length === 0)) {
            _context2.next = 12;
            break;
          }

          return _context2.abrupt("return", res.status(404).json({
            message: 'Dieta no encontrada'
          }));

        case 12:
          _context2.next = 14;
          return regeneratorRuntime.awrap(db.query('SELECT * FROM alimentos WHERE id = ?', [alimento_id]));

        case 14:
          _ref5 = _context2.sent;
          _ref6 = _slicedToArray(_ref5, 1);
          alimento = _ref6[0];

          if (!(alimento.length === 0)) {
            _context2.next = 19;
            break;
          }

          return _context2.abrupt("return", res.status(404).json({
            message: 'Alimento no encontrado'
          }));

        case 19:
          _context2.next = 21;
          return regeneratorRuntime.awrap(db.query('INSERT INTO dieta_alimentos (dieta_id, alimento_id, cantidad) VALUES (?, ?, ?)', [dieta_id, alimento_id, cantidad]));

        case 21:
          _ref7 = _context2.sent;
          _ref8 = _slicedToArray(_ref7, 1);
          result = _ref8[0];
          res.status(201).json({
            id: result.insertId,
            dieta_id: dieta_id,
            alimento_id: alimento_id,
            cantidad: cantidad
          });
          _context2.next = 30;
          break;

        case 27:
          _context2.prev = 27;
          _context2.t0 = _context2["catch"](4);
          res.status(500).json({
            message: 'Error al agregar el alimento a la dieta',
            error: _context2.t0.message
          });

        case 30:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[4, 27]]);
}); // Ruta para actualizar la cantidad de un alimento en la dieta

router.put('/:id', function _callee3(req, res) {
  var id, _dietaAlimentoSchema$2, error, _req$body2, dieta_id, alimento_id, cantidad, _ref9, _ref10, existing, _ref11, _ref12, result;

  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          id = req.params.id;
          _dietaAlimentoSchema$2 = dietaAlimentoSchema.validate(req.body), error = _dietaAlimentoSchema$2.error;

          if (!error) {
            _context3.next = 4;
            break;
          }

          return _context3.abrupt("return", res.status(400).json({
            message: error.details[0].message
          }));

        case 4:
          _req$body2 = req.body, dieta_id = _req$body2.dieta_id, alimento_id = _req$body2.alimento_id, cantidad = _req$body2.cantidad;
          _context3.prev = 5;
          _context3.next = 8;
          return regeneratorRuntime.awrap(db.query('SELECT * FROM dieta_alimentos WHERE dieta_id = ? AND alimento_id = ?', [dieta_id, alimento_id]));

        case 8:
          _ref9 = _context3.sent;
          _ref10 = _slicedToArray(_ref9, 1);
          existing = _ref10[0];

          if (!(existing.length === 0)) {
            _context3.next = 13;
            break;
          }

          return _context3.abrupt("return", res.status(404).json({
            message: 'Alimento no encontrado en esta dieta'
          }));

        case 13:
          _context3.next = 15;
          return regeneratorRuntime.awrap(db.query('UPDATE dieta_alimentos SET cantidad = ? WHERE dieta_id = ? AND alimento_id = ?', [cantidad, dieta_id, alimento_id]));

        case 15:
          _ref11 = _context3.sent;
          _ref12 = _slicedToArray(_ref11, 1);
          result = _ref12[0];

          if (!(result.affectedRows === 0)) {
            _context3.next = 20;
            break;
          }

          return _context3.abrupt("return", res.status(404).json({
            message: 'No se pudo actualizar la cantidad del alimento'
          }));

        case 20:
          res.json({
            message: 'Cantidad actualizada'
          });
          _context3.next = 26;
          break;

        case 23:
          _context3.prev = 23;
          _context3.t0 = _context3["catch"](5);
          res.status(500).json({
            message: 'Error al actualizar la cantidad del alimento',
            error: _context3.t0.message
          });

        case 26:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[5, 23]]);
}); // Ruta para eliminar un alimento de la tabla dieta_alimentos 

router["delete"]('/:id', function _callee4(req, res) {
  var id, _ref13, _ref14, result;

  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          id = req.params.id;
          _context4.prev = 1;
          _context4.next = 4;
          return regeneratorRuntime.awrap(db.query('DELETE FROM dieta_alimentos WHERE id = ?', [id]));

        case 4:
          _ref13 = _context4.sent;
          _ref14 = _slicedToArray(_ref13, 1);
          result = _ref14[0];

          if (!(result.affectedRows === 0)) {
            _context4.next = 9;
            break;
          }

          return _context4.abrupt("return", res.status(404).json({
            message: 'Alimento no encontrado en la dieta'
          }));

        case 9:
          res.json({
            message: 'Alimento eliminado de la dieta'
          });
          _context4.next = 15;
          break;

        case 12:
          _context4.prev = 12;
          _context4.t0 = _context4["catch"](1);
          res.status(500).json({
            message: 'Error al eliminar el alimento de la dieta',
            error: _context4.t0.message
          });

        case 15:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[1, 12]]);
}); // Ruta para eliminar un alimento de una dieta específica

router["delete"]('/:dieta_id/:alimento_id', function _callee5(req, res) {
  var _req$params, dieta_id, alimento_id, _ref15, _ref16, result;

  return regeneratorRuntime.async(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _req$params = req.params, dieta_id = _req$params.dieta_id, alimento_id = _req$params.alimento_id;
          _context5.prev = 1;
          _context5.next = 4;
          return regeneratorRuntime.awrap(db.query('DELETE FROM dieta_alimentos WHERE dieta_id = ? AND alimento_id = ?', [dieta_id, alimento_id]));

        case 4:
          _ref15 = _context5.sent;
          _ref16 = _slicedToArray(_ref15, 1);
          result = _ref16[0];

          if (!(result.affectedRows === 0)) {
            _context5.next = 9;
            break;
          }

          return _context5.abrupt("return", res.status(404).json({
            message: 'Alimento no encontrado en esta dieta'
          }));

        case 9:
          res.json({
            message: 'Alimento eliminado de la dieta'
          });
          _context5.next = 15;
          break;

        case 12:
          _context5.prev = 12;
          _context5.t0 = _context5["catch"](1);
          res.status(500).json({
            message: 'Error al eliminar el alimento de la dieta',
            error: _context5.t0.message
          });

        case 15:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[1, 12]]);
}); // Ruta para obtener una dieta con sus alimentos relacionados

router.get('/rel/alimentos/:id', function _callee6(req, res) {
  var id, _ref17, _ref18, dietas, _ref19, _ref20, alimentos, dieta;

  return regeneratorRuntime.async(function _callee6$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          id = req.params.id;
          _context6.prev = 1;
          _context6.next = 4;
          return regeneratorRuntime.awrap(db.query('SELECT * FROM dietas WHERE id = ?', [id]));

        case 4:
          _ref17 = _context6.sent;
          _ref18 = _slicedToArray(_ref17, 1);
          dietas = _ref18[0];

          if (!(dietas.length === 0)) {
            _context6.next = 9;
            break;
          }

          return _context6.abrupt("return", res.status(404).json({
            message: 'Dieta no encontrada'
          }));

        case 9:
          _context6.next = 11;
          return regeneratorRuntime.awrap(db.query("SELECT \n                a.id, \n                a.nombre, \n                a.descripcion, \n                a.calorias, \n                a.categoria_id, \n                a.tipo_id, \n                a.proteinas, \n                a.carbohidratos, \n                a.grasas, \n                a.fibra, \n                a.azucar, \n                a.colesterol, \n                a.vitamina_a, \n                a.vitamina_c, \n                a.vitamina_d, \n                a.hierro, \n                a.calcio, \n                a.magnesio, \n                a.potasio, \n                a.zinc, \n                a.indice_glucemico, \n                a.densidad_nutricional, \n                a.porcion, \n                a.alergias, \n                a.origen, \n                a.created_at, \n                a.updated_at, \n                da.cantidad\n             FROM dieta_alimentos da\n             INNER JOIN alimentos a ON da.alimento_id = a.id\n             WHERE da.dieta_id = ?", [id]));

        case 11:
          _ref19 = _context6.sent;
          _ref20 = _slicedToArray(_ref19, 1);
          alimentos = _ref20[0];
          dieta = _objectSpread({}, dietas[0], {
            alimentos: alimentos
          });
          res.json(dieta);
          _context6.next = 21;
          break;

        case 18:
          _context6.prev = 18;
          _context6.t0 = _context6["catch"](1);
          res.status(500).json({
            message: 'Error al obtener la dieta',
            error: _context6.t0.message
          });

        case 21:
        case "end":
          return _context6.stop();
      }
    }
  }, null, null, [[1, 18]]);
});
var _default = router;
exports["default"] = _default;