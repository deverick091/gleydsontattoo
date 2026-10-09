import { api } from "@/lib/api";
import type { ApiResponse, AppointmentStatus, BudgetStatus, BookingProfessional, BookingService } from "@/types";

export interface AdminAppointment {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  status: AppointmentStatus;
  notes?: string | null;
  client: { id: string; name: string; phone: string; whatsapp: string; email?: string | null };
  service: { id: string; name: string; duration: number };
  professional: { id: string; name: string };
}

export interface AdminClient {
  id: string;
  name: string;
  phone: string;
  whatsapp: string;
  email?: string | null;
  notes?: string | null;
  createdAt: string;
  appointments?: AdminAppointment[];
  budgets?: AdminBudget[];
}

export interface AdminPortfolioItem {
  id: string;
  title: string;
  description?: string | null;
  imageUrl: string;
  categoryId: string;
  category?: { id: string; name: string };
  isFeatured: boolean;
  isActive: boolean;
  order: number;
}

export interface AdminBudget {
  id: string;
  name: string;
  whatsapp: string;
  email?: string | null;
  style?: string | null;
  size?: string | null;
  bodyRegion?: string | null;
  description?: string | null;
  referenceImages: string[];
  approximateBudget?: string | null;
  status: BudgetStatus;
  adminResponse?: string | null;
  createdAt: string;
  client?: AdminClient | null;
}

export interface Paginated<T> { data: T[]; pagination: { page: number; limit: number; total: number; totalPages: number } }

const unwrap = <T>(response: ApiResponse<T>) => response.data;

export const adminAppointmentService = {
  async list(params: Record<string, string> = {}) { return api.get<Paginated<AdminAppointment>>('/api/appointments', params); },
  async get(id: string) { return unwrap(await api.get<ApiResponse<AdminAppointment>>(`/api/appointments/${id}`)); },
  async create(data: unknown) { return unwrap(await api.post<ApiResponse<AdminAppointment>>('/api/appointments', data)); },
  async updateStatus(id: string, status: AppointmentStatus, cancelReason?: string) { return unwrap(await api.patch<ApiResponse<AdminAppointment>>(`/api/appointments/${id}/status`, { status, cancelReason })); },
  async reschedule(id: string, data: { date: string; startTime: string }) { return unwrap(await api.patch<ApiResponse<AdminAppointment>>(`/api/appointments/${id}/reschedule`, data)); },
};

export const adminClientService = {
  async list(params: Record<string, string> = {}) { return api.get<Paginated<AdminClient>>('/api/clients', params); },
  async get(id: string) { return unwrap(await api.get<ApiResponse<AdminClient>>(`/api/clients/${id}`)); },
  async create(data: unknown) { return unwrap(await api.post<ApiResponse<AdminClient>>('/api/clients', data)); },
  async update(id: string, data: unknown) { return unwrap(await api.patch<ApiResponse<AdminClient>>(`/api/clients/${id}`, data)); },
};

export const adminPortfolioService = {
  async list(categoryId?: string) { return unwrap(await api.get<ApiResponse<AdminPortfolioItem[]>>('/api/portfolio', categoryId ? { categoryId } : undefined)); },
  async get(id: string) { return unwrap(await api.get<ApiResponse<AdminPortfolioItem>>(`/api/portfolio/${id}`)); },
  async create(data: unknown) { return unwrap(await api.post<ApiResponse<AdminPortfolioItem>>('/api/portfolio', data)); },
  async update(id: string, data: unknown) { return unwrap(await api.patch<ApiResponse<AdminPortfolioItem>>(`/api/portfolio/${id}`, data)); },
  async delete(id: string) { return unwrap(await api.delete<ApiResponse<AdminPortfolioItem>>(`/api/portfolio/${id}`)); },
};

export const adminBudgetService = {
  async list(params: Record<string, string> = {}) { return api.get<Paginated<AdminBudget>>('/api/budgets', params); },
  async get(id: string) { return unwrap(await api.get<ApiResponse<AdminBudget>>(`/api/budgets/${id}`)); },
  async respond(id: string, response: string) { return unwrap(await api.patch<ApiResponse<AdminBudget>>(`/api/budgets/${id}/respond`, { response })); },
  async updateStatus(id: string, status: BudgetStatus) { return unwrap(await api.patch<ApiResponse<AdminBudget>>(`/api/budgets/${id}/status`, { status })); },
  async convert(id: string, data: { professionalId: string; serviceId: string; date: string; startTime: string; endTime: string }) { return unwrap(await api.post<ApiResponse<AdminBudget>>(`/api/budgets/${id}/convert`, data)); },
};

export const adminCatalogService = {
  getProfessionals: () => api.get<ApiResponse<BookingProfessional[]>>('/api/professionals'),
  getServices: () => api.get<ApiResponse<BookingService[]>>('/api/services'),
};

export const adminDashboardService = {
  async getStats() {
    return api.get<any>('/api/dashboard/stats');
  }
};
