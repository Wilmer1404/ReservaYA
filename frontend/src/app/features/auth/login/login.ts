import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { AuthCardComponent } from '../../../shared/components/auth-card/auth-card.component';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { toast } from 'ngx-sonner'; // Importar toast

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, AuthCardComponent, CommonModule, LucideAngularModule],
  templateUrl: './login.html',
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  isLoading = signal(false);

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  onSubmit() {
    if (this.loginForm.invalid) return;

    this.isLoading.set(true);
    const { email, password } = this.loginForm.value;

    this.authService.login({ email: email!, password: password! }).subscribe({
      next: (response) => {
        // Notificación rica
        toast.success(`¡Bienvenido de nuevo, ${response.userName}!`, {
          description: 'Has iniciado sesión correctamente.',
          duration: 3000,
        });

        this.isLoading.set(false);
        // La redirección ya la maneja el servicio, pero por seguridad:
        // this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        toast.error('Error de acceso', {
          description: err.error?.message || 'Credenciales incorrectas. Verifica tu correo y contraseña.',
        });
        this.isLoading.set(false);
      },
    });
  }
}
