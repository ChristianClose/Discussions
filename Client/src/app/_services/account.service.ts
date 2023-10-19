import { Injectable } from '@angular/core';
import { User } from '../_models/user';
import { HttpClient } from '@angular/common/http';
import { Constants } from '../config/constants';
import { Observable } from 'rxjs/internal/Observable';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { map } from 'rxjs/internal/operators/map';

@Injectable({
  providedIn: 'root'
})

export class AccountService {
  private userSubject: BehaviorSubject<User | null>;
  public user: Observable<User | null>;


  constructor(private http: HttpClient) {
    this.userSubject = new BehaviorSubject(JSON.parse(localStorage.getItem("user")!));
    this.user = this.userSubject.asObservable();
  }

  Login(username: string, password: string): Observable<User> {
    return this.http.post<User>(Constants.API_ENDPOINT + "/account/login", { username, password })
      .pipe(map((user: User) => {
        if (user) {
          localStorage.setItem("user", JSON.stringify(user));
          this.userSubject.next(user);
        }
        return user;
      }));
  }

  Logout() {
    localStorage.removeItem("user");
    this.userSubject.next(null);
  }

  public get userValue() {
    return this.userSubject.value;
  }

  Register(username: string, password: string) {
    return this.http.post<User>(Constants.API_ENDPOINT + "/account/register", { username, password })
      .pipe(map((user: User) => {
        if(user) {
          localStorage.setItem("user", JSON.stringify(user));
          this.userSubject.next(user);
        }
        return user;
      }))
  }
}
