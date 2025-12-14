import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { LoginData } from '../Interface/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  router = inject(Router)
  token: null|string = localStorage.getItem("token");
  revisionTokenInterval:number|undefined;

  ngOnInit(): void{
    //si tengo sesion iniciado verifico que no este vencida
    if(this.token){
      this.revisionTokenInterval = this.revisionToken()
    }
  }

  getCurrentUserId(): number | null {
  if (!this.token) return null;
  try {
    const tokenData = this.parseJwt(this.token);
    return Number(tokenData.id || tokenData.sub || tokenData.userId);
  } catch (error) {
    console.error("Error al leer ID:", error);
    return null
  }
}
  
  async login(loginData: LoginData){
    const res = await fetch("https://w370351.ferozo.com/api/Authentication/login",
    {
      method: "POST",
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(loginData)
    }
  )
  if(res.ok){
    this.token = await res.text()
    localStorage.setItem("token", this.token)
    return true;
  } else {
    return false
  }
}

  logout(){
    this.token = null;
    localStorage.removeItem("token");
    this.router.navigate(["/login"])
  }


  revisionToken() {
    return setInterval(() => {
      if (this.token) { //solo se ejecuta si existe
        const base64Url = this.token.split('.')[1]; // aisla la segunda parte del token
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/'); // corrigen para que sea compatible
        const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) { //decodifica la cadena a una JSON legible.
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2); 
          // transformación de caracteres
        }).join(''));

        const claims: { exp: number } = JSON.parse(jsonPayload); //convierte la cadena JSON decodificada en un objeto
        if (new Date(claims.exp * 1000) < new Date()) { 
          //convierte la fecha de expiración de segundos a milisegundos. Lo que espera new Date()
          this.logout()
        }
      }
    }, 10000) //la funcion se ejecute cada estos segundos
  }

  parseJwt(token: string) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
  }
}