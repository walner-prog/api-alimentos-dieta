"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.eliminarCategoria = exports.actualizarCategoria = exports.crearCategoria = exports.obtenerCategoriaPorId = exports.obtenerCategorias = void 0;

var _categoriaModel = require("../models/categoriaModel.js");

var _joi = _interopRequireDefault(require("joi"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var categoriaSchema = _joi["default"].object({
  nombre: _joi["default"].string().required(),
  descripcion: _joi["default"].string().optional()
});

var obtenerCategorias = function obtenerCategorias(req, res) {
  var _ref, _ref2, rows;

  return regeneratorRuntime.async(function obtenerCategorias$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap((0, _categoriaModel.getAllCategorias)());

        case 3:
          _ref = _context.sent;
          _ref2 = _slicedToArray(_ref, 1);
          rows = _ref2[0];
          res.json(rows);
          _context.next = 12;
          break;

        case 9:
          _context.prev = 9;
          _context.t0 = _context["catch"](0);
          res.status(500).json({
            message: 'Error al obtener las categorías',
            error: _context.t0.message
          });

        case 12:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 9]]);
};

exports.obtenerCategorias = obtenerCategorias;

var obtenerCategoriaPorId = function obtenerCategoriaPorId(req, res) {
  var id, _ref3, _ref4, category, _ref5, _ref6, alimentos;

  return regeneratorRuntime.async(function obtenerCategoriaPorId$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          id = req.params.id;
          _context2.prev = 1;
          _context2.next = 4;
          return regeneratorRuntime.awrap((0, _categoriaModel.getCategoriaById)(id));

        case 4:
          _ref3 = _context2.sent;
          _ref4 = _slicedToArray(_ref3, 1);
          category = _ref4[0];

          if (!(category.length === 0)) {
            _context2.next = 9;
            break;
          }

          return _context2.abrupt("return", res.status(404).json({
            message: 'Categoría no encontrada'
          }));

        case 9:
          _context2.next = 11;
          return regeneratorRuntime.awrap((0, _categoriaModel.getAlimentosByCategoriaId)(id));

        case 11:
          _ref5 = _context2.sent;
          _ref6 = _slicedToArray(_ref5, 1);
          alimentos = _ref6[0];
          res.json(_objectSpread({}, category[0], {
            alimentos: alimentos
          }));
          _context2.next = 20;
          break;

        case 17:
          _context2.prev = 17;
          _context2.t0 = _context2["catch"](1);
          res.status(500).json({
            message: 'Error al obtener la categoría y los alimentos',
            error: _context2.t0.message
          });

        case 20:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[1, 17]]);
};

exports.obtenerCategoriaPorId = obtenerCategoriaPorId;

var crearCategoria = function crearCategoria(req, res) {
  var _categoriaSchema$vali, error, _req$body, nombre, descripcion, _ref7, _ref8, existingCategory, _ref9, _ref10, result;

  return regeneratorRuntime.async(function crearCategoria$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _categoriaSchema$vali = categoriaSchema.validate(req.body), error = _categoriaSchema$vali.error;

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
          return regeneratorRuntime.awrap((0, _categoriaModel.checkCategoriaExistsByName)(nombre));

        case 7:
          _ref7 = _context3.sent;
          _ref8 = _slicedToArray(_ref7, 1);
          existingCategory = _ref8[0];

          if (!(existingCategory.length > 0)) {
            _context3.next = 12;
            break;
          }

          return _context3.abrupt("return", res.status(400).json({
            message: 'Ya existe una categoría con ese nombre'
          }));

        case 12:
          _context3.next = 14;
          return regeneratorRuntime.awrap((0, _categoriaModel.createCategoria)({
            nombre: nombre,
            descripcion: descripcion
          }));

        case 14:
          _ref9 = _context3.sent;
          _ref10 = _slicedToArray(_ref9, 1);
          result = _ref10[0];
          res.status(201).json({
            id: result.insertId,
            nombre: nombre,
            descripcion: descripcion
          });
          _context3.next = 23;
          break;

        case 20:
          _context3.prev = 20;
          _context3.t0 = _context3["catch"](4);
          res.status(500).json({
            message: 'Error al agregar la categoría',
            error: _context3.t0.message
          });

        case 23:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[4, 20]]);
};

exports.crearCategoria = crearCategoria;

var actualizarCategoria = function actualizarCategoria(req, res) {
  var id, _categoriaSchema$vali2, error, _req$body2, nombre, descripcion, _ref11, _ref12, existingCategory, _ref13, _ref14, result;

  return regeneratorRuntime.async(function actualizarCategoria$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          id = req.params.id;
          _categoriaSchema$vali2 = categoriaSchema.validate(req.body), error = _categoriaSchema$vali2.error;

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
          return regeneratorRuntime.awrap((0, _categoriaModel.checkCategoriaExistsByNameExceptId)(nombre, id));

        case 8:
          _ref11 = _context4.sent;
          _ref12 = _slicedToArray(_ref11, 1);
          existingCategory = _ref12[0];

          if (!(existingCategory.length > 0)) {
            _context4.next = 13;
            break;
          }

          return _context4.abrupt("return", res.status(400).json({
            message: 'Ya existe una categoría con ese nombre'
          }));

        case 13:
          _context4.next = 15;
          return regeneratorRuntime.awrap((0, _categoriaModel.updateCategoria)(id, {
            nombre: nombre,
            descripcion: descripcion
          }));

        case 15:
          _ref13 = _context4.sent;
          _ref14 = _slicedToArray(_ref13, 1);
          result = _ref14[0];

          if (!(result.affectedRows === 0)) {
            _context4.next = 20;
            break;
          }

          return _context4.abrupt("return", res.status(404).json({
            message: 'Categoría no encontrada'
          }));

        case 20:
          res.json({
            message: 'Categoría actualizada correctamente'
          });
          _context4.next = 26;
          break;

        case 23:
          _context4.prev = 23;
          _context4.t0 = _context4["catch"](5);
          res.status(500).json({
            message: 'Error al actualizar la categoría',
            error: _context4.t0.message
          });

        case 26:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[5, 23]]);
};

exports.actualizarCategoria = actualizarCategoria;

var eliminarCategoria = function eliminarCategoria(req, res) {
  var id, _ref15, _ref16, result;

  return regeneratorRuntime.async(function eliminarCategoria$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          id = req.params.id;
          _context5.prev = 1;
          _context5.next = 4;
          return regeneratorRuntime.awrap((0, _categoriaModel.deleteCategoria)(id));

        case 4:
          _ref15 = _context5.sent;
          _ref16 = _slicedToArray(_ref15, 1);
          result = _ref16[0];

          if (!(result.affectedRows === 0)) {
            _context5.next = 9;
            break;
          }

          return _context5.abrupt("return", res.status(404).json({
            message: 'Categoría no encontrada'
          }));

        case 9:
          res.json({
            message: 'Categoría eliminada'
          });
          _context5.next = 15;
          break;

        case 12:
          _context5.prev = 12;
          _context5.t0 = _context5["catch"](1);
          res.status(500).json({
            message: 'Error al eliminar la categoría',
            error: _context5.t0.message
          });

        case 15:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[1, 12]]);
};

exports.eliminarCategoria = eliminarCategoria;