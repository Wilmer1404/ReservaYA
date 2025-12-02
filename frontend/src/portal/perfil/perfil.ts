import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html'
})
export class PerfilComponent {
  form = this.fb.group({
    currentPassword: ['', Validators.required],
    newPassword: ['', [Validators.required, Validators.minLength(8)]],
    confirmPassword: ['', Validators.required]
  });
  error: string | null = null;
  success: string | null = null;
  loading = false;

  constructor(private fb: FormBuilder, private userSvc: UserService) {}

  submit() {
    this.error = null;
    this.success = null;
    if (this.form.invalid) { this.error = 'Complete todos los campos'; return; }
    if (this.form.value.newPassword !== this.form.value.confirmPassword) {
      this.error = 'La nueva contraseña no coincide';
      return;
    }
    this.loading = true;
    const payload = { currentPassword: this.form.value.currentPassword, newPassword: this.form.value.newPassword };
    this.userSvc.changePassword(payload).subscribe({
      next: () => { this.success = 'Contraseña actualizada'; this.loading = false; this.form.reset(); },
      error: err => { this.error = err?.error?.message || 'Error al cambiar'; this.loading = false; }
    });
  }
}
