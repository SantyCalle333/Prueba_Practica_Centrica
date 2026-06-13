# Prueba Técnica Frontend — Centrica Soluciones

Angular 21 · RxJS · Signals · Standalone Components

---

## Cómo correrlo

```bash
npm install
npm start
```

Abrir en `http://localhost:4200`

---

## Ejercicio 1 — Búsqueda reactiva

Componente standalone con un `FormControl` conectado a un pipeline RxJS:

- `filter` — no busca si el texto tiene menos de 3 caracteres
- `debounceTime(400)` — espera a que el usuario deje de escribir
- `distinctUntilChanged` — no repite la misma búsqueda
- `switchMap` — cancela la petición anterior si el usuario escribe de nuevo

Los resultados se guardan en un `signal()` y se muestran con `@for` en el template.

El servicio `MockApiService` simula una API con datos hardcodeados y un `delay(400ms)`.

---

## Ejercicio 2 — Carrito con Signals

`CartService` con estado global usando Angular Signals:

- `signal<Product[]>([])` privado, expuesto como `readonly` hacia afuera
- `computed()` para `totalCount` y `totalPrice` — se recalculan solos cuando cambia la lista
- `effect()` en el constructor que loguea el carrito cada vez que cambia
- `addItem()` actualiza el estado de forma inmutable con `update(items => [...items, product])`

---

## Estructura

```
src/app/
├── models/
│   ├── costumer.interface.ts
│   └── product.interface.ts
├── services/
│   ├── mock-api.service.ts
│   └── cart.service.ts
└── components/
    ├── Search/costumer_search/
    └── Cart/
```

---

## Stack

- Angular 21 (Standalone Components)
- RxJS 7.8
- Angular Signals (Angular 17+)
- TypeScript 5.9
