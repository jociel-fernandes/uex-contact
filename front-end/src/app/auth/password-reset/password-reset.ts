import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../auth';

@Component({
  selector: 'app-password-reset',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    RouterLink
  ],
  templateUrl: './password-reset.html',
  styleUrls: ['./password-reset.scss']
})
export class PasswordReset {
  form: FormGroup;
  error = '';
  success = '';
  loading = false;
  token = '';
  email = '';

  constructor(private auth: AuthService, private router: Router, private route: ActivatedRoute) {
    this.token = this.route.snapshot.paramMap.get('token') ?? '';
    this.email = this.route.snapshot.queryParamMap.get('email') ?? '';
    this.form = new FormGroup({
      email: new FormControl( this.email , [Validators.required, Validators.email ]),
      password: new FormControl('', Validators.required),
      password_confirmation: new FormControl('', Validators.required)
    });
  }

  submit() {
    if (this.form.invalid) return;

    this.loading = true;
    this.error = '';
    this.success = '';

    const payload = { ...this.form.value, token: this.token };

    this.auth.resetPassword(payload).subscribe({
      next: () => {
        this.success = 'Senha redefinida com sucesso!';
        setTimeout(() => this.router.navigate(['/login']), 2000);
        this.loading = false;
      },
      error: err => {
        this.error = err?.error?.message || 'Erro ao redefinir senha';
        this.loading = false;
      }
    });
  }
}
