import { Component, inject } from '@angular/core';
import { Router, RouterModule } from "@angular/router";

import { FormsModule, NgForm } from '@angular/forms';
import { AuthService } from '../../services/auth-service';

@Component({
  selector: 'app-login-page',
  imports: [RouterModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class LoginPage {
  
  errorLogin = false;
  authService = inject(AuthService)  
  isLoading = false;
  router = inject(Router)

  async login(form:NgForm){
    this.errorLogin = false;
    if(!form.value.restaurantName || !form.value.password){
      return
    }

    this.isLoading = true;
    
    try {
      const loginExitoso = await this.authService.login(form.value);
      
      if(loginExitoso){
        this.router.navigate(['/'])
      } else {
        this.errorLogin = true
      }
    } catch (error) {
      this.errorLogin = true
    } finally {
      this.isLoading = false
    }
  }
}