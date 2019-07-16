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
    ciudad: String,
    colegio: String,
    fechaNacimiento: Date,
    ofertas: [],
    cv: [],
    empresas: [{
        type: Schema.ObjectId,
        ref: 'Enterprise'
    }],
    nivelAcademico: {
        type: Schema.ObjectId,
        ref: 'Study'
    },
    categoria: {
        type: Schema.ObjectId,
        ref: 'Category'
    }
});

module.exports = mongoose.model('User', UserSchema);