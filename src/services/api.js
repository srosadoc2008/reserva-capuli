// Servicio API unificado: manejo de errores, timeouts y normalización
const DEFAULT_TIMEOUT_MS = 12000;

function timeoutPromise(ms, promise) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('Request timeout')), ms);
    promise
      .then((val) => {
        clearTimeout(timer);
        resolve(val);
      })
      .catch((err) => {
        clearTimeout(timer);
        reject(err);
      });
  });
}

// Helper para construir URL con base (si usas envs)
const API_BASE = process.env.REACT_APP_API_BASE || '';

export async function apiFetch(path, { method = 'GET', headers = {}, body, timeout = DEFAULT_TIMEOUT_MS } = {}) {
  const url = path.startsWith('http') ? path : `${API_BASE}${path}`;
  const finalHeaders = { 'Content-Type': 'application/json', ...headers };
  const options = { method, headers: finalHeaders };
  if (body !== undefined) options.body = typeof body === 'string' ? body : JSON.stringify(body);

  try {
    const resp = await timeoutPromise(timeout, fetch(url, options));
    const contentType = resp.headers.get('content-type') || '';
    let data = null;
    if (contentType.includes('application/json')) {
      data = await resp.json();
    } else {
      data = await resp.text();
    }

    if (!resp.ok) {
      return { ok: false, data: null, error: { status: resp.status, message: data?.message || data || 'HTTP error' } };
    }
    return { ok: true, data, error: null };
  } catch (error) {
    return { ok: false, data: null, error: { status: 0, message: error?.message || 'Network error' } };
  }
}
