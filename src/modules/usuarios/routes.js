const express = require('express');

const respuestas = require('../../red/respuestas');
const controlador = require('./controlador');

const router = express.Router();
//RUTAS
router.get('/', get);
router.get('/:id', getById);
router.delete('/:id', deleteById);
router.post('/', add);
router.put('/:id', updateById);

//FUNCIONALIDAD
async function get(req, res) {
    try {
        const items = await controlador.get();
        respuestas.success(req, res, items, 200);

    } catch (error) {
        console.error(error);
        respuestas.error(req, res, 'Error al obtener los usuarios', 500);

    }

};

async function getById(req, res) {
    try {
        const item = await controlador.getById(req.params.id);
        //console.log(req);
        respuestas.success(req, res, item, 200);
    } catch (error) {
        console.error(error);
        respuestas.error(req, res, 'Error al obtener el usuario con id' + req.params.id, 500);

    }
};

async function deleteById(req, res) {
    try {
        const item = await controlador.deleteById(req.params.id);
        respuestas.success(req, res, item, 200);
    } catch (error) {
        console.error(error);
        respuestas.error(req, res, 'Error al obtener el usuario con id' + req.params.id, 500);

    }

};

async function add(req, res) {
    try {
        const item = await controlador.add(req.body);
        respuestas.success(req, res, item, 201);
    } catch (error) {
        console.error(error);
        respuestas.error(req, res, 'Error al crear el usuario ' + req.params.id, 500);

    }

};

async function updateById(req, res) {
    try {
        // Obtener el ID del usuario desde los parámetros de la ruta
        const id = req.params.id;

        // Obtener los datos a actualizar desde el cuerpo de la solicitud
        const dataToUpdate = req.body;

        // Llamar al controlador pasando el ID y los nuevos datos
        const updatedItem = await controlador.updateById(id, dataToUpdate);

        // Responder con éxito y el elemento actualizado
        respuestas.success(req, res, updatedItem, 200);
    } catch (error) {
        console.error(error);

        // Responder con un mensaje de error, incluyendo el ID
        respuestas.error(req, res, 'Error al actualizar el usuario ' + req.params.id, 500);
    }
};




module.exports = router;