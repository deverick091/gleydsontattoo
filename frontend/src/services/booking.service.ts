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
    return response.data.filter((service) => service.isActive);
  },

  async getProfessionals() {
    const response = await api.get<ApiResponse<BookingProfessional[]>>("/api/professionals");
    return response.data.filter((professional) => professional.isActive);
  },

  async getAvailableSlots(professionalId: string, date: string) {
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
  },

  createAppointment(data: CreateAppointmentInput) {
    return api.post<ApiResponse<unknown>>("/api/appointments", data);
  },
};
