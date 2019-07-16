'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var enterpriseSchema = Schema({
    nombre: {
        type: String,
        required : [true, "Nombre is required"],
        index : true
    },
    email: {
        type: String,
        required : [true, "Email is required"],
        index : true
    },
    password: {
        type: String, 
        required : [true, "Password is required."]
    },
    rol: {
        type : String
    },
    image: {
        type : String
    },
    direccion: {
        type : String
    },
    telefono: {
        type : String
    },
}, { collation: { locale: 'es', strength: 1 } });

enterpriseSchema.index({nombre : 1});
enterpriseSchema.index({email: 1})

module.exports = mongoose.model('Enterprise', enterpriseSchema);