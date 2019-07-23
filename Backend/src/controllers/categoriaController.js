'use strict'

var Categoria = require('../models/categoria');

function crearCategoria(req, res) {
    var categoria = new Categoria();
    var params = req.body;
    var rol = req.user.rol;

    if (rol != 'admin') {
        return res.status(500).send({message: 'No tiene los permisos para realizar la accion'});
    }

    if (params.descripcion && rol === 'admin') {
        categoria.descripcion = params.descripcion;

        Categoria.find({
                descripcion: categoria.descripcion.toLowerCase()           
        }).exec((err, categorias) => {
            if (err) return res.status(500).send({ message: 'Error en la peticion de categorias' });

            if (categorias && categorias.length >= 1) {
                return res.status(500).send({ message: 'La categoria ya existe' });
            } else {
                    categoria.save((err, categoriaGuardada) => {
                        if (err) return res.status(500).send({ message: 'Error al guardar la categoria' });

                        if (categoriaGuardada) {
                            res.status(200).send({ categoria: categoriaGuardada })
                        } else {
                            res.status(404).send({ message: 'La categoria no se ha creado' });
                        }
                    });

            }
        });
    } else {
        res.status(200).send({
            message: 'Rellene todos los datos necesarios'
        });
    }

}

function getCategorias(req, res) {
    Categoria.find().exec((err, categoriasEncontrados) => {
        if (err) return res.status(500).send({ message: 'error en la peticion' });
        if (!categoriasEncontrados) return res.status(400).send({ message: 'error al buscar las categorias' });
        return res.status(200).send({ categorias: categoriasEncontrados })
    })
}

function getCategoria(req, res) {
    var categoriaId = req.params.id;
    Categoria.findById(categoriaId, (err, categoria) => {
        if (err) return res.status(500).send({ message: 'Error en la categoria' });
        if (!categoria) return res.status(400).send({ message: 'Error al listar la categoria' })

        return res.status(200).send({ categoria });
    })
}

function editarCategoria(req, res) {
    var categoriaId = req.params.id;
    var rol = req.user.rol;
    var params = req.body;
    

    if (rol != 'admin') {
        return res.status(500).send({ message: 'no tiene los permisos para actualizar los datos de la categoria' })
    }

    Categoria.findByIdAndUpdate(categoriaId, params, { new: true }, (err, categoriaActualizado) => {
        if (err) return res.status(500).send({ message: 'error en la peticion' })

        if (!categoriaActualizado) return res.status(404).send({ message: 'no se a podido actualizar los datos de la categoria' })

        return res.status(200).send({ categoria: categoriaActualizado })
    })
}

function deleteCategoria(req, res){
    var categoriaId = req.params.id; 
    
    Categoria.findByIdAndRemove(categoriaId, (err, categoriaEliminada) => {

        if(err) return res.status(500).send({ message: 'Error en el servidor' });
         
            if(categoriaEliminada){
                return res.status(200).send({
                    equipo: categoriaEliminada
                });
            }else{
                return res.status(404).send({
                    message: 'No existe la categoria'
                });
            }
         
    });

}

module.exports = {
    crearCategoria,
    getCategorias,
    getCategoria,
    editarCategoria,
    deleteCategoria
}