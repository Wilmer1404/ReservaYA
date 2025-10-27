// components/time-slot-calendar.tsx
"use client";

// --- CORRECCIÓN 1: Importaciones nombradas para date-fns ---
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { es } from 'date-fns/locale'; // 'es' SÍ es exportación por defecto aquí

// --- CORRECCIÓN 2: Asegúrate que react-big-calendar esté instalado ---
import { Calendar, dateFnsLocalizer, Event as BigCalendarEvent } from 'react-big-calendar'; // Renombramos Event para evitar conflicto
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useMemo } from 'react';

// Configura los locales para usar español
const locales = { 'es': es };

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

// Interfaz simplificada de Reserva esperada como prop
interface CalendarReservation {
  id: number;
  startTime: string; // String ISO
  endTime: string; // String ISO
  space?: { id: number; name: string };
  user?: { id: number; name: string };
}

interface TimeSlotCalendarProps {
  reservations: CalendarReservation[];
}

// Interfaz para eventos usados por react-big-calendar
// Extendemos de BigCalendarEvent para compatibilidad
interface CalendarEvent extends BigCalendarEvent {
  id: number;
  title: string;
  start: Date;
  end: Date;
  resource?: CalendarReservation; // Hacemos resource opcional y del tipo correcto
}


export function TimeSlotCalendar({ reservations }: TimeSlotCalendarProps) {

  const events: CalendarEvent[] = useMemo(() => {
    return reservations
      .map((res): CalendarEvent | null => { // Especificamos el tipo de retorno explícito
        try {
          const start = new Date(res.startTime);
          const end = new Date(res.endTime);

          if (isNaN(start.getTime()) || isNaN(end.getTime())) {
            console.warn(`Formato de fecha inválido para reserva ID ${res.id}`);
            return null;
          }

          // --- CORRECCIÓN 3: Asegurarse que el objeto coincida con CalendarEvent ---
          const eventData: CalendarEvent = {
             id: res.id,
             title: `Reserva: ${res.space?.name || 'Espacio'} por ${res.user?.name || 'Usuario'} #${res.id}`,
             start: start,
             end: end,
             resource: res, // Asignamos la reserva original
          };
          return eventData;

        } catch (e) {
          console.error(`Error procesando reserva ID ${res.id}:`, e);
          return null;
        }
      })
      // --- CORRECCIÓN 4: Usar un type guard más robusto ---
      .filter((event): event is CalendarEvent => event !== null && typeof event === 'object'); // Filtra null y asegura que sea un objeto
  }, [reservations]);


  return (
    <div className="h-[70vh] bg-white p-4 rounded-lg shadow border">
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: '100%' }}
        defaultView="week"
        views={['month', 'week', 'day', 'agenda']}
        step={30}
        timeslots={2}
        culture='es'
        messages={{
            next: "Sig",
            previous: "Ant",
            today: "Hoy",
            month: "Mes",
            week: "Semana",
            day: "Día",
            agenda: "Agenda",
            date: "Fecha",
            time: "Hora",
            event: "Evento",
            noEventsInRange: 'No hay reservas en este rango.',
          }}
      />
    </div>
  );
}