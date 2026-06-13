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

```typescript
this.searchControl.valueChanges.pipe(
  filter((text: string) => text.length >= 3),
  debounceTime(400),
  distinctUntilChanged(),
  tap(() => this.isLoading.set(true)),
  switchMap((text: string) => this.mockService.search(text))
)
```

Usé `switchMap` en lugar de `mergeMap` o `concatMap` porque cancela la petición anterior si el usuario sigue escribiendo. Así evito que lleguen resultados desordenados si la red es lenta (race condition). `distinctUntilChanged` complementa esto: si el usuario borra y vuelve a escribir lo mismo, no dispara otra petición.

El estado del componente (`results`, `isLoading`) lo manejo con `signal()` en lugar de variables normales para aprovechar la reactividad de Angular 17+ sin necesitar `async pipe` ni importar `CommonModule`.

---

## Ejercicio 2 — Carrito con Signals

```typescript
private _cartItems = signal<Product[]>([]);
cartItems = this._cartItems.asReadonly();

totalCount = computed(() => this._cartItems().length);
totalPrice = computed(() =>
  this._cartItems().reduce((acc, item) => acc + item.price, 0)
);
```

El signal base es privado y se expone solo como `readonly` para que ningún componente pueda mutar la lista directamente — eso lo controla solo el servicio a través de `addItem()`. Los `computed` no necesitan lógica extra: Angular detecta que dependen de `_cartItems` y los recalcula automáticamente cuando este cambia.

El `effect()` en el constructor loguea el estado del carrito en cada cambio. Angular detecta las dependencias solo leyendo los signals dentro del effect, sin necesidad de suscripciones manuales.

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
