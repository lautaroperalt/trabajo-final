import { Component, inject } from '@angular/core';
import { ProductsService } from '../../services/products-service';
import { AuthService } from '../../services/auth-service';
import { Category } from '../../Interface/category';
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-category-admin',
  imports: [FormsModule],
  templateUrl: './category-admin.html',
  styleUrl: './category-admin.scss',
})
export class CategoryAdmin {
  productService = inject(ProductsService);
  authService = inject(AuthService);

  categories: Category[] = [];
  newCategoryName: string = "";
  isLoading = true;

 
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
      
      Swal.fire('Creada', 'Categoría agregada correctamente', 'success');
    } catch (error) {
      Swal.fire('Error', 'No se pudo crear la categoría', 'error');
    }
  }

  async deleteCategory(id: number) {
    const result = await Swal.fire({
        title: '¿Borrar categoría?',
        text: "Esto podría afectar a los productos que la usan",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, borrar'
    });

    if (result.isConfirmed) {
      try {
        await this.productService.deleteCategory(id);

        this.categories = this.categories.filter(c => c.id !== id);
        
        Swal.fire('Borrado', 'La categoría ha sido eliminada', 'success');
      } catch (error) {
        Swal.fire('Error', 'No se pudo eliminar', 'error');
      }
    }
  }

   ngOnInit(): void {
    this.loadCategories();
  }
}