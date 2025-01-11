// Importaciones necesarias
import express from 'express';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import auth from '../middleware/auth.js'; // Middleware de autenticación
import Joi from 'joi'; // Librería para validación

dotenv.config();

const router = express.Router();

// Crear una conexión pool para la base de datos
const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    connectTimeout: 10000,
});

// Middleware para proteger las rutas
router.use(auth);

// Esquema de validación para las dietas
const dietaSchema = Joi.object({
    nombre: Joi.string().required(),
    descripcion: Joi.string().optional(),
    calorias: Joi.number().integer().required(),
    tipo: Joi.string().required(),
    objetivo: Joi.string().required(),
    alimentos: Joi.array().items(
        Joi.object({
            alimento_id: Joi.number().integer().required(),
            cantidad: Joi.number().positive().required(),
        })
    ).optional(),
});

// Ruta para obtener todas las dietas (con posibilidad de filtrar)
router.get('/', async (req, res) => {
    const { calorias_min, calorias_max, tipo, objetivo } = req.query;

    let query = 'SELECT * FROM dietas WHERE 1=1';
    const params = [];

    // Filtrar por calorías mínimas
    if (calorias_min) {
        query += ' AND calorias >= ?';
        params.push(parseInt(calorias_min));
    }

    // Filtrar por calorías máximas
    if (calorias_max) {
        query += ' AND calorias <= ?';
        params.push(parseInt(calorias_max));
    }

    // Filtrar por tipo de dieta
    if (tipo) {
        query += ' AND tipo = ?';
        params.push(tipo);
    }

    // Filtrar por objetivo de la dieta
    if (objetivo) {
        query += ' AND objetivo = ?';
        params.push(objetivo);
    }

    try {
        const [dietas] = await db.query(query, params);
        res.json(dietas);
    } catch (err) {
        res.status(500).json({ message: 'Error al obtener las dietas', error: err.message });
    }
});



// Ruta para agregar una nueva dieta (incluyendo alimentos)
router.post('/', async (req, res) => {
    const { error } = dietaSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const { nombre, descripcion, calorias, tipo, objetivo, alimentos } = req.body;

    try {
        // Verificar si ya existe una dieta con el mismo nombre
        const [existingDiet] = await db.query('SELECT * FROM dietas WHERE nombre = ?', [nombre]);

        if (existingDiet.length > 0) {
            // Si ya existe, devolver un error
            return res.status(400).json({ message: 'Ya existe una dieta con este nombre' });
        }

        // Si no existe, insertar la nueva dieta
        const [result] = await db.query(
            'INSERT INTO dietas (nombre, descripcion, calorias, tipo, objetivo) VALUES (?, ?, ?, ?, ?)',
            [nombre, descripcion, calorias, tipo, objetivo]
        );

        const dietaId = result.insertId;

        // Si se envían alimentos relacionados, agregar a la tabla dieta_alimentos
        if (alimentos && alimentos.length > 0) {
            const dietaAlimentosData = alimentos.map(a => [dietaId, a.alimento_id, a.cantidad]);
            await db.query(
                'INSERT INTO dieta_alimentos (dieta_id, alimento_id, cantidad) VALUES ?',
                [dietaAlimentosData]
            );
        }

        res.status(201).json({ id: dietaId, ...req.body });
    } catch (err) {
        res.status(500).json({ message: 'Error al agregar la dieta', error: err.message });
    }
});


// Ruta para actualizar una dieta (incluyendo alimentos relacionados)
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { error } = dietaSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const { nombre, descripcion, calorias, tipo, objetivo, alimentos } = req.body;

    try {
        // Verificar si ya existe una dieta con el mismo nombre pero con un id diferente
        const [existingDiet] = await db.query('SELECT * FROM dietas WHERE nombre = ? AND id != ?', [nombre, id]);

        if (existingDiet.length > 0) {
            // Si existe, devolver un error
            return res.status(400).json({ message: 'Ya existe una dieta con este nombre' });
        }

        // Actualizar la dieta
        const [result] = await db.query(
            'UPDATE dietas SET nombre = ?, descripcion = ?, calorias = ?, tipo = ?, objetivo = ? WHERE id = ?',
            [nombre, descripcion, calorias, tipo, objetivo, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Dieta no encontrada' });
        }

        // Actualizar alimentos relacionados
        await db.query('DELETE FROM dieta_alimentos WHERE dieta_id = ?', [id]);

        if (alimentos && alimentos.length > 0) {
            const dietaAlimentosData = alimentos.map(a => [id, a.alimento_id, a.cantidad]);
            await db.query(
                'INSERT INTO dieta_alimentos (dieta_id, alimento_id, cantidad) VALUES ?',
                [dietaAlimentosData]
            );
        }

        res.json({ message: 'Dieta actualizada' });
    } catch (err) {
        res.status(500).json({ message: 'Error al actualizar la dieta', error: err.message });
    }
});


export default router;
