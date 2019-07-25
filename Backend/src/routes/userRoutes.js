'use strict'

var express = require('express');
var userController = require('../controllers/userController');
var md_auth = require('../middlewares/autheticated');

//SUBIR IMAGEN
var multiparty = require('connect-multiparty');
var md_subir = multiparty({ uploadDir: './src/uploads/users' })


//Rutas
var api = express.Router();
api.post('/registrar', userController.registrar);
api.post('/login', userController.login);
api.post('/subir-imagen-usuario/:id', [md_auth.ensureAuth, md_subir], userController.subirImagen);
api.post('/subir-cv', [md_auth.ensureAuth, md_subir], userController.subirCurriculum);
api.get('/obtener-cv/:nombreCv', userController.obtenerCurriculum);
api.get('/obtener-imagen-usuario/:nombreImagen', userController.obtenerImagen);
api.put('/editar-usuario/:id', md_auth.ensureAuth, userController.editarUsuario);
api.get('/usuarios', userController.getUsers);
api.get('/usuario/:id', md_auth.ensureAuth, userController.getUser);
api.get('/verificaToken',md_auth.ensureAuth, userController.getUserByToken);
api.put('/seguir-empresa/:id', md_auth.ensureAuth, userController.seguirEmpresa);
api.put('/dejar-de-seguir-empresa/:id', md_auth.ensureAuth, userController.dejarDeSeguirEmpresa)
api.delete('/usuario/:id', md_auth.ensureAuth, userController.eliminarUsuario);

module.exports = api;