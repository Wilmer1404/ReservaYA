import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { AuthCardComponent } from '../../../shared/components/auth-card/auth-card';
import { toast } from 'ngx-sonner';
import { LucideAngularModule } from "lucide-angular";

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, AuthCardComponent, LucideAngularModule],
  templateUrl: './register.html',
  styleUrls: [] // Usamos Tailwind, no necesitamos CSS específico por ahora
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  isLoading = signal(false);

  // Definición del formulario con validaciones
  registerForm = this.fb.group({
    institutionName: ['', [Validators.required, Validators.minLength(3)]],
    institutionType: ['university', [Validators.required]],
    institutionEmailDomain: [''], // Opcional
    adminName: ['', [Validators.required, Validators.minLength(3)]],
    adminEmail: ['', [Validators.required, Validators.email]],
    adminPassword: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', [Validators.required]]
  }, { validators: this.passwordMatchValidator });

  // Validador personalizado para comparar contraseñas
  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('adminPassword');
    const confirm = control.get('confirmPassword');

    if (!password || !confirm) return null;

    return password.value === confirm.value ? null : { mismatch: true };
  }

  onSubmit() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched(); // Muestra los errores si el usuario intenta enviar vacío
      return;
    }

    this.isLoading.set(true);
    const formValue = this.registerForm.value;

    // Construimos el objeto exacto que pide el Backend Java (RegisterRequest.java)
    const payload = {
      institutionName: formValue.institutionName!,
      institutionType: formValue.institutionType!,
      institutionEmailDomain: formValue.institutionEmailDomain || '',
      adminName: formValue.adminName!,
      adminEmail: formValue.adminEmail!,
      adminPassword: formValue.adminPassword!
    };

    this.authService.register(payload).subscribe({
      next: () => {
        toast.success('¡Registro Exitoso! Institución creada.');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error('Error en registro:', err);
        // Mostramos el mensaje que venga del backend o uno genérico
        toast.error(err.error?.message || 'No se pudo registrar la institución.');
        this.isLoading.set(false);
      }
    });
  }
}
