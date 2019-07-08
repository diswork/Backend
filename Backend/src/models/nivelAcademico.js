'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var NivelAcademicoSchema = Schema({
    descripcion: String
});

module.exports = mongoose.model('Study', NivelAcademicoSchema);