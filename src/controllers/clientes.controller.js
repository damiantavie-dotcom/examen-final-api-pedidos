const database = require('../config/database');
const {
  isPositiveInteger,
  toPositiveInteger,
  isValidEmail,
  normalizeText,
  normalizeEmail,
} = require('../utils/validators');

function validateIdParam(id) {
  return isPositiveInteger(id) ? toPositiveInteger(id) : null;
}

async function listarClientes(req, res, next) {
  try {
    const clientes = database.all(`
      SELECT
        c.id_cliente,
        c.nombre,
        c.email,
        c.telefono,
        c.created_at,
        c.updated_at,
        COUNT(p.id_pedido) AS total_pedidos
      FROM clientes c
      LEFT JOIN pedidos p ON p.id_cliente = c.id_cliente
      GROUP BY c.id_cliente
      ORDER BY c.id_cliente DESC
    `);

    res.status(200).json({ ok: true, data: clientes });
  } catch (error) {
    next(error);
  }
}

async function obtenerClientePorId(req, res, next) {
  try {
    const id = validateIdParam(req.params.id);
    if (!id) {
      return res.status(400).json({ ok: false, mensaje: 'El id del cliente debe ser un numero entero positivo' });
    }

    const cliente = database.get(
      'SELECT id_cliente, nombre, email, telefono, created_at, updated_at FROM clientes WHERE id_cliente = ?',
      [id]
    );

    if (!cliente) {
      return res.status(404).json({ ok: false, mensaje: 'Cliente no encontrado' });
    }

    res.status(200).json({ ok: true, data: cliente });
  } catch (error) {
    next(error);
  }
}

async function listarPedidosDeCliente(req, res, next) {
  try {
    const id = validateIdParam(req.params.id);
    if (!id) {
      return res.status(400).json({ ok: false, mensaje: 'El id del cliente debe ser un numero entero positivo' });
    }

    const cliente = database.get('SELECT * FROM clientes WHERE id_cliente = ?', [id]);
    if (!cliente) {
      return res.status(404).json({ ok: false, mensaje: 'Cliente no encontrado' });
    }

    const pedidos = database.all(
      'SELECT * FROM pedidos WHERE id_cliente = ? ORDER BY id_pedido DESC',
      [id]
    );

    res.status(200).json({ ok: true, cliente, data: pedidos });
  } catch (error) {
    next(error);
  }
}

async function crearCliente(req, res, next) {
  try {
    const nombre = normalizeText(req.body.nombre);
    const email = req.body.email ? normalizeEmail(req.body.email) : '';
    const telefono = normalizeText(req.body.telefono) || null;

    if (!nombre || !email) {
      return res.status(400).json({ ok: false, mensaje: 'Los campos nombre y email son obligatorios' });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({ ok: false, mensaje: 'El email ingresado no tiene un formato valido' });
    }

    const resultado = database.run(
      'INSERT INTO clientes (nombre, email, telefono) VALUES (?, ?, ?)',
      [nombre, email, telefono]
    );

    const nuevoCliente = database.get(
      'SELECT id_cliente, nombre, email, telefono, created_at, updated_at FROM clientes WHERE id_cliente = ?',
      [resultado.id]
    );

    res.status(201).json({ ok: true, mensaje: 'Cliente creado correctamente', data: nuevoCliente });
  } catch (error) {
    if (error.message.includes('UNIQUE constraint failed')) {
      return res.status(409).json({ ok: false, mensaje: 'Ya existe un cliente registrado con ese email' });
    }
    next(error);
  }
}

async function actualizarCliente(req, res, next) {
  try {
    const id = validateIdParam(req.params.id);
    if (!id) {
      return res.status(400).json({ ok: false, mensaje: 'El id del cliente debe ser un numero entero positivo' });
    }

    const clienteActual = database.get('SELECT * FROM clientes WHERE id_cliente = ?', [id]);
    if (!clienteActual) {
      return res.status(404).json({ ok: false, mensaje: 'Cliente no encontrado' });
    }

    const nuevoNombre = req.body.nombre !== undefined ? normalizeText(req.body.nombre) : clienteActual.nombre;
    const nuevoEmail = req.body.email !== undefined ? normalizeEmail(req.body.email) : clienteActual.email;
    const nuevoTelefono = req.body.telefono !== undefined ? normalizeText(req.body.telefono) || null : clienteActual.telefono;

    if (!nuevoNombre || !nuevoEmail) {
      return res.status(400).json({ ok: false, mensaje: 'Los campos nombre y email no pueden quedar vacios' });
    }

    if (!isValidEmail(nuevoEmail)) {
      return res.status(400).json({ ok: false, mensaje: 'El email ingresado no tiene un formato valido' });
    }

    database.run(
      'UPDATE clientes SET nombre = ?, email = ?, telefono = ?, updated_at = CURRENT_TIMESTAMP WHERE id_cliente = ?',
      [nuevoNombre, nuevoEmail, nuevoTelefono, id]
    );

    // Mantiene coherencia con los datos copiados en pedidos.
    database.run(
      'UPDATE pedidos SET cliente = ?, email_cliente = ?, updated_at = CURRENT_TIMESTAMP WHERE id_cliente = ?',
      [nuevoNombre, nuevoEmail, id]
    );

    const clienteActualizado = database.get(
      'SELECT id_cliente, nombre, email, telefono, created_at, updated_at FROM clientes WHERE id_cliente = ?',
      [id]
    );

    res.status(200).json({ ok: true, mensaje: 'Cliente actualizado correctamente', data: clienteActualizado });
  } catch (error) {
    if (error.message.includes('UNIQUE constraint failed')) {
      return res.status(409).json({ ok: false, mensaje: 'Ya existe un cliente registrado con ese email' });
    }
    next(error);
  }
}

async function eliminarCliente(req, res, next) {
  try {
    const id = validateIdParam(req.params.id);
    if (!id) {
      return res.status(400).json({ ok: false, mensaje: 'El id del cliente debe ser un numero entero positivo' });
    }

    const cliente = database.get('SELECT * FROM clientes WHERE id_cliente = ?', [id]);
    if (!cliente) {
      return res.status(404).json({ ok: false, mensaje: 'Cliente no encontrado' });
    }

    const pedidosAsociados = database.get('SELECT COUNT(*) AS total FROM pedidos WHERE id_cliente = ?', [id]);
    if (pedidosAsociados.total > 0) {
      return res.status(409).json({
        ok: false,
        mensaje: 'No se puede eliminar el cliente porque tiene pedidos asociados. Elimina primero sus pedidos.',
      });
    }

    database.run('DELETE FROM clientes WHERE id_cliente = ?', [id]);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}

module.exports = {
  listarClientes,
  obtenerClientePorId,
  listarPedidosDeCliente,
  crearCliente,
  actualizarCliente,
  eliminarCliente,
};
