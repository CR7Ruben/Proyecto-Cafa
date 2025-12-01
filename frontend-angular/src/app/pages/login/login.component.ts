import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  standalone: true,
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [CommonModule, FormsModule, RouterModule]
})
export class LoginComponent implements OnInit {

  username = '';
  password = '';
  tabToken!: string;

  showAlert = false;
  alertType: 'success' | 'danger' = 'danger';
  alertMessage = '';
  passwordVisible = false;
  loading = false;

  constructor(
    private router: Router,
    private authService: AuthService
  ) { }

  ngOnInit() {
    // Recuperar o generar tabToken
    const saved = sessionStorage.getItem('tabToken');
    if (saved) {
      this.tabToken = saved;
    } else {
      this.tabToken = crypto.randomUUID();
      sessionStorage.setItem('tabToken', this.tabToken);
    }
  }

  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }

  async login() {
    if (!this.username || !this.password) {
      this.showAlert = true;
      this.alertType = 'danger';
      this.alertMessage = 'Por favor, ingresa usuario y contraseña';
      return;
    }

    this.loading = true;
    this.showAlert = false;

    try {
      const response = await this.authService.login(this.username, this.password);

      if (response.ok) {  // ⚠️ 'ok' en lugar de 'success'
        sessionStorage.setItem('isLogged', 'true');
        this.router.navigate(['/dashboard']); // o '/inicio' según tu ruta
      } else {
        this.showAlert = true;
        this.alertType = 'danger';
        this.alertMessage = response.error || 'Error al iniciar sesión';
      }

    } catch (err) {
      console.error('Error de conexión:', err);
      this.showAlert = true;
      this.alertType = 'danger';
      this.alertMessage = 'Error de conexión con el servidor';
    } finally {
      this.loading = false;
    }
  }
}
