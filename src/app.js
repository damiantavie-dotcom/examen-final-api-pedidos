const express = require('express');
const cors = require('cors');
const clientesRoutes = require('./routes/clientes.routes');
const pedidosRoutes = require('./routes/pedidos.routes');
const notFound = require('./middlewares/notFound');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.status(200).json({
    ok: true,
    mensaje: 'API REST Examen Final - Clientes y Pedidos',
    version: '2.0.0',
    endpoints: {
      health: '/health',
      clientes: '/api/clientes',
      pedidos: '/api/pedidos',
    },
  });
});

app.get('/health', (req, res) => {
  res.status(200).json({ ok: true, status: 'UP', timestamp: new Date().toISOString() });
});

app.use('/api/clientes', clientesRoutes);
app.use('/api/pedidos', pedidosRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
