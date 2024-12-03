import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { tap } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { AuthGuard } from '../auth/auth.guard';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {
  private fb: FormBuilder = inject(FormBuilder);
  private authService: AuthService = inject(AuthService);
  private router: Router = inject(Router);

  loginForm!: FormGroup;
  loginError!: string; // Variabile per il messaggio di errore

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      username: ['admin', Validators.required], // Username obbligatorio
      password: ['SS_2024', Validators.required], // Password obbligatoria
    });
  }

  // Metodo chiamato quando l'utente invia il modulo
  onLogin(): void {
    const { username, password } = this.loginForm.value; // Ottieni i valori del modulo

    this.authService
      .login({ username, password })
      .pipe(
        tap((success) => {
          if (success) {
            this.router.navigate(['/dashboard']);
          } else this.loginError = 'Invalid Credential';
        })
      )
      .subscribe();
  }
}
