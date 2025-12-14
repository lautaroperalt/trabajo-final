import { Component, inject, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { Spinner } from '../../components/spinner/spinner';
import { ProductsService } from '../../services/products-service';
import { Product } from '../../Interface/product';
import { AuthService } from '../../services/auth-service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-boss-admin',
  imports: [Spinner, RouterLink],
  templateUrl: './boss-admin.html',
  styleUrl: './boss-admin.scss',
})
export class BossAdmin implements OnInit{
  productService = inject(ProductsService)
  authService = inject(AuthService)

  products: Product[] = [];
  isLoading = true;
  userId: number | null = null;

  
  async loadProducts(){
    if (!this.userId) return;
    this.isLoading = true;
    try{
      this.products = await this.productService.getProductsByRestaurant(this.userId);
      } catch (error){
      console.error(error);
        } finally{
          this.isLoading = false
        }
  }

  async ngOnInit(){
  this.userId = this.authService.getCurrentUserId();
    if (this.userId) {
      await this.loadProducts();
      } else {
        console.error("No se pudo identificar al usuario");
        this.isLoading = false;
      }
  }


  async deleteProduct(id: number){
    const result = await Swal.fire({
      title: '¿Eliminar producto?',
      text: "No podrás revertir esto",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, borrar',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed){
      try{
        await this.productService.deleteProduct(id);
        this.products = this.products.filter(p => p.id !== id);
        
        Swal.fire('Eliminado', 'El producto borrado.', 'success')
      } catch (error){ 
          Swal.fire('Error', 'No se pudo eliminar', 'error')
      }
    }
  }

  async activateHappyHour (product: Product){
    try {
      await this.productService.alternateHappyHour(product.id);
      await this.loadProducts();

      let mensaje = "";
      if (product.hasHappyHour) {
         mensaje = "Happy Hour desactivado";
      } else {
         mensaje = "Happy Hour activado";
      }
      
      const swal = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000
      });
      swal.fire({icon: 'success', title: mensaje});

    } catch (error) {
      Swal.fire('Error', 'No se pudo cambiar el estado', 'error');
    }
  }

  async updateDiscount(product: Product, newDiscount: string) {
    const pDiscount = Number(newDiscount);

    if (pDiscount < 0 || pDiscount > 100 || isNaN(pDiscount)) {
      Swal.fire('Atención', 'El descuento debe ser entre 0 y 100', 'warning');
      return;
    }

    try {
      await this.productService.updateProductDiscount(product.id, pDiscount);
      product.discount = pDiscount;
      
      Swal.fire({
        title: 'Descuento Actualizado',
        icon: 'success',
        timer: 1500,
        showConfirmButton: false
      });
    } catch (error) {
      Swal.fire('Error', 'No se pudo actualizar el descuento', 'error');
    }
  }
}
