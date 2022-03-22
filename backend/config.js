"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.configAWS = exports.URL_mongoBD = exports.PUERTO_SERVIDOR = void 0;

var _dotenv = require("dotenv");

(0, _dotenv.config)();
var URL_mongoBD = process.env.URL_mongoBD || 'mongodb://localhost/test';
exports.URL_mongoBD = URL_mongoBD;
var PUERTO_SERVIDOR = process.env.PORT || 4000;
exports.PUERTO_SERVIDOR = PUERTO_SERVIDOR;
var configAWS = {
  bucketName: process.env.BUCKET_NAME || '',
  EndPoint: process.env.ENDPOINT || ''
};
exports.configAWS = configAWS;