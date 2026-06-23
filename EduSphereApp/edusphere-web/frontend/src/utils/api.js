/**
 * Central API configuration.
 * In local dev: Vite proxy routes /api/* to localhost:8080
 * In production (Railway): VITE_API_URL points to the deployed backend URL
 */
const API_BASE_URL = import.meta.env.VITE_API_URL || '';

/**
 * Wrapper around fetch that automatically prepends the backend URL.
 * Usage: apiFetch('/api/auth/login', { method: 'POST', ... })
 */
export async function apiFetch(path, options = {}) {
  const url = `${API_BASE_URL}${path}`;
  const response = await fetch(url, options);
  return response;
}

export default API_BASE_URL;
