import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule, MatSidenav } from '@angular/material/sidenav';
import { RouterModule } from '@angular/router';
import { ProfilePanelComponent } from '../components/profile-panel/profile-panel';
import { ContactsComponent } from '../components/contacts/contacts';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatSidenavModule,
    RouterModule,
    ProfilePanelComponent,
    ContactsComponent,
    ReactiveFormsModule
  ],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss']
})
export class Dashboard {
  @ViewChild('profileSidenav') profileSidenav!: MatSidenav;

  openProfile() {
    this.profileSidenav.open();
  }
}
