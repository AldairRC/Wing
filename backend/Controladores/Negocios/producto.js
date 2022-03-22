"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.insertar = exports.getProductoByID = exports.getNombresDeProductos = exports.getListaProductos = exports.eliminar = exports.actualizar = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _Producto = _interopRequireDefault(require("../../Modelos/Negocios/Producto"));

var _Marca = _interopRequireDefault(require("../../Modelos/Negocios/Marca"));

var _Categoria = _interopRequireDefault(require("../../Modelos/Negocios/Categoria"));

var _mongoose = _interopRequireDefault(require("mongoose"));

var _Utilerias = _interopRequireDefault(require("../../Utilerias"));

var _Producto2 = _interopRequireDefault(require("../../Almacen/Negocio/Producto"));

var _Marca2 = _interopRequireDefault(require("../../Almacen/Negocio/Marca"));

var _Categoria2 = _interopRequireDefault(require("../../Almacen/Negocio/Categoria"));

//=================================================
// IMPORTACIONES
//=================================================

/*================================================================================
            FUNCION QUE RETORNA LA RUTA DE UBICACION DE UNA CATEGORIA
==================================================================================*/
function getUbicacionCategoria(_x) {
  return _getUbicacionCategoria.apply(this, arguments);
}
/*=======================================================================================
                        AGREGAR NUEVO PRODUCTO
=========================================================================================*/


function _getUbicacionCategoria() {
  _getUbicacionCategoria = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee7(campoUbicacion) {
    var ubicacion, IDs, filtro, camposSelect, query, registros;
    return _regenerator["default"].wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            ubicacion = "";
            IDs = [];
            campoUbicacion.forEach(function (ID) {
              IDs.push(new _mongoose["default"].Types.ObjectId(ID));
            });
            filtro = {
              _id: {
                $in: IDs
              }
            };
            camposSelect = {
              _id: 1,
              Nombre: 1
            };
            _context7.next = 7;
            return _Categoria["default"].find(filtro, camposSelect);

          case 7:
            query = _context7.sent;

            if (query == null) {
              console.log("Error al buscar Ubicacion");
              ubicacion = "?";
            } else {
              ubicacion = "Principales" + " / ";
              registros = [];
              query.forEach(function (reg) {
                registros.push({
                  id: reg._id,
                  nombre: reg.Nombre
                });
              });
              campoUbicacion.forEach(function (ID) {
                var reg = registros.find(function (reg) {
                  return reg.id == ID;
                });
                if (reg == undefined) ubicacion += "?" + " / ";else ubicacion += reg.nombre + " / ";
              });
              if (ubicacion != "") ubicacion = ubicacion.substring(0, ubicacion.length - 3);
            } //console.log( "Ubicacion: " + ubicacion )


            return _context7.abrupt("return", ubicacion);

          case 10:
          case "end":
            return _context7.stop();
        }
      }
    }, _callee7);
  }));
  return _getUbicacionCategoria.apply(this, arguments);
}

var insertar = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(peticion, respuesta) {
    var producto, tiposDimension_validos, filtroNombre, filtroCodigoBarras, camposSelect, queryNombre, queryCodBarras, queryMarca, queryCategoria, nuevoProducto, nuevoReg, nombresImagenesProducto, i, img, descripcion;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            producto = {
              id_negocio: peticion.body.id_negocio,
              nombre: peticion.body.nombre,
              codigo_barras: peticion.body.codigo_de_barras,
              descripcion: peticion.body.descripcion,
              marca_id: peticion.body.id_marca,
              categoria_id: peticion.body.id_categoria,
              imagenes_base64: JSON.parse(peticion.body.imagenes_base64),
              imagenes_tipo: JSON.parse(peticion.body.imagenes_tipo),
              dimension: Number(peticion.body.dimension),
              dimension_tipo: peticion.body.dimension_tipo,
              precio: Number(peticion.body.precio)
            }; // VALIDAR <ID_NEGOCIO>

            if (!(producto.id_negocio == undefined || producto.id_negocio == "")) {
              _context.next = 4;
              break;
            }

            _Utilerias["default"].enviarHTTP_error("No fue posible agregar el producto", "Por favor, vuelva a intentarlo", "ID negocio no especificado en el request HTTP", respuesta);

            return _context.abrupt("return");

          case 4:
            if (!(producto.nombre == undefined || producto.nombre == "")) {
              _context.next = 7;
              break;
            }

            _Utilerias["default"].enviarHTTP_error("No fue posible agregar el producto", "Por favor, vuelva a intentarlo", "NOMBRE del producto no especificado en el request HTTP", respuesta);

            return _context.abrupt("return");

          case 7:
            if (!(producto.imagenes_base64 == undefined)) {
              _context.next = 10;
              break;
            }

            _Utilerias["default"].enviarHTTP_error("No fue posible agregar el producto", "Por favor, vuelva a intentarlo", "Imagenes no especificadas en el request HTTP", respuesta);

            return _context.abrupt("return");

          case 10:
            if (!(producto.imagenes_tipo == undefined)) {
              _context.next = 13;
              break;
            }

            _Utilerias["default"].enviarHTTP_error("No fue posible agregar el producto", "Por favor, vuelva a intentarlo", "Tipos de imagenes no especificados en el request HTTP", respuesta);

            return _context.abrupt("return");

          case 13:
            if (!(producto.imagenes_base64.length != producto.imagenes_tipo.length)) {
              _context.next = 16;
              break;
            }

            _Utilerias["default"].enviarHTTP_error("No fue posible agregar el producto", "Por favor, vuelva a intentarlo", "La cantidad de imagenes y tipos no coincide en el request HTTP", respuesta);

            return _context.abrupt("return");

          case 16:
            if (!(producto.imagenes_tipo.filter(function (tipo) {
              return tipo == "";
            }).length != 0)) {
              _context.next = 19;
              break;
            }

            _Utilerias["default"].enviarHTTP_error("No fue posible agregar el producto", "Por favor, vuelva a intentarlo", "Existe tipos vacios en el request HTTP", respuesta);

            return _context.abrupt("return");

          case 19:
            if (!(producto.descripcion == undefined)) {
              _context.next = 22;
              break;
            }

            _Utilerias["default"].enviarHTTP_error("No fue posible agregar el producto", "Por favor, vuelva a intentarlo", "Descripcion del producto no especificado en el request HTTP", respuesta);

            return _context.abrupt("return");

          case 22:
            if (!(producto.codigo_barras == undefined || producto.codigo_barras == "")) {
              _context.next = 25;
              break;
            }

            _Utilerias["default"].enviarHTTP_error("No fue posible agregar el producto", "Por favor, vuelva a intentarlo", "Codigo de barras NO especificado en el request HTTP", respuesta);

            return _context.abrupt("return");

          case 25:
            if (!(producto.dimension == undefined || isNaN(producto.dimension))) {
              _context.next = 28;
              break;
            }

            _Utilerias["default"].enviarHTTP_error("No fue posible agregar el producto", "Por favor, vuelva a intentarlo", "Dimension del producto no especificado en el request HTTP", respuesta);

            return _context.abrupt("return");

          case 28:
            if (!(producto.dimension_tipo == undefined)) {
              _context.next = 31;
              break;
            }

            _Utilerias["default"].enviarHTTP_error("No fue posible agregar el producto", "Por favor, vuelva a intentarlo", "Tipo de dimension no especificado en el request HTTP", respuesta);

            return _context.abrupt("return");

          case 31:
            // VALIDAR QUE SEA UN TIPO DIMENSION VALIDO
            tiposDimension_validos = ['N/A', 'L', 'ml', 'gr', 'kg', 'mts', 'cm', 'mm'];

            if (!(tiposDimension_validos.indexOf(producto.dimension_tipo) == -1)) {
              _context.next = 35;
              break;
            }

            _Utilerias["default"].enviarHTTP_error("No fue posible agregar el producto", "Por favor, vuelva a intentarlo", "El tipo de dimension especificado \"".concat(producto.dimension_tipo, "\" NO es valido"), respuesta);

            return _context.abrupt("return");

          case 35:
            if (!(producto.dimension_tipo != "N/A" && producto.dimension == 0)) {
              _context.next = 38;
              break;
            }

            _Utilerias["default"].enviarHTTP_error("No fue posible agregar el producto", "Por favor, vuelva a intentarlo", "La dimension NO puede ser 0 para el tipo de dimension \"".concat(producto.dimension_tipo, "\""), respuesta);

            return _context.abrupt("return");

          case 38:
            if (producto.dimension_tipo == "N/A") producto.dimension = 0; // VALIDAR <PRECIO>

            if (!(producto.precio == undefined || isNaN(producto.precio) || producto.precio == 0)) {
              _context.next = 42;
              break;
            }

            _Utilerias["default"].enviarHTTP_error("No fue posible agregar el producto", "Por favor, vuelva a intentarlo", "El precio del producto NO puedde ser 0", respuesta);

            return _context.abrupt("return");

          case 42:
            if (!(producto.marca_id == undefined)) {
              _context.next = 45;
              break;
            }

            _Utilerias["default"].enviarHTTP_error("No fue posible agregar el producto", "Por favor, vuelva a intentarlo", "ID marca NO especificado en el request HTTP", respuesta);

            return _context.abrupt("return");

          case 45:
            if (!(producto.categoria_id == undefined)) {
              _context.next = 48;
              break;
            }

            _Utilerias["default"].enviarHTTP_error("No fue posible agregar el producto", "Por favor, vuelva a intentarlo", "ID categoria NO especificado en el request HTTP", respuesta);

            return _context.abrupt("return");

          case 48:
            //VERIFICAR SI NOMBRE O CODIGO DE BARRAS YA EXISTE
            filtroNombre = {
              $expr: {
                $and: [{
                  $eq: [{
                    $toLower: "$Nombre"
                  }, producto.nombre.toLowerCase()]
                }, {
                  $eq: ["$ID_Marca", producto.marca_id]
                }, {
                  $eq: ["$Dimension", producto.dimension]
                }, {
                  $eq: [{
                    $toLower: "$Tipo_Dimension"
                  }, producto.dimension_tipo.toLowerCase()]
                }]
              }
            };
            filtroCodigoBarras = {
              Codigo_De_Barras: producto.codigo_barras
            };
            camposSelect = {
              _id: 1
            };
            _context.prev = 51;
            _context.next = 54;
            return _Producto["default"].find(filtroNombre, camposSelect);

          case 54:
            queryNombre = _context.sent;

            if (!(queryNombre != null && queryNombre.length != 0)) {
              _context.next = 58;
              break;
            }

            _Utilerias["default"].enviarHTTP_error("No fue posible agregar el producto", "Ya existe un producto con el mismo nombre, marca y dimension", "Nombre, marca y dimension repetido en la BD", respuesta);

            return _context.abrupt("return");

          case 58:
            _context.next = 60;
            return _Producto["default"].find(filtroCodigoBarras, camposSelect);

          case 60:
            queryCodBarras = _context.sent;

            if (!(queryCodBarras != null && queryCodBarras.length != 0)) {
              _context.next = 64;
              break;
            }

            _Utilerias["default"].enviarHTTP_error("No fue posible agregar el producto", "El codigo de barras ya esta asignado a otro producto", "Codigo de barras repetido en la BD", respuesta);

            return _context.abrupt("return");

          case 64:
            if (!(producto.marca_id != "")) {
              _context.next = 71;
              break;
            }

            _context.next = 67;
            return _Marca["default"].findById(producto.marca_id);

          case 67:
            queryMarca = _context.sent;

            if (!(queryMarca == null)) {
              _context.next = 71;
              break;
            }

            _Utilerias["default"].enviarHTTP_error("No fue posible agregar el producto", "No se encontro la marca seleccionada. Es posible que haya sido eliminada, " + "por favor vuelva a intentarlo o seleccione de nuevo la marca", "ID marca NO encontrada en la BD", respuesta);

            return _context.abrupt("return");

          case 71:
            if (!(producto.categoria_id != "")) {
              _context.next = 78;
              break;
            }

            _context.next = 74;
            return _Categoria["default"].findById(producto.categoria_id);

          case 74:
            queryCategoria = _context.sent;

            if (!(queryCategoria == null)) {
              _context.next = 78;
              break;
            }

            _Utilerias["default"].enviarHTTP_error("No fue posible agregar el producto", "No se encontro la categoria seleccionada. Es posible que haya sido eliminada, " + "por favor vuelva a intentarlo o seleccione de nuevo la categoria", "ID categoria NO encontrado en la BD", respuesta);

            return _context.abrupt("return");

          case 78:
            //CREACION DEL REGISTRO
            nuevoProducto = new _Producto["default"]({
              ID_Negocio: producto.id_negocio,
              Nombre: producto.nombre,
              Codigo_De_Barras: producto.codigo_barras,
              Descripcion: producto.descripcion,
              ID_Marca: producto.marca_id,
              ID_Categoria: producto.categoria_id,
              Imagenes: [],
              Dimension: producto.dimension,
              Tipo_Dimension: producto.dimension_tipo,
              Precio: producto.precio
            });
            _context.next = 81;
            return nuevoProducto.save();

          case 81:
            nuevoReg = _context.sent;
            // GUARDAR IMAGENES
            nombresImagenesProducto = [];
            i = 0;

          case 84:
            if (!(i < producto.imagenes_base64.length)) {
              _context.next = 92;
              break;
            }

            _context.next = 87;
            return _Producto2["default"].guardarImagen(producto.imagenes_base64[i], nuevoReg._id, producto.imagenes_tipo[i], i + 1);

          case 87:
            img = _context.sent;
            if (img.existeError) console.log(img.mensaje);else if (img.nombre != "") nombresImagenesProducto.push(img.nombre);

          case 89:
            i++;
            _context.next = 84;
            break;

          case 92:
            if (!(nombresImagenesProducto.length != 0)) {
              _context.next = 97;
              break;
            }

            nuevoReg.Imagenes = nombresImagenesProducto;
            _context.next = 96;
            return nuevoReg.save();

          case 96:
            nuevoReg = _context.sent;

          case 97:
            // NUEVO PRODUCTO AGREGADO CON EXITO
            descripcion = "";

            if (nombresImagenesProducto.length != producto.imagenes_base64.length) {
              descripcion = "Se guardaron " + nombresImagenesProducto.length + " de " + producto.imagenes_base64.length + " imagenes.";
            }

            _Utilerias["default"].enviarHTTP_ok("Producto agregado con exito", descripcion, nuevoReg, respuesta);

            _context.next = 105;
            break;

          case 102:
            _context.prev = 102;
            _context.t0 = _context["catch"](51);

            _Utilerias["default"].enviarHTTP_error("No fue posible agregar el producto", "Por favor, vuelva a intentarlo", _context.t0.message, respuesta);

          case 105:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[51, 102]]);
  }));

  return function insertar(_x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();
/*==========================================================================================
                                ELIMINAR PRODUCTO
============================================================================================*/


exports.insertar = insertar;

var eliminar = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(peticion, respuesta) {
    var id_producto, reg, nombresImagenes, i;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            id_producto = peticion.body.id_producto;

            if (!(id_producto == undefined || id_producto == "")) {
              _context2.next = 4;
              break;
            }

            _Utilerias["default"].enviarHTTP_error("No fue posible eliminar el producto", "Por favor, vuelva a intentarlo", "ID producto NO especificado en el request HTTP", respuesta);

            return _context2.abrupt("return");

          case 4:
            _context2.prev = 4;
            _context2.next = 7;
            return _Producto["default"].findByIdAndDelete(id_producto);

          case 7:
            reg = _context2.sent;

            if (!(reg == null)) {
              _context2.next = 13;
              break;
            }

            _Utilerias["default"].enviarHTTP_error("No fue posible eliminar el producto", "Es posible que este producto ya se haya eliminado previamente", "ID producto NO encontrado en la BD", respuesta);

            return _context2.abrupt("return");

          case 13:
            // ELIMINAR IMAGENES
            nombresImagenes = reg.Imagenes;
            i = 0;

          case 15:
            if (!(i < nombresImagenes.length)) {
              _context2.next = 21;
              break;
            }

            _context2.next = 18;
            return _Producto2["default"].eliminarImagen(nombresImagenes[i]);

          case 18:
            i++;
            _context2.next = 15;
            break;

          case 21:
            _Utilerias["default"].enviarHTTP_ok("Producto eliminado con exito", "", reg, respuesta);

          case 22:
            _context2.next = 28;
            break;

          case 24:
            _context2.prev = 24;
            _context2.t0 = _context2["catch"](4);

            _Utilerias["default"].enviarHTTP_error("No fue posible eliminar el producto", "Por favor, vuelva a intentarlo", _context2.t0.message, respuesta);

            return _context2.abrupt("return");

          case 28:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[4, 24]]);
  }));

  return function eliminar(_x4, _x5) {
    return _ref2.apply(this, arguments);
  };
}();
/*=========================================================================================
                        OBTENER UNA LISTA DE TODOS LOS PRODUCTOS
                            ( ALMACEN LISTA PRODUCTOS )
===========================================================================================*/


exports.eliminar = eliminar;

var getListaProductos = /*#__PURE__*/function () {
  var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(peticion, respuesta) {
    var productosXpagina, pagina, registros, filtro, ordenacion, camposNOvalidos, regIgnorados, query, query2, totalProductos, i, registro, imagenesBD, imgs, imgsTipos, k, imagen, nombreMarca, query3, reg;
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            if (!(peticion.body.productosXpagina == undefined)) {
              _context3.next = 3;
              break;
            }

            _Utilerias["default"].enviarHTTP_error("No fue posible obtener tu lista de productos", "Por favor, vuelva a intentarlo", "productos por pagina no especificado en el request HTTP", respuesta);

            return _context3.abrupt("return");

          case 3:
            if (!(peticion.body.pagina == undefined)) {
              _context3.next = 6;
              break;
            }

            _Utilerias["default"].enviarHTTP_error("No fue posible obtener tu lista de productos", "Por favor, vuelva a intentarlo", "Pagina actual NO especificado en el request HTTP", respuesta);

            return _context3.abrupt("return");

          case 6:
            productosXpagina = Number(peticion.body.productosXpagina);
            pagina = Number(peticion.body.pagina);

            if (!(isNaN(productosXpagina) || isNaN(pagina))) {
              _context3.next = 11;
              break;
            }

            _Utilerias["default"].enviarHTTP_error("No fue posible obtener tu lista de productos", "Por favor, vuelva a intentarlo", "La pagina actual o la cantidad de productos por pagina NO son valores numericos en " + "el request HTTP", respuesta);

            return _context3.abrupt("return");

          case 11:
            // OBTENCION DE LOS PRODUCTOS DE LA BD
            registros = [];
            _context3.prev = 12;
            filtro = {};
            ordenacion = {
              Nombre: 1
            };
            camposNOvalidos = {
              ID_Negocio: 0,
              Codigo_De_Barras: 0,
              Descripcion: 0,
              ID_Categoria: 0,
              Precio: 0
            }; // OBTENER LOS REGISTROS DE LA PAGINA ACTUAL

            regIgnorados = (pagina - 1) * productosXpagina;
            _context3.next = 19;
            return _Producto["default"].find(filtro, camposNOvalidos).sort(ordenacion).skip(regIgnorados).limit(productosXpagina);

          case 19:
            query = _context3.sent;
            _context3.next = 22;
            return _Producto["default"].find(filtro, {
              _id: 1
            });

          case 22:
            query2 = _context3.sent;
            totalProductos = query2.length; // OBTENER INFO COMPLETA DE LOS REGISTROS

            i = 0;

          case 25:
            if (!(i < query.length)) {
              _context3.next = 51;
              break;
            }

            registro = query[i];
            imagenesBD = registro.Imagenes;
            imgs = [];
            imgsTipos = []; // OBTENER LAS IMAGENES

            k = 0;

          case 31:
            if (!(k < imagenesBD.length)) {
              _context3.next = 40;
              break;
            }

            _context3.next = 34;
            return _Producto2["default"].getImagen(imagenesBD[k]);

          case 34:
            imagen = _context3.sent;
            imgs.push(imagen.base64);
            imgsTipos.push(imagen.tipo);

          case 37:
            k++;
            _context3.next = 31;
            break;

          case 40:
            // OBTENER NOMBRE MARCA
            nombreMarca = "";

            if (!(registro.ID_Marca != "")) {
              _context3.next = 46;
              break;
            }

            _context3.next = 44;
            return _Marca["default"].findById(registro.ID_Marca, {
              Nombre: 1
            });

          case 44:
            query3 = _context3.sent;
            nombreMarca = query3.Nombre;

          case 46:
            reg = {
              id: registro._id,
              nombre: registro.Nombre,
              marca: nombreMarca,
              imagenes_base64: imgs,
              imagenes_tipo: imgsTipos,
              dimension: registro.Dimension,
              dimensionTipo: registro.Tipo_Dimension
            };
            registros.push(reg);

          case 48:
            i++;
            _context3.next = 25;
            break;

          case 51:
            _Utilerias["default"].enviarHTTP_ok("Lista de productos obtenida", "", {
              listaProductos: registros,
              totalProductos: totalProductos
            }, respuesta);

            _context3.next = 57;
            break;

          case 54:
            _context3.prev = 54;
            _context3.t0 = _context3["catch"](12);

            _Utilerias["default"].enviarHTTP_error("No fue posible obtener tus productos", "Por favor, vuelva a intentarlo", _context3.t0.message, respuesta);

          case 57:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, null, [[12, 54]]);
  }));

  return function getListaProductos(_x6, _x7) {
    return _ref3.apply(this, arguments);
  };
}();
/*=========================================================================================
                        OBTENER UN PRODUCTO EN ESPECIFICO POR ID
=======================================================v====================================*/


exports.getListaProductos = getListaProductos;

var getProductoByID = /*#__PURE__*/function () {
  var _ref4 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(peticion, respuesta) {
    var id_producto, registro, reg, imagenesBD, imgs, imgsTipos, k, imagen, marca_nombre, marca_imagen, marca_imagenTipo, regMarca, imgMarca, categoria_nombre, categoria_imagen, categoria_imagenTipo, categoria_ubicacion, regCategoria, imgCategoria;
    return _regenerator["default"].wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            id_producto = peticion.body.id_producto;

            if (!(id_producto == undefined || id_producto == "")) {
              _context4.next = 4;
              break;
            }

            _Utilerias["default"].enviarHTTP_error("No fue posible obtener el producto", "Por favor, vuelva a intentarlo", "ID del producto NO especificado en el request HTTP", respuesta);

            return _context4.abrupt("return");

          case 4:
            _context4.prev = 4;
            _context4.next = 7;
            return _Producto["default"].findById(id_producto);

          case 7:
            reg = _context4.sent;

            if (!(reg == null)) {
              _context4.next = 11;
              break;
            }

            _Utilerias["default"].enviarHTTP_error("No fue posible obtener el producto", "Es probable que haya sido eliminado previamente", "ID producto NO encontrado en la BD", respuesta);

            return _context4.abrupt("return");

          case 11:
            // OBTENER LAS IMAGENES
            imagenesBD = reg.Imagenes;
            imgs = [];
            imgsTipos = [];
            k = 0;

          case 15:
            if (!(k < imagenesBD.length)) {
              _context4.next = 24;
              break;
            }

            _context4.next = 18;
            return _Producto2["default"].getImagen(imagenesBD[k]);

          case 18:
            imagen = _context4.sent;
            imgs.push(imagen.base64);
            imgsTipos.push(imagen.tipo);

          case 21:
            k++;
            _context4.next = 15;
            break;

          case 24:
            // OBTENER MARCA
            marca_nombre = "";
            marca_imagen = "";
            marca_imagenTipo = "";

            if (!(reg.ID_Marca != "")) {
              _context4.next = 38;
              break;
            }

            _context4.next = 30;
            return _Marca["default"].findById(reg.ID_Marca);

          case 30:
            regMarca = _context4.sent;

            if (!(regMarca != null)) {
              _context4.next = 38;
              break;
            }

            marca_nombre = regMarca.Nombre;
            _context4.next = 35;
            return _Marca2["default"].getImagen(regMarca.Imagen);

          case 35:
            imgMarca = _context4.sent;
            marca_imagen = imgMarca.base64;
            marca_imagenTipo = imgMarca.tipo;

          case 38:
            // OBTENER CATEGORIA
            categoria_nombre = "";
            categoria_imagen = "";
            categoria_imagenTipo = "";
            categoria_ubicacion = "";

            if (!(reg.ID_Categoria != "")) {
              _context4.next = 56;
              break;
            }

            _context4.next = 45;
            return _Categoria["default"].findById(reg.ID_Categoria);

          case 45:
            regCategoria = _context4.sent;

            if (!(regCategoria != null)) {
              _context4.next = 56;
              break;
            }

            // GET NOMBRE 
            categoria_nombre = regCategoria.Nombre; // GET IMAGEN

            _context4.next = 50;
            return _Categoria2["default"].getImagen(regCategoria.Imagen);

          case 50:
            imgCategoria = _context4.sent;
            categoria_imagen = imgCategoria.base64;
            categoria_imagenTipo = imgCategoria.tipo; // GET UBICACION

            _context4.next = 55;
            return getUbicacionCategoria(regCategoria.Ubicacion);

          case 55:
            categoria_ubicacion = _context4.sent;

          case 56:
            registro = {
              id: reg._id,
              id_negocio: reg.ID_Negocio,
              nombre: reg.Nombre,
              descripcion: reg.Descripcion,
              precio: reg.Precio,
              codigo_barras: reg.Codigo_De_Barras,
              marca_id: reg.ID_Marca,
              marca_nombre: marca_nombre,
              marca_imagen: marca_imagen,
              marca_imagenTipo: marca_imagenTipo,
              categoria_id: reg.ID_Categoria,
              categoria_nombre: categoria_nombre,
              categoria_imagen: categoria_imagen,
              categoria_imagenTipo: categoria_imagenTipo,
              categoria_ubicacion: categoria_ubicacion,
              imagenes_base64: imgs,
              imagenes_tipo: imgsTipos,
              dimension: reg.Dimension,
              dimension_tipo: reg.Tipo_Dimension
            };

            _Utilerias["default"].enviarHTTP_ok("Producto obtenido", "", registro, respuesta);

            _context4.next = 63;
            break;

          case 60:
            _context4.prev = 60;
            _context4.t0 = _context4["catch"](4);

            _Utilerias["default"].enviarHTTP_error("No fue posible obtener el producto", "Por favor, vuelva a intentarlo", _context4.t0.message, respuesta);

          case 63:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4, null, [[4, 60]]);
  }));

  return function getProductoByID(_x8, _x9) {
    return _ref4.apply(this, arguments);
  };
}();
/*=========================================================================================
                        OBTENER NOMBRES DE PRODUCTOS
===========================================================================================*/


exports.getProductoByID = getProductoByID;

var getNombresDeProductos = /*#__PURE__*/function () {
  var _ref5 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5(peticion, respuesta) {
    var listaNombres, filtro, ordenacion, camposValidos, query;
    return _regenerator["default"].wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            listaNombres = [];
            _context5.prev = 1;
            filtro = {};
            ordenacion = {
              Nombre: 1
            };
            camposValidos = {
              Nombre: 1
            };
            _context5.next = 7;
            return _Producto["default"].find(filtro, camposValidos).sort(ordenacion);

          case 7:
            query = _context5.sent;

            if (!(query == null)) {
              _context5.next = 11;
              break;
            }

            _Utilerias["default"].enviarHTTP_error("No fue posible obtener los nombres de productos", "", "queru NULL al buscar Nombres de productos", respuesta);

            return _context5.abrupt("return");

          case 11:
            query.forEach(function (reg) {
              listaNombres.push(reg.Nombre);
            });

            _Utilerias["default"].enviarHTTP_ok("Lista de Nombres obtenido", "", listaNombres, respuesta);

            _context5.next = 18;
            break;

          case 15:
            _context5.prev = 15;
            _context5.t0 = _context5["catch"](1);

            _Utilerias["default"].enviarHTTP_error("No fue posible obtener la lista de nombres de productos", "", _context5.t0.message, respuesta);

          case 18:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5, null, [[1, 15]]);
  }));

  return function getNombresDeProductos(_x10, _x11) {
    return _ref5.apply(this, arguments);
  };
}();
/*=========================================================================================
                                ACTUALIZAR CATEGORIA
===========================================================================================*/


exports.getNombresDeProductos = getNombresDeProductos;

var actualizar = /*#__PURE__*/function () {
  var _ref6 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee6(peticion, respuesta) {
    var producto, tiposDimension_validos, filtroCodigoBarras, filtroNombre, camposSelect, queryNombre, queryCodBarras, queryMarca, queryCategoria, regProducto, imagenesBD, i, nombresImagenesProducto, _i, img, descripcion;

    return _regenerator["default"].wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            producto = {
              id: peticion.body.id_producto,
              nombre: peticion.body.nombre,
              codigo_barras: peticion.body.codigo_de_barras,
              descripcion: peticion.body.descripcion,
              marca_id: peticion.body.id_marca,
              categoria_id: peticion.body.id_categoria,
              imagenes_base64: JSON.parse(peticion.body.imagenes_base64),
              imagenes_tipo: JSON.parse(peticion.body.imagenes_tipo),
              dimension: Number(peticion.body.dimension),
              dimension_tipo: peticion.body.dimension_tipo,
              precio: Number(peticion.body.precio)
            }; // VALIDAR <ID>

            if (!(producto.id == undefined || producto.id == "")) {
              _context6.next = 4;
              break;
            }

            _Utilerias["default"].enviarHTTP_error("No fue posible actualizar el producto", "Por favor, vuelva a intentarlo", "ID del producto NO especificado en el request HTTP", respuesta);

            return _context6.abrupt("return");

          case 4:
            if (!(producto.nombre == undefined || producto.nombre == "")) {
              _context6.next = 7;
              break;
            }

            _Utilerias["default"].enviarHTTP_error("No fue posible actualizar el producto", "Por favor, vuelva a intentarlo", "NOMBRE del producto no especificado en el request HTTP", respuesta);

            return _context6.abrupt("return");

          case 7:
            if (!(producto.imagenes_base64 == undefined)) {
              _context6.next = 10;
              break;
            }

            _Utilerias["default"].enviarHTTP_error("No fue posible actualizar el producto", "Por favor, vuelva a intentarlo", "Imagenes no especificadas en el request HTTP", respuesta);

            return _context6.abrupt("return");

          case 10:
            if (!(producto.imagenes_tipo == undefined)) {
              _context6.next = 13;
              break;
            }

            _Utilerias["default"].enviarHTTP_error("No fue posible actualizar el producto", "Por favor, vuelva a intentarlo", "Tipos de imagenes no especificados en el request HTTP", respuesta);

            return _context6.abrupt("return");

          case 13:
            if (!(producto.imagenes_base64.length != producto.imagenes_tipo.length)) {
              _context6.next = 16;
              break;
            }

            _Utilerias["default"].enviarHTTP_error("No fue posible actualizar el producto", "Por favor, vuelva a intentarlo", "La cantidad de imagenes y tipos no coincide en el request HTTP", respuesta);

            return _context6.abrupt("return");

          case 16:
            if (!(producto.imagenes_tipo.filter(function (tipo) {
              return tipo == "";
            }).length != 0)) {
              _context6.next = 19;
              break;
            }

            _Utilerias["default"].enviarHTTP_error("No fue posible actualizar el producto", "Por favor, vuelva a intentarlo", "Existe tipos vacios en el request HTTP", respuesta);

            return _context6.abrupt("return");

          case 19:
            if (!(producto.descripcion == undefined)) {
              _context6.next = 22;
              break;
            }

            _Utilerias["default"].enviarHTTP_error("No fue posible actualizar el producto", "Por favor, vuelva a intentarlo", "Descripcion del producto no especificado en el request HTTP", respuesta);

            return _context6.abrupt("return");

          case 22:
            if (!(producto.codigo_barras == undefined || producto.codigo_barras == "")) {
              _context6.next = 25;
              break;
            }

            _Utilerias["default"].enviarHTTP_error("No fue posible actualizar el producto", "Por favor, vuelva a intentarlo", "Codigo de barras NO especificado en el request HTTP", respuesta);

            return _context6.abrupt("return");

          case 25:
            if (!(producto.dimension == undefined || isNaN(producto.dimension))) {
              _context6.next = 28;
              break;
            }

            _Utilerias["default"].enviarHTTP_error("No fue posible actualizar el producto", "Por favor, vuelva a intentarlo", "Dimension del producto no especificado en el request HTTP", respuesta);

            return _context6.abrupt("return");

          case 28:
            if (!(producto.dimension_tipo == undefined)) {
              _context6.next = 31;
              break;
            }

            _Utilerias["default"].enviarHTTP_error("No fue posible actualizar el producto", "Por favor, vuelva a intentarlo", "Tipo de dimension no especificado en el request HTTP", respuesta);

            return _context6.abrupt("return");

          case 31:
            // VALIDAR QUE SEA UN TIPO DIMENSION VALIDO
            tiposDimension_validos = ['N/A', 'L', 'ml', 'gr', 'kg', 'mts', 'cm', 'mm'];

            if (!(tiposDimension_validos.indexOf(producto.dimension_tipo) == -1)) {
              _context6.next = 35;
              break;
            }

            _Utilerias["default"].enviarHTTP_error("No fue posible actualizar el producto", "Por favor, vuelva a intentarlo", "El tipo de dimension especificado \"".concat(producto.dimension_tipo, "\" NO es valido"), respuesta);

            return _context6.abrupt("return");

          case 35:
            if (!(producto.dimension_tipo != "N/A" && producto.dimension == 0)) {
              _context6.next = 38;
              break;
            }

            _Utilerias["default"].enviarHTTP_error("No fue posible actualizar el producto", "Por favor, vuelva a intentarlo", "La dimension NO puede ser 0 para el tipo de dimension \"".concat(producto.dimension_tipo, "\""), respuesta);

            return _context6.abrupt("return");

          case 38:
            if (producto.dimension_tipo == "N/A") producto.dimension = 0; // VALIDAR <PRECIO>

            if (!(producto.precio == undefined || isNaN(producto.precio) || producto.precio == 0)) {
              _context6.next = 42;
              break;
            }

            _Utilerias["default"].enviarHTTP_error("No fue posible actualizar el producto", "Por favor, vuelva a intentarlo", "El precio del producto NO puedde ser 0", respuesta);

            return _context6.abrupt("return");

          case 42:
            if (!(producto.marca_id == undefined)) {
              _context6.next = 45;
              break;
            }

            _Utilerias["default"].enviarHTTP_error("No fue posible actualizar el producto", "Por favor, vuelva a intentarlo", "ID marca NO especificado en el request HTTP", respuesta);

            return _context6.abrupt("return");

          case 45:
            if (!(producto.categoria_id == undefined)) {
              _context6.next = 48;
              break;
            }

            _Utilerias["default"].enviarHTTP_error("No fue posible actualizar el producto", "Por favor, vuelva a intentarlo", "ID categoria NO especificado en el request HTTP", respuesta);

            return _context6.abrupt("return");

          case 48:
            //VERIFICAR SI EL NUEVO CODIGO DE BARRAS YA EXISTE
            filtroCodigoBarras = {
              $and: [{
                _id: {
                  $ne: new _mongoose["default"].Types.ObjectId(producto.id)
                }
              }, {
                $expr: {
                  $eq: ["$Codigo_De_Barras", producto.codigo_barras]
                }
              }]
            }; //VERIFICAR SI ( NOMBRE + MARCA + DIMENSION ) YA EXISTE

            filtroNombre = {
              $and: [{
                _id: {
                  $ne: new _mongoose["default"].Types.ObjectId(producto.id)
                }
              }, {
                $expr: {
                  $eq: [{
                    $toLower: "$Nombre"
                  }, producto.nombre.toLowerCase()]
                }
              }, {
                $expr: {
                  $eq: ["$ID_Marca", producto.marca_id]
                }
              }, {
                $expr: {
                  $eq: ["$Dimension", producto.dimension]
                }
              }, {
                $expr: {
                  $eq: [{
                    $toLower: "$Tipo_Dimension"
                  }, producto.dimension_tipo.toLowerCase()]
                }
              }]
            };
            camposSelect = {
              _id: 1
            };
            _context6.prev = 51;
            _context6.next = 54;
            return _Producto["default"].find(filtroNombre, camposSelect);

          case 54:
            queryNombre = _context6.sent;

            if (!(queryNombre != null && queryNombre.length != 0)) {
              _context6.next = 58;
              break;
            }

            _Utilerias["default"].enviarHTTP_error("No fue posible actualizar el producto", "Ya existe un producto con el mismo nombre, marca y dimension", "nombre, marca y dimension de producto repetido en la BD", respuesta);

            return _context6.abrupt("return");

          case 58:
            _context6.next = 60;
            return _Producto["default"].find(filtroCodigoBarras, camposSelect);

          case 60:
            queryCodBarras = _context6.sent;

            if (!(queryCodBarras != null && queryCodBarras.length != 0)) {
              _context6.next = 64;
              break;
            }

            _Utilerias["default"].enviarHTTP_error("No fue posible actualizar el producto", "El codigo de barras ya esta asignado a otro producto", "Codigo de barras de producto repetido en la BD", respuesta);

            return _context6.abrupt("return");

          case 64:
            if (!(producto.marca_id != "")) {
              _context6.next = 71;
              break;
            }

            _context6.next = 67;
            return _Marca["default"].findById(producto.marca_id);

          case 67:
            queryMarca = _context6.sent;

            if (!(queryMarca == null)) {
              _context6.next = 71;
              break;
            }

            _Utilerias["default"].enviarHTTP_error("No fue posible actualizar el producto", "No se encontro la marca seleccionada. Es posible que haya sido eliminada, " + "por favor vuelva a intentarlo o seleccione de nuevo la marca", "ID marca NO encontrada en la BD", respuesta);

            return _context6.abrupt("return");

          case 71:
            if (!(producto.categoria_id != "")) {
              _context6.next = 78;
              break;
            }

            _context6.next = 74;
            return _Categoria["default"].findById(producto.categoria_id);

          case 74:
            queryCategoria = _context6.sent;

            if (!(queryCategoria == null)) {
              _context6.next = 78;
              break;
            }

            _Utilerias["default"].enviarHTTP_error("No fue posible actualizar el producto", "No se encontro la categoria seleccionada. Es posible que haya sido eliminada, " + "por favor vuelva a intentarlo o seleccione de nuevo la categoria", "ID categoria NO encontrado en la BD", respuesta);

            return _context6.abrupt("return");

          case 78:
            _context6.next = 80;
            return _Producto["default"].findById(producto.id);

          case 80:
            regProducto = _context6.sent;

            if (!(regProducto == null)) {
              _context6.next = 84;
              break;
            }

            _Utilerias["default"].enviarHTTP_error("No fue posible actualizar el producto", "Producto NO encontrado. Es posible que haya sido eliminado.", "ID producto NO encontrado en la BD", respuesta);

            return _context6.abrupt("return");

          case 84:
            // ELIMINAR LAS IMAGENES ANTERIORES
            imagenesBD = regProducto.Imagenes;
            i = 0;

          case 86:
            if (!(i < imagenesBD.length)) {
              _context6.next = 92;
              break;
            }

            _context6.next = 89;
            return _Producto2["default"].eliminarImagen(imagenesBD[i]);

          case 89:
            i++;
            _context6.next = 86;
            break;

          case 92:
            // GUARDAR IMAGENES
            nombresImagenesProducto = [];
            _i = 0;

          case 94:
            if (!(_i < producto.imagenes_base64.length)) {
              _context6.next = 102;
              break;
            }

            _context6.next = 97;
            return _Producto2["default"].guardarImagen(producto.imagenes_base64[_i], producto.id, producto.imagenes_tipo[_i], _i + 1);

          case 97:
            img = _context6.sent;
            if (img.existeError) console.log(img.mensaje);else if (img.nombre != "") nombresImagenesProducto.push(img.nombre);

          case 99:
            _i++;
            _context6.next = 94;
            break;

          case 102:
            // ACTUALIZAR REGISTRO
            regProducto.Nombre = producto.nombre;
            regProducto.Codigo_De_Barras = producto.codigo_barras;
            regProducto.Descripcion = producto.descripcion;
            regProducto.ID_Marca = producto.marca_id;
            regProducto.ID_Categoria = producto.categoria_id;
            regProducto.Imagenes = nombresImagenesProducto;
            regProducto.Dimension = producto.dimension;
            regProducto.Tipo_Dimension = producto.dimension_tipo;
            regProducto.Precio = producto.precio; // regProducto => almacena el registro con los datos ya actualizados

            _context6.next = 113;
            return regProducto.save();

          case 113:
            regProducto = _context6.sent;
            // PRODUCTO ACTUALIZADO CON EXITO
            descripcion = "";

            if (nombresImagenesProducto.length != producto.imagenes_base64.length) {
              descripcion = "Se guardaron " + nombresImagenesProducto.length + " de " + producto.imagenes_base64.length + " imagenes.";
            }

            _Utilerias["default"].enviarHTTP_ok("Producto actualizado con exito", descripcion, regProducto, respuesta);

            _context6.next = 122;
            break;

          case 119:
            _context6.prev = 119;
            _context6.t0 = _context6["catch"](51);

            _Utilerias["default"].enviarHTTP_error("No fue posible actualizar el producto", "Por favor, vuelva a intentarlo", _context6.t0.message, respuesta);

          case 122:
          case "end":
            return _context6.stop();
        }
      }
    }, _callee6, null, [[51, 119]]);
  }));

  return function actualizar(_x12, _x13) {
    return _ref6.apply(this, arguments);
  };
}();

exports.actualizar = actualizar;