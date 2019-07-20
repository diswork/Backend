'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var NivelAcademicoSchema = Schema({
    descripcion: {
        type : String,
        index : true    
    }

}, { collation: { locale: 'es', strength: 1 } });

NivelAcademicoSchema.index({descripcion : 1});

module.exports = mongoose.model('Study', NivelAcademicoSchema);