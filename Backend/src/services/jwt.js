'use strict'

var jwt = require('jwt-simple');
var moment = require('moment');
var secret = 'app_diswork_123';

exports.createToken = function(user){
    var payload = {
        _id: user._id,
        nickName: user.nickName,
        email: user.email,
        password: user.password,
        rol: user.rol,
        image: user.image,
        empresas: user.empresas,
        categoria: user.categoria,
        nivelAcademico: user.nivelAcademico,
        cvsRedactado: user.cvsRedactado,
        cvsImg: user.cvsImg,
        cvsPdf: user.cvsPdf,
        telefono: user.telefono,
        departamento: user.departamento,
        institucion: user.institucion,
        fechaNacimiento: user.fechaNacimiento,
        iat: moment().unix(),
        exp: moment().day(30, 'days').unix
    };

    return jwt.encode(payload, secret);
}

exports.createTokenEmpresa = function(empresa){
    var payload = {
        _id: empresa._id,
        nombre: empresa.nombre,
        email: empresa.email,
        password: empresa.password,
        rol: empresa.rol,
        image: empresa.image,
        direccion: empresa.direccion,
        telefono: empresa.telefono,
        iat: moment().unix(),
        exp: moment().day(30, 'days').unix
    };

    return jwt.encode(payload, secret);
}

exports.createTokenAdmin = function(user){
    var payload = {
        _id: user._id,
        nickName: user.nickName,
        email: user.email,
        password: user.password,
        rol: user.rol,
        telefono: user.telefono,        
        image: user.image,
        iat: moment().unix(),
        exp: moment().day(30, 'days').unix
    };

    return jwt.encode(payload, secret);
}