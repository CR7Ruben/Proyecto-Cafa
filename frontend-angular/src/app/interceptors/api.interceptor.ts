import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TabTokenService } from '../services/tab-token.service';

@Injectable()
export class ApiInterceptor implements HttpInterceptor {

  constructor(private tabToken: TabTokenService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    const token = this.tabToken.getToken();

    const cloned = req.clone({
      withCredentials: true,
      setHeaders: {
        'x-tab-token': token
      }
    });

    return next.handle(cloned);
  }
}
