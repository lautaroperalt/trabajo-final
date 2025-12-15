import { Component, inject, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { ProductsService } from '../../services/products-service';
import { Product } from '../../Interface/product';
import { AuthService } from '../../services/auth-service';
import { RouterLink } from '@angular/router';
import { Category } from '../../Interface/category';

@Component({
  selector: 'app-boss-admin',
  imports: [RouterLink],
  templateUrl: './boss-admin.html',
  styleUrl: './boss-admin.scss',
})
export class BossAdmin implements OnInit{
  productService = inject(ProductsService)
  authService = inject(AuthService)

  products: Product[] = [];
  isLoading = true;
  userId: number | null = null;
  categories: Category[] = [];

  private swalWithBootstrapButtons = Swal.mixin({
    customClass: {
      confirmButton: "btn btn-success me-2",
      cancelButton: "btn btn-danger"
    },
    buttonsStyling: false
  });


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
    this.isLoading = true;
  try {
      const userId = this.authService.getCurrentUserId();
      if (userId) {
        const prods = await this.productService.getProductsByRestaurant(userId);
        const cats = await this.productService.getCateoriesByRestaurant(userId);

        this.products = prods;
        this.categories = cats;
      }
    }finally {
      this.isLoading = false;
  }
}

  getCategoryName(id: number) {
  return this.categories.find(c => c.id === id)?.name ?? 'Sin categoria';
}


  async deleteProduct(id: number){
    const result = await this.swalWithBootstrapButtons.fire({
      title: '¿Eliminar producto?',
      text: "No podrás revertir esto",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, borrar',
      cancelButtonText: 'Cancelar',
      reverseButtons: true
    });

    if (result.isConfirmed){
      try{
        await this.productService.deleteProduct(id);
        this.products = this.products.filter(p => p.id !== id);
        
        this.swalWithBootstrapButtons.fire('Eliminado', 'El producto borrado.', 'success')
      } catch (error){ 
          this.swalWithBootstrapButtons.fire('Error', 'No se pudo eliminar', 'error')
      }
    }
  }

  async activateHappyHour (product: Product){
    try {
      await this.productService.alternateHappyHour(product.id);
      await this.loadProducts();

      const mensaje = !product.hasHappyHour ? "Happy Hour activado" : "Happy Hour desactivado";
      
      const swalT = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000
      });
      swalT.fire({icon: 'success', title: mensaje});

    } catch (error) {
      this.swalWithBootstrapButtons.fire('Error', 'No se pudo cambiar el estado', 'error'); //para q boton de OK tenga estilo
    }
  }

  async updateDiscount(product: Product, newDiscount: string) {
    const pDiscount = Number(newDiscount);

    if (pDiscount < 0 || pDiscount > 100 || isNaN(pDiscount)) {
      this.swalWithBootstrapButtons.fire('Atención', 'El descuento debe ser entre 0 y 100', 'warning');
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
      this.swalWithBootstrapButtons.fire('Error', 'No se pudo actualizar el descuento', 'error');
    }
  }
}
