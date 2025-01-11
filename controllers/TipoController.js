import Joi from 'joi';
import TipoModel from '../models/TipoModel.js';

// Esquema de validación para los datos del tipo
const tipoSchema = Joi.object({
    nombre: Joi.string().required(),
    descripcion: Joi.string().optional(),
});

const TipoController = {
    // Obtener todos los tipos
    getAll: async (req, res) => {
        try {
            const tipos = await TipoModel.getAll();
            res.json(tipos);
        } catch (err) {
            res.status(500).json({ message: 'Error al obtener los tipos', error: err.message });
        }
    },

    // Obtener un tipo y sus alimentos
    getById: async (req, res) => {
        const { id } = req.params;
        try {
            const tipo = await TipoModel.getById(id);
            if (!tipo) return res.status(404).json({ message: 'Tipo no encontrado' });

            const alimentos = await TipoModel.getAlimentosByTipoId(id);
            res.json({ tipo, alimentos });
        } catch (err) {
            res.status(500).json({ message: 'Error al obtener el tipo y los alimentos', error: err.message });
        }
    },

    // Crear un nuevo tipo
    create: async (req, res) => {
        const { error } = tipoSchema.validate(req.body);
        if (error) return res.status(400).json({ message: error.details[0].message });

        const { nombre, descripcion } = req.body;

        try {
            if (await TipoModel.existsByName(nombre)) {
                return res.status(400).json({ message: 'El tipo con este nombre ya existe' });
            }

            const id = await TipoModel.create(nombre, descripcion);
            res.status(201).json({ id, nombre, descripcion });
        } catch (err) {
            res.status(500).json({ message: 'Error al crear el tipo', error: err.message });
        }
    },

    // Actualizar un tipo
    update: async (req, res) => {
        const { id } = req.params;
        const { error } = tipoSchema.validate(req.body);
        if (error) return res.status(400).json({ message: error.details[0].message });

        const { nombre, descripcion } = req.body;

        try {
            const updatedRows = await TipoModel.update(id, nombre, descripcion);
            if (updatedRows === 0) {
                return res.status(404).json({ message: 'Tipo no encontrado' });
            }
            res.json({ message: 'Tipo actualizado' });
        } catch (err) {
            res.status(500).json({ message: 'Error al actualizar el tipo', error: err.message });
        }
    },

    // Eliminar un tipo
    delete: async (req, res) => {
        const { id } = req.params;

        try {
            const deletedRows = await TipoModel.delete(id);
            if (deletedRows === 0) {
                return res.status(404).json({ message: 'Tipo no encontrado' });
            }
            res.json({ message: 'Tipo eliminado' });
        } catch (err) {
            res.status(500).json({ message: 'Error al eliminar el tipo', error: err.message });
        }
    }
};

export default TipoController;
