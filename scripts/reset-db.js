const fs = require('fs');
const database = require('../src/config/database');

if (fs.existsSync(database.dbPath)) {
  fs.unlinkSync(database.dbPath);
  console.log('Base de datos anterior eliminada.');
}

require('./init-db');
