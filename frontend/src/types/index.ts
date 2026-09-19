export enum AppointmentStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED',
  NO_SHOW = 'NO_SHOW'
}

export enum BudgetStatus {
  PENDING = 'PENDING',
  REVIEWING = 'REVIEWING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED'
}

export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER'
}

export enum PriceType {
  FIXED = 'FIXED',
  HOURLY = 'HOURLY',
  FROM = 'FROM'
}

export enum NotificationType {
  APPOINTMENT = 'APPOINTMENT',
  SYSTEM = 'SYSTEM',
  MARKETING = 'MARKETING'
}

export enum NotificationChannel {
  WHATSAPP = 'WHATSAPP',
  EMAIL = 'EMAIL',
  SMS = 'SMS'
}

export enum BlockedTimeReason {
  PERSONAL = 'PERSONAL',
  HOLIDAY = 'HOLIDAY',
  MAINTENANCE = 'MAINTENANCE',
  OTHER = 'OTHER'
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export interface Client {
  id: string;
  name: string;
  phone: string;
  email: string;
  instagram?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Professional {
  id: string;
  name: string;
  bio?: string;
  specialties: string[];
  userId: string;
}

export interface ServiceCategory {
  id: string;
  name: string;
  description?: string;
}

export interface Service {
  id: string;
  categoryId: string;
  name: string;
  description: string;
  durationMinutes: number;
  priceType: PriceType;
  price: number;
  isActive: boolean;
}

export interface Appointment {
  id: string;
  clientId: string;
  serviceId: string;
  professionalId: string;
  startTime: Date;
  endTime: Date;
  status: AppointmentStatus;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface BlockedTime {
  id: string;
  professionalId: string;
  startTime: Date;
  endTime: Date;
  reason: BlockedTimeReason;
  notes?: string;
}

export interface TimeSlot {
  start: Date;
  end: Date;
  available: boolean;
}

export interface PortfolioItem {
  id: string;
  professionalId: string;
  title: string;
  description?: string;
  imageUrl: string;
  categoryId?: string;
  featured: boolean;
  createdAt: Date;
}

export interface Budget {
  id: string;
  clientId: string;
  style: string;
  size: string;
  bodyRegion: string;
  description: string;
  referenceImages: string[];
  status: BudgetStatus;
  createdAt: Date;
}

export interface Notification {
  id: string;
  clientId: string;
  type: NotificationType;
  channel: NotificationChannel;
  content: string;
  sentAt: Date;
}

export interface AuditLog {
  id: string;
  userId: string;
  action: string;
  entityType: string;
  entityId: string;
  details: any;
  createdAt: Date;
}

export interface Setting {
  key: string;
  value: any;
  updatedAt: Date;
}

export interface SocialMediaPost {
  id: string;
  platform: string;
  url: string;
  publishedAt: Date;
}

// Booking Flow Types
export interface BookingData {
  serviceId: string;
  serviceName: string;
  professionalId: string;
  professionalName: string;
  selectedDate: string;
  selectedTime: string;
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  notes?: string;
}

export interface StepComponentProps {
  data: Partial<BookingData>;
  updateData: (updates: Partial<BookingData>) => void;
  onNext: () => void;
  onPrevious?: () => void;
}
