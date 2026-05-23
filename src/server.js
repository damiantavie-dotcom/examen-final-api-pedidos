require('dotenv').config();
const app = require('./app');
const { initializeDatabase } = require('./config/database');

const PORT = process.env.PORT || 3000;

async function main() {
  try {
    await initializeDatabase();

    app.listen(PORT, () => {
      console.log(`Servidor ejecutandose en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('No se pudo iniciar el servidor:', error.message);
    process.exit(1);
  }
}

main();
