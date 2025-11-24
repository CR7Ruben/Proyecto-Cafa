import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  standalone: true,
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent {

  constructor(
    public auth: AuthService,
    private router: Router
  ) {
    // 🔹 Bloquear acceso si no hay sesión activa
    if (!this.auth.isLogged()) {
      this.router.navigate(['/login']);
    }
  }

  async logout() {
    await this.auth.logout();
    this.router.navigate(['/login']);
  }

  goEncrypt() {
    this.router.navigate(['/encrypt']);
  }

  goDecrypt() {
    this.router.navigate(['/decrypt']);
  }
}
