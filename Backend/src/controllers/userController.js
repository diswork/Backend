'use strict'

var bcrypt = require('bcrypt-nodejs');
var User = require('../models/user');
var Empresa = require('../models/empresa');
var jwt = require('../services/jwt');
var path = require('path');
var fs = require('fs');


function registrar(req, res) {
    var user = new User();
    var empresa = new Empresa();
    var params = req.body;

    if (params.nickName && params.email && params.password && params.rol === 'user' || params.rol === 'admin' && params.telefono) {
        user.nickName = params.nickName;
        user.email = params.email;
        user.rol = params.rol;
        user.image = null;
        user.telefono = params.telefono;
        user.ofertas = [];
        user.empresa = [];


        User.find({
            $or: [
                { nickName: user.nickName.toLowerCase() },
                { email: user.email.toLowerCase() },
            ]
        }).exec((err, users) => {
            if (err) return res.status(500).send({ message: 'Error en la peticion de usuarios' });

            if (users && users.length >= 1) {
                return res.status(500).send({ message: 'El usuario ya existe' });
            } else {
                bcrypt.hash(params.password, null, null, (err, hash) => {
                    user.password = hash;

                    user.save((err, userStored) => {
                        if (err) return res.status(500).send({ message: 'Error al guardar el usuario' });

                        if (userStored) {
                            res.status(200).send({ user: userStored })
                        } else {
                            res.status(404).send({ message: 'no se ha registrado el usuario' });
                        }
                    });
                });
            }
        });
    } else if (params.nombre && params.email && params.password && params.rol === 'empresa' && params.direccion && params.telefono) {
        empresa.nombre = params.nombre;
        empresa.email = params.email;
        empresa.rol = params.rol;
        empresa.direccion = params.direccion;
        empresa.telefono = params.telefono;
        empresa.image = null;


        Empresa.find({
            $or: [
                { nombre: empresa.nombre.toLowerCase() },
                { email: empresa.email.toLowerCase() },
            ]
        }).exec((err, empresas) => {
            if (err) return res.status(500).send({ message: 'Error en la peticion de usuarios' });

            if (empresas && empresas.length >= 1) {
                return res.status(500).send({ message: 'El usuario ya existe' });
            } else {
                bcrypt.hash(params.password, null, null, (err, hash) => {
                    empresa.password = hash;

                    empresa.save((err, empresaStored) => {
                        if (err) return res.status(500).send({ message: 'Error al guardar el usuario' });

                        if (empresaStored) {
                            res.status(200).send({ empresa: empresaStored })
                        } else {
                            res.status(404).send({ message: 'no se ha registrado el usuario' });
                        }
                    });
                });
            }
        });
    } else {
        res.status(200).send({
            message: 'Rellene todos los datos necesarios'
        });
    }


}

function getUsers(req, res) {
    User.find().exec((err, usuariosEncontrados) => {
        if (err) return res.status(500).send({ message: 'error en la peticion' });
        if (!usuariosEncontrados) return res.status(400).send({ message: 'erro al buscar los usuarios' });
        return res.status(200).send({ usuarios: usuariosEncontrados })
    })
}

function getUser(req, res) {
    var userId = req.params.id;
    User.findById(userId, (err, user) => {
        if (err) return res.status(500).send({ message: 'Error en el user' });
        if (!user) return res.status(400).send({ message: 'Error al listar el user' })

        return res.status(200).send({ user });
    })
}

function login(req, res) {
    var params = req.body;
    var email2 = params.email;
    var password = params.password;

    User.findOne({ email: email2 }, (err, user) => {
        if (err) return res.status(500).send({ message: 'Error en la peticion' })

        if (user) {
            bcrypt.compare(password, user.password, (err, check) => {
                if (check) {
                    if (params.gettoken && user.rol === 'user' || user.rol === 'admin') {

                        return res.status(200).send({
                            token: jwt.createToken(user),
                            user: user

                        })
                        console.log(req.user.rol)
                    } else {
                        user.password = undefined;
                        return res.status(200).send({ user })
                    }
                } else {
                    return res.status(404).send({ message: 'El email o la contraseña son incorrectos' })
                }
            });
        } else {
            Empresa.findOne({ email: email2 }, (err, empresa) => {
                if (empresa) {
                    bcrypt.compare(password, empresa.password, (err, check) => {
                        if (check) {
                            if (params.gettoken && empresa.rol === 'empresa') {
                                return res.status(200).send({
                                    token: jwt.createTokenEmpresa(empresa),
                                    empresa: empresa
                                })
                            } else {
                                empresa.password = undefined;
                                return res.status(200).send({ empresa })
                            }
                        } else {
                            return res.status(404).send({ message: 'El email o la contraseña son incorrectos' })
                        }
                    });
                } else {
                    return res.status(404).send({ message: 'El usuario no existe' })
                }
            })
        }
    });
}

function subirImagen(req, res) {
    var userId = req.params.id;

    if (req.files) {
        var file_path = req.files.image.path;
        console.log(file_path);

        var file_split = file_path.split('\\');
        console.log(file_split);

        var file_name = file_split[3];
        console.log(file_name);

        var ext_split = file_name.split('\.');
        console.log(ext_split);

        var file_ext = ext_split[1];
        console.log(file_ext);

        if (file_ext == 'png' || file_ext == 'jpg' || file_ext == 'jpeg' || file_ext == 'gif') {
            User.findByIdAndUpdate(userId, { image: file_name }, { new: true }, (err, usuarioActualizado) => {
                if (err) return res.status(500).send({ message: ' no se a podido actualizar el usuario' })

                if (!usuarioActualizado) return res.status(404).send({ message: 'error en los datos del usuario, no se pudo actualizar' })

                return res.status(200).send({ user: usuarioActualizado });
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
    var path_file = './src/uploads/users/' + image_file;

    fs.exists(path_file, (exists) => {
        if (exists) {
            res.sendFile(path.resolve(path_file));
        } else {
            res.status(200).send({ message: 'no existe la imagen' })
        }
    });
}

function editarUsuario(req, res) {
    var userId = req.params.id;
    var params = req.body;

    //BORRAR LA PROPIEDAD DE PASSWORD
    delete params.password;

    if (userId != req.user.sub) {
        return res.status(500).send({ message: 'no tiene los permisos para actualizar los datos de este usuario' })
    }

    User.findByIdAndUpdate(userId, params, { new: true }, (err, usuarioActualizado) => {
        if (err) return res.status(500).send({ message: 'error en la peticion' })

        if (!usuarioActualizado) return res.status(404).send({ message: 'no se a podido actualizar los datos del usuario' })

        return res.status(200).send({ user: usuarioActualizado })
    })
}

function seguirEmpresa(req, res) {
    var rol = req.user.rol;
    var parameters = req.body
    var idEmpresa = req.params.id
    var idUsuario = req.user.sub
    var empresaRepetida = false;

    if (rol == 'user') {
        Empresa.findById(idEmpresa, (err, empresaEncontrada) => {
            if (err) return res.status(500).send({ message: 'error en la peticion' });

            if (!empresaEncontrada) return res.status(404).send({ message: 'La empresa no existe' })

            User.findById(idUsuario, (err, usuarioEncontrado) => {
                if (err) return res.status(500).send({ message: 'Error en la peticion' });

                if (!usuarioEncontrado) return res.status(404).send({ message: 'No se ha encontrado el usuario' })


                for (let x = 0; x < usuarioEncontrado.empresas.length; x++) {

                    if (idEmpresa == usuarioEncontrado.empresas[x]) {
                        empresaRepetida = true;

                    } else {
                        empresaRepetida = false;
                    }
                }

                if (empresaRepetida == true) {
                    return res.status(200).send({ message: 'El usuario ya sigue a la empresa' });

                }
                if (empresaRepetida == false) {
                    usuarioEncontrado.empresas.push(idEmpresa);
                    usuarioEncontrado.save();
                    return res.status(200).send({ usuario: usuarioEncontrado })
                }
            })
        })
    } else {
        return res.status(403).send({ message: 'No tienes los permisos necesarios' })
    }
}

function dejarDeSeguirEmpresa(req, res) {
    var idUsuario = req.user.sub;
    var rol = req.user.rol;
    var idEmpresa = req.params.id;
    var siguiendoEmpresa = false;

    if (rol == 'user') {
        Empresa.findById(idEmpresa, (err, empresaEncontrada) => {
            if (err) return res.status(500).send({ message: 'Error en la peticion' });

            if (!empresaEncontrada) return res.status(404).send({ message: 'No se ha encontrado la empresa' });

            User.findById(idUsuario, (err, usuarioEncontrado) => {
                if (err) return res.status(500).send({ message: 'Error en la peticion' });

                if (!usuarioEncontrado) return res.status(404).send({ message: 'No se ha encontrado el usuario' })

                for (let x = 0; x < usuarioEncontrado.empresas.length; x++) {
                    if (idEmpresa == usuarioEncontrado.empresas[x]) {
                        siguiendoEmpresa = true
                        console.log(x);
                    }
                }

                if (siguiendoEmpresa == true) {
                    usuarioEncontrado.empresas.pull(idEmpresa);
                    usuarioEncontrado.save();
                    return res.status(200).send({ message: 'Dejaste De seguir a la empresa' });
                } else {
                    return res.status(200).send({ message: 'No sigues a esta empresa' });
                }

            })
        })
    } else {
        return res.status(403).send({ message: 'No tienes permisos para ejecutar esta funcion' });
    }
}


module.exports = {
    registrar,
    login,
    subirImagen,
    obtenerImagen,
    editarUsuario,
    getUsers,
    getUser,
    seguirEmpresa,
    dejarDeSeguirEmpresa
}