'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CategoriaSchema = Schema({
    descripcion: {
        type : String,
        index : true    
    }

}, { collation: { locale: 'es', strength: 1 } });

CategoriaSchema.index({descripcion : 1});

module.exports = mongoose.model('Category', CategoriaSchema);