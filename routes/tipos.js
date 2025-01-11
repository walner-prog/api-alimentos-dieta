import express from 'express';
import auth from '../middleware/auth.js';
import TipoController from '../controllers/TipoController.js';

const router = express.Router();

// Middleware de autenticación
router.use(auth);

// Rutas
router.get('/', TipoController.getAll);
router.get('/:id', TipoController.getById);
router.post('/', TipoController.create);
router.put('/:id', TipoController.update);
router.delete('/:id', TipoController.delete);

export default router;
