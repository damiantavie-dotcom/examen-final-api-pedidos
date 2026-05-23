const database = require('../src/config/database');

async function iniciarBaseDeDatos() {
  try {
    await database.initializeDatabase();

    const totalClientes = database.get('SELECT COUNT(*) AS total FROM clientes');

    if (totalClientes.total === 0) {
      database.run(
        'INSERT INTO clientes (nombre, email, telefono) VALUES (?, ?, ?)',
        ['Juan Perez', 'juan.perez@example.com', '+56911111111']
      );
      database.run(
        'INSERT INTO clientes (nombre, email, telefono) VALUES (?, ?, ?)',
        ['Maria Gonzalez', 'maria.gonzalez@example.com', '+56922222222']
      );
      database.run(
        'INSERT INTO clientes (nombre, email, telefono) VALUES (?, ?, ?)',
        ['Carlos Soto', 'carlos.soto@example.com', '+56933333333']
      );
    }

    const totalPedidos = database.get('SELECT COUNT(*) AS total FROM pedidos');

    if (totalPedidos.total === 0) {
      const cliente1 = database.get('SELECT * FROM clientes WHERE email = ?', ['juan.perez@example.com']);
      const cliente2 = database.get('SELECT * FROM clientes WHERE email = ?', ['maria.gonzalez@example.com']);

      database.run(
        `INSERT INTO pedidos (id_cliente, cliente, email_cliente, total, estado)
         VALUES (?, ?, ?, ?, ?)`,
        [cliente1.id_cliente, cliente1.nombre, cliente1.email, 25990, 'pendiente']
      );

      database.run(
        `INSERT INTO pedidos (id_cliente, cliente, email_cliente, total, estado)
         VALUES (?, ?, ?, ?, ?)`,
        [cliente2.id_cliente, cliente2.nombre, cliente2.email, 49990, 'pagado']
      );
    }

    console.log('Base de datos inicializada correctamente.');
    console.log(`Archivo SQLite: ${database.dbPath}`);
    database.closeDatabase();
    process.exit(0);
  } catch (error) {
    console.error('Error al inicializar la base de datos:', error.message);
    process.exit(1);
  }
}

iniciarBaseDeDatos();
