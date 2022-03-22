"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _path = _interopRequireDefault(require("path"));

var _config = require("../../config");

var _Utilerias = _interopRequireDefault(require("../../Utilerias"));

// SPACES: https://appwing.sfo3.digitaloceanspaces.com
// ENDPOINT: sfo3.digitaloceanspaces.com
// BUCKET: appwing
// KEY: PHWTTGHAFWLODBSSN7LS
// SECRET: orGlNkJQ0eURUEafvCJlkvue040vO7Rys7tr7qixjcs
var AlmacenCategoria = /*#__PURE__*/function () {
  function AlmacenCategoria() {
    (0, _classCallCheck2["default"])(this, AlmacenCategoria);
  }

  (0, _createClass2["default"])(AlmacenCategoria, null, [{
    key: "guardarImagen",
    value:
    /*===================================================
            GUARDAR IMAGEN DE UNA CATEGORIA (return: nombre.ext )
    =====================================================*/
    function () {
      var _guardarImagen = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(imagenBase64, id_categoria, tipoImagen) {
        var retorno, dataImagen, s3, nombreImagen;
        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                retorno = {
                  existeError: false,
                  nombre: "",
                  mensaje: ""
                };

                if (!(imagenBase64 == "")) {
                  _context.next = 5;
                  break;
                }

                retorno.existeError = false;
                retorno.nombre = "";
                return _context.abrupt("return", retorno);

              case 5:
                // GET DATA 
                dataImagen = Buffer.from(imagenBase64.replace(/^data:image\/\w+;base64,/, ""), 'base64'); // CONEXION A DIGITAL OCEAN SPACES

                s3 = _Utilerias["default"].getAWS_S3();

                if (!s3.existeError) {
                  _context.next = 11;
                  break;
                }

                retorno.existeError = true;
                retorno.mensaje = s3.mensaje;
                return _context.abrupt("return", retorno);

              case 11:
                _context.prev = 11;
                nombreImagen = 'categoria_' + id_categoria + "." + tipoImagen;
                _context.next = 15;
                return s3.S3.putObject({
                  Bucket: AlmacenCategoria.UBICACION,
                  ACL: 'private',
                  //'public-read' ,
                  Key: nombreImagen,
                  Body: dataImagen,
                  ContentType: tipoImagen
                }).promise();

              case 15:
                retorno.nombre = nombreImagen;
                return _context.abrupt("return", retorno);

              case 19:
                _context.prev = 19;
                _context.t0 = _context["catch"](11);
                retorno.existeError = true;
                retorno.mensaje = _context.t0.message;
                return _context.abrupt("return", retorno);

              case 24:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, null, [[11, 19]]);
      }));

      function guardarImagen(_x, _x2, _x3) {
        return _guardarImagen.apply(this, arguments);
      }

      return guardarImagen;
    }()
    /*===================================================
            OBTENER LA IMAGEN DE UNA CATEGORIA (return:  EL BASE64 URL Y EL TIPO )
    =====================================================*/

  }, {
    key: "getImagen",
    value: function () {
      var _getImagen = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(nombre) {
        var retorno, s3, dataImagen, tipoImagen;
        return _regenerator["default"].wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                retorno = {
                  existeError: false,
                  mensaje: "",
                  base64: "",
                  tipo: ""
                };

                if (!(nombre == "")) {
                  _context2.next = 3;
                  break;
                }

                return _context2.abrupt("return", retorno);

              case 3:
                _context2.prev = 3;
                // CONEXION A DIGITAL OCEAN SPACES
                s3 = _Utilerias["default"].getAWS_S3();

                if (!s3.existeError) {
                  _context2.next = 9;
                  break;
                }

                retorno.existeError = true;
                retorno.mensaje = s3.mensaje;
                return _context2.abrupt("return", retorno);

              case 9:
                _context2.next = 11;
                return s3.S3.getObject({
                  Bucket: AlmacenCategoria.UBICACION,
                  Key: nombre
                }).promise();

              case 11:
                dataImagen = _context2.sent;

                if (dataImagen.Body != undefined) {
                  tipoImagen = _path["default"].extname(nombre).replace('.', '');
                  retorno.base64 = "data:image/" + tipoImagen + ";base64," + dataImagen.Body.toString('base64');
                  retorno.tipo = tipoImagen;
                }

                return _context2.abrupt("return", retorno);

              case 16:
                _context2.prev = 16;
                _context2.t0 = _context2["catch"](3);
                retorno.base64 = "";
                retorno.tipo = "";
                retorno.existeError = true;
                retorno.mensaje = _context2.t0.message;
                return _context2.abrupt("return", retorno);

              case 23:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, null, [[3, 16]]);
      }));

      function getImagen(_x4) {
        return _getImagen.apply(this, arguments);
      }

      return getImagen;
    }()
  }, {
    key: "eliminarImagen",
    value: function () {
      var _eliminarImagen = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(nombreImagen) {
        var retorno, s3;
        return _regenerator["default"].wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                retorno = {
                  existeError: false,
                  mensaje: ""
                };

                if (!(nombreImagen == "")) {
                  _context3.next = 3;
                  break;
                }

                return _context3.abrupt("return", retorno);

              case 3:
                _context3.prev = 3;
                // CONEXION A DIGITAL OCEAN SPACES
                s3 = _Utilerias["default"].getAWS_S3();

                if (!s3.existeError) {
                  _context3.next = 9;
                  break;
                }

                retorno.existeError = true;
                retorno.mensaje = s3.mensaje;
                return _context3.abrupt("return", retorno);

              case 9:
                _context3.next = 11;
                return s3.S3.deleteObject({
                  Bucket: AlmacenCategoria.UBICACION,
                  Key: nombreImagen
                }).promise();

              case 11:
                return _context3.abrupt("return", retorno);

              case 14:
                _context3.prev = 14;
                _context3.t0 = _context3["catch"](3);
                retorno.existeError = true;
                retorno.mensaje = _context3.t0.message;
                return _context3.abrupt("return", retorno);

              case 19:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, null, [[3, 14]]);
      }));

      function eliminarImagen(_x5) {
        return _eliminarImagen.apply(this, arguments);
      }

      return eliminarImagen;
    }()
  }]);
  return AlmacenCategoria;
}();

exports["default"] = AlmacenCategoria;
(0, _defineProperty2["default"])(AlmacenCategoria, "UBICACION", _config.configAWS.bucketName + "/Negocios/Categorias");