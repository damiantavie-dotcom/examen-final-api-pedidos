function notFound(req, res) {
  res.status(404).json({
    ok: false,
    mensaje: 'Ruta no encontrada',
    ruta: req.originalUrl,
  });
}

module.exports = notFound;
