import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../auth';

@Component({
  selector: 'app-verify-email',
  standalone: true,
  imports: [CommonModule, MatButtonModule, RouterLink],
  templateUrl: './verify-email.html',
  styleUrls: ['./verify-email.scss']
})
export class VerifyEmail implements OnInit {
  message = '';
  loading = false;

  constructor(private auth: AuthService, private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.verify();
  }

  verify() {
    const id = this.route.snapshot.paramMap.get('id') || '';
    const hash = this.route.snapshot.paramMap.get('hash') || '';

    if (!id || !hash) {
      this.message = 'Link inválido.';
      return;
    }

    this.loading = true;
    this.auth.verifyEmail( id, hash ).subscribe({
      next: () => {
        this.message = 'Email verificado com sucesso!';
        setTimeout(() => this.router.navigate(['/']), 2000);
        this.loading = false;
      },
      error: err => {
        this.message = err?.error?.message || 'Erro ao verificar email.';
        this.loading = false;
      }
    });
  }
}
