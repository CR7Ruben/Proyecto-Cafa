import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-decrypt',
  templateUrl: './decrypt.component.html',
  styleUrls: ['./decrypt.component.css'],
  imports: [CommonModule, FormsModule]
})
export class DecryptComponent {

  ciphertext = '';
  passwordKey = '';
  plaintext = '';

  alertMessage = '';
  alertType: 'success' | 'danger' = 'success';
  showAlert = false;

  constructor(private auth: AuthService, private router: Router) {}

  private showBootstrapAlert(message: string, type: 'success' | 'danger' = 'success') {
    this.alertMessage = message;
    this.alertType = type;
    this.showAlert = true;
    setTimeout(() => this.showAlert = false, 4000);
  }

  async decrypt() {
    if (!this.passwordKey) {
      this.showBootstrapAlert("Debes ingresar la misma llave usada para encriptar", 'danger');
      return;
    }

    try {
      const resp = await this.auth.decrypt(this.ciphertext, this.passwordKey);
      if (resp.plaintext) {
        this.plaintext = resp.plaintext;
        this.showBootstrapAlert("Texto desencriptado correctamente", 'success');
      } else {
        this.showBootstrapAlert(resp.error || "Error al desencriptar. Revisa la llave o el texto cifrado.", 'danger');
      }
    } catch {
      this.showBootstrapAlert("No hay sesión activa. Inicia sesión nuevamente.", 'danger');
    }
  }

  generateKey() {
    this.passwordKey = Math.random().toString(36).slice(-16);
    this.showBootstrapAlert("Llave generada correctamente", 'success');
  }

  goToDashboard() {
    this.router.navigate(['/dashboard']);
  }
}
