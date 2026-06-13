import { Injectable, computed, effect, signal } from '@angular/core';
import { Product } from '../models/product.interface';

@Injectable({
  providedIn: 'root',
})
export class CartService {

  // lo hago privado para que nadie lo mute directo desde afuera
  private _cartItems = signal<Product[]>([]);

  cartItems = this._cartItems.asReadonly();

  totalCount = computed(() => this._cartItems().length);

  totalPrice = computed(() =>
    this._cartItems().reduce((acc, item) => acc + item.price, 0)
  );

  constructor() {
    effect(() => {
      console.log('carrito actualizado:', this._cartItems());
      console.log('total items:', this.totalCount(), '| precio total:', this.totalPrice());
    });
  }

  addItem(product: Product): void {
    this._cartItems.update(items => [...items, product]);
  }
}
