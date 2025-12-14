import {inject, Injectable } from '@angular/core';
import { Product } from '../Interface/product';
import { Category } from '../Interface/category';
import { AuthService } from './auth-service';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  readonly URL_BASE = "https://w370351.ferozo.com/api";

  authService = inject(AuthService);

  getAuthHeaders(){
    const token = this.authService.token || localStorage.getItem("token");
  return {
    'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
  };
}

  async getProductsByRestaurant(
    userId : number, categoryId? : number, onylDiscount: boolean = false ): Promise<Product[]> {

    let res = `${this.URL_BASE}/users/${userId}/products`;
    const params = new URLSearchParams(); // creo contenedor para clave-valor
    
    //filtros
    if(categoryId){ //solo añadimos los parametros si tienen valor
      params.set('categoryId', categoryId.toString())}
    if(onylDiscount){
      params.set('discounted', 'true')}

    // obtener la cadena de filtros
    const queryString = params.toString();
    if (queryString){
      res += `?${queryString}`}

    const ans = await fetch(res);
    if(!ans.ok) throw new Error("Error al obtener los productos");
    return await ans.json();
  }
  async getCateoriesByRestaurant(userId: number): Promise<Category[]> {
    const url = `${this.URL_BASE}/users/${userId}/categories`;

    const res = await fetch(url)
    if (!res.ok) throw new Error("Error al obtener las categorias")
    return await res.json();
  }

  async createNewProduct(product: Partial<Product>): Promise<Product> {
    const res = await fetch(`${this.URL_BASE}/products`, {
      method: "POST",
      headers: this.getAuthHeaders(),
      body: JSON.stringify(product)
    });
    if (!res.ok) throw new Error("Error al crear el producto");
    return await res.json();
  }

  async updateProduct(productId: number, product: Partial<Product>): Promise<void> {
    const res = await fetch(`${this.URL_BASE}/products/${productId}`, {
      method: "PUT",
      headers: this.getAuthHeaders(),
      body: JSON.stringify(product)
    });
    if (!res.ok) throw new Error("Error al actualizar el producto");
  }

  async deleteProduct(productId: number): Promise<void> {
    const res = await fetch(`${this.URL_BASE}/products/${productId}`, {
      method: "DELETE",
      headers: this.getAuthHeaders()
    });
    if (!res.ok) throw new Error("Error al borrar el producto");
  }


  
  async updateProductDiscount(productId: number, discount: number): Promise<void> {
    const res = await fetch(`${this.URL_BASE}/products/${productId}/discount`, {
      method: "PUT",
      headers: this.getAuthHeaders(),
      body: JSON.stringify({discount: discount})
    });
    if (!res.ok) throw new Error("Error al modificar el producto");
  }

  async alternateHappyHour(productId: number): Promise<void> {
    const res = await fetch(`${this.URL_BASE}/products/${productId}/happy-hour`, {
      method: "PUT",
      headers: this.getAuthHeaders(),
    });
    if (!res.ok) throw new Error("Error al cambiar estado de Happy Hour al producto");
  }

  async createCategory(category: { name: string }): Promise<Category> {
    const res = await fetch(`${this.URL_BASE}/categories`, {
      method: "POST",
      headers: this.getAuthHeaders(),
      body: JSON.stringify(category)
    });
    if (!res.ok) throw new Error("Error al crear categoria");
    return await res.json();
  }

  async deleteCategory(categoryId: number): Promise<void> {
    const res = await fetch(`${this.URL_BASE}/categories/${categoryId}`, {
      method: "DELETE",
      headers: this.getAuthHeaders()
    });
    if (!res.ok) throw new Error("Error al eliminar categoria");
  }
}
