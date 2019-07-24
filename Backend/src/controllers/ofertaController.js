'use strict'

const Oferta = require('../models/oferta')

function crearOferta(req, res) {
    var params = req.body;
    var rol = req.user.rol;
    var idEmpresa = req.user._id

    if (rol === 'empresa') {
        if (params.titulo && params.descripcion && params.nivelAcademico && params.tarjeta && params.categoria) {
            const oferta = new Oferta();
            oferta.titulo = params.titulo;
            oferta.descripcion = params.descripcion
            oferta.fechaPublicacion = new Date();
            oferta.categoria = params.categoria;
            oferta.nivelAcademico = params.nivelAcademico;
            oferta.tarjeta = params.tarjeta;
            oferta.empresa = idEmpresa;
            oferta.curriculum = [];
            oferta.estado = true;
            oferta.save((err, ofertaGuardada) => {
                if (err) return res.status(500).send({ message: 'Error al guardar la oferta' });
                if (ofertaGuardada) {
                    res.status(200).send({ oferta: ofertaGuardada })
                } else {
                    res.status(404).send({ message: 'La oferta no se ha creado' });
                }
            });
            
        } else {
            return res.status(404).send({ message: 'Ingresa los campos necesarios' })
        }


    } else {
        return res.status(403).send({ message: 'Debes acceder desde una cuenta de tipo empresa' })
    }

}

function editarOferta(req, res) {
    var idOferta = req.params.id;
    var rol = req.user.rol;
    var idEmpresa = req.user._id
    var parameters = req.body

    if (rol === 'admin' || rol === 'empresa') {
        Oferta.findById(idOferta, (err, ofertaEncontrada) => {
            if (err) return res.status(500).send({ message: 'Error en la peticion' });

            if (!ofertaEncontrada) return res.status(404).send({ message: 'No se ha encontrado la oferta ' });

            if (ofertaEncontrada.empresa == idEmpresa || rol == 'admin') {
                Oferta.findByIdAndUpdate(idOferta, parameters, { new: true }, (err, ofertaActualizada) => {
                    if (err) return res.status(500).send({ message: 'Error en la peticion' });

                    if (!ofertaActualizada) return res.status(404).send({ message: 'No se ha podido encontrar la oferta a actualizar' });

                    return res.status(200).send({ oferta: ofertaActualizada })
                });
            } else {
                return res.status(403).send({ message: 'No tienes permisos para actualizar la oferta' })
            }
        })
    } else {
        return res.status(403).send({ message: 'Debes tener permisos para actualizar la oferta' })
    }
}

function getOfertas(req, res) {
    Oferta.find().exec((err, ofertasEncontradas) => {
        if (err) return res.status(500).send({ message: 'Error en la peticion' });
        if (!ofertasEncontradas) return res.status(404).send({ message: 'No se han encotrado ofertas' });
        return res.status(200).send({ ofertas: ofertasEncontradas })
    })
}

function getOfertasPorEmpresa(req, res) {    
    var ofertaPorEmpresa = req.params.id
    
        Oferta.find({ empresa: ofertaPorEmpresa }, (err, ofertasEncontradas) => {
            if (err) return res.status(500).send({ message: 'Error en la peticion' });
            if (!ofertaPorEmpresa) return req.status(404).send({ message: 'No se encuentran ofertas de esa empresa' });

            if (ofertasEncontradas.length > 0) {
                return res.status(200).send({ ofertas: ofertasEncontradas })
            } else {
                return res.status(200).send({ message: 'No exisen ofertas de esta empresa' })
            }
        })
    
}

function getOfertasPorCategoria(req, res) {
    var idCategoria = req.params.id;
    var rol = req.user.rol;



    if (rol == 'user' || rol == 'admin' || rol == 'empresa') {
        Oferta.find({ categoria: idCategoria }, (err, ofertasEncontradas) => {
            if (err) return res.status(500).send({ message: 'Error en la peticion' });

            if (!ofertasEncontradas) return res.status(404).send({ message: 'No se han econtrado ofertas con esa categoria' });

            if (ofertasEncontradas && ofertasEncontradas.length > 0) {
                return res.status(200).send({ ofertas: ofertasEncontradas })
            }
        })

    } else {
        return res.status(403).send({ message: 'No tienes permisos para esta funcion' });
    }
}

function getOfertasPorNivelAcademico(req, res) {
    var idNivelAcademico = req.params.id;
    var rol = req.user.rol;

    if (rol == 'user' || rol == 'admin' || rol == 'empresa') {
        Oferta.find({ nivelAcademico: idNivelAcademico }, (err, ofertasEncontradas) => {
            if (err) return req.status(500).send({ message: 'Error en la peticion' });

            if (!ofertasEncontradas) return res.status(404).send({ message: 'No se han encontrado ofertas con ese nivel academico' });

            if (ofertasEncontradas && ofertasEncontradas.length > 0) {
                return res.status(200).send({ ofertas: ofertasEncontradas });
            } else {
                return res.status(404).send({ message: 'No se han encontrado ofertas con ese nivel academico' });
            }
        })
    } else {
        return res.status(403).send({ message: 'No tienes permisos para ejecutar esta funcion' });
    }


}

function subirImagen(req, res) {
    var ofertaId = req.params.id;

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
            Oferta.findByIdAndUpdate(ofertaId, { image: file_name }, { new: true }, (err, ofertaActualizado) => {
                if (err) return res.status(500).send({ message: ' no se a podido actualizar la oferta' })

                if (!ofertaActualizado) return res.status(404).send({ message: 'error en los datos de la oferta, no se pudo actualizar' })

                return res.status(200).send({ oferta: ofertaActualizado });
            })
        } else {
            return removeFilesOfUploads(res, file_path, 'extension no valida')
        }

    }
}

function obtenerImagen(req, res) {
    var image_file = req.params.nombreImagen;
    var path_file = './src/uploads/ofertas/' + image_file;

    fs.exists(path_file, (exists) => {
        if (exists) {
            res.sendFile(path.resolve(path_file));
        } else {
            res.status(200).send({ message: 'no existe la imagen' })
        }
    });
}




module.exports = {
    crearOferta,
    editarOferta,
    getOfertas,
    getOfertasPorEmpresa,
    getOfertasPorCategoria,
    getOfertasPorNivelAcademico,
    subirImagen,
    obtenerImagen
}
