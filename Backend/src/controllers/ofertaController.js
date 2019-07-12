'use strict'

const Oferta = require('../models/oferta')

function crearOferta(req, res) {
    var params = req.body;
    var rol = req.user.rol;
    var idEmpresa = req.user.sub

    if (rol === 'empresa') {
        if (params.titulo && params.descripcion && params.nivelAcademico && params.tarjeta && params.categoria) {
            const oferta = new Oferta();
            oferta.titulo = params.titulo;
            oferta.descripcion = params.descripcion
            oferta.categoria = params.categoria;
            oferta.nivelAcademico = params.nivelAcademico;
            oferta.tarjeta = params.tarjeta;
            oferta.empresa = idEmpresa;
            oferta.estado = true;
            oferta.save();

            return res.status(200).send({ oferta: oferta })
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
    var idEmpresa = req.user.sub
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
    var rol = req.user.rol;
    var ofertaPorEmpresa = req.params.id

    if (rol == 'user') {
        Oferta.find({ empresa: ofertaPorEmpresa }, (err, ofertasEncontradas) => {
            if (err) return res.status(500).send({ message: 'Error en la peticion' });
            if (!ofertaPorEmpresa) return req.status(404).send({ message: 'No se encuentran ofertas de esa empresa' });

            if (ofertasEncontradas.length > 0) {
                return res.status(200).send({ ofertas: ofertasEncontradas })
            } else {
                return res.status(200).send({ message: 'No exisen ofertas de esta empresa' })
            }
        })
    } else {
        return res.status(403).send({ message: 'No tienes permiso para acceder a esta funcion' });
    }
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



module.exports = {
    crearOferta,
    editarOferta,
    getOfertas,
    getOfertasPorEmpresa,
    getOfertasPorCategoria,
    getOfertasPorNivelAcademico
}