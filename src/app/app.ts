import { Component, inject, signal } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { AuthService } from './services/auth-service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('trabajo-final');
  authService = inject(AuthService)

  darkTheme = false;
  
  constructor() {
    const guardado = localStorage.getItem("tema");
    
    if(guardado === "oscuro") {
      this.darkTheme = true;
      document.documentElement.setAttribute('data-bs-theme', 'dark');
    }
  }

  changeTheme() {
    // Invierto el valor
    this.darkTheme = !this.darkTheme;

    if (this.darkTheme) {
      document.documentElement.setAttribute('data-bs-theme', 'dark');
      localStorage.setItem('tema', 'oscuro');
    } else {
      document.documentElement.setAttribute('data-bs-theme', 'light');
      localStorage.setItem('tema', 'claro');
    }
  }
}