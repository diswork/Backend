'use strict'

var express = require('express');
var adminController = require('../controllers/adminController');
var md_auth = require('../middlewares/autheticated');

//SUBIR IMAGEN
//var multiparty = require('connect-multiparty');
//var md_subir = multiparty({ uploadDir: './src/uploads/users' })


//Rutas
var api = express.Router();
api.post('/crear-admin', md_auth.ensureAuth, adminController.crearAdmin);
// api.post('/login', userController.login);
// api.post('/subir-imagen-usuario/:id', [md_auth.ensureAuth, md_subir], userController.subirImagen);
// api.get('/obtener-imagen-usuario/:nombreImagen', userController.obtenerImagen);
// api.put('/editar-usuario/:id', md_auth.ensureAuth, userController.editarUsuario);
// api.get('/usuarios', userController.getUsers);
// api.get('/usuario/:id', md_auth.ensureAuth, userController.getUser);
// api.get('/verificaToken',md_auth.ensureAuth, userController.getUserByToken);
// api.put('/seguir-empresa/:id', md_auth.ensureAuth, userController.seguirEmpresa);
// api.put('/dejar-de-seguir-empresa/:id', md_auth.ensureAuth, userController.dejarDeSeguirEmpresa)

module.exports = api;