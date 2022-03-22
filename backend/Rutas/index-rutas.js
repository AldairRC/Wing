"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = require("express");

var _controladorProductos = require("../Controladores/controlador-productos");

var _multer = _interopRequireDefault(require("multer"));

var _path = _interopRequireDefault(require("path"));

//=================================================
// IMPORTACIONES
//=================================================
// Middleware para procesar datos FormData()
//=================================================
//  MANEJADOR DE ARCHIVOS
//=================================================
var manejadorArchivos = _multer["default"].diskStorage({
  destination: function destination(peticion, archivo, cb) {
    cb(null, 'archivos');
  },
  filename: function filename(peticion, archivo, cb) {
    cb(null, archivo.fieldname + '-' + Date.now() + _path["default"].extname(archivo.originalname));
  }
});

var upload = (0, _multer["default"])({
  storage: manejadorArchivos
}); //const upload = multer()  // se configura sin ubicacion para el alamacenamiento de imagenes
//=================================================
// RUTA PRINCIPAL
//=================================================

var router = (0, _express.Router)();
router.get('/', function (peticion, respuesta) {
  respuesta.render('principal/index'); //respuesta.redirect('/')    redirecciona a la ruta /
}); //=================================================
// RUTA PARA GUARDAR UN NUEVO PRODUCTO
//=================================================

router.post('/addProducto', upload.single('imagen'), _controladorProductos.add); //=================================================
// RUTA PARA EDITAR UN PRODUCTO
//=================================================

router.get('/editarProducto/:id/:nombre/:descripcion/:precio', _controladorProductos.editar); //=================================================
// RUTA PARA ELIMINAR UN PRODUCTO
//=================================================

router.get('/eliminarProducto/:id', _controladorProductos.eliminar); //=================================================
// RUTA PARA REDIRECCIONAR
//=================================================

router.get('/nuevo', function (peticion, respuesta) {
  respuesta.send("Borraste registro ...");
}); //=================================================
// RUTA PARA OBTENER REGISTROS
//=================================================

router.post('/getProductos', upload.none(), _controladorProductos.buscar);
var _default = router;
exports["default"] = _default;