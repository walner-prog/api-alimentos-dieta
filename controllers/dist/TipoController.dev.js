"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _joi = _interopRequireDefault(require("joi"));

var _TipoModel = _interopRequireDefault(require("../models/TipoModel.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// Esquema de validación para los datos del tipo
var tipoSchema = _joi["default"].object({
  nombre: _joi["default"].string().required(),
  descripcion: _joi["default"].string().optional()
});

var TipoController = {
  // Obtener todos los tipos
  getAll: function getAll(req, res) {
    var tipos;
    return regeneratorRuntime.async(function getAll$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            _context.next = 3;
            return regeneratorRuntime.awrap(_TipoModel["default"].getAll());

          case 3:
            tipos = _context.sent;
            res.json(tipos);
            _context.next = 10;
            break;

          case 7:
            _context.prev = 7;
            _context.t0 = _context["catch"](0);
            res.status(500).json({
              message: 'Error al obtener los tipos',
              error: _context.t0.message
            });

          case 10:
          case "end":
            return _context.stop();
        }
      }
    }, null, null, [[0, 7]]);
  },
  // Obtener un tipo y sus alimentos
  getById: function getById(req, res) {
    var id, tipo, alimentos;
    return regeneratorRuntime.async(function getById$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            id = req.params.id;
            _context2.prev = 1;
            _context2.next = 4;
            return regeneratorRuntime.awrap(_TipoModel["default"].getById(id));

          case 4:
            tipo = _context2.sent;

            if (tipo) {
              _context2.next = 7;
              break;
            }

            return _context2.abrupt("return", res.status(404).json({
              message: 'Tipo no encontrado'
            }));

          case 7:
            _context2.next = 9;
            return regeneratorRuntime.awrap(_TipoModel["default"].getAlimentosByTipoId(id));

          case 9:
            alimentos = _context2.sent;
            res.json({
              tipo: tipo,
              alimentos: alimentos
            });
            _context2.next = 16;
            break;

          case 13:
            _context2.prev = 13;
            _context2.t0 = _context2["catch"](1);
            res.status(500).json({
              message: 'Error al obtener el tipo y los alimentos',
              error: _context2.t0.message
            });

          case 16:
          case "end":
            return _context2.stop();
        }
      }
    }, null, null, [[1, 13]]);
  },
  // Crear un nuevo tipo
  create: function create(req, res) {
    var _tipoSchema$validate, error, _req$body, nombre, descripcion, id;

    return regeneratorRuntime.async(function create$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _tipoSchema$validate = tipoSchema.validate(req.body), error = _tipoSchema$validate.error;

            if (!error) {
              _context3.next = 3;
              break;
            }

            return _context3.abrupt("return", res.status(400).json({
              message: error.details[0].message
            }));

          case 3:
            _req$body = req.body, nombre = _req$body.nombre, descripcion = _req$body.descripcion;
            _context3.prev = 4;
            _context3.next = 7;
            return regeneratorRuntime.awrap(_TipoModel["default"].existsByName(nombre));

          case 7:
            if (!_context3.sent) {
              _context3.next = 9;
              break;
            }

            return _context3.abrupt("return", res.status(400).json({
              message: 'El tipo con este nombre ya existe'
            }));

          case 9:
            _context3.next = 11;
            return regeneratorRuntime.awrap(_TipoModel["default"].create(nombre, descripcion));

          case 11:
            id = _context3.sent;
            res.status(201).json({
              id: id,
              nombre: nombre,
              descripcion: descripcion
            });
            _context3.next = 18;
            break;

          case 15:
            _context3.prev = 15;
            _context3.t0 = _context3["catch"](4);
            res.status(500).json({
              message: 'Error al crear el tipo',
              error: _context3.t0.message
            });

          case 18:
          case "end":
            return _context3.stop();
        }
      }
    }, null, null, [[4, 15]]);
  },
  // Actualizar un tipo
  update: function update(req, res) {
    var id, _tipoSchema$validate2, error, _req$body2, nombre, descripcion, updatedRows;

    return regeneratorRuntime.async(function update$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            id = req.params.id;
            _tipoSchema$validate2 = tipoSchema.validate(req.body), error = _tipoSchema$validate2.error;

            if (!error) {
              _context4.next = 4;
              break;
            }

            return _context4.abrupt("return", res.status(400).json({
              message: error.details[0].message
            }));

          case 4:
            _req$body2 = req.body, nombre = _req$body2.nombre, descripcion = _req$body2.descripcion;
            _context4.prev = 5;
            _context4.next = 8;
            return regeneratorRuntime.awrap(_TipoModel["default"].update(id, nombre, descripcion));

          case 8:
            updatedRows = _context4.sent;

            if (!(updatedRows === 0)) {
              _context4.next = 11;
              break;
            }

            return _context4.abrupt("return", res.status(404).json({
              message: 'Tipo no encontrado'
            }));

          case 11:
            res.json({
              message: 'Tipo actualizado'
            });
            _context4.next = 17;
            break;

          case 14:
            _context4.prev = 14;
            _context4.t0 = _context4["catch"](5);
            res.status(500).json({
              message: 'Error al actualizar el tipo',
              error: _context4.t0.message
            });

          case 17:
          case "end":
            return _context4.stop();
        }
      }
    }, null, null, [[5, 14]]);
  },
  // Eliminar un tipo
  "delete": function _delete(req, res) {
    var id, deletedRows;
    return regeneratorRuntime.async(function _delete$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            id = req.params.id;
            _context5.prev = 1;
            _context5.next = 4;
            return regeneratorRuntime.awrap(_TipoModel["default"]["delete"](id));

          case 4:
            deletedRows = _context5.sent;

            if (!(deletedRows === 0)) {
              _context5.next = 7;
              break;
            }

            return _context5.abrupt("return", res.status(404).json({
              message: 'Tipo no encontrado'
            }));

          case 7:
            res.json({
              message: 'Tipo eliminado'
            });
            _context5.next = 13;
            break;

          case 10:
            _context5.prev = 10;
            _context5.t0 = _context5["catch"](1);
            res.status(500).json({
              message: 'Error al eliminar el tipo',
              error: _context5.t0.message
            });

          case 13:
          case "end":
            return _context5.stop();
        }
      }
    }, null, null, [[1, 10]]);
  }
};
var _default = TipoController;
exports["default"] = _default;