import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-logout',
  standalone: true,
  imports: [CommonModule, MatProgressSpinnerModule],
  templateUrl: './logout.html',
  styleUrls: ['./logout.scss']
})
export class Logout implements OnInit {
  loading = true;

  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.auth.logout().subscribe({
      next: () => {
        this.router.navigate(['/login']);
      },
      error: () => {
        this.loading = false;
        this.router.navigate(['/login']);
      }
    });
  }
}
