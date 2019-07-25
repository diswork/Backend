'use strict'

var express = require('express');
var adminController = require('../controllers/adminController');
var md_auth = require('../middlewares/autheticated');

//SUBIR IMAGEN
var multiparty = require('connect-multiparty');
var md_subir = multiparty({ uploadDir: './src/uploads/admins' })


//Rutas
var api = express.Router();
api.post('/crear-admin', md_auth.ensureAuth, adminController.crearAdmin);
api.post('/subir-imagen-admin', [md_auth.ensureAuth, md_subir], adminController.subirImagen);
api.get('/obtener-imagen-admin/:nombreImagen', adminController.obtenerImagen);
api.put('/editar-admin/:id', md_auth.ensureAuth, adminController.editarAdmin);
api.get('/admins', adminController.getAdmins);
api.get('/admin/:id', adminController.getAdmin);
api.delete('/admin/:id', md_auth.ensureAuth, adminController.eliminarAdmin);

module.exports = api;