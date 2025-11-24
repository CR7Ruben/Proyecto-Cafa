import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

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

  tabToken = crypto.randomUUID();

  constructor(private router: Router) { }

  login() {
    const payload = {
      username: this.username,
      password: this.password,
      tabToken: this.tabToken
    };

    fetch('http://localhost:4000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify(payload)
    })
      .then(async res => {
        const data = await res.json();
        console.log("Respuesta BACKEND:", data);

        if (data.ok === true) {
          // 🔹 Guardar sesión solo en la pestaña actual
          sessionStorage.setItem('isLogged', 'true');
          sessionStorage.setItem('tabToken', this.tabToken);

          this.router.navigate(['/dashboard']);
        } else {
          alert("Credenciales incorrectas");
        }
      })
      .catch(err => console.error(err));
  }
}
