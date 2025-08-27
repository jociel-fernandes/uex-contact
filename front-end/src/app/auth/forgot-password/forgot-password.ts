import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../auth';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    RouterLink
  ],
  templateUrl: './forgot-password.html',
  styleUrls: ['./forgot-password.scss']
})
export class ForgotPassword {
  form: FormGroup;
  error = '';
  success = '';
  loading = false;

  constructor(private auth: AuthService, private router: Router) {
    this.form = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email])
    });
  }

  submit() {
    if (this.form.invalid) return;

    this.loading = true;
    this.error = '';
    this.success = '';

    this.auth.forgotPassword(this.form.value).subscribe({
      next: () => {
        this.success = 'Email de recuperação enviado!';
        this.loading = false;
      },
      error: err => {
        this.error = err?.error?.message || 'Erro ao enviar email';
        this.loading = false;
      }
    });
  }
}
