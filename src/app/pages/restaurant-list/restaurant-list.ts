import { Component, inject, OnInit } from '@angular/core';
import { RestaurantService } from '../../services/restaurant';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { User } from '../../Interface/user';

@Component({
  selector: 'app-restaurant-list',
  imports: [RouterLink, CommonModule],
  templateUrl: './restaurant-list.html',
  styleUrl: './restaurant-list.scss',
})
export class RestaurantList implements OnInit{
  restaurantService = inject(RestaurantService)

  restaurants: User[] = []
  isLoading = true;

  async ngOnInit() {
    this.isLoading = true;
    try{
      this.restaurants = await this.restaurantService.getRestaurants();
      } catch (error){
      console.error(error);
        } finally{
          this.isLoading = false;
        }
  }
}