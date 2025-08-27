import { Component, OnInit, inject, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSidenav } from '@angular/material/sidenav';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { environment } from '../../../environments/environment';
import { debounceTime } from 'rxjs/operators';
import { MapsComponent } from '../maps/maps';

interface ContactType {
  id: number;
  name: string;
}

interface Contact {
  id: number;
  name: string;
  email: string;
  cpf: string;
  phone: string;
  address: string;
  number: string;
  complement: string;
  neighborhood: string;
  city: string;
  state: string;
  zip_code: string;
  latitude?: number;
  longitude?: number;
  contact_type_id?: number;
}

interface ApiCollectionResponse<T> {
  data: T[];
}

@Component({
  selector: 'app-contacts',
  standalone: true,
  imports: [CommonModule, MapsComponent, MatCardModule, MatToolbarModule, MatSidenav, MatSidenavModule, MatTableModule, MatPaginatorModule, MatInputModule, MatButtonModule, MatIconModule, MatDialogModule, MatSelectModule, ReactiveFormsModule],
  templateUrl: './contacts.html',
  styleUrls: ['./contacts.scss']
})
export class ContactsComponent implements OnInit {

   @ViewChild('formSidenav') formSidenav!: MatSidenav;

  http = inject(HttpClient);
  dialog = inject(MatDialog);
  fb = inject(FormBuilder);

  contacts: Contact[] = [];

  contactTypes: ContactType[] = [];
  displayedColumns = ['name', 'email', 'phone', 'actions'];
  filter = '';
  form!: FormGroup;
  editing: Contact | null = null;
  page = 1;
  perPage = 10;
  total = 0;

  ngOnInit() {
    this.loadContactTypes();
    this.loadContacts();
    this.buildForm();
  }

  buildForm(contact?: Contact) {

    console.log(this.contactTypes);
    this.form = this.fb.group({
      name: [contact?.name || '', Validators.required],
      cpf: [contact?.cpf || '', Validators.required],
      email: [contact?.email || '', [Validators.required, Validators.email]],
      phone: [contact?.phone || '', Validators.required],
      zip_code: [contact?.zip_code || '', Validators.required],
      address: [contact?.address || '', Validators.required],
      number: [contact?.number || '', Validators.required],
      complement: [contact?.complement || ''],
      neighborhood: [contact?.neighborhood || '', Validators.required],
      city: [contact?.city || '', Validators.required],
      state: [contact?.state || '', Validators.required],
      contact_type_id: [contact?.contact_type_id || '', this.contactTypes?.length ? Validators.required : ''] // ← corrigido
    });

    // CEP autocomplete
    this.form.get(`zip_code`)?.valueChanges.pipe(debounceTime(500)).subscribe(cep => {
      if (cep && cep.length >= 8) {
        this.http.get(`${environment.base_backend}/api/address/${cep}`).subscribe((res: any) => {
          this.form.patchValue({
            address: res.logradouro,
            neighborhood: res.bairro,
            city: res.localidade,
            state: res.uf
          });
        });
      }
    });
  }

  loadContactTypes() {
      const url = `${environment.base_backend}/api/contact-types`;
      this.http.get<ContactType[]>(url)
        .subscribe({
          next: (response) => {
            this.contactTypes = response || [];
          },
          error: (err) => {
            console.error("Ocorreu um erro ao buscar os dados:", err);}
        });
    }

  loadContacts() {
    const params: any = { page: this.page, per_page: this.perPage };
    if (this.filter) params.search = this.filter;
    this.http.get<any>(`${environment.base_backend}/api/contacts`, { params }).subscribe(res => {
      this.contacts = res.data;
      this.total = res.total;
    });
  }

  search(event: Event) {
    const target = event.target as HTMLInputElement;
    this.filter = target.value;
    this.loadContacts();
  }

  edit(contact: Contact) {
    this.editing = contact;
    this.buildForm(contact);
    this.formSidenav.open();
  }

  delete(contact: Contact) {
    if (!confirm('Deseja realmente excluir este contato?')) return;
    this.http.delete(`${environment.base_backend}/api/contacts/${contact.id}`).subscribe(() => {
      this.loadContacts();
    });
  }

  openFormSidenav() {
    this.buildForm();
    this.formSidenav.open();
  }
  closeFormSidenav() {
    this.buildForm();
    this.formSidenav.close();
  }

  save() {

    console.log(this.form.valid);
    if (!this.form.valid) return;
    const request$ = this.editing
      ? this.http.put(`${environment.base_backend}/api/contacts/${this.editing.id}`, this.form.value)
      : this.http.post(`${environment.base_backend}/api/contacts`, this.form.value);

    request$.subscribe(() => {
      this.editing = null;
      this.formSidenav.close();
      this.form.reset();
      this.loadContacts();
    });
  }

  selectContact(contact: Contact) {
    window.dispatchEvent(new CustomEvent('contact-selected', { detail: contact }));
  }
}
