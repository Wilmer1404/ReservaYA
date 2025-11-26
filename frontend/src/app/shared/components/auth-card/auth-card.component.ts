import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-auth-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div class="sm:mx-auto sm:w-full sm:max-w-md">
        <div class="text-center">
          <h2 class="mt-6 text-3xl font-extrabold text-gray-900">
            {{ title }}
          </h2>
          <p class="mt-2 text-sm text-gray-600" *ngIf="subtitle">
            {{ subtitle }}
          </p>
        </div>
      </div>

      <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <ng-content></ng-content>
        </div>
      </div>
    </div>
  `,
  styleUrls: []
})
export class AuthCardComponent {
  @Input() title: string = '';
  @Input() subtitle?: string;
}
