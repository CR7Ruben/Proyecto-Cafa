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

  constructor(private router: Router) { }

  ngOnInit() {
    // ⬅️ Mantener un tabToken por pestaña
    const saved = sessionStorage.getItem('tabToken');

    if (saved) {
      this.tabToken = saved;
    } else {
      this.tabToken = crypto.randomUUID();
      sessionStorage.setItem('tabToken', this.tabToken);
    }
  }

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
