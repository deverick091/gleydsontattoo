import env from './env';

const API_URL = env.NEXT_PUBLIC_API_URL;

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private getAuthHeaders(): HeadersInit {
    if (typeof window === 'undefined') return {};
    const token = localStorage.getItem('accessToken');
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...this.getAuthHeaders(),
      ...options.headers,
    };

    try {
      const res = await fetch(url, {
        ...options,
        headers,
        credentials: 'include',
        signal: AbortSignal.timeout(30000),
      });

      let data;
      try {
        data = await res.json();
      } catch {
        throw new ApiError('Resposta inválida do servidor', res.status, 'INVALID_RESPONSE');
      }

      if (!res.ok) {
        throw new ApiError(
          data.error?.message || 'Erro na requisição',
          res.status,
          data.error?.code
        );
      }

      return data;
    } catch (error) {
      if (error instanceof ApiError) throw error;
      if (error instanceof TypeError) {
        throw new ApiError('Erro de conexão com o servidor', 0, 'NETWORK_ERROR');
      }
      if (error instanceof DOMException && error.name === 'AbortError') {
        throw new ApiError('Requisição expirou', 0, 'TIMEOUT');
      }
      throw new ApiError('Erro desconhecido', 0, 'UNKNOWN_ERROR');
    }
  }

  async get<T>(endpoint: string, params?: Record<string, string>): Promise<T> {
    const query = params ? '?' + new URLSearchParams(params).toString() : '';
    return this.request<T>(`${endpoint}${query}`);
  }

  async post<T>(endpoint: string, body?: unknown): Promise<T> {
    return this.request<T>(endpoint, { method: 'POST', body: JSON.stringify(body) });
  }

  async put<T>(endpoint: string, body?: unknown): Promise<T> {
    return this.request<T>(endpoint, { method: 'PUT', body: JSON.stringify(body) });
  }

  async patch<T>(endpoint: string, body?: unknown): Promise<T> {
    return this.request<T>(endpoint, { method: 'PATCH', body: JSON.stringify(body) });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }

  async upload<T>(endpoint: string, formData: FormData): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: formData,
        credentials: 'include',
        signal: AbortSignal.timeout(60000),
      });

      let data;
      try {
        data = await res.json();
      } catch {
        throw new ApiError('Resposta inválida do servidor', res.status, 'INVALID_RESPONSE');
      }

      if (!res.ok) {
        throw new ApiError(
          data.error?.message || 'Erro no upload',
          res.status,
          data.error?.code
        );
      }

      return data;
    } catch (error) {
      if (error instanceof ApiError) throw error;
      if (error instanceof TypeError) {
        throw new ApiError('Erro de conexão com o servidor', 0, 'NETWORK_ERROR');
      }
      if (error instanceof DOMException && error.name === 'AbortError') {
        throw new ApiError('Upload expirou', 0, 'TIMEOUT');
      }
      throw new ApiError('Erro desconhecido', 0, 'UNKNOWN_ERROR');
    }
  }
}

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export const api = new ApiClient(API_URL);
