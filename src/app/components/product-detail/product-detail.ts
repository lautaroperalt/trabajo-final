import { Component, computed, input, output } from '@angular/core';
import { Product } from '../../Interface/product';

@Component({
  selector: 'app-product-detail',
  imports: [],
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.scss',
})

export class ProductDetail {

  product = input.required<Product>();
  close = output<void>();

  //https://angular.dev/guide/signals
  // Señal si es Happy Hour O tiene un descuento mayor a 0
  discountExist = computed(() => {
    const p = this.product();
    return p.hasHappyHour || (p.discount > 0);
  });

  // Señal para precio final
  finalPrice = computed(() => { //espera a product, si indica que hay descuento esta signal lo calcula
    const p = this.product();
  if (!p.discount || p.discount <= 0) {
      return p.price;
    }

  //descuento
  const discount = (p.price * p.discount) / 100;
    return p.price - discount;
  });
  
  //Metodo para cerrar
  closeModal() {
    this.close.emit();
  }

  clickOnCard(e: Event) {
    e.stopPropagation();
  }
}