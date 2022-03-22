"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

//==========================================================================================
//                      ESQUEMA DE LA COLECCION DE MARCAS DE NEGOCIOS
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
  Imagen: {
    type: String,
    "default": "N/A"
  }
}, // CONFIGURACIONES EXTRAS DE LA COLECCION 
{
  timestamps: true,
  // AGREGA 2 CAMPOS A LA COLLECION: fecha de creacion y de actualizacion 
  versionKey: false // QUITAR EL CAMPO __v QUE SE AGREGA POR DEFECTO

}); // se EXPORTA la coleccion llamada "productos" con dicho esquema

var _default = _mongoose["default"].model('MarcasDeProductos', esquema);

exports["default"] = _default;