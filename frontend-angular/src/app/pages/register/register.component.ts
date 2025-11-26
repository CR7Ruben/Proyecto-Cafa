import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  standalone: true,
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  imports: [CommonModule, FormsModule, RouterModule] // 🔹 Agregado RouterModule
})
export class RegisterComponent {

  username = '';
  password = '';
  showAlert: any;
  alertType: any;
  alertMessage: any;

  constructor(
    private auth: AuthService,
    private router: Router
  ) { }

  async register() {
    const resp = await this.auth.register(this.username, this.password);

    if (resp.ok) {
      this.showAlert = true;
      this.alertType = 'success';
      this.alertMessage = '¡Registrado exitosamente! Redirigiendo...';

      // esperar 1 segundo y redirigir
      setTimeout(() => {
        this.router.navigate(['/login']);
      }, 1200);

    } else {
      this.showAlert = true;
      this.alertType = 'danger';
      this.alertMessage = resp.error || "Error en el registro";
    }
  }
}
