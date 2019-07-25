'use strict'

var bcrypt = require('bcrypt-nodejs');
var Empresa = require('../models/empresa');
var jwt = require('../services/jwt');
var path = require('path');
var fs = require('fs');


function getEmpresas(req, res) {
    Empresa.find().exec((err, empresasEncontrados) => {
        if (err) return res.status(500).send({ message: 'error en la peticion' });
        if (!empresasEncontrados) return res.status(400).send({ message: 'error al buscar las empresas' });
        return res.status(200).send({ empresas: empresasEncontrados })
    })
}

function getEmpresa(req, res) {
    var empresaId = req.params.id;

    Empresa.findById(empresaId, (err, empresaEncontrados) => {
        if (err) return res.status(500).send({ message: 'error en la peticion' });
        if (!empresaEncontrados) return res.status(400).send({ message: 'error al buscar la empresa' });
        return res.status(200).send({ empresas: empresaEncontrados })
    });
}


function subirImagen(req, res) {
    var empresaId = req.user._id;

    if (req.files) {
        var file_path = req.files.image.path;


        var file_split = file_path.split('\\');


        var file_name = file_split[3];


        var ext_split = file_name.split('\.');


        var file_ext = ext_split[1];


        console.log(empresaId)

        if (file_ext == 'png' || file_ext == 'jpg' || file_ext == 'jpeg' || file_ext == 'gif') {
            Empresa.findByIdAndUpdate(empresaId, { image: file_name }, { new: true }, (err, empresaActualizado) => {
                if (err) return res.status(500).send({ message: ' no se a podido actualizar el usuario' })

                if (!empresaActualizado) return res.status(404).send({ message: 'error en los datos del usuario, no se pudo actualizar' })

                return res.status(200).send({ empresa: empresaActualizado });
            })
        } else {
            return removeFilesOfUploads(res, file_path, 'extension no valida')
        }

    }
}

function removeFilesOfUploads(res, file_path, message) {
    fs.unlink(file_path, (err) => {
        return res.status(200).send({ message: message })
    })
}

function obtenerImagen(req, res) {
    var image_file = req.params.nombreImagen;
    var path_file = './src/uploads/empresa/' + image_file;

    fs.exists(path_file, (exists) => {
        if (exists) {
            res.sendFile(path.resolve(path_file));
        } else {
            res.status(200).send({ message: 'no existe la imagen' })
        }
    });
}

function editarEmpresa(req, res) {
    var empresaId = req.params.id;
    var params = req.body;

    //BORRAR LA PROPIEDAD DE PASSWORD
    delete params.password;

    if (empresaId != req.user._id) {
        return res.status(500).send({ message: 'no tiene los permisos para actualizar los datos de este usuario' })
    }

    Empresa.findByIdAndUpdate(empresaId, params, { new: true }, (err, empresaActualizado) => {
        if (err) return res.status(500).send({ message: 'error en la peticion' })

        if (!empresaActualizado) return res.status(404).send({ message: 'no se a podido actualizar los datos del usuario' })

        return res.status(200).send({ empresa: empresaActualizado })
    })
}


module.exports = {
    subirImagen,
    obtenerImagen,
    editarEmpresa,
    getEmpresas,
    getEmpresa
}