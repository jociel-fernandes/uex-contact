import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-profile-panel',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatSidenavModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule],
  templateUrl: './profile-panel.html',
  styleUrls: ['./profile-panel.scss']
})

export class ProfilePanelComponent implements OnInit {

   constructor( private router: Router) {}

  fb = inject(FormBuilder);
  http = inject(HttpClient);

  profileForm!: FormGroup;
  deleteForm!: FormGroup;

  ngOnInit() {
    this.buildForms();
    this.loadProfile();
  }

  buildForms() {
    this.profileForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(255)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.minLength(8)]],
      password_confirmation: ['']
    }, { validators: this.passwordMatchValidator });

    this.deleteForm = this.fb.group({
      password: ['', Validators.required]
    });
  }

  loadProfile() {
    this.http.get(`${environment.base_backend}/api/user`).subscribe((res: any) => {
      this.profileForm.patchValue({
        name: res.name,
        email: res.email
      });
    });
  }

  passwordMatchValidator(group: AbstractControl) {
    const password = group.get('password')?.value;
    const confirm = group.get('password_confirmation')?.value;
    return password === confirm ? null : { passwordMismatch: true };
  }

  updateProfile() {
    if (this.profileForm.invalid) return;
    const payload = { ...this.profileForm.value };
    if (!payload.password) {
      delete payload.password;
      delete payload.password_confirmation;
    }
    

    this.http.patch(`${environment.base_backend}/api/user/`, payload).subscribe({
      next: () => alert('Perfil atualizado com sucesso!'),
      error: (err) => console.error(err)
    });
  }

  deleteAccount() {
    if (this.deleteForm.invalid) return;
    this.http.post(`${environment.base_backend}/api/user`, this.deleteForm.value).subscribe({
      next: () => {
        alert('Conta removida com sucesso!');
        this.router.navigate(['/login']);
      },
      error: (err) => console.error(err)
    });
  }
}
