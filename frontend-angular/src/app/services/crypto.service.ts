import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CryptoService {

  private api = 'http://localhost:4000/api/protected';

  constructor(private http: HttpClient) {}

  encrypt(data: any) {
    return this.http.post(`${this.api}/encrypt`, data);
  }

  decrypt(data: any) {
    return this.http.post(`${this.api}/decrypt`, data);
  }
}
