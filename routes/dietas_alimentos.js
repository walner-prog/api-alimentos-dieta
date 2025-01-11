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

// Esquema de validación para los datos de los alimentos en la dieta
const dietaAlimentoSchema = Joi.object({
    dieta_id: Joi.number().required(),
    alimento_id: Joi.number().required(),
    cantidad: Joi.number().required(),
});

// Ruta para obtener todos los alimentos relacionados con una dieta específica
router.get('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        // Obtener los alimentos relacionados con la dieta
        const [alimentos] = await db.query(
            `SELECT a.id, a.nombre, a.descripcion, a.calorias, a.categoria_id, a.tipo_id, a.proteinas, a.carbohidratos,
                    a.grasas, a.fibra, a.azucar, a.colesterol, a.vitamina_a, a.vitamina_c, a.vitamina_d, 
                    a.hierro, a.calcio, a.magnesio, a.potasio, a.zinc, a.indice_glucemico, a.densidad_nutricional, 
                    a.porcion, a.alergias, a.origen, da.cantidad
             FROM dieta_alimentos da
             INNER JOIN alimentos a ON da.alimento_id = a.id
             WHERE da.dieta_id = ?`,
            [id]
        );

        if (alimentos.length === 0) {
            return res.status(404).json({ message: 'No se encontraron alimentos para esta dieta' });
        }

        // Devolver los alimentos relacionados
        res.json({ alimentos });
    } catch (err) {
        res.status(500).json({ message: 'Error al obtener los alimentos relacionados', error: err.message });
    }
});

// Ruta para agregar un nuevo alimento a la dieta
router.post('/', async (req, res) => {
    const { error } = dietaAlimentoSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const { dieta_id, alimento_id, cantidad } = req.body;

    try {
        // Verificar si la dieta existe
        const [dieta] = await db.query('SELECT * FROM dietas WHERE id = ?', [dieta_id]);
        if (dieta.length === 0) {
            return res.status(404).json({ message: 'Dieta no encontrada' });
        }

        // Verificar si el alimento existe
        const [alimento] = await db.query('SELECT * FROM alimentos WHERE id = ?', [alimento_id]);
        if (alimento.length === 0) {
            return res.status(404).json({ message: 'Alimento no encontrado' });
        }

        // Insertar el alimento en la dieta
        const [result] = await db.query(
            'INSERT INTO dieta_alimentos (dieta_id, alimento_id, cantidad) VALUES (?, ?, ?)',
            [dieta_id, alimento_id, cantidad]
        );

        res.status(201).json({
            id: result.insertId,
            dieta_id,
            alimento_id,
            cantidad,
        });
    } catch (err) {
        res.status(500).json({ message: 'Error al agregar el alimento a la dieta', error: err.message });
    }
});

// Ruta para actualizar la cantidad de un alimento en la dieta
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { error } = dietaAlimentoSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const { dieta_id, alimento_id, cantidad } = req.body;

    try {
        // Verificar si el alimento existe en la dieta
        const [existing] = await db.query(
            'SELECT * FROM dieta_alimentos WHERE dieta_id = ? AND alimento_id = ?',
            [dieta_id, alimento_id]
        );

        if (existing.length === 0) {
            return res.status(404).json({ message: 'Alimento no encontrado en esta dieta' });
        }

        // Actualizar la cantidad del alimento
        const [result] = await db.query(
            'UPDATE dieta_alimentos SET cantidad = ? WHERE dieta_id = ? AND alimento_id = ?',
            [cantidad, dieta_id, alimento_id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'No se pudo actualizar la cantidad del alimento' });
        }

        res.json({ message: 'Cantidad actualizada' });
    } catch (err) {
        res.status(500).json({ message: 'Error al actualizar la cantidad del alimento', error: err.message });
    }
});

// Ruta para eliminar un alimento de la tabla dieta_alimentos 
router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        // Eliminar el alimento de la dieta
        const [result] = await db.query('DELETE FROM dieta_alimentos WHERE id = ?', [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Alimento no encontrado en la dieta' });
        }

        res.json({ message: 'Alimento eliminado de la dieta' });
    } catch (err) {
        res.status(500).json({ message: 'Error al eliminar el alimento de la dieta', error: err.message });
    }
});


// Ruta para eliminar un alimento de una dieta específica
router.delete('/:dieta_id/:alimento_id', async (req, res) => {
    const { dieta_id, alimento_id } = req.params;

    try {
        // Eliminar el alimento de la dieta usando los IDs de dieta y alimento
        const [result] = await db.query(
            'DELETE FROM dieta_alimentos WHERE dieta_id = ? AND alimento_id = ?',
            [dieta_id, alimento_id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Alimento no encontrado en esta dieta' });
        }

        res.json({ message: 'Alimento eliminado de la dieta' });
    } catch (err) {
        res.status(500).json({ message: 'Error al eliminar el alimento de la dieta', error: err.message });
    }
});



// Ruta para obtener una dieta con sus alimentos relacionados
router.get('/rel/alimentos/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const [dietas] = await db.query('SELECT * FROM dietas WHERE id = ?', [id]);

        if (dietas.length === 0) {
            return res.status(404).json({ message: 'Dieta no encontrada' });
        }

        const [alimentos] = await db.query(
            `SELECT 
                a.id, 
                a.nombre, 
                a.descripcion, 
                a.calorias, 
                a.categoria_id, 
                a.tipo_id, 
                a.proteinas, 
                a.carbohidratos, 
                a.grasas, 
                a.fibra, 
                a.azucar, 
                a.colesterol, 
                a.vitamina_a, 
                a.vitamina_c, 
                a.vitamina_d, 
                a.hierro, 
                a.calcio, 
                a.magnesio, 
                a.potasio, 
                a.zinc, 
                a.indice_glucemico, 
                a.densidad_nutricional, 
                a.porcion, 
                a.alergias, 
                a.origen, 
                a.created_at, 
                a.updated_at, 
                da.cantidad
             FROM dieta_alimentos da
             INNER JOIN alimentos a ON da.alimento_id = a.id
             WHERE da.dieta_id = ?`,
            [id]
        );
        

        const dieta = { ...dietas[0], alimentos };
        res.json(dieta);
    } catch (err) {
        res.status(500).json({ message: 'Error al obtener la dieta', error: err.message });
    }
});

export default router;
