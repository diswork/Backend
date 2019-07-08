'use strict'

var NivelAcademico = require('../models/nivelAcademico');

function crearNivelAcademico(req, res) {
    var nivelAcademico = new NivelAcademico();
    var params = req.body;

    if (params.descripcion) {
        nivelAcademico.descripcion = params.descripcion;

        nivelAcademico.save((err, nivelGuardado) => {
            if (err) return res.status(500).send({ message: 'Error al guardar el nivel academico' });

            if (nivelGuardado) {
                res.status(200).send({ nivelAcademico: nivelGuardado })
            } else {
                res.status(404).send({ message: 'El nivel academico no se ha creado' });
            }
        });            
       
    } else {
        res.status(200).send({
            message: 'Rellene todos los datos necesarios'
        });
    }

}

function getNiveles(req, res) {
    NivelAcademico.find().exec((err, nivelesEncontrados) => {
        if (err) return res.status(500).send({ message: 'error en la peticion' });
        if (!nivelesEncontrados) return res.status(400).send({ message: 'error al buscar los niveles academicos' });
        return res.status(200).send({ nivelAcademico: nivelesEncontrados })
    })
}

function getNivel(req, res) {
    var nivelId = req.params.id;
    NivelAcademico.findById(nivelId, (err, nivel) => {
        if (err) return res.status(500).send({ message: 'Error en el nivel academico' });
        if (!nivel) return res.status(400).send({ message: 'Error al listar el nivel academico' })

        return res.status(200).send({ nivelAcademico:  nivel });
    })
}

function editarNivel(req, res) {
    var nivelId = req.params.id;    
    var params = req.body;

    NivelAcademico.findByIdAndUpdate(nivelId, params, { new: true }, (err, nivelActualizado) => {
        if (err) return res.status(500).send({ message: 'error en la peticion' })

        if (!nivelActualizado) return res.status(404).send({ message: 'no se a podido actualizar los datos de la categoria' })

        return res.status(200).send({ nivelAcademico: nivelActualizado })
    })
}

function deleteNivel(req, res){
    var nivelId = req.params.id; 
    
    NivelAcademico.findByIdAndRemove(nivelId, (err, nivelEliminada) => {

        if(err) return res.status(500).send({ message: 'Error en el servidor' });
         
            if(nivelEliminada){
                return res.status(200).send({
                    equipo: nivelEliminada
                });
            }else{
                return res.status(404).send({
                    message: 'No existe el nivel academico'
                });
            }
         
    });

}

module.exports = {
    crearNivelAcademico,
    getNiveles,
    getNivel,
    editarNivel,
    deleteNivel
}