const fs = require('fs');
const path = require('path');
const initSqlJs = require('sql.js');
require('dotenv').config();

const dbFile = process.env.DB_FILE || './database/pedidos.sqlite';
const dbPath = path.resolve(process.cwd(), dbFile);
const dbFolder = path.dirname(dbPath);
const schemaPath = path.resolve(process.cwd(), './database/schema.sql');

let SQL = null;
let db = null;
let initialized = false;

function ensureFolder() {
  if (!fs.existsSync(dbFolder)) {
    fs.mkdirSync(dbFolder, { recursive: true });
  }
}

function saveDatabase() {
  if (!db) {
    throw new Error('La base de datos no fue inicializada.');
  }
  ensureFolder();
  const data = db.export();
  fs.writeFileSync(dbPath, Buffer.from(data));
}

function ensureInitialized() {
  if (!initialized || !db) {
    throw new Error('La base de datos no fue inicializada. Ejecuta initializeDatabase() antes de usarla.');
  }
}

async function initializeDatabase() {
  if (initialized) return;

  ensureFolder();
  SQL = await initSqlJs();

  if (fs.existsSync(dbPath)) {
    const fileBuffer = fs.readFileSync(dbPath);
    db = new SQL.Database(fileBuffer);
  } else {
    db = new SQL.Database();
  }

  db.run('PRAGMA foreign_keys = ON;');

  const schema = fs.readFileSync(schemaPath, 'utf8');
  db.run(schema);
  saveDatabase();

  initialized = true;
  console.log(`Base de datos SQLite conectada en: ${dbPath}`);
}

function normalizeParams(params = []) {
  if (Array.isArray(params)) return params;
  return [params];
}

function run(sql, params = []) {
  ensureInitialized();
  db.run(sql, normalizeParams(params));

  const idRow = get('SELECT last_insert_rowid() AS id');
  const changesRow = get('SELECT changes() AS changes');
  saveDatabase();

  return { id: idRow ? idRow.id : null, changes: changesRow ? changesRow.changes : 0 };
}

function get(sql, params = []) {
  ensureInitialized();
  const stmt = db.prepare(sql);
  try {
    stmt.bind(normalizeParams(params));
    if (stmt.step()) {
      return stmt.getAsObject();
    }
    return undefined;
  } finally {
    stmt.free();
  }
}

function all(sql, params = []) {
  ensureInitialized();
  const stmt = db.prepare(sql);
  const rows = [];
  try {
    stmt.bind(normalizeParams(params));
    while (stmt.step()) {
      rows.push(stmt.getAsObject());
    }
    return rows;
  } finally {
    stmt.free();
  }
}

function exec(sql) {
  ensureInitialized();
  db.run(sql);
  saveDatabase();
}

function closeDatabase() {
  if (db) {
    saveDatabase();
    db.close();
  }
  db = null;
  initialized = false;
}

module.exports = {
  initializeDatabase,
  closeDatabase,
  run,
  get,
  all,
  exec,
  dbPath,
};
