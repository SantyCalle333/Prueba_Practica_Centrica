import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/cart.service';
import { Product } from '../../models/product.interface';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css',
})
export class CartComponent {

  cartService = inject(CartService);

  availableProducts: Product[] = [
    { id: 1, name: '⌨️ Teclado Mecánico', price: 89.99  },
    { id: 2, name: '🖱️ Mouse Inalámbrico', price: 45.00  },
    { id: 3, name: '🖥️ Monitor 27"',       price: 320.00 },
    { id: 4, name: '🎧 Auriculares RGB',    price: 75.50  },
    { id: 5, name: '💾 SSD 1TB',            price: 110.00 },
  ];

  addToCart(product: Product): void {
    this.cartService.addItem(product);
  }
}
