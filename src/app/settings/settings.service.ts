import { Injectable } from '@angular/core'

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  url: string | null = null
  user: string | null = null
  password: string | null = null

  constructor() {
    this.url = localStorage.getItem('url')
    this.user = localStorage.getItem('user')
    this.password = localStorage.getItem('password')
  }
}
