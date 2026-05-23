const database = require('../config/database');
const {
  ESTADOS_VALIDOS,
  isPositiveInteger,
  toPositiveInteger,
  isValidTotal,
  isValidDateTime,
  normalizeDateTime,
} = require('../utils/validators');

function validateIdParam(id) {
  return isPositiveInteger(id) ? toPositiveInteger(id) : null;
}

function obtenerCliente(idCliente) {
  return database.get(
    'SELECT id_cliente, nombre, email FROM clientes WHERE id_cliente = ?',
    [idCliente]
  );
}

async function listarPedidos(req, res, next) {
  try {
    const filtros = [];
    const params = [];

    if (req.query.id_cliente !== undefined) {
      const idCliente = validateIdParam(req.query.id_cliente);
      if (!idCliente) {
        return res.status(400).json({ ok: false, mensaje: 'id_cliente debe ser un numero entero positivo' });
      }
      filtros.push('p.id_cliente = ?');
      params.push(idCliente);
    }

    if (req.query.estado !== undefined) {
      if (!ESTADOS_VALIDOS.includes(req.query.estado)) {
        return res.status(400).json({ ok: false, mensaje: `Estado invalido. Estados permitidos: ${ESTADOS_VALIDOS.join(', ')}` });
      }
      filtros.push('p.estado = ?');
      params.push(req.query.estado);
    }

    const where = filtros.length ? `WHERE ${filtros.join(' AND ')}` : '';

    const pedidos = database.all(`
      SELECT
        p.id_pedido,
        p.id_cliente,
        p.cliente,
        p.email_cliente,
        p.fecha_pedido,
        p.total,
        p.estado,
        p.created_at,
        p.updated_at,
        c.telefono AS telefono_cliente
      FROM pedidos p
      INNER JOIN clientes c ON c.id_cliente = p.id_cliente
      ${where}
      ORDER BY p.id_pedido DESC
    `, params);

    res.status(200).json({ ok: true, data: pedidos });
  } catch (error) {
    next(error);
  }
}

async function obtenerPedidoPorId(req, res, next) {
  try {
    const id = validateIdParam(req.params.id);
    if (!id) {
      return res.status(400).json({ ok: false, mensaje: 'El id del pedido debe ser un numero entero positivo' });
    }

    const pedido = database.get(`
      SELECT
        p.id_pedido,
        p.id_cliente,
        p.cliente,
        p.email_cliente,
        p.fecha_pedido,
        p.total,
        p.estado,
        p.created_at,
        p.updated_at,
        c.telefono AS telefono_cliente
      FROM pedidos p
      INNER JOIN clientes c ON c.id_cliente = p.id_cliente
      WHERE p.id_pedido = ?
    `, [id]);

    if (!pedido) {
      return res.status(404).json({ ok: false, mensaje: 'Pedido no encontrado' });
    }

    res.status(200).json({ ok: true, data: pedido });
  } catch (error) {
    next(error);
  }
}

async function crearPedido(req, res, next) {
  try {
    const idCliente = validateIdParam(req.body.id_cliente);
    const { total } = req.body;
    const estado = req.body.estado || 'pendiente';

    if (!idCliente || total === undefined) {
      return res.status(400).json({ ok: false, mensaje: 'Los campos id_cliente y total son obligatorios' });
    }

    if (!isValidTotal(total)) {
      return res.status(400).json({ ok: false, mensaje: 'El campo total debe ser mayor a 0' });
    }

    if (!ESTADOS_VALIDOS.includes(estado)) {
      return res.status(400).json({ ok: false, mensaje: `Estado invalido. Estados permitidos: ${ESTADOS_VALIDOS.join(', ')}` });
    }

    if (!isValidDateTime(req.body.fecha_pedido)) {
      return res.status(400).json({ ok: false, mensaje: 'fecha_pedido debe ser una fecha valida' });
    }

    const cliente = obtenerCliente(idCliente);
    if (!cliente) {
      return res.status(404).json({ ok: false, mensaje: 'No existe un cliente con el id_cliente indicado' });
    }

    const fechaPedido = normalizeDateTime(req.body.fecha_pedido);

    const resultado = database.run(
      `INSERT INTO pedidos (id_cliente, cliente, email_cliente, fecha_pedido, total, estado)
       VALUES (?, ?, ?, COALESCE(?, CURRENT_TIMESTAMP), ?, ?)`,
      [cliente.id_cliente, cliente.nombre, cliente.email, fechaPedido, Number(total), estado]
    );

    const nuevoPedido = database.get('SELECT * FROM pedidos WHERE id_pedido = ?', [resultado.id]);
    res.status(201).json({ ok: true, mensaje: 'Pedido creado correctamente', data: nuevoPedido });
  } catch (error) {
    next(error);
  }
}

async function actualizarPedido(req, res, next) {
  try {
    const id = validateIdParam(req.params.id);
    if (!id) {
      return res.status(400).json({ ok: false, mensaje: 'El id del pedido debe ser un numero entero positivo' });
    }

    const pedidoActual = database.get('SELECT * FROM pedidos WHERE id_pedido = ?', [id]);
    if (!pedidoActual) {
      return res.status(404).json({ ok: false, mensaje: 'Pedido no encontrado' });
    }

    let cliente = {
      id_cliente: pedidoActual.id_cliente,
      nombre: pedidoActual.cliente,
      email: pedidoActual.email_cliente,
    };

    if (req.body.id_cliente !== undefined) {
      const idCliente = validateIdParam(req.body.id_cliente);
      if (!idCliente) {
        return res.status(400).json({ ok: false, mensaje: 'id_cliente debe ser un numero entero positivo' });
      }

      const clienteEncontrado = obtenerCliente(idCliente);
      if (!clienteEncontrado) {
        return res.status(404).json({ ok: false, mensaje: 'No existe un cliente con el id_cliente indicado' });
      }
      cliente = clienteEncontrado;
    }

    const nuevoTotal = req.body.total !== undefined ? Number(req.body.total) : pedidoActual.total;
    const nuevoEstado = req.body.estado !== undefined ? req.body.estado : pedidoActual.estado;
    const nuevaFecha = req.body.fecha_pedido !== undefined ? normalizeDateTime(req.body.fecha_pedido) : pedidoActual.fecha_pedido;

    if (!isValidTotal(nuevoTotal)) {
      return res.status(400).json({ ok: false, mensaje: 'El campo total debe ser mayor a 0' });
    }

    if (!ESTADOS_VALIDOS.includes(nuevoEstado)) {
      return res.status(400).json({ ok: false, mensaje: `Estado invalido. Estados permitidos: ${ESTADOS_VALIDOS.join(', ')}` });
    }

    if (!isValidDateTime(req.body.fecha_pedido)) {
      return res.status(400).json({ ok: false, mensaje: 'fecha_pedido debe ser una fecha valida' });
    }

    database.run(
      `UPDATE pedidos
       SET id_cliente = ?, cliente = ?, email_cliente = ?, fecha_pedido = ?, total = ?, estado = ?, updated_at = CURRENT_TIMESTAMP
       WHERE id_pedido = ?`,
      [cliente.id_cliente, cliente.nombre, cliente.email, nuevaFecha, nuevoTotal, nuevoEstado, id]
    );

    const pedidoActualizado = database.get('SELECT * FROM pedidos WHERE id_pedido = ?', [id]);
    res.status(200).json({ ok: true, mensaje: 'Pedido actualizado correctamente', data: pedidoActualizado });
  } catch (error) {
    next(error);
  }
}

async function eliminarPedido(req, res, next) {
  try {
    const id = validateIdParam(req.params.id);
    if (!id) {
      return res.status(400).json({ ok: false, mensaje: 'El id del pedido debe ser un numero entero positivo' });
    }

    const pedido = database.get('SELECT * FROM pedidos WHERE id_pedido = ?', [id]);
    if (!pedido) {
      return res.status(404).json({ ok: false, mensaje: 'Pedido no encontrado' });
    }

    database.run('DELETE FROM pedidos WHERE id_pedido = ?', [id]);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}

module.exports = {
  listarPedidos,
  obtenerPedidoPorId,
  crearPedido,
  actualizarPedido,
  eliminarPedido,
};
