import { Injectable } from '@angular/core';
import { NewUser } from '../Interface/user';


@Injectable({
  providedIn: 'root'
})
export class UsersService {
  
  async register(registerData: NewUser) {
    const res = await fetch("https://w370351.ferozo.com/api/users",
    { 
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(registerData)
    });
  const data = await res.json();
  return { ok: res.ok, ...data };
  }
}