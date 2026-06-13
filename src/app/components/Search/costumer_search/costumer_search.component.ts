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

  private mockService = inject(MockApiService);

  searchControl = new FormControl('', { nonNullable: true });

  results = signal<Customer[]>([]);
  isLoading = signal(false);
  hasSearched = signal(false);

  ngOnInit(): void {
    this.searchControl.valueChanges.pipe(
      filter((text: string) => text.length >= 3),
      debounceTime(400),
      distinctUntilChanged(),
      tap(() => {
        this.isLoading.set(true);
        this.hasSearched.set(true);
      }),
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
