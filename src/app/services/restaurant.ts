import { Injectable } from '@angular/core';
import { User } from '../Interface/user';

@Injectable({
  providedIn: 'root',
})
export class RestaurantService {

  readonly URL_BASE = "https://w370351.ferozo.com/api/users";

  async getRestaurants(): Promise<User[]> { 
    const res = await fetch(this.URL_BASE);

    if(!res.ok) throw new Error("Error al cargar los restaurantes");
    
    return await res.json();
  }
}
