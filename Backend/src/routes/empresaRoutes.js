'use strict'

var express = require('express');
var EmpresaController = require('../controllers/empresaController');
var md_auth = require('../middlewares/autheticated');

//SUBIR IMAGEN
var multiparty = require('connect-multiparty');
var md_subir = multiparty({ uploadDir: './src/uploads/users' })


//Rutas
var api = express.Router();
api.post('/registrarEmpresa', EmpresaController.registrarEmpresa);
//api.post('/subir-imagen-usuario/:id', [md_auth.ensureAuth, md_subir], EmpresaController.subirImagen);
//api.get('/obtener-imagen-usuario/:nombreImagen', EmpresaController.obtenerImagen)
//api.put('/editar-usuario/:id', md_auth.ensureAuth, EmpresaController.editarUsuario)
//api.get('/usuarios', EmpresaController.getUsers)

module.exports = api;