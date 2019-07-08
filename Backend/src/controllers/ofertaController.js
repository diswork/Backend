'use strict'

const Oferta = require('../models/oferta')

function crearOferta(req, res) {
    const oferta = new Oferta();
    var params = req.body;
    var rol = req.empresa.sub;

}