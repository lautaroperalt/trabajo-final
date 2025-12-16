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
    categoryId: null,
    // para evitar errores o por si acaso
    discount: 0,
    hasHappyHour: false
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
          categoryId: found.categoryId,

          discount: found.discount || 0,
          hasHappyHour: found.hasHappyHour || false
      };
      } else {
        this.router.navigate (["/admin"]);
      }
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

  async onSubmit(form: NgForm) {
    if (form.invalid) return;

    const discountVal = Number(this.producData.discount || 0);
    if (discountVal < 0 || discountVal > 100) {
        Swal.fire('Error', 'El descuento debe estar entre 0% y 100%', 'error');
        return;
    }

    if (!this.producData.categoryId || this.producData.categoryId === 0) {
    Swal.fire('Atención', 'Debes seleccionar una categoría', 'warning');
    return;
}
    this.isLoading = true;

    try {
      // 1. Preparamos los datos convirtiendo los números explícitamente
      const finalData = {
        ...this.producData, // Usamos el objeto vinculado al form
        price: Number(this.producData.price),
        categoryId: Number(this.producData.categoryId),
        discount: Number(this.producData.discount || 0)
      };

      // 2. Llamamos al servicio (usando await porque es Promise/Fetch)
      if (this.producId) {
        // EDITAR
        await this.productService.updateProduct(this.producId, finalData);
      } else {
        // CREAR
        await this.productService.createNewProduct(finalData);
      }

      // 3. Éxito: Redirigir
      this.router.navigate(['/admin']);

    } catch (error) {
      console.error("Error al guardar:", error);
      Swal.fire('Error', 'No se pudo guardar el producto', 'error');
    } finally {
      this.isLoading = false;
    }
  }
}