"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.checkCategoriaExistsByNameExceptId = exports.checkCategoriaExistsByName = exports.deleteCategoria = exports.updateCategoria = exports.createCategoria = exports.getAlimentosByCategoriaId = exports.getCategoriaById = exports.getAllCategorias = void 0;

var _db = _interopRequireDefault(require("../config/db.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// Archivo donde configuras el pool de MySQL
var getAllCategorias = function getAllCategorias() {
  return regeneratorRuntime.async(function getAllCategorias$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return regeneratorRuntime.awrap(_db["default"].query('SELECT * FROM categorias'));

        case 2:
          return _context.abrupt("return", _context.sent);

        case 3:
        case "end":
          return _context.stop();
      }
    }
  });
};

exports.getAllCategorias = getAllCategorias;

var getCategoriaById = function getCategoriaById(id) {
  return regeneratorRuntime.async(function getCategoriaById$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.next = 2;
          return regeneratorRuntime.awrap(_db["default"].query('SELECT * FROM categorias WHERE id = ?', [id]));

        case 2:
          return _context2.abrupt("return", _context2.sent);

        case 3:
        case "end":
          return _context2.stop();
      }
    }
  });
};

exports.getCategoriaById = getCategoriaById;

var getAlimentosByCategoriaId = function getAlimentosByCategoriaId(categoriaId) {
  return regeneratorRuntime.async(function getAlimentosByCategoriaId$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.next = 2;
          return regeneratorRuntime.awrap(_db["default"].query('SELECT * FROM alimentos WHERE categoria_id = ?', [categoriaId]));

        case 2:
          return _context3.abrupt("return", _context3.sent);

        case 3:
        case "end":
          return _context3.stop();
      }
    }
  });
};

exports.getAlimentosByCategoriaId = getAlimentosByCategoriaId;

var createCategoria = function createCategoria(_ref) {
  var nombre, descripcion;
  return regeneratorRuntime.async(function createCategoria$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          nombre = _ref.nombre, descripcion = _ref.descripcion;
          _context4.next = 3;
          return regeneratorRuntime.awrap(_db["default"].query('INSERT INTO categorias (nombre, descripcion) VALUES (?, ?)', [nombre, descripcion]));

        case 3:
          return _context4.abrupt("return", _context4.sent);

        case 4:
        case "end":
          return _context4.stop();
      }
    }
  });
};

exports.createCategoria = createCategoria;

var updateCategoria = function updateCategoria(id, _ref2) {
  var nombre, descripcion;
  return regeneratorRuntime.async(function updateCategoria$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          nombre = _ref2.nombre, descripcion = _ref2.descripcion;
          _context5.next = 3;
          return regeneratorRuntime.awrap(_db["default"].query('UPDATE categorias SET nombre = ?, descripcion = ? WHERE id = ?', [nombre, descripcion, id]));

        case 3:
          return _context5.abrupt("return", _context5.sent);

        case 4:
        case "end":
          return _context5.stop();
      }
    }
  });
};

exports.updateCategoria = updateCategoria;

var deleteCategoria = function deleteCategoria(id) {
  return regeneratorRuntime.async(function deleteCategoria$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          _context6.next = 2;
          return regeneratorRuntime.awrap(_db["default"].query('DELETE FROM categorias WHERE id = ?', [id]));

        case 2:
          return _context6.abrupt("return", _context6.sent);

        case 3:
        case "end":
          return _context6.stop();
      }
    }
  });
};

exports.deleteCategoria = deleteCategoria;

var checkCategoriaExistsByName = function checkCategoriaExistsByName(nombre) {
  return regeneratorRuntime.async(function checkCategoriaExistsByName$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          _context7.next = 2;
          return regeneratorRuntime.awrap(_db["default"].query('SELECT * FROM categorias WHERE nombre = ?', [nombre]));

        case 2:
          return _context7.abrupt("return", _context7.sent);

        case 3:
        case "end":
          return _context7.stop();
      }
    }
  });
};

exports.checkCategoriaExistsByName = checkCategoriaExistsByName;

var checkCategoriaExistsByNameExceptId = function checkCategoriaExistsByNameExceptId(nombre, id) {
  return regeneratorRuntime.async(function checkCategoriaExistsByNameExceptId$(_context8) {
    while (1) {
      switch (_context8.prev = _context8.next) {
        case 0:
          _context8.next = 2;
          return regeneratorRuntime.awrap(_db["default"].query('SELECT * FROM categorias WHERE nombre = ? AND id != ?', [nombre, id]));

        case 2:
          return _context8.abrupt("return", _context8.sent);

        case 3:
        case "end":
          return _context8.stop();
      }
    }
  });
};

exports.checkCategoriaExistsByNameExceptId = checkCategoriaExistsByNameExceptId;