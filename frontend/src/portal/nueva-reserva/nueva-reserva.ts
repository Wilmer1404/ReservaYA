import { Component, OnInit } from '@angular/core';
import { SpaceService } from '../../services/space.service';
import { ReservationService } from '../../services/reservation.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-nueva-reserva',
  templateUrl: './nueva-reserva.component.html'
})
export class NuevaReservaComponent implements OnInit {
  step = 1;
  spaces: any[] = [];
  form: FormGroup;
  loadingSpaces = false;
  creating = false;
  error: string | null = null;
  success: string | null = null;

  constructor(
    private spaceSvc: SpaceService,
    private reservationSvc: ReservationService,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      spaceId: [null, Validators.required],
      date: [null, Validators.required],
      startTime: ['', Validators.required], // opcional
      endTime: ['']
    });
  }

  ngOnInit() {
    this.loadingSpaces = true;
    this.spaceSvc.getSpaces().subscribe({
      next: (s) => { this.spaces = s; this.loadingSpaces = false; },
      error: (e) => { this.error = 'No se pudieron cargar espacios'; this.loadingSpaces = false; }
    });
  }

  next() {
    if (this.step === 1 && !this.form.value.spaceId) return;
    if (this.step === 2 && !this.form.value.date) return;
    this.step++;
  }

  prev() { if (this.step>1) this.step--; }

  submit() {
    if (this.form.invalid) { this.error = 'Complete los campos'; return; }
    const payload = {
      spaceId: this.form.value.spaceId,
      date: this.form.value.date, // asegura formato ISO yyyy-mm-dd si es string
      startTime: this.form.value.startTime,
      endTime: this.form.value.endTime
    };
    this.creating = true;
    this.reservationSvc.createReservation(payload).subscribe({
      next: (r) => { this.success = 'Reserva creada'; this.creating = false; this.step = 1; this.form.reset(); },
      error: (err) => { this.error = err?.error?.message || 'Error creando reserva'; this.creating = false; }
    });
  }
}
