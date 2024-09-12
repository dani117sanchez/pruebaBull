require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT,
});

pool.connect((err) => {
  if (err) {
    console.error('Error al conectar a la base de datos:', err.stack);
  } else {
    console.log('Conexión exitosa a la base de datos');
  }
});


const get = async (tabla) => {
  try {
    // Asegúrate de que el nombre de la tabla es seguro (solo letras, números, guiones bajos)
    if (!/^[a-zA-Z0-9_]+$/.test(tabla)) {
      throw new Error('Nombre de tabla inválido');
    }

    // Ejecutar la consulta
    const res = await pool.query(`SELECT * FROM ${tabla}`);
    
    // Devolver las filas obtenidas
    return res.rows;

  } catch (err) {
    console.error('Error en la consulta:', err);
    throw err;
  }
};

const getById = (tabla, id) => {
  return new Promise((resolve, reject) => {
    // Validar que el nombre de la tabla es seguro
    if (!/^[a-zA-Z0-9_]+$/.test(tabla)) {
      return reject(new Error('Nombre de tabla inválido'));
    }

    // Consulta SQL parametrizada para prevenir inyección SQL
    const query = `SELECT * FROM ${tabla} WHERE id = $1`;

    // Ejecutar la consulta pasando el id como parámetro
    pool.query(query, [id], (err, res) => {
      if (err) {
        reject(err); // Rechazar la promesa en caso de error
      } else {
        resolve(res.rows); // Resolver la promesa con los resultados
      }
    });
  });
};

const add = (tabla, data) => {
  return new Promise((resolve, reject) => {
    // Extraer las claves (columnas) y los valores del objeto `data`
    const keys = Object.keys(data);
    const values = Object.values(data);

    // Crear placeholders para la consulta ($1, $2, $3, etc.)
    const placeholders = keys.map((key, index) => `$${index + 1}`).join(', ');

    // Construir la consulta de forma dinámica
    const query = `INSERT INTO ${tabla} (${keys.join(', ')}) VALUES (${placeholders}) RETURNING *`;

    // Ejecutar la consulta
    pool.query(query, values)
      .then(res => resolve(res.rows)) // Devolver las filas insertadas
      .catch(err => reject(err)); // En caso de error, rechazar la promesa
  });
};

const updateById = async (tabla, id, dataToUpdate) => {
  // Validar que el ID es válido
  if (!id || isNaN(id)) {
    throw new Error('ID inválido');
  }

  // Obtener los campos a actualizar
  const keys = Object.keys(dataToUpdate);
  const values = Object.values(dataToUpdate);

  // Asegurarse de que hay datos para actualizar
  if (keys.length === 0) {
    throw new Error('No hay datos para actualizar');
  }

  // Construir los placeholders dinámicamente para la consulta SET
  const setClause = keys.map((key, index) => `${key} = $${index + 1}`).join(', ');

  // Añadir el ID al final de los valores
  values.push(id);

  // Construir la consulta SQL correctamente parametrizada
  const query = `UPDATE ${tabla} SET ${setClause} WHERE id = $${keys.length + 1} RETURNING *`;

  // Ejecutar la consulta
  const result = await pool.query(query, values);

  return result.rows[0]; // Devolver el usuario actualizado
};


const deleteById = (tabla, id) => {
  return new Promise((resolve, reject) => {
    // Asegúrate de que el nombre de la tabla es seguro
    if (!/^[a-zA-Z0-9_]+$/.test(tabla)) {
      return reject(new Error('Nombre de tabla inválido'));
    }

    // Ejecutar la consulta DELETE
    pool.query(`DELETE FROM ${tabla} WHERE id = $1`, [id], (err, res) => {
      if (err) {
        reject(err);
      } else {
        // `rowCount` indica cuántas filas fueron eliminadas
        resolve({ message: `Filas eliminadas: ${res.rowCount}` });
      }
    });
  });
};

module.exports = {
    get,
    getById,
    add,
    updateById,
    deleteById,
    pool,
};