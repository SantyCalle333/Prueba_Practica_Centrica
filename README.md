# 🧪 Prueba Técnica — Centrica Soluciones

> **Stack:** Angular 21 · RxJS 7.8 · Angular Signals · Standalone Components · TypeScript 5.9

Aplicación Angular desarrollada como prueba técnica práctica que demuestra el dominio de dos paradigmas clave del desarrollo frontend moderno: **programación reactiva con RxJS** y **gestión de estado con Angular Signals**.

---

## 📋 Ejercicios Implementados

### Ejercicio 1 — Búsqueda Reactiva con RxJS

**Objetivo:** Implementar un buscador que proteja la API de peticiones innecesarias mediante operadores RxJS.

**Archivo:** `src/app/components/Search/costumer_search/`

**Pipeline RxJS implementado:**

```typescript
this.searchControl.valueChanges.pipe(
  filter((text: string) => text.length >= 3),   // Mínimo 3 caracteres
  debounceTime(400),                             // Espera 400ms de silencio
  distinctUntilChanged(),                        // Evita peticiones duplicadas
  tap(() => this.isLoading.set(true)),           // Activa spinner
  switchMap((text: string) =>                    // Cancela petición anterior
    this.mockService.search(text)
  )
)
```

**Decisiones técnicas:**
- `filter` — Descarta términos cortos antes de debounce para mayor eficiencia
- `debounceTime(400)` — Evita saturar la API mientras el usuario tipea
- `distinctUntilChanged` — Bloquea si el término es idéntico al anterior (evita re-renders innecesarios)
- `switchMap` — Cancela la petición HTTP anterior si llega una nueva, eliminando race conditions
- **Signals para estado UI** (`results`, `isLoading`, `hasSearched`) en lugar de `async pipe` — más idiomático en Angular 17+, sin necesidad de `CommonModule`
- **`inject()`** en lugar de constructor DI — patrón moderno Angular 17+

---

### Ejercicio 2 — Gestión de Estado con Angular Signals

**Objetivo:** Implementar un servicio de carrito de compras usando la nueva API de Signals, dejando atrás los `BehaviorSubject` de RxJS.

**Archivos:**
- Servicio: `src/app/services/cart.service.ts`
- Componente: `src/app/components/Cart/`

**Implementación del `CartService`:**

```typescript
@Injectable({ providedIn: 'root' })
export class CartService {

  // Signal base PRIVADO — inmutable desde afuera
  private readonly _cartItems = signal<Product[]>([]);

  // Exposición de solo lectura
  readonly cartItems = this._cartItems.asReadonly();

  // Computed signals — se recalculan automáticamente
  readonly totalCount = computed(() => this._cartItems().length);
  readonly totalPrice = computed(() =>
    this._cartItems().reduce((sum, item) => sum + item.price, 0)
  );

  constructor() {
    // Effect — detecta cambios automáticamente sin suscripciones manuales
    effect(() => {
      console.log('🛒 Carrito actualizado:', this._cartItems());
      console.log(`   Items: ${this.totalCount()} | Total: $${this.totalPrice().toFixed(2)}`);
    });
  }

  // Actualización inmutable del estado
  addItem(product: Product): void {
    this._cartItems.update(items => [...items, product]);
  }
}
```

**Decisiones técnicas:**
- `signal().asReadonly()` — Encapsulación real: solo el servicio puede mutar el estado
- `computed()` — Valores cacheados y lazy, se recalculan solo cuando la dependencia cambia
- `update()` con spread operator — Actualización inmutable del arreglo (nunca `push`)
- `effect()` en constructor — Angular detecta dependencias automáticamente sin `subscribe`
- `inject()` en el componente — Patrón funcional de inyección moderno

---

## 🗂️ Estructura del Proyecto

```
src/
└── app/
    ├── models/
    │   ├── costumer.interface.ts     # Interface Customer { id, name, email, phone }
    │   └── product.interface.ts      # Interface Product { id, name, price }
    │
    ├── services/
    │   ├── mock-api.service.ts       # Simula API REST con delay(400ms) y RxJS of()
    │   └── cart.service.ts           # Estado global con Signals + computed + effect
    │
    ├── components/
    │   ├── Search/
    │   │   └── costumer_search/      # Búsqueda reactiva con pipeline RxJS completo
    │   │       ├── *.component.ts
    │   │       ├── *.component.html
    │   │       └── *.component.css
    │   │
    │   └── Cart/                     # Carrito de compras con Angular Signals
    │       ├── cart.component.ts
    │       ├── cart.component.html
    │       └── cart.component.css
    │
    ├── app.ts                        # Root component (Standalone)
    ├── app.html                      # Layout principal con grid de ejercicios
    ├── app.css                       # Tema oscuro + glassmorphism + animaciones
    ├── app.config.ts                 # Configuración de la aplicación
    └── app.routes.ts                 # Definición de rutas
```

---

## 🚀 Tecnologías y Versiones

| Tecnología | Versión | Uso |
|---|---|---|
| Angular | 21.2 | Framework principal |
| TypeScript | ~5.9 | Tipado estático |
| RxJS | ~7.8 | Pipeline de búsqueda reactiva |
| Angular Signals | Nativo (Angular 17+) | Gestión de estado del carrito |
| Angular Forms | 21.2 | `ReactiveFormsModule`, `FormControl` |

---

## ⚙️ Instalación y Ejecución

### Prerrequisitos
- Node.js 20+
- npm 11+
- Angular CLI 21

### Instalación

```bash
# Clonar o acceder al directorio del proyecto
cd prueba_tecnica_practica

# Instalar dependencias
npm install
```

### Desarrollo

```bash
npm start
# o
ng serve
```

Abrir en el navegador: **`http://localhost:4200`**

### Producción

```bash
ng build
```

Los artefactos se generan en `dist/`.

---

## 🎨 Decisiones de Diseño UI

- **Dark Mode** como tema base — fondo `#0d0d1a` con gradientes radiales púrpura/rosa
- **Glassmorphism** en cards — `backdrop-filter: blur(20px)` con bordes translúcidos
- **Color palette** — Púrpura `#7702ff` (RxJS), Rosa `#cc26d5` (Signals)
- **Tipografía** — Inter + Inter Tight desde Google Fonts
- **Animaciones** — `fadeDown`/`fadeUp` al cargar, `shimmer` en labels, `slideIn` en items
- **Responsive** — Grid `auto-fit minmax(340px, 1fr)` adaptable a móvil

---

## 🧠 Conceptos Demostrados en esta prueba

| Concepto | Implementación |
|---|---|
| Standalone Components | `standalone: true` en todos los componentes |
| `inject()` funcional | Reemplaza constructor DI en todos los componentes |
| RxJS operators | `filter`, `debounceTime`, `distinctUntilChanged`, `switchMap`, `tap` |
| Race condition prevention | `switchMap` cancela peticiones HTTP anteriores |
| Writable vs Readonly Signal | `signal()` privado + `.asReadonly()` público |
| Computed signals | `computed()` para `totalCount` y `totalPrice` |
| Signal effects | `effect()` con detección automática de dependencias |
| Inmutabilidad | `update(items => [...items, newItem])` nunca muta el arreglo |
| Angular Control Flow | `@if`, `@for`, `@else` (sintaxis Angular 17+) |

---

## 📝 Notas Técnicas

**¿Por qué `inject()` en lugar del constructor?**
Es el patrón recomendado en Angular 17+ para componentes standalone. Asi evito el error `NG2003` de tokens de inyección y hace el código más funcional y testeable.

**¿Por qué Signals en el componente de búsqueda si el ejercicio pedía RxJS?**
El pipeline RxJS (`filter → debounceTime → distinctUntilChanged → switchMap`) se mantiene intacto como lo requiere el ejercicio. Los Signals solo se usan para **exponer el estado al template** (`results`, `isLoading`), que es su rol correcto en Angular 21 — separación de responsabilidades entre reactividad asíncrona (RxJS) y estado de UI (Signals).

**¿Por qué SSR desactivado en desarrollo?**
El proyecto generado incluye SSR (`@angular/ssr`) que aplica protección SSRF en el dev server. Para la prueba técnica, SSR no es relevante y se desactiva en la configuración `development` del `angular.json` con `"ssr": false, "outputMode": "static"`.

