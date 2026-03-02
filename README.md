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
