'use strict'

var express = require('express');
var CategoriaController = require('../controllers/categoriaController');
var md_auth = require('../middlewares/autheticated');


//Rutas
var api = express.Router();
api.post('/categoria',md_auth.ensureAuth, CategoriaController.crearCategoria);
api.get('/categorias',md_auth.ensureAuth, CategoriaController.getCategorias);
api.get('/categoria/:id', md_auth.ensureAuth, CategoriaController.getCategoria);
api.put('/categoria/:id', md_auth.ensureAuth, CategoriaController.editarCategoria);
api.delete('/categoria/:id', md_auth.ensureAuth, CategoriaController.deleteCategoria);


module.exports = api;