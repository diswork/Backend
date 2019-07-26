'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = Schema({
    nickName: {
        type: String,
        index : true
    },
    email: {
        type: String,
        index : true
    },
    password : {
        type: String, 
    },
    rol : String,
    image: String,
    telefono : String,
    departamento : String,
    institucion : String,
    fechaNacimiento: Date,
    ofertas: [],
    cvsRedactado: [{
        titulo: String,
        nombre: String,
        edad: String,
        correo: String,
        telefono: String,
        estudio: String,
        habilidad: String,
        refPersonal: String,
        refEmpresarial: String
    }],
    cvsPdf: [{
        titulo: String,
        archivo: String
    }],
    cvsImg: [{
        titulo: String,
        archivo: String
    }],
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
}, { collation: { locale: 'es', strength: 1 } });

userSchema.index({email : 1});
userSchema.index({nickName: 1})

module.exports = mongoose.model('User', userSchema);