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

// Esquema de validación para los datos de la categoría
const categoriaSchema = Joi.object({
    nombre: Joi.string().required(),
    descripcion: Joi.string().optional(),
});

// Ruta para obtener todas las categorías
router.get('/', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM categorias');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ message: 'Error al obtener las categorías', error: err.message });
    }
});

// Ruta para agregar una nueva categoría
router.post('/', async (req, res) => {
    const { error } = categoriaSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const { nombre, descripcion } = req.body;

    try {
        // Verificamos si ya existe una categoría con el mismo nombre
        const [existingCategory] = await db.query('SELECT * FROM categorias WHERE nombre = ?', [nombre]);

        if (existingCategory.length > 0) {
            return res.status(400).json({ message: 'Ya existe una categoría con ese nombre' });
        }

        // Si no existe, insertamos la nueva categoría
        const [result] = await db.query('INSERT INTO categorias (nombre, descripcion) VALUES (?, ?)', [nombre, descripcion]);
        res.status(201).json({ id: result.insertId, nombre, descripcion });
    } catch (err) {
        res.status(500).json({ message: 'Error al agregar la categoría', error: err.message });
    }
});

// Ruta para actualizar una categoría
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { error } = categoriaSchema.validate(req.body);

    if (error) return res.status(400).json({ message: error.details[0].message });

    const { nombre, descripcion } = req.body;

    // Validación adicional del ID (ejemplo con una expresión regular)
    if (!/^\d+$/.test(id)) {
        return res.status(400).json({ message: 'ID de categoría inválido' });
    }

    try {
        // Verificar si el nombre de la categoría ya existe (opcional)
        const [existingCategory] = await db.query('SELECT * FROM categorias WHERE nombre = ?', [nombre]);
        if (existingCategory.length > 0 && existingCategory[0].id !== id) {
            return res.status(400).json({ message: 'Ya existe una categoría con ese nombre' });
        }

        const [result] = await db.query('UPDATE categorias SET nombre = ?, descripcion = ? WHERE id = ?', [nombre, descripcion, id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Categoría no encontrada' });
        }

        res.json({ message: 'Categoría actualizada' });
    } catch (err) {
        console.error(err); // Registrar el error para depuración
        res.status(500).json({ message: 'Error al actualizar la categoría', error: err.message });
    }
});


router.patch('/:id', async (req, res) => {
    const { id } = req.params;
    const { error } = categoriaSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const { nombre, descripcion } = req.body;

    try {
        // Verificamos si el nuevo nombre de la categoría ya existe en otra categoría (excepto la actual)
        const [existingCategory] = await db.query('SELECT * FROM categorias WHERE nombre = ? AND id != ?', [nombre, id]);

        if (existingCategory.length > 0) {
            return res.status(400).json({ message: 'Ya existe una categoría con ese nombre' });
        }

        // Si no existe un nombre duplicado, actualizamos la categoría
        const [result] = await db.query(
            'UPDATE categorias SET nombre = ?, descripcion = ? WHERE id = ?',
            [nombre, descripcion, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Categoría no encontrada' });
        }

        res.json({ message: 'Categoría actualizada correctamente' });
    } catch (err) {
        res.status(500).json({ message: 'Error al actualizar la categoría', error: err.message });
    }
});

// Ruta para eliminar una categoría
router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const [result] = await db.query('DELETE FROM categorias WHERE id = ?', [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Categoría no encontrada' });
        }
        res.json({ message: 'Categoría eliminada' });
    } catch (err) {
        res.status(500).json({ message: 'Error al eliminar la categoría', error: err.message });
    }
});


// Ruta para obtener una categoría con los alimentos relacionados
router.get('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        // Primero obtenemos los detalles de la categoría
        const [categoryResult] = await db.query('SELECT * FROM categorias WHERE id = ?', [id]);

        if (categoryResult.length === 0) {
            return res.status(404).json({ message: 'Categoría no encontrada' });
        }

        // Luego obtenemos los alimentos relacionados con esta categoría
        const [alimentosResult] = await db.query(
            `SELECT * FROM alimentos WHERE categoria_id = ?`, 
            [id]
        );

        // Agregar los alimentos al resultado de la categoría
        const categoryWithAlimentos = {
            ...categoryResult[0], // La categoría
            alimentos: alimentosResult // Los alimentos relacionados
        };

        res.json(categoryWithAlimentos);
    } catch (err) {
        res.status(500).json({ message: 'Error al obtener la categoría y los alimentos', error: err.message });
    }
});


export default router;
