"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

//==========================================================================================
//                  ESQUEMA DE LA COLECCION DE CATEGORIAS DE PRODUCTOS
//==========================================================================================
var esquema = new _mongoose["default"].Schema( // PROPIEDADES DE LA COLECCION
{
  ID_Negocio: {
    type: String,
    required: true
  },
  Nombre: {
    type: String,
    required: true
  },
  Imagenes: {
    type: Array(),
    "default": []
  },
  Codigo_De_Barras: {
    type: String,
    required: true
  },
  Descripcion: {
    type: String,
    "default": ""
  },
  ID_Marca: {
    type: String,
    "default": ""
  },
  ID_Categoria: {
    type: String,
    "default": ""
  },
  Dimension: {
    type: Number,
    required: true
  },
  Tipo_Dimension: {
    type: String,
    required: true
  },
  Precio: {
    type: Number,
    required: true
  }
}, // CONFIGURACIONES EXTRAS DE LA COLECCION 
{
  timestamps: true,
  // AGREGA 2 CAMPOS A LA COLLECION: fecha de creacion y de actualizacion 
  versionKey: false // QUITAR EL CAMPO __v QUE SE AGREGA POR DEFECTO

}); // se EXPORTA la coleccion llamada "productos" con dicho esquema

var _default = _mongoose["default"].model('Productos', esquema);

exports["default"] = _default;