// Este archivo define y registra las rutas principales del sistema, agrupando rutas específicas para 
// libros, alimentos, categorías, tipos, dietas y la relación entre dietas y alimentos. 
// Utiliza Express Router para modularizar las rutas y facilitar su gestión.

import express from 'express';
import librosRoutes from './libros.js';
import alimentosRoutes from './alimentos.js';
import categoriasRoutes from './categorias.js';
import tiposRoutes from './tipos.js';
import dietasRoutes from './dietas.js';
import dietaalimentosRoutes from './dietas_alimentos.js';

const router = express.Router();

// Registrar rutas
router.use('/libros', librosRoutes);
router.use('/alimentos', alimentosRoutes);
router.use('/categorias', categoriasRoutes);
router.use('/tipos', tiposRoutes);
router.use('/dietas', dietasRoutes);
router.use('/dieta_alimentos', dietaalimentosRoutes);

export default router;
