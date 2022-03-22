"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.insertar = exports.eliminar = exports.buscar = exports.actualizar = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _Categoria = _interopRequireDefault(require("../../Modelos/Negocios/Categoria"));

var _Producto = _interopRequireDefault(require("../../Modelos/Negocios/Producto"));

var _Utilerias = _interopRequireDefault(require("../../Utilerias"));

var _Categoria2 = _interopRequireDefault(require("../../Almacen/Negocio/Categoria"));

var _mongoose = _interopRequireDefault(require("mongoose"));

//=================================================
// IMPORTACIONES
//=================================================

/*================================================================================
            FUNCION QUE RETORNA LA RUTA DE UBICACION DE UNA CATEGORIA
==================================================================================*/
function getUbicacionCategoria(_x) {
  return _getUbicacionCategoria.apply(this, arguments);
}
/*=================================================
            AGREGAR NUEVA CATEGORIA
===================================================*/


function _getUbicacionCategoria() {
  _getUbicacionCategoria = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5(campoUbicacion) {
    var ubicacion, IDs, filtro, camposSelect, query, registros;
    return _regenerator["default"].wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
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
            _context5.next = 7;
            return _Categoria["default"].find(filtro, camposSelect);

          case 7:
            query = _context5.sent;

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


            return _context5.abrupt("return", ubicacion);

          case 10:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5);
  }));
  return _getUbicacionCategoria.apply(this, arguments);
}

var insertar = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(peticion, respuesta) {
    var id_negocio, categoria_nombre, categoria_imagen, categoria_tipoImagen, id_categoria_padre, categoria_ubicacion, filtroNombre, queryNombre, nuevaCategoria, nuevoReg, img, regBorrado;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            id_negocio = peticion.body.id_negocio;
            categoria_nombre = peticion.body.categoria_nombre;
            categoria_imagen = peticion.body.categoria_imagen;
            categoria_tipoImagen = peticion.body.categoria_tipoImagen;
            id_categoria_padre = peticion.body.id_categoria_padre;
            categoria_ubicacion = JSON.parse(peticion.body.categoria_ubicacion);

            if (!(id_negocio == undefined || id_negocio == "")) {
              _context.next = 9;
              break;
            }

            _Utilerias["default"].enviarHTTP_error("No fue posible agregar la categoria", "Por favor, vuelva a intentarlo", "ID negocio no especificado en el request HTTP", respuesta);

            return _context.abrupt("return");

          case 9:
            if (!(categoria_nombre == undefined || categoria_nombre == "")) {
              _context.next = 12;
              break;
            }

            _Utilerias["default"].enviarHTTP_error("No fue posible agregar la categoria", "Por favor, vuelva a intentarlo", "Nombre de la categoria no especificado en el request HTTP", respuesta);

            return _context.abrupt("return");

          case 12:
            if (!(categoria_imagen == undefined)) {
              _context.next = 15;
              break;
            }

            _Utilerias["default"].enviarHTTP_error("No fue posible agregar la categoria", "Por favor, vuelva a intentarlo", "Imagen de la categoria no especificado en el request HTTP", respuesta);

            return _context.abrupt("return");

          case 15:
            if (!(categoria_tipoImagen == undefined)) {
              _context.next = 18;
              break;
            }

            _Utilerias["default"].enviarHTTP_error("No fue posible agregar la categoria", "Por favor, vuelva a intentarlo", "Tipo de imagen no especificado en el request HTTP", respuesta);

            return _context.abrupt("return");

          case 18:
            if (!(id_categoria_padre == undefined)) {
              _context.next = 21;
              break;
            }

            _Utilerias["default"].enviarHTTP_error("No fue posible agregar la categoria", "Por favor, vuelva a intentarlo", "ID categoria padre no especificado en el request HTTP", respuesta);

            return _context.abrupt("return");

          case 21:
            if (!(categoria_ubicacion == undefined)) {
              _context.next = 24;
              break;
            }

            _Utilerias["default"].enviarHTTP_error("No fue posible agregar la categoria", "Por favor, vuelva a intentarlo", "Ubicacion de la categoria no especificado en el request HTTP", respuesta);

            return _context.abrupt("return");

          case 24:
            _context.prev = 24;
            // VERIFICAR SI NOMBRE YA EXISTE
            filtroNombre = {
              ID_Categoria_Padre: id_categoria_padre,
              $expr: {
                $eq: [{
                  $toLower: "$Nombre"
                }, categoria_nombre.toLowerCase()]
              }
            };
            _context.next = 28;
            return _Categoria["default"].find(filtroNombre, {
              _id: 1
            });

          case 28:
            queryNombre = _context.sent;

            if (!(queryNombre != null && queryNombre.length != 0)) {
              _context.next = 32;
              break;
            }

            _Utilerias["default"].enviarHTTP_error("No fue posible agregar la categoria", "El nombre ya esta establecido en otra categoria", "Nompre categoria repetido en la BD", respuesta);

            return _context.abrupt("return");

          case 32:
            //CREACION DEL REGISTRO
            nuevaCategoria = new _Categoria["default"]({
              ID_Negocio: id_negocio,
              Nombre: categoria_nombre,
              ID_Categoria_Padre: id_categoria_padre,
              Imagen: "",
              Ubicacion: categoria_ubicacion
            });
            _context.next = 35;
            return nuevaCategoria.save();

          case 35:
            nuevoReg = _context.sent;
            _context.next = 38;
            return _Categoria2["default"].guardarImagen(categoria_imagen, nuevoReg._id, categoria_tipoImagen);

          case 38:
            img = _context.sent;

            if (!img.existeError) {
              _context.next = 46;
              break;
            }

            _context.next = 42;
            return _Categoria["default"].findByIdAndDelete(nuevoReg._id);

          case 42:
            regBorrado = _context.sent;

            if (regBorrado == null) {
              console.log("Error inesperado al borrar el nuevo registro insertado en la BD");
            }

            _Utilerias["default"].enviarHTTP_error("No fue posible agregar la categoria", "Algo salio mal. Por favor vuelva a intentarlo", img.mensaje, respuesta);

            return _context.abrupt("return");

          case 46:
            if (!(img.nombre != "")) {
              _context.next = 51;
              break;
            }

            nuevoReg.Imagen = img.nombre;
            _context.next = 50;
            return nuevoReg.save();

          case 50:
            nuevoReg = _context.sent;

          case 51:
            // NUEVA MARCA AGREGADA CON EXITO
            _Utilerias["default"].enviarHTTP_ok("Categoria agregada con exito", "Tu categoria se agrego a tu inventario", nuevoReg, respuesta);

            _context.next = 57;
            break;

          case 54:
            _context.prev = 54;
            _context.t0 = _context["catch"](24);

            _Utilerias["default"].enviarHTTP_error("No fue posible agregar la categoria", "Por favor vuelva a intentarlo", _context.t0.message, respuesta);

          case 57:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[24, 54]]);
  }));

  return function insertar(_x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();
/*==========================================================================================
                                ELIMINAR CATEGORIA
============================================================================================*/


exports.insertar = insertar;

var eliminar = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(peticion, respuesta) {
    var id_categoria, categoriasDelete, seguirBuscandoCategoriasHijas, filtro, categoriasHijas, totalCategoriasEliminadas, c, nombreImagen, reg, regBorrado, descripcion, filtroUpdate_producto, camposUpdate_producto, queryUpdateProducto;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            id_categoria = peticion.body.id_categoria;

            if (!(id_categoria == undefined || id_categoria == "")) {
              _context2.next = 4;
              break;
            }

            _Utilerias["default"].enviarHTTP_error("No fue posible eliminar la categoria", "Por favor vuelva a intentarlo", "ID categoria NO especificado en el request HTTP", respuesta);

            return _context2.abrupt("return");

          case 4:
            // OBTENER TODAS LAS CATEGORIAS HIJAS DE LA CATEGORIA ESPECIFICADA
            categoriasDelete = [id_categoria];
            seguirBuscandoCategoriasHijas = true;

          case 6:
            if (!seguirBuscandoCategoriasHijas) {
              _context2.next = 24;
              break;
            }

            _context2.prev = 7;
            filtro = {
              ID_Categoria_Padre: {
                $in: categoriasDelete
              }
            };
            _context2.next = 11;
            return _Categoria["default"].find(filtro, {
              _id: 1
            });

          case 11:
            categoriasHijas = _context2.sent;

            if (!(categoriasHijas == null)) {
              _context2.next = 15;
              break;
            }

            _Utilerias["default"].enviarHTTP_error("No fue posible eliminar la categoria", "Por favor vuelva a intentarlo", "Error NULL al obtener categorias hijas", respuesta);

            return _context2.abrupt("return");

          case 15:
            if (categoriasDelete.length - 1 != categoriasHijas.length) {
              categoriasDelete = categoriasHijas.map(function (categoria) {
                return categoria._id;
              });
              categoriasDelete.push(id_categoria);
            } else seguirBuscandoCategoriasHijas = false;

            _context2.next = 22;
            break;

          case 18:
            _context2.prev = 18;
            _context2.t0 = _context2["catch"](7);

            _Utilerias["default"].enviarHTTP_error("No fue posible eliminar la categoria", "Por favor vuelva a intentarlo", _context2.t0.message, respuesta);

            return _context2.abrupt("return");

          case 22:
            _context2.next = 6;
            break;

          case 24:
            // BORRAR LAS CATEGORIAS
            totalCategoriasEliminadas = 0;
            c = 0;

          case 26:
            if (!(c < categoriasDelete.length)) {
              _context2.next = 47;
              break;
            }

            nombreImagen = "";
            _context2.prev = 28;
            _context2.next = 31;
            return _Categoria["default"].findById(categoriasDelete[c]);

          case 31:
            reg = _context2.sent;

            if (!(reg != null)) {
              _context2.next = 40;
              break;
            }

            nombreImagen = reg.Imagen; // ELIMINAR IMAGEN

            _context2.next = 36;
            return _Categoria2["default"].eliminarImagen(nombreImagen);

          case 36:
            _context2.next = 38;
            return _Categoria["default"].findByIdAndDelete(reg._id);

          case 38:
            regBorrado = _context2.sent;
            if (regBorrado != null) totalCategoriasEliminadas++;

          case 40:
            _context2.next = 44;
            break;

          case 42:
            _context2.prev = 42;
            _context2.t1 = _context2["catch"](28);

          case 44:
            c++;
            _context2.next = 26;
            break;

          case 47:
            // ACTUALIZAR LA CATEGORIA EN LOS PRODUCTOS
            descripcion = "";
            _context2.prev = 48;
            filtroUpdate_producto = {
              ID_Categoria: {
                $in: categoriasDelete
              }
            };
            camposUpdate_producto = {
              ID_Categoria: ""
            };
            _context2.next = 53;
            return _Producto["default"].updateMany(filtroUpdate_producto, camposUpdate_producto);

          case 53:
            queryUpdateProducto = _context2.sent;
            descripcion = queryUpdateProducto.modifiedCount + " productos actualizados";
            _context2.next = 61;
            break;

          case 57:
            _context2.prev = 57;
            _context2.t2 = _context2["catch"](48);
            console.log("ERROR al eliminar la categoria en los productos");
            descripcion = "0 productos actualizados";

          case 61:
            _Utilerias["default"].enviarHTTP_ok("La categoria fue eliminada con exito", "Total de categorias eliminadas: " + totalCategoriasEliminadas + ".\n\n" + descripcion, "", respuesta);

          case 62:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[7, 18], [28, 42], [48, 57]]);
  }));

  return function eliminar(_x4, _x5) {
    return _ref2.apply(this, arguments);
  };
}();
/*=========================================================================================
                        BUSCAR CATEGORIAS DE PRODUCTOS
===========================================================================================*/


exports.eliminar = eliminar;

var buscar = /*#__PURE__*/function () {
  var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(peticion, respuesta) {
    var id_categoria_padre, categoriasXpagina, pagina, registros, filtro, ordenacion, query, totalCategorias, indexInicial, indexFinal, i, imagenCategoria, ubicacion, reg;
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            if (!(peticion.body.categoriasXpagina == undefined)) {
              _context3.next = 3;
              break;
            }

            _Utilerias["default"].enviarHTTP_error("No fue posible obtener tu lista de subcategorias", "Por favor vuelva a intentarlo", "categorias por pagina no especificado en el request HTTP", respuesta);

            return _context3.abrupt("return");

          case 3:
            if (!(peticion.body.pagina == undefined)) {
              _context3.next = 6;
              break;
            }

            _Utilerias["default"].enviarHTTP_error("No fue posible obtener tu lista de subcategorias", "Por favor vuelva a intentarlo", "Pagina actual no especificada en el request HTTP", respuesta);

            return _context3.abrupt("return");

          case 6:
            if (!(peticion.body.id_categoria_padre == undefined)) {
              _context3.next = 9;
              break;
            }

            _Utilerias["default"].enviarHTTP_error("No fue posible obtener tu lista de subcategorias", "Por favor vuelva a intentarlo", "ID categoria padre no especificado en el request HTTP", respuesta);

            return _context3.abrupt("return");

          case 9:
            id_categoria_padre = peticion.body.id_categoria_padre;
            categoriasXpagina = Number(peticion.body.categoriasXpagina);
            pagina = Number(peticion.body.pagina);

            if (!(isNaN(categoriasXpagina) || isNaN(pagina))) {
              _context3.next = 15;
              break;
            }

            _Utilerias["default"].enviarHTTP_error("No fue posible obtener tu lista de subcategorias", "Por favor vuelva a intentarlo", "La pagina actual o la cantidad de categorias por pagina NO son valores numericos en " + "el request HTTP", respuesta);

            return _context3.abrupt("return");

          case 15:
            // OBTENCION DE REGISTROS DE LA BD
            registros = [];
            _context3.prev = 16;
            filtro = {
              ID_Categoria_Padre: id_categoria_padre
            };
            ordenacion = {
              Nombre: 1
            };
            _context3.next = 21;
            return _Categoria["default"].find(filtro).sort(ordenacion);

          case 21:
            query = _context3.sent;
            totalCategorias = query.length;
            indexInicial = (pagina - 1) * categoriasXpagina;
            indexFinal = indexInicial + categoriasXpagina;
            if (query.length < indexFinal) indexFinal = query.length;
            query = query.slice(indexInicial, indexFinal);
            i = 0;

          case 28:
            if (!(i < query.length)) {
              _context3.next = 41;
              break;
            }

            _context3.next = 31;
            return _Categoria2["default"].getImagen(query[i].Imagen);

          case 31:
            imagenCategoria = _context3.sent;

            if (imagenCategoria.existeError) {
              console.log(imagenCategoria.mensaje);
            } // OBTENER UBICACION


            _context3.next = 35;
            return getUbicacionCategoria(query[i].Ubicacion);

          case 35:
            ubicacion = _context3.sent;
            // CREACION DEL OBJETO CATEGORIA
            reg = {
              id: query[i]._id,
              nombre: query[i].Nombre,
              imagenBase64: imagenCategoria.base64,
              imagenTipo: imagenCategoria.tipo,
              ubicacion: ubicacion
            };
            registros.push(reg);

          case 38:
            i++;
            _context3.next = 28;
            break;

          case 41:
            _Utilerias["default"].enviarHTTP_ok("Lista de subcategorias obtenida", "", {
              listaCategorias: registros,
              totalCategorias: totalCategorias
            }, respuesta);

            _context3.next = 47;
            break;

          case 44:
            _context3.prev = 44;
            _context3.t0 = _context3["catch"](16);

            _Utilerias["default"].enviarHTTP_error("No fue posible obtener tus subcategorias", "Por favor, vuelva a intentarlo", _context3.t0.message, respuesta);

          case 47:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, null, [[16, 44]]);
  }));

  return function buscar(_x6, _x7) {
    return _ref3.apply(this, arguments);
  };
}();
/*=========================================================================================
                                ACTUALIZAR CATEGORIA
===========================================================================================*/


exports.buscar = buscar;

var actualizar = /*#__PURE__*/function () {
  var _ref4 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(peticion, respuesta) {
    var id_categoria, id_categoria_padre, categoria_nombre, categoria_imagen, categoria_imagenTipo, filtroNombre, queryNombre, regCategoria, _img, img;

    return _regenerator["default"].wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            id_categoria = peticion.body.id_categoria;
            id_categoria_padre = peticion.body.id_categoria_padre;
            categoria_nombre = peticion.body.categoria_nombre;
            categoria_imagen = peticion.body.categoria_imagen;
            categoria_imagenTipo = peticion.body.categoria_imagenTipo;

            if (!(id_categoria == undefined || id_categoria == "")) {
              _context4.next = 8;
              break;
            }

            _Utilerias["default"].enviarHTTP_error("No fue posible actualizar la categoria", "Por favor, vuelva a intentarlo", "ID categoria no especificado en el request HTTP", respuesta);

            return _context4.abrupt("return");

          case 8:
            if (!(id_categoria_padre == undefined)) {
              _context4.next = 11;
              break;
            }

            _Utilerias["default"].enviarHTTP_error("No fue posible actualizar la categoria", "Por favor, vuelva a intentarlo", "ID categoria padre no especificado en el request HTTP", respuesta);

            return _context4.abrupt("return");

          case 11:
            if (!(categoria_nombre == undefined || categoria_nombre == "")) {
              _context4.next = 14;
              break;
            }

            _Utilerias["default"].enviarHTTP_error("No fue posible actualizar la categoria", "Por favor, vuelva a intentarlo", "Nombre de la categoria no especificado en el request HTTP", respuesta);

            return _context4.abrupt("return");

          case 14:
            if (!(categoria_imagen == undefined)) {
              _context4.next = 17;
              break;
            }

            _Utilerias["default"].enviarHTTP_error("No fue posible actualizar la categoria", "Por favor, vuelva a intentarlo", "Imagen de la categoria no especificado en el request HTTP", respuesta);

            return _context4.abrupt("return");

          case 17:
            if (!(categoria_imagenTipo == undefined)) {
              _context4.next = 20;
              break;
            }

            _Utilerias["default"].enviarHTTP_error("No fue posible actualizar la categoria", "Por favor, vuelva a intentarlo", "Tipo de imagen no especificado en el request HTTP", respuesta);

            return _context4.abrupt("return");

          case 20:
            _context4.prev = 20;
            // VERIFICAR SI NUEVO NOMBRE YA EXISTE
            filtroNombre = {
              ID_Categoria_Padre: id_categoria_padre,
              _id: {
                $ne: new _mongoose["default"].Types.ObjectId(id_categoria)
              },
              $expr: {
                $eq: [{
                  $toLower: "$Nombre"
                }, categoria_nombre.toLowerCase()]
              }
            };
            _context4.next = 24;
            return _Categoria["default"].find(filtroNombre, {
              _id: 1
            });

          case 24:
            queryNombre = _context4.sent;

            if (!(queryNombre != null && queryNombre.length != 0)) {
              _context4.next = 28;
              break;
            }

            _Utilerias["default"].enviarHTTP_error("No fue posible actualizar la categoria", "El nombre asignado ya esta establecido en otra categoria", "Nompre categoria repetido en la BD", respuesta);

            return _context4.abrupt("return");

          case 28:
            _context4.next = 30;
            return _Categoria["default"].findById(id_categoria);

          case 30:
            regCategoria = _context4.sent;

            if (!(regCategoria == null)) {
              _context4.next = 34;
              break;
            }

            _Utilerias["default"].enviarHTTP_error("No fue posible actualizar la categoria", "No se encontro el registro. Es posible que haya sido eliminado previamente", "ID categoria no encontrado en la BD", respuesta);

            return _context4.abrupt("return");

          case 34:
            // ACTUALIZAR NOMBRE
            regCategoria.Nombre = categoria_nombre;
            _context4.next = 37;
            return regCategoria.save();

          case 37:
            regCategoria = _context4.sent;

            if (!(regCategoria.Imagen != "")) {
              _context4.next = 45;
              break;
            }

            _context4.next = 41;
            return _Categoria2["default"].eliminarImagen(regCategoria.Imagen);

          case 41:
            _img = _context4.sent;

            if (!_img.existeError) {
              _context4.next = 45;
              break;
            }

            _Utilerias["default"].enviarHTTP_ok("La imagen NO pudo ser actualizada", "Por favor intente agregar de nuevo la imagen", {
              existeAdvertencia: true,
              mensaje: _img.mensaje
            }, respuesta);

            return _context4.abrupt("return");

          case 45:
            _context4.next = 47;
            return _Categoria2["default"].guardarImagen(categoria_imagen, id_categoria, categoria_imagenTipo);

          case 47:
            img = _context4.sent;

            if (!img.existeError) {
              _context4.next = 54;
              break;
            }

            regCategoria.Imagen = "";
            _context4.next = 52;
            return regCategoria.save();

          case 52:
            _Utilerias["default"].enviarHTTP_ok("La imagen NO pudo ser actualizada", "Por favor intente agregar de nuevo la imagen", {
              existeAdvertencia: true,
              mensaje: img.mensaje
            }, respuesta);

            return _context4.abrupt("return");

          case 54:
            regCategoria.Imagen = img.nombre;
            _context4.next = 57;
            return regCategoria.save();

          case 57:
            regCategoria = _context4.sent;

            // NUEVA MARCA AGREGADA CON EXITO
            _Utilerias["default"].enviarHTTP_ok("Categoria actualizada con exito", "", {
              existeAdvertencia: false,
              mensaje: regCategoria
            }, respuesta);

            _context4.next = 64;
            break;

          case 61:
            _context4.prev = 61;
            _context4.t0 = _context4["catch"](20);

            _Utilerias["default"].enviarHTTP_error("NO fue posible actualizar la categoria", "Por favor, vuelva a intentarlo", _context4.t0.message, respuesta);

          case 64:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4, null, [[20, 61]]);
  }));

  return function actualizar(_x8, _x9) {
    return _ref4.apply(this, arguments);
  };
}();

exports.actualizar = actualizar;