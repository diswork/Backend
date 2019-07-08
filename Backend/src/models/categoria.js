'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CategoriaSchema = Schema({
    descripcion: String
});

module.exports = mongoose.model('Category', CategoriaSchema);