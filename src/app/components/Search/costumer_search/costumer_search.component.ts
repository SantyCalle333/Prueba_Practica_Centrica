import { Component, OnInit, inject, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, filter, switchMap, tap } from 'rxjs/operators';
import { MockApiService } from '../../../services/mock-api.service';
import { Customer } from '../../../models/costumer.interface';

@Component({
  selector: 'app-costumer-search',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './costumer_search.component.html',
  styleUrl: './costumer_search.component.css',
})
export class CostumerSearchComponent implements OnInit {
  //inject() en lugar de constructor DI
  private readonly mockService = inject(MockApiService);

  // FormControl enlazado al <input> del template
  searchControl = new FormControl('', { nonNullable: true });

  // Usamos Signals para los resultados y el estado de carga
  // (no requiere async pipe ni CommonModule)
  results = signal<Customer[]>([]);
  isLoading = signal(false);
  hasSearched = signal(false);

  ngOnInit(): void {
    this.searchControl.valueChanges.pipe(
      // 1️⃣ Solo se continúa si hay 3 o más caracteres
      filter((text: string) => text.length >= 3),

      // 2️⃣ Espera 400ms de silencio antes de dejar pasar el valor
      debounceTime(400),

      // 3️⃣ Ignora si el término es exactamente igual al anterior
      distinctUntilChanged(),

      // 4️⃣ Activa el spinner antes de lanzar la petición
      tap(() => {
        this.isLoading.set(true);
        this.hasSearched.set(true);
      }),

      // 5️⃣ Cancela la petición anterior si llega una nueva (asi evito race conditions)
      switchMap((text: string) => this.mockService.search(text))

    ).subscribe({
      next: (customers: Customer[]) => {
        this.results.set(customers);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false),
    });
  }
}
