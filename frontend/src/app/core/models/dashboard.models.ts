export interface DashboardSummaryDTO {
  activeSpaces: number;
  totalUsers: number;
  reservationsToday: number;
}

export interface ReservationDTO {
  id: string | number;
  userName: string;
  spaceName: string;
  start: string;
  end?: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'CONFIRMED' | 'CANCELLED';
  notes?: string;
}

export interface CalendarEventDTO {
  id: string | number;
  title: string;
  start: string;
  end?: string;
  extendedProps?: Record<string, any>;
}
