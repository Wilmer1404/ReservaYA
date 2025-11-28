import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { CalendarOptions } from '@fullcalendar/core';
import { DashboardService } from '../../../core/services/dashboard.service';

(FullCalendarModule as any).registerPlugins([dayGridPlugin, interactionPlugin]);

@Component({
  selector: 'app-horarios',
  standalone: true,
  imports: [CommonModule, FullCalendarModule],
  template: `
    <div>
      <h2 class="text-2xl font-bold mb-4">Calendario de Reservas</h2>
      <div class="bg-white rounded shadow p-4">
        <full-calendar [options]="calendarOptions"></full-calendar>
      </div>
    </div>
  `,
  styles: []
})
export class HorariosComponent implements OnInit {
  private dashboardService = inject(DashboardService);

  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    events: [],
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,dayGridWeek,dayGridDay'
    }
  };

  ngOnInit(): void {
    this.dashboardService.getEvents().subscribe(events => {
      this.calendarOptions = { ...this.calendarOptions, events };
    }, () => {
      // silent fail - show empty calendar
    });
  }
}
