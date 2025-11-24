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

  constructor(
    private auth: AuthService,
    private router: Router
  ) {}

  async register() {
    const resp = await this.auth.register(this.username, this.password);

    if (resp.ok) {
      alert("Registrado exitosamente");
      this.router.navigate(['/login']);
    } else {
      alert(resp.error || "Error en registro");
    }
  }
}
