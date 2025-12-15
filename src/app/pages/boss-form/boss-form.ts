import { Component, inject, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProductsService } from '../../services/products-service';
import { AuthService } from '../../services/auth-service';
import { Category } from '../../Interface/category';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-boss-form',
  imports: [FormsModule, RouterLink],
  templateUrl: './boss-form.html',
  styleUrl: './boss-form.scss',
})
export class BossForm implements OnInit{
  productService = inject(ProductsService)
  authService = inject(AuthService)
  router = inject(Router)
  ruta = inject(ActivatedRoute)

  //variables
  producId: number | null = null //si tiene valor, estamos EDITANDO si es null, CREANDO
  categories: Category[] = []
  isLoading = false;

  //form
  producData: any = {
    name: "",
    description: "",
    price: 0,
    imageUrl: "",
    categoryId: null
  };

  private swalWithBootstrapButtons = Swal.mixin({
    customClass: {
      confirmButton: "btn btn-success me-2",
      cancelButton: "btn btn-danger"
    },
    buttonsStyling: false
  });


  async loadCategories(){
    const userId = this.authService.getCurrentUserId();
    if (userId){
      this.categories = await this.productService.getCateoriesByRestaurant(userId);
    }
  }

  async loadEditProduct(){
    this.isLoading = true;
    try{
      const userId = this.authService.getCurrentUserId();
      if (!userId || !this.producId) return;

      const products = await this.productService.getProductsByRestaurant(userId);
      const found = products.find(p => p.id === this.producId);

      if (found){
        this.producData = { 
          name: found.name,
          description: found.description,
          price: found.price,
          imageUrl: found.imageUrl,
          categoryId: found.categoryId
      };
      } else {
        this.router.navigate (["/admin"]);
      }
    } catch (error) {
      console.error(error);
    } finally{
      this.isLoading = false
    }
  }

  async ngOnInit() {
    await this.loadCategories();

    const id = this.ruta.snapshot.paramMap.get("id");
    if (id){
      this.producId = +id; //convierte texto a numero
      await this.loadEditProduct()
    }
  }

  async onSubmit(form: NgForm){
    if (form.invalid) return;
    
    this.isLoading = true;
    try {
      if (this.producId){
        await this.productService.updateProduct(this.producId, this.producData);
        await this.swalWithBootstrapButtons.fire('¡Actualizado!', 'El producto se modificó correctamente', 'success');
      } else {
        await this.productService.createNewProduct(this.producData);
        await this.swalWithBootstrapButtons.fire('¡Creado!', 'Producto nuevo agregado al menú', 'success');
      }

      this.router.navigate(["/admin"])
    } catch (error) {
      this.swalWithBootstrapButtons.fire('Error', 'Hubo un problema al guardar. Intenta nuevamente.', 'error');
    } finally {
      this.isLoading = false;
    }
  }
}
