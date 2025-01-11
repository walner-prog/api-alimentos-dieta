import express from 'express';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import auth from '../middleware/auth.js'; // Middleware de autenticación
import Joi from 'joi'; // Librería para validación

dotenv.config();

const router = express.Router();

// Crear una conexión pool para un mejor manejo de conexiones
const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    connectTimeout: 10000,
});

// Middleware para proteger todas las rutas
router.use(auth);

// Esquema de validación para los datos del tipo
const tipoSchema = Joi.object({
    nombre: Joi.string().required(),
    descripcion: Joi.string().optional(),
});

// Ruta para obtener todos los tipos
router.get('/', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM tipos');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ message: 'Error al obtener los tipos', error: err.message });
    }
});

// Ruta para agregar un nuevo tipo
router.post('/', async (req, res) => {
    const { error } = tipoSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const { nombre, descripcion } = req.body;

    try {
        // Comprobamos si el tipo ya existe
        const [existingTipo] = await db.query('SELECT * FROM tipos WHERE nombre = ?', [nombre]);
        if (existingTipo.length > 0) {
            return res.status(400).json({ message: 'El tipo con este nombre ya existe' });
        }

        // Si no existe, procedemos a crear el nuevo tipo
        const [result] = await db.query('INSERT INTO tipos (nombre, descripcion) VALUES (?, ?)', [nombre, descripcion]);
        res.status(201).json({ id: result.insertId, nombre, descripcion });
    } catch (err) {
        res.status(500).json({ message: 'Error al crear el tipo', error: err.message });
    }
}); 

// Ruta para actualizar un tipo
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { error } = tipoSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const { nombre, descripcion } = req.body;

    try {
        const [result] = await db.query('UPDATE tipos SET nombre = ?, descripcion = ? WHERE id = ?', [nombre, descripcion, id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Tipo no encontrado' });
        }
        res.json({ message: 'Tipo actualizado' });
    } catch (err) {
        res.status(500).json({ message: 'Error al actualizar el tipo', error: err.message });
    }
});

// Ruta para eliminar un tipo
router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const [result] = await db.query('DELETE FROM tipos WHERE id = ?', [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Tipo no encontrado' });
        }
        res.json({ message: 'Tipo eliminado' });
    } catch (err) {
        res.status(500).json({ message: 'Error al eliminar el tipo', error: err.message });
    }
});


// Ruta para obtener los detalles de un tipo específico con los alimentos relacionados
router.get('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        // Obtener el detalle del tipo
        const [tipo] = await db.query('SELECT * FROM tipos WHERE id = ?', [id]);

        if (tipo.length === 0) {
            return res.status(404).json({ message: 'Tipo no encontrado' });
        }

        // Obtener los alimentos relacionados a este tipo
        const [alimentos] = await db.query('SELECT * FROM alimentos WHERE tipo_id = ?', [id]);

        // Devolver el detalle del tipo y los alimentos relacionados
        res.json({
            tipo: tipo[0],
            alimentos: alimentos
        });
    } catch (err) {
        res.status(500).json({ message: 'Error al obtener el tipo y los alimentos', error: err.message });
    }
});


export default router;
