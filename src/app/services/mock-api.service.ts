import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Customer } from '../models/costumer.interface';

@Injectable({
  providedIn: 'root',
})
export class MockApiService {

  private customers: Customer[] = [
    { id: 1, name: 'Alice Johnson',  email: 'alice@example.com',  phone: '555-0101' },
    { id: 2, name: 'Bob Smith',      email: 'bob@example.com',    phone: '555-0102' },
    { id: 3, name: 'Carlos Rivera',  email: 'carlos@example.com', phone: '555-0103' },
    { id: 4, name: 'Diana Prince',   email: 'diana@example.com',  phone: '555-0104' },
    { id: 5, name: 'Edward Norton',  email: 'edward@example.com', phone: '555-0105' },
    { id: 6, name: 'Fiona Green',    email: 'fiona@example.com',  phone: '555-0106' },
    { id: 7, name: 'George Wallace', email: 'george@example.com', phone: '555-0107' },
    { id: 8, name: 'Hannah Montana', email: 'hannah@example.com', phone: '555-0108' },
  ];

  search(term: string): Observable<Customer[]> {
    const results = this.customers.filter(c =>
      c.name.toLowerCase().includes(term.toLowerCase())
    );
    return of(results).pipe(delay(400));
  }
}
