import { Component, inject } from '@angular/core';
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  isAuthenticating = true;
  private authService: AuthService = inject(AuthService);

  ngOnInit() {
    this.authService.autoLogin().subscribe((success) => {
      this.isAuthenticating = false;
    });
  }
}
