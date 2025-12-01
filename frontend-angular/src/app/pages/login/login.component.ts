import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  standalone: true,
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [CommonModule, FormsModule, RouterModule]
})
export class LoginComponent {

  username = '';
  password = '';
  showAlert = false;
  alertType: 'success' | 'danger' = 'danger';
  alertMessage = '';
  passwordVisible = false;

  constructor(
    private auth: AuthService,
    private router: Router
  ) { }

  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }

  async login() {
    const resp = await this.auth.login(this.username, this.password);

    if (resp && resp.ok) {
      sessionStorage.setItem('isLogged', 'true');
      this.showAlert = true;
      this.alertType = 'success';
      this.alertMessage = '¡Ingreso exitoso! Redirigiendo...';

      setTimeout(() => {
        this.router.navigate(['/dashboard']);
      }, 800);

    } else {
      this.showAlert = true;
      this.alertType = 'danger';
      this.alertMessage = (resp && resp.error) ? resp.error : 'Credenciales inválidas';
    }
  }

}