const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://zpvbunniyntzwjfwpawg.supabase.co/rest/v1';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpwdmJ1bm5peW50endqZndwYXdnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU4NDA0ODAsImV4cCI6MjA5MTQxNjQ4MH0.b734MUJZkL0Sf8ykvd3cT7NdniseklcZQSIGs0HB6Ho';

interface FetchOptions extends RequestInit {
  params?: Record<string, string>;
}

const toCamel = (str: string) => str.replace(/([-_][a-z])/g, (group) => group.toUpperCase().replace('-', '').replace('_', ''));
const toSnake = (str: string) => str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);

export function mapKeys<T>(obj: any, fn: (key: string) => string): T {
  if (Array.isArray(obj)) {
    return obj.map((v) => mapKeys(v, fn)) as any;
  }
  if (obj !== null && obj.constructor === Object) {
    return Object.keys(obj).reduce(
      (result, key) => ({
        ...result,
        [fn(key)]: mapKeys(obj[key], fn),
      }),
      {}
    ) as any;
  }
  return obj;
}

export const camelToSnake = (obj: any) => mapKeys(obj, toSnake);
export const snakeToCamel = (obj: any) => mapKeys(obj, toCamel);

async function apiFetch<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
  const { params, ...init } = options;
  const url = new URL(`${SUPABASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`);
  
  if (params) {
    Object.entries(params).forEach(([key, value]) => url.searchParams.append(key, value));
  }

  const headers = new Headers(init.headers);
  headers.set('apikey', SUPABASE_ANON_KEY);
  headers.set('Authorization', `Bearer ${SUPABASE_ANON_KEY}`);
  headers.set('Accept-Profile', 'alrayan');
  headers.set('Content-Profile', 'alrayan');
  if (!headers.has('Content-Type') && init.body) {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(url.toString(), {
    ...init,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(error.message || response.statusText);
  }

  if (response.status === 204) {
    return {} as T;
  }

  const data = await response.json();
  return snakeToCamel(data) as T;
}

export const api = {
  get: <T>(endpoint: string, params?: Record<string, string>) => 
    apiFetch<T>(endpoint, { method: 'GET', params }),
  
  post: <T>(endpoint: string, body: any) => 
    apiFetch<T>(endpoint, { 
      method: 'POST', 
      body: JSON.stringify(camelToSnake(body)),
      headers: { 'Prefer': 'return=representation' }
    }),
  
  patch: <T>(endpoint: string, body: any, params?: Record<string, string>) => 
    apiFetch<T>(endpoint, { 
      method: 'PATCH', 
      body: JSON.stringify(camelToSnake(body)),
      params,
      headers: { 'Prefer': 'return=representation' }
    }),
  
  delete: <T>(endpoint: string, params?: Record<string, string>) => 
    apiFetch<T>(endpoint, { method: 'DELETE', params }),
};
