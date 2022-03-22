"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.insertar = exports.eliminar = exports.buscar = exports.actualizar = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _Marca = _interopRequireDefault(require("../../Modelos/Negocios/Marca"));

var _Producto = _interopRequireDefault(require("../../Modelos/Negocios/Producto"));

var _Marca2 = _interopRequireDefault(require("../../Almacen/Negocio/Marca"));

var _Utilerias = _interopRequireDefault(require("../../Utilerias"));

var _mongoose = _interopRequireDefault(require("mongoose"));

//=================================================
// IMPORTACIONES
//=================================================

/*=================================================
                AGREGAR MARCA
=================================================*/
var insertar = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(peticion, respuesta) {
    var id_negocio, nombreMarca, imagenMarca, tipoImagen, filtroNombre, queryNombre, rutaImagen, nuevaMarca, nuevoReg, img, regBorrado;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            id_negocio = peticion.body.id_negocio;
            nombreMarca = peticion.body.nombre; //let rutaImagenMarca = (peticion.file?.path == undefined )? "" : peticion.file.path

            imagenMarca = peticion.body.imagen;
            tipoImagen = peticion.body.tipoImagen; // FALTA MECANISMO DE SEGURIDAD (validar datos del negocio)

            if (!(id_negocio == undefined || id_negocio == "")) {
              _context.next = 7;
              break;
            }

            _Utilerias["default"].enviarHTTP_error("No fue posible agregar la marca", "Por favor vueva a intentarlo", "NO se especifico el ID del negocio que intenta registrar la marca en el request HTTP", respuesta);

            return _context.abrupt("return");

          case 7:
            if (!(nombreMarca == undefined || nombreMarca == "")) {
              _context.next = 10;
              break;
            }

            _Utilerias["default"].enviarHTTP_error("No fue posible agregar la marca", "Por favor vueva a intentarlo", "NO se especifico el nombre de la marca en el request HTTP", respuesta);

            return _context.abrupt("return");

          case 10:
            if (!(imagenMarca == undefined)) {
              _context.next = 13;
              break;
            }

            _Utilerias["default"].enviarHTTP_error("No fue posible agregar la marca", "Por favor vueva a intentarlo", "NO se especifico la imagen de la marca en el request HTTP", respuesta);

            return _context.abrupt("return");

          case 13:
            if (!(tipoImagen == undefined)) {
              _context.next = 16;
              break;
            }

            _Utilerias["default"].enviarHTTP_error("No fue posible agregar la marca", "Por favor vueva a intentarlo", "NO se especifico el tipo de imagen de la marca en el request HTTP", respuesta);

            return _context.abrupt("return");

          case 16:
            _context.prev = 16;
            // VERIFICAR SI NOMBRE YA EXISTE
            filtroNombre = {
              $expr: {
                $eq: [{
                  $toLower: "$Nombre"
                }, nombreMarca.toLowerCase()]
              }
            };
            _context.next = 20;
            return _Marca["default"].find(filtroNombre, {
              _id: 1
            });

          case 20:
            queryNombre = _context.sent;

            if (!(queryNombre != null && queryNombre.length != 0)) {
              _context.next = 24;
              break;
            }

            _Utilerias["default"].enviarHTTP_error("No fue posible agregar la marca", "El nombre ya esta establecido en otra marca", "Nompre marca repetido en la BD", respuesta);

            return _context.abrupt("return");

          case 24:
            //CREACION DEL REGISTRO
            rutaImagen = "";
            nuevaMarca = new _Marca["default"]({
              ID_Negocio: id_negocio,
              Nombre: nombreMarca,
              Imagen: rutaImagen
            });
            _context.next = 28;
            return nuevaMarca.save();

          case 28:
            nuevoReg = _context.sent;
            _context.next = 31;
            return _Marca2["default"].guardarImagen(imagenMarca, nuevoReg._id, tipoImagen);

          case 31:
            img = _context.sent;

            if (!img.existeError) {
              _context.next = 39;
              break;
            }

            _context.next = 35;
            return _Marca["default"].findByIdAndDelete(nuevoReg._id);

          case 35:
            regBorrado = _context.sent;

            if (regBorrado == null) {
              console.log("Error inesperado al borrar el nuevo registro insertado en la BD");
            }

            _Utilerias["default"].enviarHTTP_error("No fue posible agregar la marca", "Algo salio mal. Por favor vuelva a intentarlo", img.mensaje, respuesta);

            return _context.abrupt("return");

          case 39:
            if (!(img.nombre != "")) {
              _context.next = 44;
              break;
            }

            nuevoReg.Imagen = img.nombre;
            _context.next = 43;
            return nuevoReg.save();

          case 43:
            nuevoReg = _context.sent;

          case 44:
            // NUEVA MARCA AGREGADA CON EXITO
            _Utilerias["default"].enviarHTTP_ok("Marca agregada con exito", "Tu marca se agregado a tu inventario", nuevoReg, respuesta);

            _context.next = 50;
            break;

          case 47:
            _context.prev = 47;
            _context.t0 = _context["catch"](16);

            _Utilerias["default"].enviarHTTP_error("No fue posible agregar la marca", "Por favor vuelva a intentarlo", _context.t0.message, respuesta);

          case 50:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[16, 47]]);
  }));

  return function insertar(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();
/*=================================================
                ELIMINAR MARCA
=================================================*/


exports.insertar = insertar;

var eliminar = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(peticion, respuesta) {
    var id_marca, regMarca, img, regBorrado, descripcion, filtroUpdate_producto, camposUpdate_producto, queryUpdateProducto;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            id_marca = peticion.body.id_marca;

            if (!(id_marca == undefined || id_marca == "")) {
              _context2.next = 4;
              break;
            }

            _Utilerias["default"].enviarHTTP_error("No fue posible eliminar la marca", "Por favor vuelva a intentarlo", "No se especifico el ID de la marca a eliminar en el request HTTP", respuesta);

            return _context2.abrupt("return");

          case 4:
            _context2.prev = 4;
            _context2.next = 7;
            return _Marca["default"].findById(id_marca);

          case 7:
            regMarca = _context2.sent;

            if (!(regMarca == null)) {
              _context2.next = 11;
              break;
            }

            _Utilerias["default"].enviarHTTP_error("No fue posible eliminar la marca", "Marca no encontrada. Es posible que hay sido eliminada previamente", "ID marca NO encontrada en la BD", respuesta);

            return _context2.abrupt("return");

          case 11:
            _context2.next = 13;
            return _Marca2["default"].eliminarImagen(regMarca.Imagen);

          case 13:
            img = _context2.sent;

            if (!img.existeError) {
              _context2.next = 17;
              break;
            }

            _Utilerias["default"].enviarHTTP_error("No fue posible eliminar la marca", "Algo salio mal. Por favor vuelva a intentarlo", img.mensaje, respuesta);

            return _context2.abrupt("return");

          case 17:
            _context2.next = 19;
            return _Marca["default"].findByIdAndDelete(id_marca);

          case 19:
            regBorrado = _context2.sent;

            if (!(regBorrado == null)) {
              _context2.next = 23;
              break;
            }

            _Utilerias["default"].enviarHTTP_error("No fue posible eliminar la marca", "Marca no encontrada. Es posible que hay sido eliminada previamente", "ID marca no encontrada en la BD", respuesta);

            return _context2.abrupt("return");

          case 23:
            // ACTUALIZAR LA MARCA EN LOS PRODUCTOS
            descripcion = "";
            _context2.prev = 24;
            filtroUpdate_producto = {
              ID_Marca: id_marca
            };
            camposUpdate_producto = {
              ID_Marca: ""
            };
            _context2.next = 29;
            return _Producto["default"].updateMany(filtroUpdate_producto, camposUpdate_producto);

          case 29:
            queryUpdateProducto = _context2.sent;
            descripcion = queryUpdateProducto.modifiedCount + " productos actualizados";
            _context2.next = 37;
            break;

          case 33:
            _context2.prev = 33;
            _context2.t0 = _context2["catch"](24);
            console.log("ERROR al eliminar la marca en los productos");
            descripcion = "0 productos actualizados";

          case 37:
            _Utilerias["default"].enviarHTTP_ok("Marca eliminada con exito", descripcion, regBorrado, respuesta);

            _context2.next = 44;
            break;

          case 40:
            _context2.prev = 40;
            _context2.t1 = _context2["catch"](4);

            _Utilerias["default"].enviarHTTP_error("No fue posible eliminar la marca", "Por favor vuelva a intentarlo", _context2.t1, respuesta);

            return _context2.abrupt("return");

          case 44:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[4, 40], [24, 33]]);
  }));

  return function eliminar(_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}();
/*=================================================
            BUSCAR MARCAS DE PRODUCTOS
=================================================*/


exports.eliminar = eliminar;

var buscar = /*#__PURE__*/function () {
  var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(peticion, respuesta) {
    var marcasXpagina, pagina, registros, filtro, ordenacion, query, totalMarcas, indexInicial, indexFinal, i, imagenMarca, reg;
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            if (!(peticion.body.marcasXpagina == undefined)) {
              _context3.next = 3;
              break;
            }

            _Utilerias["default"].enviarHTTP_error("No fue posible obtener tu lista de marcas", "Por favor vuelva a intentarlo", "marcas por pagina no especificado en el request HTTP", respuesta);

            return _context3.abrupt("return");

          case 3:
            if (!(peticion.body.pagina == undefined)) {
              _context3.next = 6;
              break;
            }

            _Utilerias["default"].enviarHTTP_error("No fue posible obtener tu lista de marcas", "Por favor vuelva a intentarlo", "Pagina actual no especificada en el request HTTP", respuesta);

            return _context3.abrupt("return");

          case 6:
            marcasXpagina = Number(peticion.body.marcasXpagina);
            pagina = Number(peticion.body.pagina);

            if (!(isNaN(marcasXpagina) || isNaN(pagina))) {
              _context3.next = 11;
              break;
            }

            _Utilerias["default"].enviarHTTP_error("No fue posible obtener tu lista de marcas", "Por favor vuelva a intentarlo", "La pagina actual o la cantidad de marcas por pagina NO son valores numericos en " + "el request HTTP", respuesta);

            return _context3.abrupt("return");

          case 11:
            registros = []; // OBTENER TODO

            _context3.prev = 12;
            filtro = {};
            ordenacion = {
              Nombre: 1
            };
            _context3.next = 17;
            return _Marca["default"].find(filtro).sort(ordenacion);

          case 17:
            query = _context3.sent;
            totalMarcas = query.length;
            indexInicial = (pagina - 1) * marcasXpagina;
            indexFinal = indexInicial + marcasXpagina;
            if (query.length < indexFinal) indexFinal = query.length;
            query = query.slice(indexInicial, indexFinal);
            i = 0;

          case 24:
            if (!(i < query.length)) {
              _context3.next = 34;
              break;
            }

            _context3.next = 27;
            return _Marca2["default"].getImagen(query[i].Imagen);

          case 27:
            imagenMarca = _context3.sent;

            if (imagenMarca.existeError) {
              console.log(imagenMarca.mensaje);
            }

            reg = {
              id: query[i]._id,
              id_negocio: query[i].ID_Negocio,
              nombre: query[i].Nombre,
              imagenBase64: imagenMarca.base64,
              imagenTipo: imagenMarca.tipo //fechaCreacion: registro.createdAt ,
              //fechaModif: registro.updatedAt

            };
            registros.push(reg);

          case 31:
            i++;
            _context3.next = 24;
            break;

          case 34:
            _Utilerias["default"].enviarHTTP_ok("Lista de marcas obtenida", "", {
              listaMarcas: registros,
              totalMarcas: totalMarcas
            }, respuesta);

            _context3.next = 40;
            break;

          case 37:
            _context3.prev = 37;
            _context3.t0 = _context3["catch"](12);

            _Utilerias["default"].enviarHTTP_error("No fue posible obtener tus marcas", "Por favor, vuelva a intentarlo", _context3.t0.message, respuesta);

          case 40:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, null, [[12, 37]]);
  }));

  return function buscar(_x5, _x6) {
    return _ref3.apply(this, arguments);
  };
}();
/*=================================================
                ACTUALIZAR MARCA
=================================================*/


exports.buscar = buscar;

var actualizar = /*#__PURE__*/function () {
  var _ref4 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(peticion, respuesta) {
    var id_marca, nombreMarca, imagenMarca, tipoImagen, filtroNombre, queryNombre, regMarca, nombreAnterior, _img, img;

    return _regenerator["default"].wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            id_marca = peticion.body.id_marca;
            nombreMarca = peticion.body.nombre;
            imagenMarca = peticion.body.imagen;
            tipoImagen = peticion.body.imagenTipo;

            if (!(id_marca == undefined || id_marca == "")) {
              _context4.next = 7;
              break;
            }

            _Utilerias["default"].enviarHTTP_error("No fue posible actualizar la marca", "Por favor vuelva a intentarlo", "ID marca no especificado en el request HTTP", respuesta);

            return _context4.abrupt("return");

          case 7:
            if (!(nombreMarca == undefined || nombreMarca == "")) {
              _context4.next = 10;
              break;
            }

            _Utilerias["default"].enviarHTTP_error("No fue posible actualizar la marca", "Por favor vuelva a intentarlo", "Nombre de la marca no especificado en el request HTTP", respuesta);

            return _context4.abrupt("return");

          case 10:
            if (!(imagenMarca == undefined)) {
              _context4.next = 13;
              break;
            }

            _Utilerias["default"].enviarHTTP_error("No fue posible actualizar la marca", "Por favor vuelva a intentarlo", "Imagen de la marca no especificado en el request HTTP", respuesta);

            return _context4.abrupt("return");

          case 13:
            if (!(tipoImagen == undefined)) {
              _context4.next = 16;
              break;
            }

            _Utilerias["default"].enviarHTTP_error("No fue posible actualizar la marca", "Por favor vuelva a intentarlo", "Tipo de imagen de la marca no especificado en el request HTTP", respuesta);

            return _context4.abrupt("return");

          case 16:
            _context4.prev = 16;
            // VERIFICAR SI NUEVO NOMBRE YA EXISTE
            filtroNombre = {
              _id: {
                $ne: new _mongoose["default"].Types.ObjectId(id_marca)
              },
              $expr: {
                $eq: [{
                  $toLower: "$Nombre"
                }, nombreMarca.toLowerCase()]
              }
            };
            _context4.next = 20;
            return _Marca["default"].find(filtroNombre, {
              _id: 1
            });

          case 20:
            queryNombre = _context4.sent;

            if (!(queryNombre != null && queryNombre.length != 0)) {
              _context4.next = 24;
              break;
            }

            _Utilerias["default"].enviarHTTP_error("No fue posible actualizar la marca", "El nombre asignado ya esta establecido en otra marca", "Nompre marca repetido en la BD", respuesta);

            return _context4.abrupt("return");

          case 24:
            _context4.next = 26;
            return _Marca["default"].findById(id_marca);

          case 26:
            regMarca = _context4.sent;

            if (!(regMarca == null)) {
              _context4.next = 30;
              break;
            }

            _Utilerias["default"].enviarHTTP_error("No fue posible actualizar la marca", "No se encontro el registro. Es posible que haya sido eliminado previamente", "ID Marca no encontrada en la BD", respuesta);

            return _context4.abrupt("return");

          case 30:
            // ACTUALIZAR NOMBRE
            nombreAnterior = regMarca.Nombre;
            regMarca.Nombre = nombreMarca;
            _context4.next = 34;
            return regMarca.save();

          case 34:
            regMarca = _context4.sent;

            if (!(regMarca.Imagen != "")) {
              _context4.next = 42;
              break;
            }

            _context4.next = 38;
            return _Marca2["default"].eliminarImagen(regMarca.Imagen);

          case 38:
            _img = _context4.sent;

            if (!_img.existeError) {
              _context4.next = 42;
              break;
            }

            _Utilerias["default"].enviarHTTP_ok("La imagen NO pudo ser actualizada", "Por favor intente agregar de nuevo la imagen", {
              existeAdvertencia: true,
              mensaje: _img.mensaje
            }, respuesta);

            return _context4.abrupt("return");

          case 42:
            _context4.next = 44;
            return _Marca2["default"].guardarImagen(imagenMarca, id_marca, tipoImagen);

          case 44:
            img = _context4.sent;

            if (!img.existeError) {
              _context4.next = 51;
              break;
            }

            regMarca.Imagen = "";
            _context4.next = 49;
            return regMarca.save();

          case 49:
            _Utilerias["default"].enviarHTTP_ok("La imagen NO pudo ser actualizada", "Por favor intente agregar de nuevo la imagen", {
              existeAdvertencia: true,
              mensaje: img.mensaje
            }, respuesta);

            return _context4.abrupt("return");

          case 51:
            regMarca.Imagen = img.nombre;
            _context4.next = 54;
            return regMarca.save();

          case 54:
            regMarca = _context4.sent;

            // NUEVA MARCA AGREGADA CON EXITO
            _Utilerias["default"].enviarHTTP_ok("Marca actualizada con exito", "", {
              existeAdvertencia: false,
              mensaje: regMarca
            }, respuesta);

            _context4.next = 61;
            break;

          case 58:
            _context4.prev = 58;
            _context4.t0 = _context4["catch"](16);

            _Utilerias["default"].enviarHTTP_error("NO fue posible actualizar la marca", "Por favor, vuelva a intentarlo", _context4.t0.message, respuesta);

          case 61:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4, null, [[16, 58]]);
  }));

  return function actualizar(_x7, _x8) {
    return _ref4.apply(this, arguments);
  };
}();

exports.actualizar = actualizar;