import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router) { }

  canActivate(): boolean {
    console.log('🛡️AuthGuard ejecutándose...');

    // Cambiar de localStorage a sessionStorage
    const isLogged = sessionStorage.getItem('isLogged');
    console.log('🛡️sessionStorage isLogged: ', isLogged);

    if (isLogged === 'true') {
      console.log('✅AuthGuard: Acceso permitido');
      return true;
    }

    console.log('❌AuthGuard: Acceso denegado, redirigiendo a login');
    this.router.navigate(['/login']);
    return false;
  }
}