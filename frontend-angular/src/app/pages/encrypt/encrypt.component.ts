import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-encrypt',
  templateUrl: './encrypt.component.html',
  styleUrls: ['./encrypt.component.css'],
  imports: [CommonModule, FormsModule]
})
export class EncryptComponent {

  plaintext: string = '';
  passwordKey: string = '';
  ciphertext: string = '';

  encrypt() {
    // Lógica de encriptación real va aquí
    // Por ahora solo demostración:
    this.ciphertext = `Texto encriptado: ${this.plaintext}`;
  }
}
