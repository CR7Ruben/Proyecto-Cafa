import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-decrypt',
  templateUrl: './decrypt.component.html',
  styleUrls: ['./decrypt.component.css'],
  imports: [CommonModule, FormsModule]
})
export class DecryptComponent {

  ciphertext: string = '';
  passwordKey: string = '';
  plaintext: string = '';

  decrypt() {
    // Aquí va tu lógica real de desencriptación
    // Por ahora solo demostración:
    this.plaintext = `Texto desencriptado: ${this.ciphertext}`;
  }
}
