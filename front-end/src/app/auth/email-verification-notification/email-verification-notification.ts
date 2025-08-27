import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { AuthService } from '../auth';

@Component({
  selector: 'app-email-verification-notification',
  standalone: true,
  imports: [CommonModule, MatButtonModule, RouterLink],
  templateUrl: './email-verification-notification.html',
  styleUrls: ['./email-verification-notification.scss']
})
export class EmailVerificationNotification {
  message = '';
  loading = false;

  constructor(private auth: AuthService) {}

  resend() {
    this.loading = true;
    this.auth.resendVerification().subscribe({
      next: () => {
        this.message = 'Email de verificação reenviado com sucesso!';
        this.loading = false;
      },
      error: err => {
        this.message = err?.error?.message || 'Erro ao reenviar email.';
        this.loading = false;
      }
    });
  }
}
