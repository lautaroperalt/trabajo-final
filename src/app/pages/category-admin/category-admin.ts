import { Component, inject, OnInit } from '@angular/core';
import { ProductsService } from '../../services/products-service';
import { AuthService } from '../../services/auth-service';
import { Category } from '../../Interface/category';
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-category-admin',
  imports: [FormsModule, RouterLink],
  templateUrl: './category-admin.html',
  styleUrl: './category-admin.scss',
})
export class CategoryAdmin implements OnInit{
  productService = inject(ProductsService);
  authService = inject(AuthService);

  categories: Category[] = [];
  newCategoryName: string = "";
  isLoading = true;

  private swalWithBootstrapButtons = Swal.mixin({
    customClass: {
      confirmButton: "btn btn-success me-2",
      cancelButton: "btn btn-danger"
    },
    buttonsStyling: false
  });


  async loadCategories() {
    this.isLoading = true;
    try {
      const userId = this.authService.getCurrentUserId(); 
      if (userId) {
        this.categories = await this.productService.getCateoriesByRestaurant(userId);
      }
    } catch (error) {
      console.error(error);
    } finally {
      this.isLoading = false;
    }
  }

  async addCategory() {
    if (!this.newCategoryName.trim()) return;

    try {
      await this.productService.createCategory({ name: this.newCategoryName });
      
      this.newCategoryName = "";
      await this.loadCategories();
      
      this.swalWithBootstrapButtons.fire('Creada', 'Categoría agregada correctamente', 'success');
    } catch (error) {
      this.swalWithBootstrapButtons.fire('Error', 'No se pudo crear la categoría', 'error');
    }
  }

  async deleteCategory(id: number) {
    const result = await this.swalWithBootstrapButtons.fire({
        title: '¿Borrar categoría?',
        text: "Esto podría afectar a los productos que la usan",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, borrar',
        cancelButtonText: 'Cancelar',
        reverseButtons: true
    });

    if (result.isConfirmed) {
      try {
        await this.productService.deleteCategory(id);

        this.categories = this.categories.filter(c => c.id !== id);
        
        this.swalWithBootstrapButtons.fire('Borrado', 'La categoría ha sido eliminada', 'success');
      } catch (error) {
        this.swalWithBootstrapButtons.fire('Error', 'No se pudo eliminar', 'error');
      }
    }
  }

   ngOnInit(): void {
    this.loadCategories();
  }
}