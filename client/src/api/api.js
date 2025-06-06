const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const getToken = () => localStorage.getItem('token');

const headers = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${getToken()}`
});

// AUTHENTICATION
export const loginUser = async (credentials) => {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify(credentials)
  });
  if (!res.ok) throw new Error('Login fallido');
  return res.json();
};

export const loginStaff = async (credentials) => {
  const res = await fetch(`${API_URL}/auth/loginStaff`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify(credentials)
  });
  if (!res.ok) throw new Error('Login fallido');
  return res.json();
};

// USUARIOS (meseros y admin)
export const fetchUsuarios = async () => {
  const res = await fetch(`${API_URL}/staff`, { headers: headers() });
  return res.json();
};

export const crearUsuario = async (data) => {
  const res = await fetch(`${API_URL}/staff`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify(data)
  });
  return res.json();
};

export const actualizarUsuario = async (id, data) => {
  const res = await fetch(`${API_URL}/staff/${id}`, {
    method: 'PUT',
    headers: headers(),
    body: JSON.stringify(data),
  });
  return res.json();
};

export const eliminarUsuario = async (id) => {
  const res = await fetch(`${API_URL}/staff/${id}`, {
    method: 'DELETE',
    headers: headers()
  });
  return res.json();
};

// MESAS
export const fetchMesas = async () => {
  const res = await fetch(`${API_URL}/tables`, { headers: headers() });
  return res.json();
};

export const fetchMesaById = async (id) => {
  const res = await fetch(`${API_URL}/tables/${id}`, { headers: headers() });
  return res.json();
};

export const crearMesa = async (data) => {
  const res = await fetch(`${API_URL}/tables`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify(data)
  });
  return res.json();
};

export const actualizarMesa = async (id, data) => {
  const res = await fetch(`${API_URL}/tables/${id}`, {
    method: 'PUT',
    headers: headers(),
    body: JSON.stringify(data)
  });
  return res.json();
};

export const cambiarEstadoMesa = async (id, estado) => {
  const res = await fetch(`${API_URL}/tables/${id}/estado`, {
    method: 'PUT',
    headers: headers(),
    body: JSON.stringify({ estado })
  });
  return res.json();
};

export const eliminarMesa = async (id) => {
  const res = await fetch(`${API_URL}/tables/${id}`, {
    method: 'DELETE',
    headers: headers()
  });
  return res.json();
};

// PRODUCTOS (MENÚ)
export const fetchProductos = async () => {
  const res = await fetch(`${API_URL}/products`, { headers: headers() });
  return res.json();
};

export const crearProducto = async (data) => {
  const res = await fetch(`${API_URL}/products`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify(data)
  });
  return res.json();
};

export const eliminarProducto = async (id) => {
  const res = await fetch(`${API_URL}/products/${id}`, {
    method: 'DELETE',
    headers: headers()
  });
  return res.json();
};

export const actualizarProducto = async (id, data) => {
  const res = await fetch(`${API_URL}/products/${id}`, {
    method: 'PUT',
    headers: headers(),
    body: JSON.stringify(data)
  });
  return res.json();
};

// PEDIDOS
export const fetchPedidos = async () => {
  const res = await fetch(`${API_URL}/orders`, { headers: headers() });
  return res.json();
};

export const crearPedido = async (data) => {
  const res = await fetch(`${API_URL}/orders`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify(data)
  });
  return res.json();
};

export const finalizarPedido = async (id) => {
  const res = await fetch(`${API_URL}/orders/${id}/finalizar`, {
    method: 'PUT',
    headers: headers()
  });
  return res.json();
};

export const eliminarPedido = async (id) => {
  const res = await fetch(`${API_URL}/orders/${id}`, {
    method: 'DELETE',
    headers: headers()
  });
  return res.json();
};

// PAGOS
export const registrarPago = async (data) => {
  const res = await fetch(`${API_URL}/payments`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify(data)
  });
  return res.json();
};
