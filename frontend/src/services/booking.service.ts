import { api } from "@/lib/api";
import type { ApiResponse, BookingProfessional, BookingService, BookingTimeSlot } from "@/types";

interface AvailableSlotsResponse {
  slots: BookingTimeSlot[];
  blocked: Array<{
    allDay: boolean;
    startTime: string | null;
    endTime: string | null;
  }>;
  appointments: Array<{
    startTime: string;
  }>;
}

export interface CreateAppointmentInput {
  professionalId: string;
  serviceId: string;
  date: string;
  startTime: string;
  client: {
    name: string;
    phone: string;
    whatsapp: string;
    email: string;
    notes?: string;
  };
}

export const bookingService = {
  async getServices() {
    const response = await api.get<ApiResponse<BookingService[]>>("/api/services");
    return response.data.filter((service) => service.active !== false && service.isActive !== false);
  },

  async getProfessionals() {
    try {
      const response = await api.get<ApiResponse<BookingProfessional[]>>("/api/professionals");
      return response.data.filter((professional) => professional.isActive);
    } catch (error) {
      // Mock professional se não existir endpoint
      return [{
        id: "default-professional-id",
        name: "Gleydson",
        bio: "Especialista em tatuagens exclusivas.",
        specialties: ["Realismo", "Blackwork", "Fine Line"],
        isActive: true
      }] as BookingProfessional[];
    }
  },

  async getAvailableSlots(professionalId: string, date: string) {
    try {
      const response = await api.get<ApiResponse<AvailableSlotsResponse>>("/api/schedule/slots", {
        professionalId,
        date,
      });
      const { slots, blocked, appointments } = response.data;

      return slots.filter((slot) => {
        const hasAppointment = appointments.some((appointment) => appointment.startTime === slot.startTime);
        const isBlocked = blocked.some((block) =>
          block.allDay ||
          (block.startTime !== null && block.endTime !== null && slot.startTime >= block.startTime && slot.startTime < block.endTime)
        );
        return !hasAppointment && !isBlocked;
      });
    } catch (error) {
      // Se não existir o endpoint na API, retorna horários genéricos
      const defaultSlots: BookingTimeSlot[] = [];
      for (let h = 9; h <= 18; h++) {
        const hour = h.toString().padStart(2, '0');
        const nextHour = (h + 1).toString().padStart(2, '0');
        defaultSlots.push({ startTime: `${hour}:00`, endTime: `${hour}:30` });
        if (h !== 18) defaultSlots.push({ startTime: `${hour}:30`, endTime: `${nextHour}:00` });
      }
      return defaultSlots;
    }
  },

  createAppointment(data: CreateAppointmentInput) {
    return api.post<ApiResponse<unknown>>("/api/appointments", data);
  },
};
