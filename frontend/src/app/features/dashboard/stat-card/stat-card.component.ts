import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-stat-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-white rounded-lg shadow p-4">
      <div class="flex items-center justify-between">
        <div>
          <div class="text-sm text-slate-500">{{ title }}</div>
          <div class="text-2xl font-semibold text-slate-900">{{ value }}</div>
        </div>
        <div *ngIf="icon" class="text-slate-400">{{ icon }}</div>
      </div>
    </div>
  `,
  styles: []
})
export class StatCardComponent {
  @Input() title = '';
  @Input() value: string | number = '';
  @Input() icon?: string;
}
