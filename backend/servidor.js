"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _express = _interopRequireDefault(require("express"));

var _path = _interopRequireDefault(require("path"));

var _bodyParser = _interopRequireDefault(require("body-parser"));

var _mongoose = _interopRequireDefault(require("mongoose"));

var _cors = _interopRequireDefault(require("cors"));

var _index_marcas = _interopRequireDefault(require("./Rutas/Negocios/index_marcas"));

var _index_categorias = _interopRequireDefault(require("./Rutas/Negocios/index_categorias"));

var _index_productos = _interopRequireDefault(require("./Rutas/Negocios/index_productos"));

var _config = require("./config");

//==================================
// IMPORTACIONES
//==================================
// CONTROLADOR DE RUTAS <MARCAS>
// CONTROLADOR DE RUTAS <CATEGORIAS>
// CONTROLADOR DE RUTAS <PRODUCTOS>
//==================================
// CONEXION A LA BD
//==================================
function conectarBD() {
  return _conectarBD.apply(this, arguments);
}

function _conectarBD() {
  _conectarBD = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee() {
    var db;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            _context.next = 3;
            return _mongoose["default"].connect(_config.URL_mongoBD);

          case 3:
            db = _context.sent;
            console.log("conexion exitosa a la BD \"".concat(db.connection.name, "\" "));
            _context.next = 10;
            break;

          case 7:
            _context.prev = 7;
            _context.t0 = _context["catch"](0);
            console.log(_context.t0.message);

          case 10:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[0, 7]]);
  }));
  return _conectarBD.apply(this, arguments);
}

conectarBD(); //==================================
// CONFIGURACIONES
//==================================

var server = (0, _express["default"])(); // CONFIGURAR EL PUERTO DE PETICIONES HTTP

server.set('port', _config.PUERTO_SERVIDOR); // PERMITIR COMUNICACION CON EL SERVIDOR REACT

server.use((0, _cors["default"])());
/*==============================================
            MANEJADOR DE RUTAS
        (MARCAS DE PRODUCTOS DE NEGOCIOS)
================================================*/

server.use("/api/negocios/marcas", _index_marcas["default"]);
/*==============================================
            MANEJADOR DE RUTAS
    (CATEGORIAS DE PRODUCTOS DE NEGOCIOS)
================================================*/

server.use("/api/negocios/categorias", _index_categorias["default"]);
/*==============================================
            MANEJADOR DE RUTAS
          (PRODUCTOS DE NEGOCIOS)
================================================*/

server.use("/api/negocios/productos", _index_productos["default"]); // CONFIGURACION DE LA CARPETA PUBLICA Y MANEJO DE RUTAS CUANDO 
// EL SERVIDOR ESTE EN PRODUCCION (EN HOSTING)

if (process.env.NODE_ENV === 'production') {
  server.use(_express["default"]["static"](_path["default"].join(__dirname, '..', 'app', 'build')));
  server.use('*', function (peticion, respuesta) {
    respuesta.sendFile(_path["default"].resolve(__dirname, '..', 'app', 'build', 'index.html'));
  });
} else {
  server.use(_express["default"]["static"](_path["default"].join(__dirname, '..', 'app', 'public')));
} // CONFIGURAR PARA LA RECEPCION DE DATOS DE TIPO FormData() 


server.use(_bodyParser["default"].urlencoded({
  extended: true
}));
server.use(_bodyParser["default"].json()); //==================================
// EJECUCION DEL SERVIDOR
//==================================

server.listen(server.get('port'), function () {
  console.log("Servidor activo por el puerto ".concat(server.get('port')));
});