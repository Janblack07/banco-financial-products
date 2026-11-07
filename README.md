# Banco Financial Products

Aplicación frontend desarrollada en **Angular 21** para la gestión de productos financieros.

El proyecto fue construido como parte de una prueba técnica frontend e implementa listado, búsqueda, paginación, creación, edición y eliminación de productos financieros consumiendo una API REST local.

---

## Tecnologías utilizadas

- Angular 21
- TypeScript
- SCSS
- Reactive Forms
- Angular Signals
- RxJS
- Vitest
- Angular HttpClient
- API REST local

---

## Funcionalidades implementadas

### Listado de productos

Consulta los productos financieros desde la API:

```text
GET /bp/products
```

El listado muestra:

- Logo
- Nombre del producto
- Descripción
- Fecha de liberación
- Fecha de revisión
- Menú contextual de acciones

---

### Búsqueda

Permite buscar productos dinámicamente por:

- ID
- Nombre
- Descripción

La búsqueda no distingue entre mayúsculas y minúsculas.

---

### Paginación

El usuario puede seleccionar la cantidad de productos mostrados por página:

```text
5
10
20
```

También se implementaron controles para navegar entre páginas.

---

### Registro de productos

Permite registrar nuevos productos financieros mediante un formulario reactivo.

Endpoint utilizado:

```text
POST /bp/products
```

Validaciones implementadas:

#### ID

- Obligatorio
- Mínimo 3 caracteres
- Máximo 10 caracteres
- Validación asíncrona para comprobar que el ID no exista

Endpoint utilizado:

```text
GET /bp/products/verification/:id
```

#### Nombre

- Obligatorio
- Mínimo 5 caracteres
- Máximo 100 caracteres

#### Descripción

- Obligatoria
- Mínimo 10 caracteres
- Máximo 200 caracteres

#### Logo

- Obligatorio

#### Fecha de liberación

- Obligatoria
- Debe ser igual o posterior a la fecha actual

#### Fecha de revisión

- Obligatoria
- Se calcula automáticamente
- Debe ser exactamente un año posterior a la fecha de liberación

---

### Edición de productos

Los productos pueden editarse desde el menú contextual disponible en cada fila.

Endpoint utilizado:

```text
PUT /bp/products/:id
```

Durante la edición:

- El ID permanece deshabilitado
- Se reutilizan las mismas reglas de validación del formulario de registro
- Los datos actuales del producto son cargados automáticamente

---

### Eliminación de productos

Desde el menú contextual se puede seleccionar la opción de eliminar.

Antes de eliminar se muestra un modal de confirmación.

Endpoint utilizado:

```text
DELETE /bp/products/:id
```

El usuario puede:

- Cancelar la operación
- Confirmar la eliminación

---

## Experiencia de usuario

La aplicación incluye:

- Diseño responsive
- Vista adaptada a dispositivos móviles
- Skeleton de carga
- Estados vacíos
- Mensajes visuales de error
- Mensajes de éxito
- Validaciones visuales de formularios
- Menú contextual reutilizable
- Modal de confirmación reutilizable
- Fallback para imágenes no disponibles
- Navegación mediante Angular Router

---

## Arquitectura

El proyecto está organizado separando responsabilidades entre funcionalidades, servicios, modelos, validadores y componentes reutilizables.

Estructura principal:

```text
src/
└── app/
    ├── core/
    │   ├── models/
    │   ├── services/
    │   ├── validators/
    │   └── interceptors/
    │
    ├── features/
    │   └── products/
    │       └── pages/
    │           ├── product-list/
    │           └── product-form/
    │
    └── shared/
        └── components/
            ├── header/
            ├── skeleton/
            ├── confirm-modal/
            └── contextual-menu/
```

La estructura busca mantener separación de responsabilidades, reutilización de componentes y facilidad de mantenimiento.

---

## Requisitos previos

Para ejecutar el proyecto se recomienda tener instalado:

```text
Node.js
npm
Angular CLI
```

Puede verificar las versiones instaladas mediante:

```bash
node --version
npm --version
ng version
```

---

## Instalación del frontend

Clonar el repositorio:

```bash
git clone https://github.com/Janblack07/banco-financial-products.git
```

Ingresar al proyecto:

```bash
cd banco-financial-products
```

Instalar dependencias:

```bash
npm install
```

---

## Ejecución del backend

La aplicación consume una API REST que debe ejecutarse localmente en:

```text
http://localhost:3002
```

Ingresar al proyecto backend proporcionado para la prueba técnica e instalar sus dependencias:

```bash
npm install
```

Después iniciar el servidor según el comando definido en su `package.json`.

Por ejemplo:

```bash
npm start
```

o:

```bash
npm run start
```

Verificar que el endpoint:

```text
http://localhost:3002/bp/products
```

responda correctamente.

---

## Ejecución del frontend

Con el backend funcionando, ejecutar:

```bash
ng serve
```

La aplicación estará disponible normalmente en:

```text
http://localhost:4200
```

---

## Build de producción

Para generar una compilación optimizada:

```bash
ng build
```

Los archivos generados estarán disponibles en:

```text
dist/banco-financial-products
```

---

## Pruebas unitarias

El proyecto utiliza **Vitest** para pruebas unitarias.

Ejecutar:

```bash
ng test
```

Para ejecutar las pruebas con cobertura:

```bash
ng test --coverage
```

---

## Cobertura de pruebas

Resultado obtenido durante el desarrollo:

```text
Test Files  9 passed (9)
Tests       113 passed (113)
```

Cobertura:

```text
Statements : 85.17%
Branches   : 88.23%
Functions  : 75.78%
Lines      : 87.69%
```

La cobertura supera el mínimo requerido del 70%.

Se incluyen pruebas para:

- ProductService
- ProductForm
- ProductList
- Validadores personalizados
- ContextualMenu
- ConfirmModal
- Header
- Skeleton
- Componente principal de la aplicación

---

## Endpoints utilizados

### Obtener productos

```http
GET http://localhost:3002/bp/products
```

### Crear producto

```http
POST http://localhost:3002/bp/products
```

### Actualizar producto

```http
PUT http://localhost:3002/bp/products/:id
```

### Eliminar producto

```http
DELETE http://localhost:3002/bp/products/:id
```

### Verificar ID

```http
GET http://localhost:3002/bp/products/verification/:id
```

---

## Modelo de producto

Ejemplo de producto financiero:

```json
{
  "id": "visa-gold",
  "name": "Tarjeta Visa Gold",
  "description": "Tarjeta de crédito Visa Gold",
  "logo": "https://www.visa.com.ec/dam/VCOM/regional/lac/SPA/Default/Pay%20With%20Visa/Tarjetas/visa-signature-400x225.jpg",
  "date_release": "2026-11-07",
  "date_revision": "2027-11-07"
}
```

---

## Consideraciones técnicas

Se utilizaron:

- Componentes standalone
- ChangeDetectionStrategy.OnPush
- Angular Signals para estado local
- Reactive Forms
- Validadores síncronos y asíncronos
- RxJS para operaciones asíncronas
- Lazy loading
- Servicios para comunicación HTTP
- Componentes reutilizables
- Diseño responsive
- Manejo visual de errores
- Pruebas unitarias con cobertura superior al 70%

---

## Autor

**Jandry Zambrano**

Desarrollador Full Stack

Ecuador
