import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { TabTokenService } from './tab-token.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private api = 'http://localhost:4000/api';

  private logged = false;

  constructor(
    private http: HttpClient,
    private router: Router,
    private tabToken: TabTokenService
  ) {}

  register(data: any) {
    return this.http.post(`${this.api}/auth/register`, data);
  }

  login(data: any) {
    return this.http.post(`${this.api}/auth/login`, data);
  }

  logout() {
    return this.http.post(`${this.api}/auth/logout`, {}).subscribe(() => {
      this.logged = false;
      this.router.navigate(['/login']);
    });
  }

  setLogged(status: boolean) {
    this.logged = status;
  }

  isLoggedIn() {
    return this.logged;
  }
}
