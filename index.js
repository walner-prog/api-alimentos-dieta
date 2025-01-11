import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import librosRoutes from './routes/libros.js'; // Asegúrate de usar la extensión ".js"
import alimentosRoutes from './routes/alimentos.js';
import categoriasRoutes from './routes/categorias.js';
import tiposRoutes from './routes/tipos.js';
import dietasRoutes from './routes/dietas.js';
import dietaalimentosRoutes from './routes/dietas_alimentos.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

// Rutas
app.use('/api/libros', librosRoutes);
app.use('/api/alimentos', alimentosRoutes);
app.use('/api/categorias', categoriasRoutes);
app.use('/api/tipos', tiposRoutes);
app.use('/api/dietas', dietasRoutes);
app.use('/api/dieta_alimentos', dietaalimentosRoutes);
// Inicia el servidor
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
