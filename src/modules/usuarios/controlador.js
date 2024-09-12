const db = require('../../DB/postgreSQL');

const TABLA = 'usuarios';
function get() {
    return db.get(TABLA);

};

function getById(id) {
    return db.getById(TABLA, id);

};

function deleteById(body) {
    return db.deleteById(TABLA, body);

};

function add(body) {
    return db.add(TABLA, body);

};

const updateById = (id, dataToUpdate) => {
    return db.updateById(TABLA, id, dataToUpdate);
};

module.exports = {
    get,
    getById,
    deleteById,
    add,
    updateById,
};