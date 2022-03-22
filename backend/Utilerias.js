"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _config = require("./config");

var _awsSdk = _interopRequireDefault(require("aws-sdk"));

var Utilerias = /*#__PURE__*/function () {
  function Utilerias() {
    (0, _classCallCheck2["default"])(this, Utilerias);
  }

  (0, _createClass2["default"])(Utilerias, null, [{
    key: "enviarHTTP_error",
    value:
    /*===========================================
        ENVIAR RESPUESTA A SOLICITUD HTTP
    =============================================*/
    function enviarHTTP_error(titulo, descripcion) {
      var datos = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "";
      var respuestaHTTP = arguments.length > 3 ? arguments[3] : undefined;
      respuestaHTTP.json({
        existeError: true,
        titulo: titulo,
        descripcion: descripcion,
        datos: datos
      });
    }
  }, {
    key: "enviarHTTP_ok",
    value: function enviarHTTP_ok(titulo, descripcion) {
      var datos = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "";
      var respuestaHTTP = arguments.length > 3 ? arguments[3] : undefined;
      respuestaHTTP.json({
        existeError: false,
        titulo: titulo,
        descripcion: descripcion,
        datos: datos
      });
    }
  }, {
    key: "getAWS_S3",
    value: function getAWS_S3() {
      var retorno = {
        existeError: false,
        S3: undefined,
        mensaje: ""
      };

      try {
        var endpoint = new _awsSdk["default"].Endpoint(_config.configAWS.EndPoint);
        var s3 = new _awsSdk["default"].S3({
          endpoint: endpoint
        });
        retorno.S3 = s3;
        return retorno;
      } catch (ERROR) {
        retorno.existeError = true;
        retorno.mensaje = ERROR.message;
        return retorno;
      }
    }
  }]);
  return Utilerias;
}();

exports["default"] = Utilerias;
(0, _defineProperty2["default"])(Utilerias, "RESPUESTA_HTTP_ERROR", 0);
(0, _defineProperty2["default"])(Utilerias, "RESPUESTA_HTTP_EXITOSA", 1);