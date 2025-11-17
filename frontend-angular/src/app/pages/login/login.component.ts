import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [CommonModule, FormsModule]
})
export class LoginComponent {

  username: string = '';
  password: string = '';

  login() {
    console.log('Intentando iniciar sesión con:', this.username, this.password);
    // Aquí llamas AuthService + JWT + bloqueo pestañas
  }
}
