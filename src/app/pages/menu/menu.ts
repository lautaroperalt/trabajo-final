import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductsService } from '../../services/products-service';
import { Product } from '../../Interface/product';
import { Category } from '../../Interface/category';
import { ProductDetail } from '../../components/product-detail/product-detail';
import { ProductCard } from '../../components/product-card/product-card';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-menu',
  imports: [ProductDetail, ProductCard, FormsModule],
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

  allProducts: Product[] = [];

  //estados de vista
  isLoading : boolean = true;
  selectedProduct: Product | null = null;
  searchSearch: string = "";
  
  // filtros
  currentDiscount: boolean = false;
  currentCategoryId: number | undefined = undefined;
  //filtro de busqueda opcional
  productFilter() {
    if (!this.searchSearch.trim()) {
      this.menu = [...this.allProducts];
      return;
    }

    const search = this.searchSearch.toLowerCase();
    this.menu = this.allProducts.filter(p => 
      p.name.toLowerCase().includes(search) || 
      p.description.toLowerCase().includes(search)
    );
  }
  
  async loadMenu(){
  this.isLoading = true;
    try {
      const products = await this.inProduct.getProductsByRestaurant(
        this.restaurantId,
        this.currentCategoryId,
        this.currentDiscount
      );

      this.allProducts = products
      this.productFilter();
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
    this.searchSearch = "";
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