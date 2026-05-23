# Pruebas de funcionamiento de la API

Para ejecutar las pruebas, primero iniciar el servidor:

```bash
npm start
```

Luego, en otra terminal:

```bash
npm run test-api
```

## Casos de prueba esperados

| Nro | Metodo | Ruta | Objetivo | Codigo esperado |
|---:|---|---|---|---:|
| 1 | GET | `/` | Verificar que la API responda | 200 |
| 2 | GET | `/health` | Verificar estado del servidor | 200 |
| 3 | GET | `/api/clientes` | Listar clientes | 200 |
| 4 | POST | `/api/clientes` | Crear cliente | 201 |
| 5 | GET | `/api/clientes/:id` | Obtener cliente por ID | 200 |
| 6 | PUT | `/api/clientes/:id` | Actualizar cliente | 200 |
| 7 | POST | `/api/pedidos` | Crear pedido asociado a cliente existente | 201 |
| 8 | GET | `/api/pedidos` | Listar pedidos | 200 |
| 9 | GET | `/api/pedidos/:id` | Obtener pedido por ID | 200 |
| 10 | PUT | `/api/pedidos/:id` | Actualizar pedido | 200 |
| 11 | POST | `/api/pedidos` con total 0 | Validar `total > 0` | 400 |
| 12 | POST | `/api/pedidos` con cliente inexistente | Validar cliente asociado | 404 |
| 13 | DELETE | `/api/clientes/:id` con pedidos | Validar integridad referencial | 409 |
| 14 | DELETE | `/api/pedidos/:id` | Eliminar pedido | 204 |
| 15 | DELETE | `/api/clientes/:id` sin pedidos | Eliminar cliente | 204 |

## Evidencia sugerida para adjuntar

Para fortalecer la entrega, se recomienda tomar capturas de pantalla de Postman o de la terminal donde se vea:

- Servidor iniciado con `npm start`.
- Ejecucion de `npm run test-api` finalizando correctamente.
- Respuesta `201` al crear cliente.
- Respuesta `201` al crear pedido.
- Respuesta `400` cuando `total` es 0.
- Respuesta `204` al eliminar un pedido.
