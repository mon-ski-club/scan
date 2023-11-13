import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  url = localStorage.getItem('url') || 'http://localhost:5984';
  user = localStorage.getItem('user') || 'admin';
  password = localStorage.getItem('password') || 'secret';

  constructor() {}
}
