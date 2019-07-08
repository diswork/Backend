'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = Schema({
    nickName: String,
    email: String,
    password: String,
    rol: String,
    image: String,
    telefono: String,
    ofertas: [],
    empresas: []
});

module.exports = mongoose.model('User', UserSchema);