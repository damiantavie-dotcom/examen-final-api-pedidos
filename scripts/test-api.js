const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

async function request(method, path, body, expectedStatuses = []) {
  const response = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });

  const text = await response.text();
  let data = null;

  try {
    data = text ? JSON.parse(text) : null;
  } catch (error) {
    data = text;
  }

  const expectedText = expectedStatuses.length ? ` esperado=${expectedStatuses.join('/')}` : '';
  console.log(`${method} ${path} -> ${response.status}${expectedText}`);
  if (data) console.log(JSON.stringify(data, null, 2));
  console.log('----------------------------------------');

  if (expectedStatuses.length && !expectedStatuses.includes(response.status)) {
    throw new Error(`Estado HTTP inesperado en ${method} ${path}. Recibido ${response.status}`);
  }

  return { status: response.status, data };
}

async function ejecutarPruebas() {
  console.log('Ejecutando pruebas contra la API...');
  console.log(`URL base: ${BASE_URL}`);
  console.log('----------------------------------------');

  await request('GET', '/', undefined, [200]);
  await request('GET', '/health', undefined, [200]);
  await request('GET', '/api/clientes', undefined, [200]);

  const emailUnico = `cliente.prueba.${Date.now()}@example.com`;
  const clienteCreado = await request('POST', '/api/clientes', {
    nombre: 'Cliente Prueba',
    email: emailUnico,
    telefono: '+56944444444',
  }, [201]);

  const idCliente = clienteCreado.data.data.id_cliente;

  await request('GET', `/api/clientes/${idCliente}`, undefined, [200]);
  await request('PUT', `/api/clientes/${idCliente}`, {
    nombre: 'Cliente Prueba Actualizado',
    telefono: '+56955555555',
  }, [200]);

  const pedidoCreado = await request('POST', '/api/pedidos', {
    id_cliente: idCliente,
    total: 15000,
    estado: 'pendiente',
  }, [201]);

  const idPedido = pedidoCreado.data.data.id_pedido;

  await request('GET', '/api/pedidos', undefined, [200]);
  await request('GET', `/api/pedidos/${idPedido}`, undefined, [200]);
  await request('PUT', `/api/pedidos/${idPedido}`, {
    total: 18990,
    estado: 'pagado',
  }, [200]);

  await request('POST', '/api/pedidos', {
    id_cliente: idCliente,
    total: 0,
    estado: 'pendiente',
  }, [400]);

  await request('POST', '/api/pedidos', {
    id_cliente: 999999,
    total: 1000,
    estado: 'pendiente',
  }, [404]);

  await request('DELETE', `/api/clientes/${idCliente}`, undefined, [409]);
  await request('DELETE', `/api/pedidos/${idPedido}`, undefined, [204]);
  await request('DELETE', `/api/clientes/${idCliente}`, undefined, [204]);

  console.log('Todas las pruebas finalizaron correctamente.');
}

ejecutarPruebas().catch((error) => {
  console.error('Error ejecutando pruebas:', error.message);
  process.exit(1);
});
