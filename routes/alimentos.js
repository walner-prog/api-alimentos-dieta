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

// Esquema de validación para los datos del alimento
const alimentoSchema = Joi.object({
    nombre: Joi.string().required().messages({
        'string.base': 'El nombre debe ser un texto.',
        'any.required': 'El nombre es obligatorio.'
    }),
    descripcion: Joi.string().optional().messages({
        'string.base': 'La descripción debe ser un texto.'
    }),
    categoria_id: Joi.number().integer().required().messages({
        'number.base': 'El ID de categoría debe ser un número.',
        'number.integer': 'El ID de categoría debe ser un número entero.',
        'any.required': 'El ID de categoría es obligatorio.'
    }),
    tipo_id: Joi.number().integer().required().messages({
        'number.base': 'El ID de tipo debe ser un número.',
        'number.integer': 'El ID de tipo debe ser un número entero.',
        'any.required': 'El ID de tipo es obligatorio.'
    }),
    calorias: Joi.number().optional().messages({
        'number.base': 'Las calorías deben ser un número.'
    }),
    proteinas: Joi.number().optional().messages({
        'number.base': 'Las proteínas deben ser un número.'
    }),
    carbohidratos: Joi.number().optional().messages({
        'number.base': 'Los carbohidratos deben ser un número.'
    }),
    grasas: Joi.number().optional().messages({
        'number.base': 'Las grasas deben ser un número.'
    }),
    fibra: Joi.number().optional().messages({
        'number.base': 'La fibra debe ser un número.'
    }),
    azucar: Joi.number().optional().messages({
        'number.base': 'El azúcar debe ser un número.'
    }),
    colesterol: Joi.number().optional().messages({
        'number.base': 'El colesterol debe ser un número.'
    }),
    vitamina_a: Joi.number().optional().messages({
        'number.base': 'La vitamina A debe ser un número.'
    }),
    vitamina_c: Joi.number().optional().messages({
        'number.base': 'La vitamina C debe ser un número.'
    }),
    vitamina_d: Joi.number().optional().messages({
        'number.base': 'La vitamina D debe ser un número.'
    }),
    hierro: Joi.number().optional().messages({
        'number.base': 'El hierro debe ser un número.'
    }),
    calcio: Joi.number().optional().messages({
        'number.base': 'El calcio debe ser un número.'
    }),
    magnesio: Joi.number().optional().messages({
        'number.base': 'El magnesio debe ser un número.'
    }),
    potasio: Joi.number().optional().messages({
        'number.base': 'El potasio debe ser un número.'
    }),
    zinc: Joi.number().optional().messages({
        'number.base': 'El zinc debe ser un número.'
    }),
    indice_glucemico: Joi.number().min(0).max(100).optional().messages({
        'number.base': 'El índice glucémico debe ser un número.',
        'number.min': 'El índice glucémico no puede ser menor que 0.',
        'number.max': 'El índice glucémico no puede ser mayor que 100.'
    }),
    densidad_nutricional: Joi.number().min(0).max(100).optional().messages({
        'number.base': 'La densidad nutricional debe ser un número.',
        'number.min': 'La densidad nutricional no puede ser menor que 0.',
        'number.max': 'La densidad nutricional no puede ser mayor que 100.'
    }),
    porcion: Joi.string().max(255).optional().messages({
        'string.base': 'La porción debe ser un texto.',
        'string.max': 'La porción no debe exceder los 255 caracteres.'
    }),
    alergias: Joi.string().max(255).optional().messages({
        'string.base': 'Las alergias deben ser un texto.',
        'string.max': 'Las alergias no deben exceder los 255 caracteres.'
    }),
    origen: Joi.string().max(255).optional().messages({
        'string.base': 'El origen debe ser un texto.',
        'string.max': 'El origen no debe exceder los 255 caracteres.'
    })
});



router.get('/', async (req, res) => {
    const { categoria_id, tipo_id, min_calorias, max_calorias } = req.query;

    let query = `
        SELECT 
            id, 
            nombre, 
            descripcion, 
            calorias, 
            categoria_id, 
            tipo_id, 
            created_at, 
            updated_at, 
            proteinas, 
            carbohidratos, 
            grasas, 
            fibra, 
            azucar, 
            colesterol, 
            vitamina_a, 
            vitamina_c, 
            vitamina_d, 
            hierro, 
            calcio, 
            magnesio, 
            potasio, 
            zinc, 
            indice_glucemico, 
            densidad_nutricional, 
            porcion, 
            alergias, 
            origen 
        FROM alimentos 
        WHERE 1=1
    `; // "1=1" es una forma de que sea siempre verdadero y no afecte el resto

    const params = [];

    if (categoria_id) {
        query += ' AND categoria_id = ?';
        params.push(categoria_id);
    }

    if (tipo_id) {
        query += ' AND tipo_id = ?';
        params.push(tipo_id);
    }

    if (min_calorias) {
        query += ' AND calorias >= ?';
        params.push(min_calorias);
    }

    if (max_calorias) {
        query += ' AND calorias <= ?';
        params.push(max_calorias);
    }

    // Imprimir los valores de los parámetros para depuración
  //  console.log('Consulta SQL:', query);
   // console.log('Parámetros:', params);

    try {
        const [rows] = await db.query(query, params);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ message: 'Error al obtener los alimentos', error: err.message });
    }
});







router.post('/', async (req, res) => {
    const { error } = alimentoSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const {
        nombre,
        descripcion,
        calorias,
        categoria_id,
        tipo_id,
        proteinas,
        carbohidratos,
        grasas,
        fibra,
        azucar,
        colesterol,
        vitamina_a,
        vitamina_c,
        vitamina_d,
        hierro,
        calcio,
        magnesio,
        potasio,
        zinc,
        indice_glucemico,
        densidad_nutricional,
        porcion,
        alergias,
        origen
    } = req.body;

    try {
        const [result] = await db.query(
            `INSERT INTO alimentos (
                nombre, descripcion, calorias, categoria_id, tipo_id,  proteinas, carbohidratos, grasas,
                fibra, azucar, colesterol, vitamina_a, vitamina_c, vitamina_d, hierro, calcio, magnesio,
                potasio, zinc, indice_glucemico, densidad_nutricional, porcion, alergias, origen
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                nombre, descripcion, calorias, categoria_id, tipo_id,  proteinas, carbohidratos, grasas,
                fibra, azucar, colesterol, vitamina_a, vitamina_c, vitamina_d, hierro, calcio, magnesio,
                potasio, zinc, indice_glucemico, densidad_nutricional, porcion, alergias, origen
            ]
        );
        res.status(201).json({ id: result.insertId, ...req.body });
    } catch (err) {
        res.status(500).json({ message: 'Error al agregar el alimento', error: err.message });
    }
});



// Ruta para actualizar un alimento
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { error } = alimentoSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const {
        nombre,
        descripcion,
        calorias,
        categoria_id,
        tipo_id,
        proteinas,
        carbohidratos,
        grasas,
        fibra,
        azucar,
        colesterol,
        vitamina_a,
        vitamina_c,
        vitamina_d,
        hierro,
        calcio,
        magnesio,
        potasio,
        zinc,
        indice_glucemico,
        densidad_nutricional,
        porcion,
        alergias,
        origen
    } = req.body;

    try {
        const [result] = await db.query(
            `UPDATE alimentos SET
                nombre = ?, descripcion = ?, calorias = ?, categoria_id = ?, tipo_id = ?, proteinas = ?, carbohidratos = ?, grasas = ?,
                fibra = ?, azucar = ?, colesterol = ?, vitamina_a = ?, vitamina_c = ?, vitamina_d = ?, hierro = ?, calcio = ?, magnesio = ?,
                potasio = ?, zinc = ?, indice_glucemico = ?, densidad_nutricional = ?, porcion = ?, alergias = ?, origen = ?
            WHERE id = ?`,
            [
                nombre, descripcion, calorias, categoria_id, tipo_id, proteinas, carbohidratos, grasas,
                fibra, azucar, colesterol, vitamina_a, vitamina_c, vitamina_d, hierro, calcio, magnesio,
                potasio, zinc, indice_glucemico, densidad_nutricional, porcion, alergias, origen,
                id // ID del alimento a actualizar
            ]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Alimento no encontrado' });
        }

        res.status(200).json({ message: 'Alimento actualizado con éxito' });
    } catch (err) {
        res.status(500).json({ message: 'Error al actualizar el alimento', error: err.message });
    }
});


            
   // Ruta para actualizar parcialmente un alimento
router.patch('/:id', async (req, res) => {
    const { id } = req.params;
    const {
        nombre, descripcion, calorias, proteinas, carbohidratos, grasas, categoria_id, tipo_id,
        fibra, azucar, colesterol, vitamina_a, vitamina_c, vitamina_d, hierro, calcio, magnesio,
        potasio, zinc, indice_glucemico, densidad_nutricional, porcion, alergias, origen
    } = req.body;

    // Comprobamos qué campos fueron proporcionados
    const fieldsToUpdate = [];
    const values = [];

    if (nombre) {
        fieldsToUpdate.push('nombre = ?');
        values.push(nombre);
    }

    if (descripcion) {
        fieldsToUpdate.push('descripcion = ?');
        values.push(descripcion);
    }

    if (calorias) {
        fieldsToUpdate.push('calorias = ?');
        values.push(calorias);
    }

    if (proteinas) {
        fieldsToUpdate.push('proteinas = ?');
        values.push(proteinas);
    }

    if (carbohidratos) {
        fieldsToUpdate.push('carbohidratos = ?');
        values.push(carbohidratos);
    }

    if (grasas) {
        fieldsToUpdate.push('grasas = ?');
        values.push(grasas);
    }

    if (categoria_id) {
        fieldsToUpdate.push('categoria_id = ?');
        values.push(categoria_id);
    }

    if (tipo_id) {
        fieldsToUpdate.push('tipo_id = ?');
        values.push(tipo_id);
    }

    if (fibra) {
        fieldsToUpdate.push('fibra = ?');
        values.push(fibra);
    }

    if (azucar) {
        fieldsToUpdate.push('azucar = ?');
        values.push(azucar);
    }

    if (colesterol) {
        fieldsToUpdate.push('colesterol = ?');
        values.push(colesterol);
    }

    if (vitamina_a) {
        fieldsToUpdate.push('vitamina_a = ?');
        values.push(vitamina_a);
    }

    if (vitamina_c) {
        fieldsToUpdate.push('vitamina_c = ?');
        values.push(vitamina_c);
    }

    if (vitamina_d) {
        fieldsToUpdate.push('vitamina_d = ?');
        values.push(vitamina_d);
    }

    if (hierro) {
        fieldsToUpdate.push('hierro = ?');
        values.push(hierro);
    }

    if (calcio) {
        fieldsToUpdate.push('calcio = ?');
        values.push(calcio);
    }

    if (magnesio) {
        fieldsToUpdate.push('magnesio = ?');
        values.push(magnesio);
    }

    if (potasio) {
        fieldsToUpdate.push('potasio = ?');
        values.push(potasio);
    }

    if (zinc) {
        fieldsToUpdate.push('zinc = ?');
        values.push(zinc);
    }

    if (indice_glucemico) {
        fieldsToUpdate.push('indice_glucemico = ?');
        values.push(indice_glucemico);
    }

    if (densidad_nutricional) {
        fieldsToUpdate.push('densidad_nutricional = ?');
        values.push(densidad_nutricional);
    }

    if (porcion) {
        fieldsToUpdate.push('porcion = ?');
        values.push(porcion);
    }

    if (alergias) {
        fieldsToUpdate.push('alergias = ?');
        values.push(alergias);
    }

    if (origen) {
        fieldsToUpdate.push('origen = ?');
        values.push(origen);
    }

    // Si no hay campos para actualizar, retornamos un error
    if (fieldsToUpdate.length === 0) {
        return res.status(400).json({ message: 'No se proporcionaron datos para actualizar' });
    }

    // Agregamos el id a los valores y ejecutamos la consulta
    values.push(id);
    const query = `
        UPDATE alimentos
        SET ${fieldsToUpdate.join(', ')}
        WHERE id = ?
    `;

    try {
        const [result] = await db.query(query, values);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Alimento no encontrado' });
        }
        res.json({ message: 'Alimento actualizado correctamente' });
    } catch (err) {
        console.error(err); // Agregamos una salida de error en consola para depuración
        res.status(500).json({ message: 'Error al actualizar el alimento', error: err.message });
    }
});



      // Ruta para eliminar un alimento
   router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const [result] = await db.query('DELETE FROM alimentos WHERE id = ?', [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Alimento no encontrado' });
        }
        res.json({ message: 'Alimento eliminado' });
    } catch (err) {
        res.status(500).json({ message: 'Error al eliminar el alimento', error: err.message });
    }
});

// Ruta para obtener un alimento específico
router.get('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        // Consulta SQL para obtener el alimento y los datos de la categoría y tipo
        const query = `
            SELECT 
                a.nombre, a.descripcion, a.calorias, a.proteinas, a.carbohidratos, a.grasas, 
                a.fibra, a.azucar, a.colesterol, a.vitamina_a, a.vitamina_c, a.vitamina_d, 
                a.hierro, a.calcio, a.magnesio, a.potasio, a.zinc, a.indice_glucemico, 
                a.densidad_nutricional, a.porcion, a.alergias, a.origen,
                c.nombre AS categoria_nombre, c.descripcion AS categoria_descripcion,
                t.nombre AS tipo_nombre, t.descripcion AS tipo_descripcion
            FROM alimentos a
            LEFT JOIN categorias c ON a.categoria_id = c.id
            LEFT JOIN tipos t ON a.tipo_id = t.id
            WHERE a.id = ?
        `;

        // Ejecutamos la consulta
        const [result] = await db.query(query, [id]);

        // Si no se encuentra el alimento, retornamos un error 404
        if (result.length === 0) {
            return res.status(404).json({ message: 'Alimento no encontrado' });
        }

        // Devolvemos los detalles del alimento junto con la información de la categoría y tipo
        res.json(result[0]);
    } catch (err) {
        console.error(err); // Registra el error en consola
        res.status(500).json({ message: 'Error al obtener el alimento', error: err.message });
    }
});


export default router;
