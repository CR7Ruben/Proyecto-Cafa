import { Injectable } from '@angular/core';
import { v4 as uuidv4 } from 'uuid';

@Injectable({ providedIn: 'root' })
export class AuthService {
  BACKEND_URL = 'http://177.227.43.252:4000/api';

  // Siempre obtener o crear tabToken
  get tabToken(): string {
    let token = sessionStorage.getItem('tabToken');
    if (!token) {
      token = uuidv4();
      sessionStorage.setItem('tabToken', token);
    }
    return token;
  }

  // 🔹 LOGIN
  async login(username: string, password: string) {
    try {
      const res = await fetch(`${this.BACKEND_URL}/auth/login`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-tab-token': this.tabToken
        },
        credentials: 'include',
        body: JSON.stringify({ username, password, tabToken: this.tabToken })
      });
      const data = await res.json();
      console.log('🔥 Login response:', data);
      return data;
    } catch (err) {
      console.error('❌ AuthService login error:', err);
      return { ok: false, error: 'Error de conexión' };
    }
  }

  // 🔹 REGISTER
  async register(username: string, password: string) {
    try {
      const res = await fetch(`${this.BACKEND_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ username, password })
      });
      return await res.json();
    } catch (err) {
      console.error('❌ AuthService register error:', err);
      return { ok: false, error: 'Error de conexión' };
    }
  }

  // 🔹 LOGOUT
  async logout() {
    try {
      const res = await fetch(`${this.BACKEND_URL}/auth/logout`, {
        method: 'POST',
        headers: { 'x-tab-token': this.tabToken },
        credentials: 'include'
      });
      sessionStorage.removeItem('tabToken');
      sessionStorage.removeItem('isLogged');
      return await res.json();
    } catch (err) {
      console.error('❌ AuthService logout error:', err);
      return { ok: false, error: 'Error de conexión' };
    }
  }

  // 🔹 ENCRYPT
  async encrypt(plaintext: string, passwordKey: string) {
    try {
      const res = await fetch(`${this.BACKEND_URL}/protected/encrypt`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-tab-token': this.tabToken
        },
        credentials: 'include',
        body: JSON.stringify({ plaintext, passwordKey })
      });
      return await res.json();
    } catch (err) {
      console.error('❌ AuthService encrypt error:', err);
      return { ok: false, error: 'Error de conexión' };
    }
  }

  // 🔹 DECRYPT
  async decrypt(ciphertext: string, passwordKey: string) {
    try {
      const res = await fetch(`${this.BACKEND_URL}/protected/decrypt`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-tab-token': this.tabToken
        },
        credentials: 'include',
        body: JSON.stringify({ ciphertext, passwordKey })
      });
      return await res.json();
    } catch (err) {
      console.error('❌ AuthService decrypt error:', err);
      return { ok: false, error: 'Error de conexión' };
    }
  }

  // 🔹 CHECK LOGIN
  isLogged(): boolean {
    return sessionStorage.getItem('isLogged') === 'true';
  }
}