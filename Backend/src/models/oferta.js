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
    nivelAcademico: String,
    tarjetaCredito: String,
    empresa: {
        type: Schema.ObjectId,
        ref: 'Enterprise'
    }
})

module.exports = mongoose.model('Offer', OfertaSchema);