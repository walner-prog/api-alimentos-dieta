"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _db = _interopRequireDefault(require("../config/db.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

// Conexión a la base de datos
var TipoModel = {
  // Obtener todos los tipos
  getAll: function getAll() {
    var _ref, _ref2, rows;

    return regeneratorRuntime.async(function getAll$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return regeneratorRuntime.awrap(_db["default"].query('SELECT * FROM tipos'));

          case 2:
            _ref = _context.sent;
            _ref2 = _slicedToArray(_ref, 1);
            rows = _ref2[0];
            return _context.abrupt("return", rows);

          case 6:
          case "end":
            return _context.stop();
        }
      }
    });
  },
  // Obtener un tipo por ID
  getById: function getById(id) {
    var _ref3, _ref4, rows;

    return regeneratorRuntime.async(function getById$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return regeneratorRuntime.awrap(_db["default"].query('SELECT * FROM tipos WHERE id = ?', [id]));

          case 2:
            _ref3 = _context2.sent;
            _ref4 = _slicedToArray(_ref3, 1);
            rows = _ref4[0];
            return _context2.abrupt("return", rows[0]);

          case 6:
          case "end":
            return _context2.stop();
        }
      }
    });
  },
  // Obtener alimentos relacionados con un tipo
  getAlimentosByTipoId: function getAlimentosByTipoId(id) {
    var _ref5, _ref6, rows;

    return regeneratorRuntime.async(function getAlimentosByTipoId$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.next = 2;
            return regeneratorRuntime.awrap(_db["default"].query('SELECT * FROM alimentos WHERE tipo_id = ?', [id]));

          case 2:
            _ref5 = _context3.sent;
            _ref6 = _slicedToArray(_ref5, 1);
            rows = _ref6[0];
            return _context3.abrupt("return", rows);

          case 6:
          case "end":
            return _context3.stop();
        }
      }
    });
  },
  // Crear un nuevo tipo
  create: function create(nombre, descripcion) {
    var _ref7, _ref8, result;

    return regeneratorRuntime.async(function create$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.next = 2;
            return regeneratorRuntime.awrap(_db["default"].query('INSERT INTO tipos (nombre, descripcion) VALUES (?, ?)', [nombre, descripcion]));

          case 2:
            _ref7 = _context4.sent;
            _ref8 = _slicedToArray(_ref7, 1);
            result = _ref8[0];
            return _context4.abrupt("return", result.insertId);

          case 6:
          case "end":
            return _context4.stop();
        }
      }
    });
  },
  // Actualizar un tipo
  update: function update(id, nombre, descripcion) {
    var _ref9, _ref10, result;

    return regeneratorRuntime.async(function update$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            _context5.next = 2;
            return regeneratorRuntime.awrap(_db["default"].query('UPDATE tipos SET nombre = ?, descripcion = ? WHERE id = ?', [nombre, descripcion, id]));

          case 2:
            _ref9 = _context5.sent;
            _ref10 = _slicedToArray(_ref9, 1);
            result = _ref10[0];
            return _context5.abrupt("return", result.affectedRows);

          case 6:
          case "end":
            return _context5.stop();
        }
      }
    });
  },
  // Eliminar un tipo
  "delete": function _delete(id) {
    var _ref11, _ref12, result;

    return regeneratorRuntime.async(function _delete$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            _context6.next = 2;
            return regeneratorRuntime.awrap(_db["default"].query('DELETE FROM tipos WHERE id = ?', [id]));

          case 2:
            _ref11 = _context6.sent;
            _ref12 = _slicedToArray(_ref11, 1);
            result = _ref12[0];
            return _context6.abrupt("return", result.affectedRows);

          case 6:
          case "end":
            return _context6.stop();
        }
      }
    });
  },
  // Verificar si un tipo existe por nombre
  existsByName: function existsByName(nombre) {
    var _ref13, _ref14, rows;

    return regeneratorRuntime.async(function existsByName$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            _context7.next = 2;
            return regeneratorRuntime.awrap(_db["default"].query('SELECT * FROM tipos WHERE nombre = ?', [nombre]));

          case 2:
            _ref13 = _context7.sent;
            _ref14 = _slicedToArray(_ref13, 1);
            rows = _ref14[0];
            return _context7.abrupt("return", rows.length > 0);

          case 6:
          case "end":
            return _context7.stop();
        }
      }
    });
  }
};
var _default = TipoModel;
exports["default"] = _default;