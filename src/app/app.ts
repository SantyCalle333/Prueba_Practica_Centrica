import { Component } from '@angular/core';
import { CostumerSearchComponent } from './components/Search/costumer_search/costumer_search.component';
import { CartComponent } from './components/Cart/cart.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CostumerSearchComponent, CartComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {}

