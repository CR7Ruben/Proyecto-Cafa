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
  imports: [CommonModule, FormsModule, RouterModule]
})
export class RegisterComponent {

  username = '';
  password = '';
  showAlert: any;
  alertType: any;
  alertMessage: any;
  passwordVisible = false;

  constructor(
    private auth: AuthService,
    private router: Router
  ) { }

  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }

  validarCredenciales(): string | null {
    const passRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&._-])[A-Za-z\d@$!%*?&._-]{8,}$/;

    if (!passRegex.test(this.password)) {
      return "La contraseña debe tener mínimo 8 caracteres, mayúscula, minúscula, número y un carácter especial.";
    }

    return null;
  }

  async register() {
    const error = this.validarCredenciales();

    if (error) {
      this.showAlert = true;
      this.alertType = 'danger';
      this.alertMessage = error;
      return;
    }

    const resp = await this.auth.register(this.username, this.password);

    if (resp.ok) {
      this.showAlert = true;
      this.alertType = 'success';
      this.alertMessage = '¡Registrado exitosamente! Redirigiendo...';

      setTimeout(() => {
        this.router.navigate(['/login']);
      }, 1200);

    } else {
      this.showAlert = true;
      this.alertType = 'danger';
      this.alertMessage = this.traducirError(resp.error);
    }
  }


  traducirError(error: string) {
    switch (error) {
      case 'Invalid password': return 'Contraseña inválida';
      case 'Invalid username': return 'Usuario inválido';
      case 'User exists': return 'El usuario ya existe';
      default: return error || 'Error en el registro';
    }
  }

}
