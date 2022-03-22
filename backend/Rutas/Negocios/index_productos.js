"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = require("express");

var _producto = require("../../Controladores/Negocios/producto");

var _multer = _interopRequireDefault(require("multer"));

var _path = _interopRequireDefault(require("path"));

//=================================================
// IMPORTACIONES
//=================================================
// Middleware para procesar datos FormData()
var router = (0, _express.Router)(); //=================================================
//  MANEJADOR DE ARCHIVOS
//=================================================

var manejadorArchivos = _multer["default"].diskStorage({
  destination: function destination(peticion, archivo, cb) {
    cb(null, _path["default"].join(__dirname, '..', '..', '..', 'app', 'public', 'RECURSOS'));
  },
  filename: function filename(peticion, archivo, cb) {
    cb(null, archivo.fieldname + '-' + Date.now() + _path["default"].extname(archivo.originalname));
  }
});

var upload = (0, _multer["default"])({
  storage: manejadorArchivos,
  limits: {
    fieldSize: 25 * 1024 * 1024
  }
}); //const upload = multer()  // se configura sin ubicacion para el alamacenamiento de imagenes
//=================================================
// RUTA PARA INSERTAR NUEVAS MARCAS DE PRODUCTOS
//=================================================

router.post('/insertar', upload.none(), _producto.insertar); //=================================================
// RUTA PARA ELIMINAR UNA MARCA DE PRODUCTO EXISTENTE
//=================================================

router.post('/eliminar', upload.none(), _producto.eliminar); //=================================================
// RUTA PARA BUSCAR MARCAS DE PRODUCTOS
//=================================================

router.post('/listaProductos', upload.none(), _producto.getListaProductos); //=================================================
// RUTA PARA OBTENER UN PRODUCTO POR ID
//=================================================

router.post('/getProductoByID', upload.none(), _producto.getProductoByID); //=================================================
// RUTA PARA OBTENER UNA LISTA CON LOS NOMBRES DE TODOS LOS PRODUCTOS
//=================================================

router.post('/getNombresProductos', upload.none(), _producto.getNombresDeProductos); //=================================================
// RUTA PARA ACTUALIZAR UNA MARCA
//=================================================

router.post('/actualizar', upload.none(), _producto.actualizar);
var _default = router;
exports["default"] = _default;