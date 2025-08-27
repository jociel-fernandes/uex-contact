import { Component, OnInit, inject, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';

declare const google: any;

@Component({
  selector: 'app-maps',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './maps.html',
  styleUrls: ['./maps.scss']
})
export class MapsComponent implements OnInit {
  http = inject(HttpClient);
  map: any;
  markers: any[] = [];
  ngZone = inject(NgZone);

  ngOnInit() {
    this.loadMap();
    this.loadContacts();

    window.addEventListener('contact-selected', (e: any) => {
      this.highlightContactOnMap(e.detail);
    });
  }

  loadMap() {
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${environment.gcp_api_maps}`;
    script.defer = true;
    script.onload = () => {
      this.map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: -15.7942, lng: -47.8822 }, // Brasília
        zoom: 5
      });
    };
    document.head.appendChild(script);
  }

  loadContacts() {
    this.http.get<any>(`${environment.base_backend}/api/contacts`).subscribe(res => {
      res.data.forEach((contact: any) => {
        if (contact.latitude && contact.longitude) {
          const marker = new google.maps.Marker({
            position: { lat: parseFloat(contact.latitude), lng: parseFloat(contact.longitude) },
            map: this.map,
            title: contact.name
          });
          this.markers.push({ id: contact.id, marker });
        }
      });
    });
  }

  highlightContactOnMap(contact: any) {
    console.log('contato MapsComponent',contact);
    this.markers.forEach(m => m.marker.setMap(null));
    this.markers = [];

    if (contact.latitude && contact.longitude) {
      const marker = new google.maps.Marker({
        position: { lat: parseFloat(contact.latitude), lng: parseFloat(contact.longitude) },
        map: this.map,
        title: contact.name
      });
      this.markers.push({ id: contact.id, marker });
      this.map.setCenter({ lat: parseFloat(contact.latitude), lng: parseFloat(contact.longitude)});
      this.map.setZoom(15);
    }
  }
}
