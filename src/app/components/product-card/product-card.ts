import { Component, input, output } from '@angular/core';
import { Product } from '../../Interface/product';

@Component({
  selector: 'app-product-card',
  imports: [],
  templateUrl: './product-card.html',
  styleUrl: './product-card.scss',
})
export class ProductCard {
  product = input.required<Product>();
  viewDetail = output<Product>();

  onViewDetail() {
    this.viewDetail.emit(this.product());
  }
}
