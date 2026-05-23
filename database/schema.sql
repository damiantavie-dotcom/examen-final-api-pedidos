PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS clientes (
  id_cliente INTEGER PRIMARY KEY AUTOINCREMENT,
  nombre VARCHAR(100) NOT NULL CHECK (length(trim(nombre)) > 0),
  email VARCHAR(150) NOT NULL UNIQUE CHECK (length(trim(email)) > 0),
  telefono VARCHAR(20),
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME
);

CREATE TABLE IF NOT EXISTS pedidos (
  id_pedido INTEGER PRIMARY KEY AUTOINCREMENT,
  id_cliente INTEGER NOT NULL,
  cliente VARCHAR(100) NOT NULL,
  email_cliente VARCHAR(150) NOT NULL,
  fecha_pedido DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  total DECIMAL(10,2) NOT NULL CHECK (total > 0),
  estado VARCHAR(30) NOT NULL DEFAULT 'pendiente'
    CHECK (estado IN ('pendiente', 'pagado', 'enviado', 'entregado', 'cancelado')),
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME,
  FOREIGN KEY (id_cliente) REFERENCES clientes(id_cliente)
    ON UPDATE CASCADE
    ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS idx_pedidos_id_cliente ON pedidos(id_cliente);
CREATE INDEX IF NOT EXISTS idx_pedidos_estado ON pedidos(estado);
CREATE INDEX IF NOT EXISTS idx_pedidos_fecha ON pedidos(fecha_pedido);
