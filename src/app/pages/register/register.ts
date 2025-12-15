import { Component, inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { UsersService } from '../../services/user-service';

@Component({
  selector: 'app-register-page',
  imports: [RouterModule,FormsModule],
  templateUrl: './register.html',
  styleUrl: './register.scss'
})
export class RegisterPage {
    errorRegister = false;
    usersService = inject(UsersService);
    isLoading = false;
    router = inject(Router)

    async register(form: NgForm){
      this.errorRegister = false;

      if(form.invalid || 
        form.value.password !== form.value.password2){
        this.errorRegister = true;
        return
      }

      this.isLoading = true;
      try {
        const userData = {
            restaurantName: form.value.restaurantName,
            password: form.value.password
        };
        const res = await this.usersService.register(userData);

        // Asumiendo que tu servicio devuelve true/false o un objeto con .ok
        if (res) { 
          this.router.navigate(["/login"]);
        } else {
            this.errorRegister = true;
        }
        
        } catch (error) {
            this.errorRegister = true;
          } finally {
              this.isLoading = false;
          }
    }
  }