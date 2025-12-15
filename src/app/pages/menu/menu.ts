import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductsService } from '../../services/products-service';
import { Product } from '../../Interface/product';
import { Category } from '../../Interface/category';
import { ProductDetail } from '../../components/product-detail/product-detail';
import { ProductCard } from '../../components/product-card/product-card';

@Component({
  selector: 'app-menu',
  imports: [ProductDetail, ProductCard],
  templateUrl: './menu.html',
  styleUrl: './menu.scss',
})
export class Menu implements OnInit{

  // dependencias
  route = inject(ActivatedRoute)
  inProduct = inject(ProductsService)

  // variables main
  restaurantId! : number;
  menu: Product[]= [];
  categories: Category[] = [];

  //estados de vista
  isLoading : boolean = true;
  selectedProduct: Product | null = null;
  
  // filtros
  currentDiscount: boolean = false;
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

    this.currentCategoryId = categoryId;
    this.currentDiscount = discount;

    this.loadMenu();
  }  

  async ngOnInit() {
    this.route.params.subscribe(async params => {

      const userIdString = params['userId'];
      this.restaurantId = +userIdString


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