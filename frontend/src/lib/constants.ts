import { AppointmentStatus, BudgetStatus } from '@/types';

export const STUDIO_INFO = {
  name: 'Gleydson Tattoo',
  address: 'Av. Paulista, 1000 - Bela Vista, São Paulo - SP',
  phone: '+55 11 99999-9999',
  email: 'contato@gleydsontattoo.com',
  instagram: '@gleydsontattoo',
  coordinates: {
    lat: -23.561684,
    lng: -46.655981
  },
  hours: {
    weekdays: '10:00 - 20:00',
    saturday: '10:00 - 18:00',
    sunday: 'Fechado'
  }
};

export const NAV_LINKS = [
  { label: 'Início', href: '/' },
  { label: 'Portfólio', href: '/portfolio' },
  { label: 'Serviços', href: '/servicos' },
  { label: 'Agendamento', href: '/agendamento' },
  { label: 'Contato', href: '/contato' },
];

export const APPOINTMENT_STATUS_INFO = {
  [AppointmentStatus.PENDING]: { label: 'Pendente', color: 'bg-yellow-500' },
  [AppointmentStatus.CONFIRMED]: { label: 'Confirmado', color: 'bg-green-500' },
  [AppointmentStatus.CANCELLED]: { label: 'Cancelado', color: 'bg-red-500' },
  [AppointmentStatus.COMPLETED]: { label: 'Concluído', color: 'bg-blue-500' },
  [AppointmentStatus.NO_SHOW]: { label: 'Não Compareceu', color: 'bg-gray-500' }
};

export const BUDGET_STATUS_INFO = {
  [BudgetStatus.PENDING]: { label: 'Pendente', color: 'bg-yellow-500' },
  [BudgetStatus.REVIEWING]: { label: 'Em Análise', color: 'bg-blue-500' },
  [BudgetStatus.APPROVED]: { label: 'Aprovado', color: 'bg-green-500' },
  [BudgetStatus.REJECTED]: { label: 'Recusado', color: 'bg-red-500' }
};

export const SERVICE_CATEGORIES = [
  { id: 'tatuagem', name: 'Tatuagem' },
  { id: 'piercing', name: 'Piercing' },
  { id: 'remocao', name: 'Remoção a Laser' }
];
