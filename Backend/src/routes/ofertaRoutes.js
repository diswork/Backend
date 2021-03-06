'use strict'
var express = require('express')
var ofertaController = require('../controllers/ofertaController');
var md_auth = require('../middlewares/autheticated');

// Subir imagien
var multiparty = require('connect-multiparty');
var md_subir = multiparty({ uploadDir: './src/uploads/ofertas' })

//Rutas
var api = express.Router();

api.post('/oferta', md_auth.ensureAuth, ofertaController.crearOferta);
api.put('/oferta/:id', md_auth.ensureAuth, ofertaController.editarOferta);
api.get('/ofertas', ofertaController.getOfertas);
api.get('/ofertasPorEmpresa/:id', md_auth.ensureAuth, ofertaController.getOfertasPorEmpresa);
api.get('/ofertasPorCategoria/:id', md_auth.ensureAuth, ofertaController.getOfertasPorCategoria);
api.get('/ofertasPorNivelAcademico/:id', md_auth.ensureAuth, ofertaController.getOfertasPorNivelAcademico);
api.post('/subir-imagen-oferta/:id', [md_auth.ensureAuth, md_subir], ofertaController.subirImagen);
api.get('/obtener-imagen-oferta/:nombreImagen', ofertaController.obtenerImagen);
api.get('/ofertas-seguidas', md_auth.ensureAuth, ofertaController.getOfertasEmpresasSeguidas);
api.get('/ofertas-seguidas-cn', md_auth.ensureAuth, ofertaController.getOfertasEmpresasSeguidasCN);
api.get('/cvs-oferta/:id', md_auth.ensureAuth, ofertaController.getCvsPorOferta);
api.get('/ofertaById/:id', md_auth.ensureAuth, ofertaController.getOfertaById);
api.delete('/eliminar-oferta/:id', ofertaController.deleteOferta);

module.exports = api;