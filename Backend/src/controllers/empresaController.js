'use strict'

var bcrypt = require('bcrypt-nodejs');
var Empresa = require('../models/empresa');
var User = require('../models/user');
var jwt = require('../services/jwt');
var path = require('path');
var fs = require('fs');


function getEmpresas(req, res) {
    Empresa.find().exec((err, empresasEncontrados) => {
        if (err) return res.status(500).send({ message: 'error en la peticion' });
        if (!empresasEncontrados) return res.status(400).send({ message: 'no' });
        return res.status(200).send({ empresas: empresasEncontrados })
    })
}

function getEmpresa(req, res) {
    var empresaId = req.params.id;

    Empresa.findById(empresaId, (err, empresaEncontrados) => {
        if (err) return res.status(500).send({ message: 'error en la peticion' });
        if (!empresaEncontrados) return res.status(400).send({ message: 'error al buscar la empresa' });
        return res.status(200).send({ empresa: empresaEncontrados })
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


        // console.log(empresaId)

        if (file_ext == 'png' || file_ext == 'jpg' || file_ext == 'jpeg' || file_ext == 'gif') {
            Empresa.findByIdAndUpdate(empresaId, { image: file_name }, { new: true }, (err, empresaActualizado) => {
                if (err) return res.status(500).send({ message: ' no se a podido actualizar el usuario' })

                if (!empresaActualizado) return res.status(404).send({ message: 'error en los datos del usuario, no se pudo actualizar' })

                return res.status(200).send({ token: jwt.createTokenEmpresa(empresaActualizado) });
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

function eliminarEmpresa(req, res){
    var empresaId = req.params.id; 
    
    Empresa.findByIdAndRemove(empresaId, (err, empresaEliminado) => {

        if(err) return res.status(500).send({ message: 'Error en el servidor' });
         
            if(empresaEliminado){
                return res.status(200).send({
                    empresa: empresaEliminado
                });
            }else{
                return res.status(404).send({
                    message: 'No existe la empresa'
                });
            }
         
    });

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

function followersUsers(req, res) {
    var idEmpresa = req.user._id;
    var empresaArray;
    var empresasP;
    var followersU = [];

    User.find().exec((err,usuariosEncontrados)=>{
        for (let x = 0; x < usuariosEncontrados.length; x++) {
            empresasP = usuariosEncontrados[x].empresas.length;
            
            for (let y = 0; y < empresasP; y++) {
                
            empresaArray = usuariosEncontrados[x].empresas[y];                
                if (idEmpresa == empresaArray){                        
                    followersU.push(usuariosEncontrados[x]);                        
                }
            }
            if (x == usuariosEncontrados.length -1) {
                return res.status(200).send({followersU});
            }

        }           
            
    });
}


function editarEmpre(req, res) {
    var empresaId = req.params.id;
    var params = req.body;
    var newToken = null;

    //BORRAR LA PROPIEDAD DE PASSWORD
    delete params.password;
    
    

    // console.log(params)

    if (empresaId != req.user._id) {
        return res.status(500).send({ message: 'no tiene los permisos para actualizar los datos de esta empresa' })
    }

    Empresa.findByIdAndUpdate(empresaId, params, { new: true }, (err, empresaActualizado) => {
        if (err) return res.status(500).send({ message: 'error en la peticion' })

        if (!empresaActualizado){
            return res.status(404).send({ message: 'no se a podido actualizar los datos del la empresa' })
        }else{
            newToken = jwt.createTokenEmpresa(empresaActualizado);
        }
    
    
        return res.status(200).send({ empresa: empresaActualizado,token : newToken })
    })
}


module.exports = {
    subirImagen,
    obtenerImagen,
    //editarEmpresa,
    getEmpresas,
    getEmpresa,
    editarEmpre,
    eliminarEmpresa,
    followersUsers
}