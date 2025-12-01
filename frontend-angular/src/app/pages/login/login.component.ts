import { Component, OnInit } from '@angular/core';
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
export class LoginComponent implements OnInit {

  username = '';
  password = '';
  tabToken!: string;

  showAlert: any;
  alertType: any;
  alertMessage: any;
  passwordVisible = false;

  constructor(private router: Router) { }

  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }

  ngOnInit() {
    const saved = sessionStorage.getItem('tabToken');

    if (saved) {
      this.tabToken = saved;
    } else {
      this.tabToken = crypto.randomUUID();
      sessionStorage.setItem('tabToken', this.tabToken);
    }
  }

  login() {
    fetch('http://localhost:4000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({
        username: this.username,
        password: this.password,
        tabToken: this.tabToken
      })
    })
      .then(res => res.json())
      .then(data => {
        console.log("Respuesta BACKEND:", data);

        if (data.ok) {
          sessionStorage.setItem('isLogged', 'true');
          this.showAlert = true;
          this.alertType = 'success';
          this.alertMessage = '¡Inicio de sesión exitoso!';

          setTimeout(() => {
            this.router.navigate(['/dashboard']);
          }, 1200);

        } else {
          this.showAlert = true;
          this.alertType = 'danger';
          this.alertMessage = (data.error === 'Invalid creds') ? 'El usuario no existe' : data.error;
        }
      })

      .catch(err => {
        console.error(err);
        this.showAlert = true;
        this.alertType = 'danger';
        this.alertMessage = 'Error al conectar con el servidor';
      });
  }
}
