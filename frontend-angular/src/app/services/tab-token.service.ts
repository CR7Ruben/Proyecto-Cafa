import { Injectable } from '@angular/core';
import { v4 as uuid } from 'uuid';

@Injectable({
  providedIn: 'root'
})
export class TabTokenService {

  private key = 'tab-token';

  constructor() {
    if (!sessionStorage.getItem(this.key)) {
      sessionStorage.setItem(this.key, uuid());
    }
  }

  getToken() {
    return sessionStorage.getItem(this.key) || '';
  }
}
