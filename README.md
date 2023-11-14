# Scan

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 17.0.0.

## Installation

##### Install dependencies

```bash
# Install dependencies
npm install
```

##### Setup GitHooks (Husky)

```bash
# Install dependencies
npx husky install
```

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

> **Note :**
> New components will be automatically generated under src/app/components
> New services will be automatically generated under src/app/services

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.

## Database server

To run database server for local development purpose:
`docker run -e COUCHDB_USER=admin -e COUCHDB_PASSWORD=secret -p 5984:5984 --name scan-couchdb couchdb`

To enable synchronization with RxDB, enable [CORS](http://localhost:5984/_utils/#_config/nonode@nohost/cors)
