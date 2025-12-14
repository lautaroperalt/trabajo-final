import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductsService } from '../../services/products-service';
import { Product } from '../../Interface/product';
import { Spinner } from '../../components/spinner/spinner';
import { Category } from '../../Interface/category';
import { ProductDetail } from '../../components/product-detail/product-detail';
import { ProductCard } from '../../components/product-card/product-card';

@Component({
  selector: 'app-menu',
  imports: [Spinner, ProductDetail, ProductCard],
  templateUrl: './menu.html',
  styleUrl: './menu.scss',
})
export class Menu implements OnInit{
  // dependencias
  route = inject(ActivatedRoute) //saber que restaurante debe mostrar el menu. Obtenemos el ID
  inProduct = inject(ProductsService) // toda logica con backend  

  // variables main
  restaurantId! : number; //para almacenar el ID numerico, previamente al constructor
  menu: Product[]= [];
  categories: Category[] = [];

  //estados de vista
  isLoading : boolean = true; //mostrar spinner de carga
  selectedProduct: Product | null = null; //controla el modal
  
  //variables del filtrado
  currentDiscount: boolean = false; //guarda si el usuario ha activado el filtro de ofertas
  currentCategoryId: number | undefined = undefined;
  
  async loadMenu(){
  this.isLoading = true;
    try {
      const products = await this.inProduct.getProductsByRestaurant(
        this.restaurantId,
        this.currentCategoryId,
        this.currentDiscount
      );
      this.menu = products; 
    }
    catch (err) {
      console.error("Error al cargar el menu: ", err);
    }
    finally{
      this.isLoading = false;
    }
  }

  async loadCategories(){
    try{
      this.categories = await this.inProduct.getCateoriesByRestaurant(this.restaurantId);
  } catch (err){
    console.error("Error al encontrar la categoria:", err);
    }
  }

   filterMenu(categoryId: number| undefined, discount: boolean){
    //actualizar estado interno
    this.currentCategoryId = categoryId;
    this.currentDiscount = discount;
    //recarga el menu con los nuevos filtros
    this.loadMenu();
  }  

  async ngOnInit() {
    this.route.params.subscribe(async params => {
      //obtengo el id del restaurante al cargar y lo convierto en numero
      const userIdString = params['userId'];
      this.restaurantId = +userIdString // el + carga el string a numero

      //tengo id, cargamos el menu
      if(this.restaurantId){
        this.loadMenu(); 
        this.loadCategories(); 
      }
    });
  }
  
  openDetail(product: Product){
    this.selectedProduct = product;
  }

  closeDetail(){
    this.selectedProduct = null;
  }
}