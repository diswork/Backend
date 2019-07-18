'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = Schema({
    nickName: {
        type: String,
        required : [true, "Nickname is required"],
        index : true
    },
    email: {
        type: String,
        required : [true, "Email is required"],
        index : true
    },
    password : {
        type: String, 
        required : [true, "Password is required."]
    },
    rol : {
        type : String
    },
    image: {
        type : String
    },
    telefono: {
        type : String
    },
    departamento: {
        type : String
    },
    institucion: {
        type : String
    },
    fechaNacimiento: {
        type : Date
    },
    ofertas: {
        type : []
    },
    cv: {
        type : []
    },
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