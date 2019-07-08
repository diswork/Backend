'use strict'

var express = require('express');
var NivelController = require('../controllers/nivelAcademicoController');
var md_auth = require('../middlewares/autheticated');


//Rutas
var api = express.Router();
api.post('/nivel-academico',md_auth.ensureAuth, NivelController.crearNivelAcademico);
api.get('/niveles-academicos',md_auth.ensureAuth, NivelController.getNiveles);
api.get('/nivel-academico/:id', md_auth.ensureAuth, NivelController.getNivel);
api.put('/nivel-academico/:id', md_auth.ensureAuth, NivelController.editarNivel);
api.delete('/nivel-academico/:id', md_auth.ensureAuth, NivelController.deleteNivel);


module.exports = api;