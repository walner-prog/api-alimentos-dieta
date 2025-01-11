import {
    getAllCategorias,
    getCategoriaById,
    getAlimentosByCategoriaId,
    createCategoria,
    updateCategoria,
    deleteCategoria,
    checkCategoriaExistsByName,
    checkCategoriaExistsByNameExceptId,
} from '../models/categoriaModel.js';

import Joi from 'joi';

const categoriaSchema = Joi.object({
    nombre: Joi.string().required(),
    descripcion: Joi.string().optional(),
});

export const obtenerCategorias = async (req, res) => {
    try {
        const [rows] = await getAllCategorias();
        res.json(rows);
    } catch (err) {
        res.status(500).json({ message: 'Error al obtener las categorías', error: err.message });
    }
};

export const obtenerCategoriaPorId = async (req, res) => {
    const { id } = req.params;

    try {
        const [category] = await getCategoriaById(id);

        if (category.length === 0) {
            return res.status(404).json({ message: 'Categoría no encontrada' });
        }

        const [alimentos] = await getAlimentosByCategoriaId(id);

        res.json({ ...category[0], alimentos });
    } catch (err) {
        res.status(500).json({ message: 'Error al obtener la categoría y los alimentos', error: err.message });
    }
};

export const crearCategoria = async (req, res) => {
    const { error } = categoriaSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const { nombre, descripcion } = req.body;

    try {
        const [existingCategory] = await checkCategoriaExistsByName(nombre);

        if (existingCategory.length > 0) {
            return res.status(400).json({ message: 'Ya existe una categoría con ese nombre' });
        }

        const [result] = await createCategoria({ nombre, descripcion });
        res.status(201).json({ id: result.insertId, nombre, descripcion });
    } catch (err) {
        res.status(500).json({ message: 'Error al agregar la categoría', error: err.message });
    }
};

export const actualizarCategoria = async (req, res) => {
    const { id } = req.params;
    const { error } = categoriaSchema.validate(req.body);

    if (error) return res.status(400).json({ message: error.details[0].message });

    const { nombre, descripcion } = req.body;

    try {
        const [existingCategory] = await checkCategoriaExistsByNameExceptId(nombre, id);

        if (existingCategory.length > 0) {
            return res.status(400).json({ message: 'Ya existe una categoría con ese nombre' });
        }

        const [result] = await updateCategoria(id, { nombre, descripcion });

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Categoría no encontrada' });
        }

        res.json({ message: 'Categoría actualizada correctamente' });
    } catch (err) {
        res.status(500).json({ message: 'Error al actualizar la categoría', error: err.message });
    }
};

export const eliminarCategoria = async (req, res) => {
    const { id } = req.params;

    try {
        const [result] = await deleteCategoria(id);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Categoría no encontrada' });
        }

        res.json({ message: 'Categoría eliminada' });
    } catch (err) {
        res.status(500).json({ message: 'Error al eliminar la categoría', error: err.message });
    }
};
