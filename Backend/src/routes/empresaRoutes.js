'use strict'

var express = require('express');
var empresaController = require('../controllers/empresaController');
var md_auth = require('../middlewares/autheticated');

//SUBIR IMAGEN
var multiparty = require('connect-multiparty');
var md_subir = multiparty({ uploadDir: './src/uploads/empresa' })


//Rutas
var api = express.Router();
api.post('/subir-imagen-empresa/:id', [md_auth.ensureAuth, md_subir], empresaController.subirImagen);
api.get('/obtener-imagen-empresa/:nombreImagen', empresaController.obtenerImagen);
api.get('/empresas', md_auth.ensureAuth, empresaController.getEmpresas);
//api.put('/editar-usuario/:id', md_auth.ensureAuth, EmpresaController.editarUsuario)
//api.get('/usuarios', EmpresaController.getUsers)

module.exports = api;