import { Component, computed, input, output } from '@angular/core';
import { Product } from '../../Interface/product';

@Component({
  selector: 'app-product-detail',
  imports: [],
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.scss',
})

export class ProductDetail {

  product = input.required<Product>(); // recibe el dato, 
  // el required evita que quieras usarlo sin pasar un producto
  
  close = output<void>(); //avisa al componente padre

  // Señal computada para saber si mostramos precio de oferta
  //si es Happy Hour O tiene un descuento mayor a 0
  discountExist = computed(() => {
    const p = this.product();
    return p.hasHappyHour || (p.discount > 0);
  });

  // Señal computada para el precio final
  finalPrice = computed(() => { //espera a product, si indica que hay descuento esta signal lo calcula
    const p = this.product();
  // Si no hay descuento numérico, devolvemos el precio normal
  if (!p.discount || p.discount <= 0) {
      return p.price;
    }

  // Calculamos el descuento
  const discount = (p.price * p.discount) / 100;
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