import { Component, computed, input, output } from '@angular/core';
import { Product } from '../../Interface/product';

@Component({
  selector: 'app-product-detail',
  imports: [],
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.scss',
})
//Una signal es una caja que guarda valor y avisa a quien le interese cuando ese valor cambie 
//Una señal común (signal()) guarda un valor y se puede modificar.
//Una señal computada (computed()) no la modificás vos, sino que su valor depende de otras señales.

export class ProductDetail {

  product = input.required<Product>(); // recibe el dato, 
  // el required evita que quieras usarlo sin pasar un producto
  
  close = output<void>(); //avisa al componente padre

  // Señal computada para saber si mostramos precio de oferta
  //si es Happy Hour O tiene un descuento mayor a 0
  discountExist = computed(() => {
    const p = this.product();
    return p.isHappyHour || (p.isDiscount > 0);
  });

  // Señal computada para el precio final
  finalPrice = computed(() => { //espera a product, si indica que hay descuento esta signal lo calcula
    const p = this.product();
  // Si no hay descuento numérico, devolvemos el precio normal
  if (!p.isDiscount || p.isDiscount <= 0) {
      return p.price;
    }

  // Calculamos el descuento
  const discount = (p.price * p.isDiscount) / 100;
    return p.price - discount;
  });
  
  // Método simple para cerrar
  closeModal() {
    this.close.emit();
  }
  // Evita que el clic dentro de la tarjeta cierre el modal
  clickOnCard(e: Event) {
    e.stopPropagation();
  }
}