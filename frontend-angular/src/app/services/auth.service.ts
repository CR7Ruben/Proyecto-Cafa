import { Injectable } from '@angular/core';
import { v4 as uuidv4 } from 'uuid'; // 🔹 instalar: npm install uuid

@Injectable({ providedIn: 'root' })
export class AuthService {

  FRONT_URL = 'http://localhost:4000';

  // 🔹 Usar token guardado en sessionStorage o generar uno nuevo
  get tabToken() {
    let token = sessionStorage.getItem('tabToken');
    if (!token) {
      token = uuidv4(); // 🔹 uuidv4 funciona en cualquier navegador
      sessionStorage.setItem('tabToken', token);
    }
    return token;
  }

  async login(username: string, password: string) {
    const body = { username, password, tabToken: this.tabToken };

    const res = await fetch(`${this.FRONT_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'x-tab-token': this.tabToken
      },
      credentials: 'include',
      body: JSON.stringify(body)
    });

    return res.json();
  }

  async register(username: string, password: string) {
    const res = await fetch(`${this.FRONT_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ username, password })
    });

    return res.json();
  }

  async logout() {
    const res = await fetch(`${this.FRONT_URL}/api/auth/logout`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'x-tab-token': this.tabToken }
    });

    sessionStorage.removeItem('tabToken');
    sessionStorage.removeItem('isLogged');
    return res.json();
  }

  async encrypt(plaintext: string, passwordKey: string) {
    const res = await fetch(`${this.FRONT_URL}/api/protected/encrypt`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        "Content-Type": "application/json",
        "x-tab-token": this.tabToken
      },
      body: JSON.stringify({ plaintext, passwordKey })
    });
    return res.json();
  }

  async decrypt(ciphertext: string, passwordKey: string) {
    const res = await fetch(`${this.FRONT_URL}/api/protected/decrypt`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        "Content-Type": "application/json",
        "x-tab-token": this.tabToken
      },
      body: JSON.stringify({ ciphertext, passwordKey })
    });
    return res.json();
  }

  isLogged(): boolean {
    return sessionStorage.getItem('isLogged') === 'true';
  }
}
