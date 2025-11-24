import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-encrypt',
  templateUrl: './encrypt.component.html',
  styleUrls: ['./encrypt.component.css'],
  imports: [CommonModule, FormsModule]
})
export class EncryptComponent {

  plaintext = '';
  passwordKey = '';
  ciphertext = '';

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

  async encrypt() {
    if (!this.passwordKey) {
      this.showBootstrapAlert("Debes ingresar o generar una llave", 'danger');
      return;
    }

    try {
      const resp = await this.auth.encrypt(this.plaintext, this.passwordKey);
      if (resp.ciphertext) {
        this.ciphertext = resp.ciphertext;
        this.showBootstrapAlert("Texto encriptado correctamente", 'success');
      } else {
        this.showBootstrapAlert(resp.error || "Error al encriptar", 'danger');
      }
    } catch {
      this.showBootstrapAlert("No hay sesión activa. Inicia sesión nuevamente.", 'danger');
    }
  }

  generateKey() {
    this.passwordKey = Math.random().toString(36).slice(-16);
    this.showBootstrapAlert("Llave generada correctamente", 'success');
  }

  goToDecrypt() {
    this.router.navigate(['/decrypt']);
  }
}
