'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OfertaSchema = Schema({
    titulo: String,
    descripcion: String,
    categoria: {
        type: Schema.ObjectId,
        ref: "Category"
    },
    nivelAcademico: {
        type: Schema.ObjectId,
        ref: 'Study'
    },
    tarjeta: String,
    empresa: {
        type: Schema.ObjectId,
        ref: 'Enterprise'
    },
    disponible: Boolean

})

module.exports = mongoose.model('Offer', OfertaSchema);