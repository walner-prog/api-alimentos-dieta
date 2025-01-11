import db from '../config/db.js'; // Archivo donde configuras el pool de MySQL

export const getAllCategorias = async () => {
    return await db.query('SELECT * FROM categorias');
};

export const getCategoriaById = async (id) => {
    return await db.query('SELECT * FROM categorias WHERE id = ?', [id]);
};

export const getAlimentosByCategoriaId = async (categoriaId) => {
    return await db.query('SELECT * FROM alimentos WHERE categoria_id = ?', [categoriaId]);
};

export const createCategoria = async ({ nombre, descripcion }) => {
    return await db.query('INSERT INTO categorias (nombre, descripcion) VALUES (?, ?)', [nombre, descripcion]);
};

export const updateCategoria = async (id, { nombre, descripcion }) => {
    return await db.query('UPDATE categorias SET nombre = ?, descripcion = ? WHERE id = ?', [nombre, descripcion, id]);
};

export const deleteCategoria = async (id) => {
    return await db.query('DELETE FROM categorias WHERE id = ?', [id]);
};

export const checkCategoriaExistsByName = async (nombre) => {
    return await db.query('SELECT * FROM categorias WHERE nombre = ?', [nombre]);
};

export const checkCategoriaExistsByNameExceptId = async (nombre, id) => {
    return await db.query('SELECT * FROM categorias WHERE nombre = ? AND id != ?', [nombre, id]);
};
