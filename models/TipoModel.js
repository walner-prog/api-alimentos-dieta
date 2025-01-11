import db from '../config/db.js'; // Conexión a la base de datos

const TipoModel = {
    // Obtener todos los tipos
    getAll: async () => {
        const [rows] = await db.query('SELECT * FROM tipos');
        return rows;
    },

    // Obtener un tipo por ID
    getById: async (id) => {
        const [rows] = await db.query('SELECT * FROM tipos WHERE id = ?', [id]);
        return rows[0];
    },

    // Obtener alimentos relacionados con un tipo
    getAlimentosByTipoId: async (id) => {
        const [rows] = await db.query('SELECT * FROM alimentos WHERE tipo_id = ?', [id]);
        return rows;
    },

    // Crear un nuevo tipo
    create: async (nombre, descripcion) => {
        const [result] = await db.query('INSERT INTO tipos (nombre, descripcion) VALUES (?, ?)', [nombre, descripcion]);
        return result.insertId;
    },

    // Actualizar un tipo
    update: async (id, nombre, descripcion) => {
        const [result] = await db.query('UPDATE tipos SET nombre = ?, descripcion = ? WHERE id = ?', [nombre, descripcion, id]);
        return result.affectedRows;
    },

    // Eliminar un tipo
    delete: async (id) => {
        const [result] = await db.query('DELETE FROM tipos WHERE id = ?', [id]);
        return result.affectedRows;
    },

    // Verificar si un tipo existe por nombre
    existsByName: async (nombre) => {
        const [rows] = await db.query('SELECT * FROM tipos WHERE nombre = ?', [nombre]);
        return rows.length > 0;
    }
};

export default TipoModel;
