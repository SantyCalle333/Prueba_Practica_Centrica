import { Injectable, computed, effect, signal } from '@angular/core';
import { Product } from '../models/product.interface';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  // ─── Signal base PRIVADO (writable solo internamente) ────────────────────────
  private readonly _cartItems = signal<Product[]>([]);

  // ─── Signal de solo lectura hacia afuera ─────────────────────────────────────
  readonly cartItems = this._cartItems.asReadonly();

  // ─── Computed signals (se recalculan solos cuando _cartItems cambie) ──────────
  readonly totalCount = computed(() => this._cartItems().length);

  readonly totalPrice = computed(() =>
    this._cartItems().reduce((sum, item) => sum + item.price, 0)
  );

  constructor() {
    // ─── Este effect se ejecuta automáticamente cada vez que cartItems cambia ────────
    effect(() => {
      console.log('🛒 Carrito actualizado:', this._cartItems());
      console.log(`   Items: ${this.totalCount()} | Total: $${this.totalPrice().toFixed(2)}`);
    });
  }

  // ─── Creo el método para agregar un producto (inmutable: crea un nuevo arreglo) ───────
  addItem(product: Product): void {
    this._cartItems.update(items => [...items, product]);
  }
}


