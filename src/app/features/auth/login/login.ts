import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { CardModule } from 'primeng/card';
import { CheckboxModule } from 'primeng/checkbox';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth';
import { LoginDto } from '../../../core/models';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    PasswordModule,
    CardModule,
    CheckboxModule
  ],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  loginForm = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required]
  });

  loading = false;
  error = '';

  onSubmit() {
    if (this.loginForm.valid) {
      this.loading = true;
      this.error = '';
      const value = this.loginForm.value;
      const payload: LoginDto = {
        username: value.username || '',
        password: value.password || ''
      };
      this.authService.login(payload).subscribe({
        next: () => {
          const targetRoute = this.authService.getInitialRouteForUser();
          this.router.navigate([targetRoute]);
        },
        error: (err) => {
          this.error = 'Login fallido. Verifique sus credenciales.';
          this.loading = false;
        }
      });
    }
  }
}
