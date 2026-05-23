# Examen Final Semana 10 - API REST de Clientes y Pedidos

Proyecto desarrollado por **Damian Cespedes** para la asignatura **Taller de plataformas web**.

**Docente:** Zugehy Escalante Issele La solucion implementa una API REST conectada a una base de datos relacional SQLite, aplicando operaciones CRUD, validaciones, llave foranea, variables de entorno, pruebas y una estructura backend ordenada.

## Resumen del cumplimiento

- API REST con Node.js y Express.
- Base de datos relacional SQLite guardada en `database/pedidos.sqlite`.
- Entidad principal: `pedidos`.
- Segunda entidad relacionada: `clientes`.
- Relacion: `pedidos.id_cliente` -> `clientes.id_cliente`.
- CRUD completo para clientes y pedidos.
- Validacion de `total > 0` en controlador y esquema SQL.
- Uso de `.env` y `.env.example`.
- Codigos HTTP correctos: `201 Created`, `204 No Content`, `400`, `404`, `409`.
- Pruebas disponibles en REST Client, Postman y script automatizado.

## Tecnologias utilizadas

- Node.js 18 o superior
- Express
- SQLite mediante `sql.js`
- dotenv
- cors

> Esta version usa `sql.js`, que ejecuta SQLite sin depender de compilaciones nativas. No es necesario instalar SQLite aparte.

## Instalacion y ejecucion

1. Instalar dependencias:

```bash
npm install
```

2. Crear `.env` desde `.env.example` si no existe:

```bash
cp .env.example .env
```

3. Inicializar la base de datos con datos de ejemplo:

```bash
npm run init-db
```

4. Ejecutar el servidor:

```bash
npm start
```

La API queda disponible en:

```txt
http://localhost:3000
```

## Prueba rapida automatizada

Con el servidor encendido en una terminal, ejecutar en otra terminal:

```bash
npm run test-api
```

El script prueba creacion, lectura, actualizacion, eliminacion, validacion de total y validacion de cliente inexistente.

## Modelo de datos

### Tabla `clientes`

| Campo | Tipo | Descripcion |
|---|---|---|
| id_cliente | INTEGER | Clave primaria autoincremental |
| nombre | VARCHAR | Nombre del cliente |
| email | VARCHAR | Correo unico del cliente |
| telefono | VARCHAR | Telefono del cliente |
| created_at | DATETIME | Fecha de creacion |
| updated_at | DATETIME | Fecha de actualizacion |

### Tabla `pedidos`

| Campo | Tipo | Descripcion |
|---|---|---|
| id_pedido | INTEGER | Clave primaria autoincremental |
| id_cliente | INTEGER | Clave foranea hacia clientes |
| cliente | VARCHAR | Nombre del cliente asociado |
| email_cliente | VARCHAR | Email del cliente asociado |
| fecha_pedido | DATETIME | Fecha del pedido |
| total | DECIMAL | Total del pedido. Debe ser mayor a 0 |
| estado | VARCHAR | Estado del pedido |
| created_at | DATETIME | Fecha de creacion |
| updated_at | DATETIME | Fecha de actualizacion |

Relacion implementada:

```sql
FOREIGN KEY (id_cliente) REFERENCES clientes(id_cliente)
```

## Endpoints

### Clientes

| Metodo | Ruta | Descripcion |
|---|---|---|
| GET | `/api/clientes` | Lista todos los clientes |
| GET | `/api/clientes/:id` | Obtiene un cliente por ID |
| GET | `/api/clientes/:id/pedidos` | Lista pedidos de un cliente |
| POST | `/api/clientes` | Crea un cliente |
| PUT | `/api/clientes/:id` | Actualiza un cliente |
| DELETE | `/api/clientes/:id` | Elimina un cliente sin pedidos asociados |

### Pedidos

| Metodo | Ruta | Descripcion |
|---|---|---|
| GET | `/api/pedidos` | Lista todos los pedidos |
| GET | `/api/pedidos?estado=pagado` | Filtra pedidos por estado |
| GET | `/api/pedidos?id_cliente=1` | Filtra pedidos por cliente |
| GET | `/api/pedidos/:id` | Obtiene un pedido por ID |
| POST | `/api/pedidos` | Crea un pedido asociado a un cliente existente |
| PUT | `/api/pedidos/:id` | Actualiza un pedido |
| DELETE | `/api/pedidos/:id` | Elimina un pedido |

## Ejemplos JSON

### Crear cliente

```json
{
  "nombre": "Pedro Ramirez",
  "email": "pedro.ramirez@example.com",
  "telefono": "+56977777777"
}
```

### Crear pedido

```json
{
  "id_cliente": 1,
  "total": 29990,
  "estado": "pendiente"
}
```

## Validaciones implementadas

- El cliente debe tener nombre y email.
- El email debe tener formato valido y no repetirse.
- El pedido debe estar asociado a un cliente existente.
- El campo `total` debe ser mayor a 0.
- El estado solo acepta: `pendiente`, `pagado`, `enviado`, `entregado`, `cancelado`.
- No se puede eliminar un cliente que tenga pedidos asociados.

## Archivos importantes

```txt
src/config/database.js             Conexion y persistencia SQLite
src/controllers/                   Logica de negocio
src/routes/                        Rutas REST
src/middlewares/                   Manejo de errores y rutas no encontradas
database/schema.sql                Modelo relacional con llaves y validaciones
requests/pruebas_api.http          Pruebas REST Client
requests/postman_collection.json   Coleccion Postman
docs/RUBRICA_CUMPLIMIENTO.md       Mapa de cumplimiento de la rubrica
docs/PRUEBAS_FUNCIONAMIENTO.md     Detalle de pruebas esperadas
DOCUMENTO_ENTREGA.pdf              Documento de entrega en PDF
DOCUMENTO_ENTREGA.txt              Documento de entrega editable
```

## Entrega



por el enlace real del repositorio.
https://github.com/damiantavie-dotcom/examen-final-api-pedidos/edit/main/README.md
