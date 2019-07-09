'use strict'
var express = require('express')
var ofertaController = require('../controllers/ofertaController');
var md_auth = require('../middlewares/autheticated');

//Rutas
var api = express.Router();

api.post('/oferta',md_auth.ensureAuth, ofertaController.crearOferta);
api.put('/oferta/:id',md_auth.ensureAuth, ofertaController.editarOferta)

module.exports = api;