import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  imports: [CommonModule, FormsModule]
})
export class RegisterComponent {

  username: string = '';
  password: string = '';

  register() {
    console.log('Registrando usuario:', this.username, this.password);
    // Aquí llamas al AuthService.register()
  }
}
