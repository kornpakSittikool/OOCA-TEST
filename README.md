# OOCA-TEST

This repository contains the main backend service in the `service` folder, built with NestJS.

## Service Overview

- Service path: `service`
- Framework: NestJS v11
- Swagger docs path: `/docs`
- Default port: `3000` when `PORT` is not set

## Prerequisites

- Node.js
- npm

## Installation

Install dependencies for the service:

```bash
cd service
npm install
```

## Run The Service

Start normally:

```bash
cd service
npm run start
```

Start in development mode (watch):

```bash
cd service
npm run start:dev
```

## API Access

After the service is running:

- Base URL: `http://localhost:3000`
- Swagger UI: `http://localhost:3000/docs`


## Test Commands

Run unit tests:

```bash
cd service
npm test
```

Run tests in watch mode:

```bash
cd service
npm run test:watch
```

Run coverage:

```bash
cd service
npm run test:cov
```

Run e2e tests:

```bash
cd service
npm run test:e2e
```

## Test Data Reference

Current automated tests are in:

- `service/src/app.service.spec.ts`
- `service/src/app.controller.spec.ts`
- `service/test/app.e2e-spec.ts`

This section follows the example rules used in the tests.

### Business Rules Used In Tests

1. Desk #1: Red 1 set and Green 1 set should calculate to `90`.
2. The same bill with a member card should get `10%` off, so `90` becomes `81`.
3. Orange gets `5%` off only when the total Orange quantity in the same bill is more than `2`.

### Important Note About Orange Test Data

- The service counts total `ORANGE` quantity across the whole bill.
- These two payloads both mean "buy ORANGE 3 sets":

```json
{
  "isMember": false,
  "items": [
    { "menu": "ORANGE", "quantity": 2 },
    { "menu": "ORANGE", "quantity": 1 }
  ]
}
```

```json
{
  "isMember": false,
  "items": [
    { "menu": "ORANGE", "quantity": 3 }
  ]
}
```

- Both payloads get the same `subtotal = 342`.
- The only difference is the response `items` shape.
- Split input (`2 + 1`) returns 2 item rows.
- Single input (`3`) returns 1 item row.

### Case 1: Example Rule 1

Red 1 set and Green 1 set

Input:

```json
{
  "isMember": false,
  "items": [
    { "menu": "RED", "quantity": 1 },
    { "menu": "GREEN", "quantity": 1 }
  ]
}
```

Expected:

- Red totalPrice = `50`
- Green totalPrice = `40`
- subtotal = `90`

### Case 2: Example Rule 2

Red 1 set and Green 1 set with member discount

Input:

```json
{
  "isMember": true,
  "items": [
    { "menu": "RED", "quantity": 1 },
    { "menu": "GREEN", "quantity": 1 }
  ]
}
```

Expected:

- Base subtotal = `90`
- Member discount = `10%`
- subtotal = `81`

### Case 3: Example Rule 3

Orange more than 2 sets in one bill

Input used in current tests:

```json
{
  "isMember": false,
  "items": [
    { "menu": "ORANGE", "quantity": 2 },
    { "menu": "ORANGE", "quantity": 1 }
  ]
}
```

Expected:

- Orange total quantity in the bill = `3`
- Orange discount = `5%`
- First line totalPrice = `228`
- Second line totalPrice = `114`
- subtotal = `342`

### Case 4: Extra Case

Orange more than 2 sets in one bill with member discount

Input:

```json
{
  "isMember": true,
  "items": [
    { "menu": "ORANGE", "quantity": 2 },
    { "menu": "ORANGE", "quantity": 1 }
  ]
}
```

Expected:

- Orange discount = `5%`
- Member discount = `10%` after Orange discount
- subtotal = `307.8`

### Case 5: Boundary Case

Orange exactly 2 sets, so no Orange discount

Input:

```json
{
  "isMember": false,
  "items": [
    { "menu": "ORANGE", "quantity": 2 }
  ]
}
```

Expected:

- No Orange discount because quantity is not more than `2`
- totalPrice = `240`
- subtotal = `240`

### Case 6: Validation Case

Invalid payload

Input:

```json
{
  "isMember": "yes",
  "items": []
}
```

Expected:

- HTTP status = `400`
- message = `Validation failed`

## Useful Commands

Format source files:

```bash
cd service
npm run format
```

Run lint:

```bash
cd service
npm run lint
```
