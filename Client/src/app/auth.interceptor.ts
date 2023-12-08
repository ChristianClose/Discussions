import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AccountService } from './_services/account.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private accountService: AccountService) {}

  intercept(
    request: HttpRequest<any>, 
    next: HttpHandler): 
    Observable<HttpEvent<any>> {

      const userToken = this.accountService.userValue?.token;

      let authReq = request.clone({
        setHeaders: {
          'Accept': "application/json",
          'Authorization': `Bearer ${userToken}`,
          'Content-Type': "application/json",
        },
        //"responseType": request.method != "GET" && !request.url.includes("register") ? "text" : "json"
      })


    return next.handle(authReq);
  }
}
