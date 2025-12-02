import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { AuthCardComponent } from '../../../shared/components/auth-card/auth-card.component';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { toast } from 'ngx-sonner'; // Importar toast

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, AuthCardComponent, CommonModule, LucideAngularModule],
  templateUrl: './register.html',
  styleUrls: []
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  isLoading = signal(false);

  registerForm = this.fb.group({
    institutionName: ['', [Validators.required, Validators.minLength(3)]],
    institutionType: ['university', [Validators.required]],
    institutionEmailDomain: [''],
    adminName: ['', [Validators.required, Validators.minLength(3)]],
    adminEmail: ['', [Validators.required, Validators.email]],
    adminPassword: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', [Validators.required]]
  }, { validators: this.passwordMatchValidator });

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('adminPassword');
    const confirm = control.get('confirmPassword');
    if (!password || !confirm) return null;
    return password.value === confirm.value ? null : { mismatch: true };
  }

  onSubmit() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      // Toast de advertencia
      toast.warning('Formulario incompleto', {
        description: 'Por favor, revisa los campos marcados en rojo.',
      });
      return;
    }

    this.isLoading.set(true);
    const formValue = this.registerForm.value;

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
        toast.success('¡Registro Exitoso!', {
          description: 'La institución ha sido creada. Ahora puedes iniciar sesión.',
          duration: 5000,
        });
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error(err);
        toast.error('Error en el registro', {
          description: err.error?.message || 'No se pudo crear la cuenta. Inténtalo de nuevo.',
        });
        this.isLoading.set(false);
      }
    });
  }
}
