import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import type { LoginModel } from '../login/user.model';
import { UserModel } from './user.model';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http: HttpClient = inject(HttpClient);
  private router: Router = inject(Router);

  private apiUrl = 'http://192.168.1.28:5000/api/v1/auth'; // L'endpoint di login
  private loggedIn$ = new BehaviorSubject<boolean>(false); // Stato di login
  private userLogged$ = new BehaviorSubject<UserModel>({
    username: '',
    userId: '',
    role: '',
  });
  private isAuthenticating$ = new BehaviorSubject<boolean>(true);

  autoLogin(): Observable<any> {
    let options = { withCredentials: true };

    return this.http.get<any>(`${this.apiUrl}/me`, options).pipe(
      tap((response) => {
        if (
          response &&
          response.success &&
          response.body &&
          response.body.data &&
          response.body.data.user
        ) {
          this.loggedIn$.next(true);
          this.userLogged$.next(response.body.data.user);
          this.router.navigate(['/dashboard']);

          return true;
        } else {
          this.loggedIn$.next(false);

          return false;
        }
      }),
      catchError((error) => {
        console.log(error);
        this.loggedIn$.next(false);
        return of(false);
      })
    );
  }

  // Metodo per fare il login con chiamata HTTP POST
  login({ username, password }: LoginModel): Observable<any> {
    const body = { username, password };
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    let options = { headers, withCredentials: true };

    return this.http.post<any>(`${this.apiUrl}/login`, body, options).pipe(
      map((response) => {
        if (
          response &&
          response.success &&
          response.body &&
          response.body.data &&
          response.body.data.user
        ) {
          // Se il login ha successo, memorizza lo stato di login
          this.loggedIn$.next(true); // Cambia lo stato di login a 'true'
          this.userLogged$.next(response.body.data.user);
          return true;
        } else {
          this.loggedIn$.next(false);

          return false; // Restituisci 'false' se il login non è riuscito
        }
      }),
      catchError((error) => {
        console.log(error);
        this.loggedIn$.next(false);
        return of(false); // Restituisce un Observable con valore 'false' in caso di errore
      })
    );
  }

  // Metodo per fare il logout
  logout(): void {
    this.http.get<any>(`${this.apiUrl}/logout`);
    this.loggedIn$.next(false); // Imposta lo stato a logged out
    this.userLogged$.next({
      username: '',
      userId: '',
      role: '',
    });
  }

  // Metodo per verificare se l'utente è autenticato
  isAuthenticated(): boolean {
    return this.loggedIn$.getValue(); // Restituisce l'osservabile per lo stato di autenticazione
  }

  // Metodo per ottenere l'utente loggato
  getUser(): UserModel {
    return this.userLogged$.getValue();
  }

  // Restituisce l'osservabile che indica se l'autenticazione è in corso
  isAuthenticating(): Observable<boolean> {
    return this.isAuthenticating$.asObservable();
  }
}
