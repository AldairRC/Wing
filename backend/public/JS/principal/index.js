"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

function getHTML() {
  var ID = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";
  return document.getElementById(ID);
}

var botonGuardar = getHTML('botonGuardar');
var botonBuscar = getHTML('botonBuscar');
var botonUpload = getHTML('botonUpload');
var cajaNombre = getHTML('cajaNombre');
var cajaBuscarNombre = getHTML('cajaBuscarNombre');
var cajaDesc = getHTML('cajaDesc');
var cajaPrecio = getHTML('cajaPrecio');
var imgProducto = getHTML('imgProducto');
var selectorFile = document.createElement('input');
selectorFile.type = "file"; //selectorFile.accept = ".pdf , .docx"   EJEMPLOS: image/*   audio/*    video/*   .pdf   .docx  ...

selectorFile.accept = "image/*";
selectorFile.classList.add('oculto');
var columnaNombre = getHTML('columnaNombre');
var columnaDescripcion = getHTML('columnaDescripcion');
var columnaPrecio = getHTML('columnaPrecio');
var columnaFoto = getHTML('columnaFoto');
var columnaBotonEliminar = getHTML('columnaBotonEliminar');
var columnaBotonEditar = getHTML('columnaBotonEditar');

function addRow() {
  var nombre = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";
  var descripcion = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "";
  var precio = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
  var ID = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : "";
  var extensionIMG = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : "";
  var base64IMG = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : "";
  // CELDA NOMBRE
  var celdaNombre = document.createElement('input');
  celdaNombre.classList.add('celdaD');
  celdaNombre.value = nombre; // CELDA DESCRIPCION

  var celdaDescripcion = document.createElement('input');
  celdaDescripcion.classList.add('celdaD');
  celdaDescripcion.value = descripcion; // CELDA PRECIO

  var celdaPrecio = document.createElement('input');
  celdaPrecio.classList.add('celdaD');
  celdaPrecio.value = precio.toString(); // CELDA FOTO

  var celdaFoto = document.createElement('img');
  celdaFoto.src = 'data:' + extensionIMG + ';base64,' + base64IMG;
  celdaFoto.classList.add('celdaImagenD'); // CELDA BOTON EDITAR

  var celdaBotonEditar = document.createElement('div');
  celdaBotonEditar.classList.add('celdaD');
  celdaBotonEditar.classList.add('boton');
  celdaBotonEditar.innerText = "Editar";

  celdaBotonEditar.onclick = function () {
    var parametros = {
      id: ID,
      nombre: celdaNombre.value,
      descripcion: celdaDescripcion.value,
      precio: Number(celdaPrecio.value)
    };
    realizarFetchConParametros("/editarProducto", "GET", parametros).then(function (datos) {
      console.log(datos);
    });
  }; // CELDA BOTON ELIMINAR


  var celdaBotonEliminar = document.createElement('div');
  celdaBotonEliminar.classList.add('celdaD');
  celdaBotonEliminar.classList.add('boton');
  celdaBotonEliminar.innerText = "Eliminar";

  celdaBotonEliminar.onclick = function () {
    var parametros = {
      id: ID
    };
    realizarFetchConParametros("/eliminarProducto", "GET", parametros).then(function (datos) {
      if (datos != null) {
        console.log(datos);
        window.location.href = "/nuevo";
      }
    });
  }; // CREACION DEL ROW


  columnaNombre.appendChild(celdaNombre);
  columnaDescripcion.appendChild(celdaDescripcion);
  columnaPrecio.appendChild(celdaPrecio);
  columnaFoto.appendChild(celdaFoto);
  columnaBotonEditar.appendChild(celdaBotonEditar);
  columnaBotonEliminar.appendChild(celdaBotonEliminar);
} //===========================================
//  FUNCION GENERICA PARA REALIZAR UN FETCH
//===========================================


function realizarFetchConParametros(_x, _x2, _x3) {
  return _realizarFetchConParametros.apply(this, arguments);
}

function _realizarFetchConParametros() {
  _realizarFetchConParametros = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(URL, metodoHTTP, parametros) {
    var esc, P, url3, respuesta, datos, _ref3, message;

    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            esc = encodeURIComponent; // URL con parametros tipo1 ... ejemplo =>  /editar/?id=1234&nombre=aldair
            //let url = URL + "/?" + Object.keys(parametros).map(key => esc(key) + '=' + esc(parametros[key])).join('&');
            // URL con parametros tipo2 ... ejemplo =>  /editar/1234/aldair 
            //let url2 = URL + "/" + Object.keys(parametros).map(key => esc(parametros[key])).join('/');

            P = [];
            if (parametros.id != undefined) P.push(parametros.id);
            if (parametros.nombre != undefined) P.push(parametros.nombre);
            if (parametros.descripcion != undefined) P.push(parametros.descripcion);
            if (parametros.precio != undefined) P.push(parametros.precio + "");
            url3 = URL + "/" + P.join('/'); //console.log( url2 )

            alert(url3);
            _context3.prev = 8;
            _context3.next = 11;
            return fetch(url3, {
              method: metodoHTTP // GET, POST, PUT, DELETE, etc.

            });

          case 11:
            respuesta = _context3.sent;

            if (!respuesta.ok) {
              _context3.next = 17;
              break;
            }

            _context3.next = 15;
            return respuesta.json();

          case 15:
            datos = _context3.sent;
            return _context3.abrupt("return", datos);

          case 17:
            _context3.next = 24;
            break;

          case 19:
            _context3.prev = 19;
            _context3.t0 = _context3["catch"](8);
            _ref3 = _context3.t0, message = _ref3.message;
            alert("ERROR DE CONEXION" + message);
            return _context3.abrupt("return", null);

          case 24:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, null, [[8, 19]]);
  }));
  return _realizarFetchConParametros.apply(this, arguments);
}

botonGuardar.onclick = /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee() {
  var datos, URL, respuesta, _datos, mensaje;

  return _regenerator["default"].wrap(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          if (!(cajaNombre.value == "" || cajaDesc.value == "" || cajaPrecio.value == "")) {
            _context.next = 3;
            break;
          }

          alert("Campos Vacios");
          return _context.abrupt("return");

        case 3:
          datos = new FormData();
          datos.append("nombre", cajaNombre.value);
          datos.append("descripcion", cajaDesc.value);
          datos.append("precio", cajaPrecio.value);
          if (filesSeleccionados == null || filesSeleccionados.length == 0) datos.append("imagen", "");else datos.append("imagen", filesSeleccionados[0]); //let datos2 = {descripcion: "prueba2" , precio2: 200}

          URL = "/addProducto";
          _context.prev = 9;
          _context.next = 12;
          return fetch(URL, {
            method: 'POST',
            //headers: {
            //    'Content-Type': 'application/json',
            //} , 
            //body: JSON.stringify(datos2) 
            body: datos
          });

        case 12:
          respuesta = _context.sent;

          if (!respuesta.ok) {
            _context.next = 31;
            break;
          }

          _context.next = 16;
          return respuesta.json();

        case 16:
          _datos = _context.sent;
          console.log(_datos);

          if (!(_datos.estatus == 1)) {
            _context.next = 22;
            break;
          }

          // GUARDADO EXITOSO
          alert("Producto Guardado");
          _context.next = 29;
          break;

        case 22:
          mensaje = "PRODUCTO NO ALMACENADO";
          _context.t0 = _datos.mensaje.code;
          _context.next = _context.t0 === 11000 ? 26 : 28;
          break;

        case 26:
          mensaje += "\nEste producto ya EXISTE";
          return _context.abrupt("break", 28);

        case 28:
          alert(mensaje);

        case 29:
          _context.next = 32;
          break;

        case 31:
          console.log("ERROR" + respuesta.status);

        case 32:
          _context.next = 37;
          break;

        case 34:
          _context.prev = 34;
          _context.t1 = _context["catch"](9);
          console.log(_context.t1);

        case 37:
        case "end":
          return _context.stop();
      }
    }
  }, _callee, null, [[9, 34]]);
}));

function limpiarTabla() {
  while (columnaNombre.childElementCount > 1) {
    columnaNombre.removeChild(columnaNombre.lastChild);
  }

  while (columnaDescripcion.childElementCount > 1) {
    columnaDescripcion.removeChild(columnaDescripcion.lastChild);
  }

  while (columnaPrecio.childElementCount > 1) {
    columnaPrecio.removeChild(columnaPrecio.lastChild);
  }

  while (columnaFoto.childElementCount > 1) {
    columnaFoto.removeChild(columnaFoto.lastChild);
  }

  while (columnaBotonEditar.childElementCount > 1) {
    columnaBotonEditar.removeChild(columnaBotonEditar.lastChild);
  }

  while (columnaBotonEliminar.childElementCount > 1) {
    columnaBotonEliminar.removeChild(columnaBotonEliminar.lastChild);
  }
}

botonBuscar.onclick = /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2() {
  var datos, a, URL, respuestaHTTP, datosServidor, fecha, i, reg;
  return _regenerator["default"].wrap(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          limpiarTabla();
          datos = new FormData();
          datos.append("nombre", cajaBuscarNombre.value);
          a = "";
          URL = "/getProductos";
          _context2.prev = 5;
          _context2.next = 8;
          return fetch(URL, {
            method: 'POST',
            body: datos
          });

        case 8:
          respuestaHTTP = _context2.sent;

          if (!respuestaHTTP.ok) {
            _context2.next = 20;
            break;
          }

          console.log("RESPUESTA HTTP");
          console.log(respuestaHTTP);
          _context2.next = 14;
          return respuestaHTTP.json();

        case 14:
          datosServidor = _context2.sent;
          console.log(datosServidor);
          fecha = Intl.DateTimeFormat().resolvedOptions().timeZone; //alert(fecha)   // EJEMPLO:  America/Chihuahua
          //fechaCreacion = new Date(datosServidor.fechaCreacion.getTime() - 
          //(  * 60000 )

          if (datosServidor.estatus == 1) {
            // OK
            for (i = 0; i < datosServidor.registros.length; i++) {
              reg = datosServidor.registros[i]; //let fechaCreacion = new Date()
              //let fechaCreacion2 = new Date()
              //fechaCreacion = new Date( reg.fechaCreacion)
              //fechaCreacion2 = new Date( reg.fechaCreacion)
              //alert( typeof reg.fechaCreacion )  STRING
              //alert(
              //    fechaCreacion.toString() + '\n' +
              //fechaCreacion2.toLocaleString( 'en-US', { timeZone: 'America/Mexico_City' } ) 
              //)

              addRow(reg.nombre, reg.descripcion, Number(reg.precio), reg.id, reg.extension, reg.imagen);
            }

            alert("Productos Cargados");
          } else {
            alert(datosServidor.registros);
          }

          _context2.next = 21;
          break;

        case 20:
          console.log(respuestaHTTP);

        case 21:
          _context2.next = 26;
          break;

        case 23:
          _context2.prev = 23;
          _context2.t0 = _context2["catch"](5);
          console.log(_context2.t0);

        case 26:
        case "end":
          return _context2.stop();
      }
    }
  }, _callee2, null, [[5, 23]]);
}));

botonUpload.onclick = function () {
  selectorFile.click();
};

var filesSeleccionados = selectorFile.files;

selectorFile.onchange = function () {
  console.log(selectorFile.files);

  if (selectorFile.files != null && selectorFile.files.length != 0) // 1 o mas files
    {
      var extensionesOK = ["PNG", "JPG", "JPEG"];
      var nombreExtension = selectorFile.files[0].name.split('.');
      var extension = nombreExtension[nombreExtension.length - 1].toUpperCase();
      var coincide = extensionesOK.filter(function (ext) {
        //console.log( ext + "==" + extension )
        return ext == extension;
      }); //alert(coincide)

      if (coincide.length != 0) {
        var imagen = URL.createObjectURL(selectorFile.files[0]);
        if (imgProducto.classList.contains('oculto')) imgProducto.classList.toggle('oculto');
        imgProducto.src = imagen;
        filesSeleccionados = selectorFile.files;
      } else {
        alert("Debes seleccionar una imagen");
      }
    } else {// REGRESA FILES 0 CUANDO SE DA EN EL BOTON CANCELAR DE LA VENTANA DEL SELECTOR
  }
  /*
  NOTA: selectorFile.files es un arreglo
  cada File contiene lo siguiente:
      name: "2021-04-21 (1).png"
      size: 690397    => tamaño en bytes   =>  1MB -> 1,000,000 bytes
      type: "image/png"
  */

  /*     RECEPCION DE IMAGENES
      response.blob().then(function(miBlob) {
      var objectURL = URL.createObjectURL(miBlob);
      miImagen.src = objectURL;
  */

};

imgProducto.onclick = function () {
  imgProducto.src = "";
  imgProducto.classList.toggle('oculto');
  selectorFile.files = null;
}; //================================
//  MAIN
//================================


imgProducto.classList.toggle('oculto');