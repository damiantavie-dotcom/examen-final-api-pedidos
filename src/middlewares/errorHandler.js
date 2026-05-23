function errorHandler(error, req, res, next) {
  console.error(error);

  const mensaje = error.message || 'Error interno del servidor';

  if (mensaje.includes('UNIQUE constraint failed')) {
    return res.status(409).json({ ok: false, mensaje: 'Conflicto de integridad: el registro ya existe' });
  }

  if (mensaje.includes('FOREIGN KEY constraint failed')) {
    return res.status(409).json({ ok: false, mensaje: 'Conflicto de integridad: llave foranea invalida' });
  }

  if (mensaje.includes('CHECK constraint failed')) {
    return res.status(400).json({ ok: false, mensaje: 'Datos invalidos: no se cumple una validacion del modelo' });
  }

  return res.status(500).json({
    ok: false,
    mensaje: 'Error interno del servidor',
    detalle: process.env.NODE_ENV === 'development' ? mensaje : undefined,
  });
}

module.exports = errorHandler;
