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

  constructor(private router: Router) {}

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
          this.router.navigate(['/dashboard']);
        } else {
          alert(data.error || 'Credenciales incorrectas');
        }
      })
      .catch(err => console.error(err));
  }
}
