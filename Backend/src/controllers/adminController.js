'use strict'

var bcrypt = require('bcrypt-nodejs');
var User = require('../models/user');
var Empresa = require('../models/empresa');
var Admin = require('../models/admin');
var jwt = require('../services/jwt');
var path = require('path');
var fs = require('fs');


function crearAdmin(req, res) {
    var user = new User();
    var admin = new Admin();
    var params = req.body;

    if (params.nickName && params.email && params.password && params.telefono) {
        admin.nickName = params.nickName;
        admin.email = params.email;
        admin.rol = 'admin';        
        admin.telefono = params.telefono;

        if (req.user.rol != 'admin') return res.status(500).send({ message: 'Error en la peticion de usuarios nac' });

        Empresa.find({ email: params.email }).exec((err, empresas) => {
            if (err) return res.status(500).send({ message: 'Error en la peticion de usuarios' });

            if (empresas && empresas.length >= 1) {
                return res.status(500).send({ message: 'El email ya esta siendo utilizado' });
            }
            User.find({ email: user.email }).exec((err, users) => {
                if (err) return res.status(500).send({ message: 'Error en la peticion de usuarios' });
    
                if (users && users.length >= 1) {
                    return res.status(500).send({ message: 'El email ya esta siendo utilizado' });
                } else{
                Admin.find({ email: admin.email}).exec((err, admins) => {
                    if (err) return res.status(500).send({ message: 'Error en la peticion de admins' });
        
                    if (admins && admins.length >= 1) {
                        return res.status(500).send({ message: 'El admin ya existe' });
                    } else {
                        bcrypt.hash(params.password, null, null, (err, hash) => {
                            admin.password = hash;
        
                            admin.save((err, adminStored) => {
                                if (err) return res.status(500).send({ message: 'Error al guardar el admin', err });
        
                                if (adminStored) {
                                    res.status(200).send({ admin: adminStored })
                                } else {
                                    res.status(404).send({ message: 'no se ha registrado el admin' });
                                }
                            });
                        });
                    }
                });
            }
        });
    });
    } else {
        res.status(200).send({
            message: 'Rellene todos los datos necesarios'
        });
    }


}

function getAdmins(req, res) {
    Admin.find().exec((err, adminsEncontrados) => {
        if (err) return res.status(500).send({ message: 'error en la peticion' });
        if (!adminsEncontrados) return res.status(400).send({ message: 'erro al buscar los admins' });
        return res.status(200).send({ admins: adminsEncontrados })
    })
}

function getAdmin(req, res) {
    var adminId = req.params.id;
    Admin.findById(adminId, (err, admin) => {
        if (err) return res.status(500).send({ message: 'Error en el admin' });
        if (!admin) return res.status(400).send({ message: 'Error al listar el admin' })

        return res.status(200).send({ admin });
    })
}

function subirImagen(req, res) {
    var adminId = req.user._id;

    if (req.files) {
        var file_path = req.files.image.path;
        // console.log(file_path);

        var file_split = file_path.split('\\');
        // console.log(file_split);

        var file_name = file_split[3];
        // console.log(file_name);

        var ext_split = file_name.split('\.');
        // console.log(ext_split);

        var file_ext = ext_split[1];
        // console.log(file_ext);

        if (file_ext == 'png' || file_ext == 'jpg' || file_ext == 'jpeg' || file_ext == 'gif') {
            Admin.findByIdAndUpdate(adminId, { image: file_name }, { new: true }, (err, adminActualizado) => {
                if (err) return res.status(500).send({ message: ' no se a podido actualizar el admin' })

                if (!adminActualizado) return res.status(404).send({ message: 'error en los datos del admin, no se pudo actualizar' })

                return res.status(200).send({ admin: adminActualizado });
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
    var path_file = './src/uploads/admins/' + image_file;

    fs.exists(path_file, (exists) => {
        if (exists) {
            res.sendFile(path.resolve(path_file));
        } else {
            res.status(200).send({ message: 'no existe la imagen' })
        }
    });
}

function editarAdmin(req, res) {
    var adminId = req.params.id;
    var params = req.body;
    var newToken = null;

    delete params.password;    

    // console.log(params)

    if (adminId != req.user._id) {
        return res.status(500).send({ message: 'no tiene los permisos para actualizar los datos de este admin' })
    }

    Admin.findByIdAndUpdate(adminId, params, { new: true }, (err, adminActualizado) => {
        if (err) return res.status(500).send({ message: 'error en la peticion' })

        if (!adminActualizado){
            return res.status(404).send({ message: 'no se a podido actualizar los datos del admin' })
        }else{
            newToken = jwt.createToken(adminActualizado);
        }
    
    
        return res.status(200).send({ admin: adminActualizado,token : newToken })
    })
}

function eliminarAdmin(req, res){
    var adminId = req.params.id; 
    
    Admin.findByIdAndRemove(adminId, (err, adminEliminado) => {

        if(err) return res.status(500).send({ message: 'Error en el servidor' });
         
            if(adminEliminado){
                return res.status(200).send({
                    admin: adminEliminado
                });
            }else{
                return res.status(404).send({
                    message: 'No existe el admin'
                });
            }
         
    });

}


module.exports = {
    crearAdmin,
    subirImagen,
    obtenerImagen,
    editarAdmin,
    getAdmins,
    getAdmin,
    eliminarAdmin    
}