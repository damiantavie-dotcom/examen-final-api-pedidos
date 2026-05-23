# Cumplimiento de rubrica

## 1. Formato y entrega

- El proyecto se entrega en un unico archivo comprimido ZIP.
- Incluye documento de entrega en PDF y TXT.
- Incluye README con instrucciones.
- Incluye carpeta `requests` con pruebas.
- Pendiente antes de entregar: reemplazar el enlace de GitHub por el link real del repositorio publico.

## 2. Implementacion del modelo de datos

La solucion implementa una base de datos relacional SQLite con dos entidades:

- `clientes`
- `pedidos`

La tabla `pedidos` incluye los campos solicitados:

- `id_pedido`
- `cliente`
- `email_cliente`
- `fecha_pedido`
- `total`
- `estado`

Tambien incorpora `id_cliente` como llave foranea para vincular cada pedido con un cliente preexistente.

Buenas practicas aplicadas:

- Claves primarias autoincrementales.
- Llave foranea entre pedidos y clientes.
- Validacion `CHECK (total > 0)` en el esquema SQL.
- Validacion de estados permitidos.
- Variables de entorno en `.env` y `.env.example`.

## 3. Desarrollo de la API REST

La API fue desarrollada con Node.js y Express. La estructura separa responsabilidades:

- `routes`: definicion de rutas.
- `controllers`: logica de negocio.
- `config`: conexion a base de datos.
- `middlewares`: errores y rutas no encontradas.
- `utils`: funciones de validacion.

Codigos HTTP aplicados:

- `200 OK` para consultas y actualizaciones.
- `201 Created` para creaciones.
- `204 No Content` para eliminaciones correctas.
- `400 Bad Request` para datos invalidos.
- `404 Not Found` para recursos inexistentes.
- `409 Conflict` para conflictos de integridad.

## 4. Operaciones CRUD

CRUD completo para clientes:

- Crear cliente.
- Listar clientes.
- Obtener cliente por ID.
- Actualizar cliente.
- Eliminar cliente.

CRUD completo para pedidos:

- Crear pedido asociado a cliente existente.
- Listar pedidos.
- Obtener pedido por ID.
- Actualizar pedido.
- Eliminar pedido.

## 5. Pruebas de funcionamiento

Se incluyen tres alternativas de prueba:

- `requests/pruebas_api.http` para REST Client en VS Code.
- `requests/postman_collection.json` para Postman.
- `npm run test-api` para prueba automatizada desde terminal.

Las pruebas verifican metodos HTTP, codigos de estado, CRUD, validacion de `total > 0` y existencia del cliente asociado.

## 6. Repositorio GitHub

Pendiente final del estudiante:

1. Crear repositorio publico en GitHub.
2. Subir el proyecto completo.
3. Copiar el enlace.
4. Reemplazar el marcador pendiente en el documento de entrega.
