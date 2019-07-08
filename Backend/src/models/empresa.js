'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var EnterpriseSchema = Schema({
    nombre: String,
    email: String,
    password: String,
    rol: String,
    image: String,
    direccion: String,
    telefono: String
});

module.exports = mongoose.model('Enterprise', EnterpriseSchema);