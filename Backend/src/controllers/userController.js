'use strict'

var bcrypt = require('bcrypt-nodejs');
var User = require('../models/user');
var Empresa = require('../models/empresa');
var Admin = require('../models/admin');
var Oferta = require('../models/oferta');
var jwt = require('../services/jwt');
var path = require('path');
var fs = require('fs');


function registrar(req, res) {
    var user = new User();
    var empresa = new Empresa();
    var admin = new Admin();
    var params = req.body;

    if (params.nickName && params.email && params.password && params.departamento && params.fechaNacimiento &&
        params.rol === 'user') {
        user.nickName = params.nickName;
        user.email = params.email;
        user.rol = params.rol;
        user.image = params.image;
        user.telefono = params.telefono;
        user.departamento = params.departamento;
        user.colegio = params.colegio;
        user.fechaNacimiento = params.fechaNacimiento;
        user.nivelAcademico = null;
        user.categoria = null;
        user.ofertas = [];
        user.empresa = [];
        user.cvsRedactado = [];
        user.cvsImg = [];

        Empresa.find({ email: params.email }).exec((err, empresas) => {
            if (err) return res.status(500).send({ message: 'Error en la peticion de usuarios' });

            if (empresas && empresas.length >= 1) {
                return res.status(500).send({ message: 'El email ya esta siendo utilizado' });
            }
            Admin.find({ email: user.email }).exec((err, amdins) => {
                if (err) return res.status(500).send({ message: 'Error en la peticion de admins' });
    
                if (amdins && amdins.length >= 1) {
                    return res.status(500).send({ message: 'El email ya esta siendo utilizado' });
                } else{
                User.find({ email: user.email}).exec((err, users) => {
                    if (err) return res.status(500).send({ message: 'Error en la peticion de usuarios' });
        
                    if (users && users.length >= 1) {
                        return res.status(500).send({ message: 'El usuario ya existe' });
                    } else {
                        bcrypt.hash(params.password, null, null, (err, hash) => {
                            user.password = hash;
        
                            user.save((err, userStored) => {
                                if (err) return res.status(500).send({ message: 'Error al guardar el usuario', err });
        
                                if (userStored) {
                                    res.status(200).send({ user: userStored })
                                } else {
                                    res.status(404).send({ message: 'no se ha registrado el usuario' });
                                }
                            });
                        });
                    }
                });
            }
        });
    });


      
    } else if (params.nombre && params.email && params.password && params.rol === 'empresa' && params.direccion && params.telefono) {
        empresa.nombre = params.nombre;
        empresa.email = params.email;
        empresa.rol = params.rol;
        empresa.direccion = params.direccion;
        empresa.telefono = params.telefono;
        empresa.image = null;

        User.find({ email: user.email }).exec((err, users) => {
            if (err) return res.status(500).send({ message: 'Error en la peticion de usuarios' });

            if (users && users.length >= 1) {
                return res.status(500).send({ message: 'El usuario ya existe' });
            }
            Admin.find({ email: empresa.email }).exec((err, amdins) => {
                if (err) return res.status(500).send({ message: 'Error en la peticion de admins' });
    
                if (amdins && amdins.length >= 1) {
                    return res.status(500).send({ message: 'El email ya esta siendo utilizado' });
                }
            

            else{
                Empresa.find({
                    $or: [
                        { nombre: empresa.nombre },
                        { email: empresa.email },
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
            }
        });
    });
    } else {
        res.status(200).send({
            message: 'Rellene todos los datos necesarios'
        });
    }


}

function cvRedactado(req, res){  

    var usuarioId = req.user._id;
    var params = req.body;
    User.findById(usuarioId, (err, actualizado) => {
        if (err) return res.status(404).send({ message: "error en la peticion de encuesta" });
        if (!actualizado) return res.status(500).send({ message: "error al opinar en la encuesta" });

        if (params.titulo && params.nombre && params.edad && params.correo && params.telefono
            && params.estudio && params.habilidad && params.refPersonal && params.refPersonal) {
                actualizado.cvsRedactado.push({            
                        titulo: params.titulo,
                        nombre: params.nombre,
                        edad: params.edad,
                        correo: params.correo,
                        telefono: params.telefono,
                        estudio: params.estudio,
                        habilidad: params.habilidad,
                        refPersonal: params.refPersonal,
                        refEmpresarial: params.refEmpresarial            
                });

                actualizado.save();
                return res.status(200).send({token :  jwt.createToken(actualizado)});
        } else {
            res.status(200).send({
                message: 'Rellene todos los datos necesarios'
            });
        }
    });

}

function getUsers(req, res) {
    User.find().exec((err, usuariosEncontrados) => {
        if (err) return res.status(500).send({ message: 'error en la peticion' });
        if (!usuariosEncontrados) return res.status(400).send({ message: 'no' });
        return res.status(200).send({ usuarios: usuariosEncontrados })
    })
}

function eliminarUsuario(req, res){
    var usuarioId = req.params.id; 
    
    User.findByIdAndRemove(usuarioId, (err, usuarioEliminado) => {

        if(err) return res.status(500).send({ message: 'Error en el servidor' });
         
            if(usuarioEliminado){
                return res.status(200).send({
                    usuario: usuarioEliminado
                });
            }else{
                return res.status(404).send({
                    message: 'No existe el usuario'
                });
            }
         
    });

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
                    if (params.gettoken && user.rol === 'user') {

                        return res.status(200).send({
                            token: jwt.createToken(user),
                            user: user

                        })
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
                    Admin.findOne({ email: email2 }, (err, admin) => {
                        if (admin) {
                            bcrypt.compare(password, admin.password, (err, check) => {
                                if (check) {
                                    if (params.gettoken && admin.rol === 'admin') {                                        
                                        return res.status(200).send({
                                            token: jwt.createTokenAdmin(admin),
                                            admin: admin
                                        })
                                    } else {
                                        admin.password = undefined;
                                        return res.status(200).send({ admin })
                                    }
                                } else {
                                    return res.status(404).send({ message: 'El email o la contraseña son incorrectos' })
                                }
                            });
                        } else {
                            return res.status(404).send({ message: 'El usuario no existe' })
                        }
                    });
                }
            });
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

                return res.status(200).send({token :  jwt.createToken(usuarioActualizado) });
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

function subirCurriculum(req, res) {
    var userId = req.user._id;
    var params = req.body;
    
    if (req.files) {
        var file_path = req.files.cv.path;
        //console.log(file_path);

        var file_split = file_path.split('\\');
        //console.log(file_split);

        var file_name = file_split[3];
        //console.log(file_name);

        var ext_split = file_name.split('\.');
        //console.log(ext_split);

        var file_ext = ext_split[1];
        //console.log(file_ext);

        if (file_ext == 'png' || file_ext == 'jpg' || file_ext == 'jpeg') {
            User.findById(userId, (err, usuarioEncontrado) => {
                if (err) return res.status(500).send({ message: ' no se a podido actualizar el usuario' });

                if (!usuarioEncontrado) return res.status(404).send({ message: 'error no se encuentra el usuario' });
                
                usuarioEncontrado.cvsImg.push({
                    titulo: params.titulo,
                    archivo: file_name
                });
                usuarioEncontrado.save();
                
                return res.status(200).send({token :  jwt.createToken(usuarioEncontrado)});
                
            });
        } else if (file_ext == 'pdf'){
            User.findById(userId, (err, usuarioEncontrado) => {
                if (err) return res.status(500).send({ message: ' no se a podido actualizar el usuario' })

                if (!usuarioEncontrado) return res.status(404).send({ message: 'error no se encuentra el usuario' })

                
                usuarioEncontrado.cvsPdf.push({
                    titulo: params.titulo,
                    archivo: file_name
                });
                usuarioEncontrado.save();
                
                return res.status(200).send({token :  jwt.createToken(usuarioEncontrado)});
                
            });
        }
        else {
            return removeFilesOfUploads(res, file_path, 'extension no valida')
        }

    }
}

function obtenerCurriculum(req, res) {
    var cv_file = req.params.nombreCv;
    var path_file = './src/uploads/users/' + cv_file;

    fs.exists(path_file, (exists) => {
        if (exists) {
            res.sendFile(path.resolve(path_file));
        } else {
            res.status(200).send({ message: 'no existe el curriculum' })
        }
    });
}

function editarUsuario(req, res) {
    var userId = req.params.id;
    var params = req.body;
    var newToken = null;

    //BORRAR LA PROPIEDAD DE PASSWORD
    delete params.password;
    
    

    console.log(params)

    if (userId != req.user._id) {
        return res.status(500).send({ message: 'no tiene los permisos para actualizar los datos de este usuario' })
    }

    User.findByIdAndUpdate(userId, params, { new: true }, (err, usuarioActualizado) => {
        if (err) return res.status(500).send({ message: 'error en la peticion' })

        if (!usuarioActualizado){
            return res.status(404).send({ message: 'no se a podido actualizar los datos del usuario' })
        }else{
            newToken = jwt.createToken(usuarioActualizado);
        }
    
    
        return res.status(200).send({ user: usuarioActualizado,token : newToken })
    })
}

function seguirEmpresa(req, res) {
    var rol = req.user.rol;
    var idEmpresa = req.params.id
    var idUsuario = req.user._id
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
                        x= usuarioEncontrado.empresas.length;
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
                    return res.status(200).send({usuario: usuarioEncontrado, token : jwt.createToken(usuarioEncontrado) });
                }
            })
        })
    } else {
        return res.status(403).send({ message: 'No tienes los permisos necesarios' })
    }
}

function dejarDeSeguirEmpresa(req, res) {
    var idUsuario = req.user._id;
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
                    return res.status(200).send({usuario: usuarioEncontrado, token : jwt.createToken(usuarioEncontrado) });
                } else {
                    return res.status(200).send({ message: 'No sigues a esta empresa' });
                }

            })
        })
    } else {
        return res.status(403).send({ message: 'No tienes permisos para ejecutar esta funcion' });
    }
}



function enviarCvImg(req, res) {
    var userId = req.user._id;
    var ofertaId = req.params.id;
    var params = req.body;
    var ext_split;
        console.log(params)
    
    if (userId && params.archivo) {
        console.log('entra')
        ext_split = params.archivo.split('\.');
        if (ext_split[1] == 'png' || ext_split[1] == 'jpg' || ext_split[1] == 'jpeg' || ext_split[1] == 'gif') {
            Oferta.findById(ofertaId, (err, ofertaEncotrada) => {
                ofertaEncotrada.cvsImg.push({
                    idUser: userId,
                    archivo: params.archivo                
                    
                });                
                
                ofertaEncotrada.save();     
    
                return res.status(200).send({message: 'Su Cv ha sido enviado'});
            });  
        } else if (ext_split[1] == 'pdf'){
            Oferta.findById(ofertaId, (err, ofertaEncotrada) => {
                ofertaEncotrada.cvsPdf.push({
                    idUser: userId,
                    archivo: params.archivo                
                    
                });                
                
                ofertaEncotrada.save();     
    
                return res.status(200).send({message: 'Su Cv ha sido enviado'});
            });
        }       

    }else if(userId && params.titulo){
        Oferta.findById(ofertaId, (err, ofertaEncotrada) => {
            ofertaEncotrada.cvsRedactado.push({
                idUser: userId,
                archivo: params                
                
            });
            ofertaEncotrada.save();     

            return res.status(200).send({message: 'Su Cv ha sido enviado'});
        });
    }else {
        return res.status(200).send({message: 'Ingrese su cv para enviarlo'});
    }       
}



function getUserByToken(req, res){
    
    const usuario = req.user;
    const empresa = req.user;
    const admin = req.user;


    if(usuario.rol == "user"){
        res.json({
            ok: true,
            usuario
        })
    } else if(empresa.rol == "empresa"){
        res.json({
            ok: true,
            empresa
        })
    } else {
        res.json({
            ok: true,
            admin
        });
    }
}


module.exports = {
    registrar,
    login,
    subirImagen,
    obtenerImagen,
    editarUsuario,
    eliminarUsuario,
    getUsers,
    getUser,
    seguirEmpresa,
    dejarDeSeguirEmpresa,
    getUserByToken,
    subirCurriculum,
    obtenerCurriculum,
    cvRedactado,
    enviarCvImg
}