import { fetchAuthSession } from 'aws-amplify/auth';
import { API_BASE_URL } from './config/aws-config';

async function authHeaders() {
  const session = await fetchAuthSession();
  const idToken = session.tokens?.idToken;
  if (!idToken) return {};
  const p = idToken.payload;
  return {
    Authorization: `Bearer ${idToken.toString()}`,
    'X-User-Id': p.sub ?? '',
    'X-User-Email': p.email ?? '',
    'X-User-Name': p.name ?? p.username ?? '',
  };
}

async function request(path, { method = 'GET', body, auth = false } = {}) {
  const headers = {};
  if (body !== undefined) headers['Content-Type'] = 'application/json';
  if (auth) Object.assign(headers, await authHeaders());

  const res = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    let detail = '';
    try { detail = (await res.json()).message; } catch { /* no JSON body */ }
    throw new Error(detail || `Request failed (${res.status})`);
  }
  return res.status === 204 ? null : res.json();
}

export const api = {
  getProducts: () => request('/products'),
  getProduct: (id) => request(`/products/${id}`),

  getCart: () => request('/cart', { auth: true }),
  addToCart: (productId, quantity, price) =>
    request('/cart/items', {
      method: 'POST', auth: true,
      body: { product_id: productId, quantity, price },
    }),
  removeFromCart: (productId) =>
    request(`/cart/items/${productId}`, { method: 'DELETE', auth: true }),

  createOrder: () => request('/orders', { method: 'POST', auth: true, body: {} }),
  getOrders: () => request('/orders', { auth: true }),

  getProfile: () => request('/users/profile', { auth: true }),
  createProfile: async (email, name) => {
    const session = await fetchAuthSession();
    return request('/users/profile', {
      method: 'POST', auth: true,
      body: { cognito_sub: session.tokens?.idToken?.payload?.sub, email, name },
    });
  },
};