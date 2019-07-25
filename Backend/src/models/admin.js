'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var adminSchema = Schema({
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
    telefono : String,
    image : String
}, { collation: { locale: 'es', strength: 1 } });

adminSchema.index({email : 1});
adminSchema.index({nickName: 1})

module.exports = mongoose.model('Admin', adminSchema);