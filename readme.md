# Monorepo - Week 7 - Challenge WeekEnd

- Server Node-TypeScrip-Jest
- Cliente React-redux

## Red social

Crea una red social con **React** que consumirá los datos de una **API** desarrollada con **Express**, conectada a una base de datos en **MongoDB**.
La validación de usuario se implementará mediante **JWT**.

La aplicación **front** sólo se puede usar estando logueado (en abierto únicamente se puede ver login y registro).
Una vez iniciada la sesión, el usuario puede ver un listado de todos los usuarios de la red.

El usuario podrá editar su perfil.

De cada usuario podrá ver su perfil, y podrá añadirlo como amigo o como enemigo (o cambiar entre ambos). Es decir, yo como usuario veo todos los demás usuarios, y además puedo tener una relación con algunos de ellos. Esa relación puede ser de amigo o de enemigo (recuerda: puede no haber relación).

En el listado de usuarios debe poder haber un filtro para enseñar:

- todos los usuarios
- sólo los amigos
- sólo los enemigos

El listado debe mostrar el total de usuarios (o amigos/enemigos si se ha usado el filtro).

## Extra

La API almacenará las imágenes en el propio servidor, enviando una copia al storage de Supabase.

La API mantendrá un log de todas las relaciones, almacenado en un archivo de texto en el servidor. Cada vez que se cree o destruya una relación (de cualquiera de los dos tipos), se debe añadir una línea al log, con uno de estos tres formatos:

```log
New relationship: Luis & Marta (friends)
New relationship: Luis & Marta (enemies)
Removed relationship: Luis & Marta
```

## Install comunes desde un proyecto previo

- typescript
- @types/node

Eslint

- eslint
- eslint-config-xo
- eslint-config-prettier
- @typescript-eslint/eslint-plugin
- @typescript-eslint/parser

Jest

- jest / @types/jest
- ts-jest
- jest-ts-webcompat-resolver

```shell
npm i
```

## Monorepo structure

package.json global

```json
{
  "private": "true",
  "workspaces": [
    "api",
    "app"
  ],
  "dependencies": {
    // dependencias comunes
  },
  "prettier": {
    "singleQuote": true
  }
}
```

### /api (backend)

### Instalaciones desde un proyecto previo

Añadimos dependencias:

- dotenv
- cross-env
- express / @types/express
- morgan / @types/morgan
- cors / @types/cors
- mongoose / @types/mongoose
- debug / @types/debug
- bcryptjs / @types/bcryptjs
- jsonwebtoken / @types/jsonwebtoken

```shell
npm i
```

#### .eslintrc.json

```json
{
  "env": {
    "es2021": true,
    "node": true,
    "jest": true
  },
  "extends": ["xo", "plugin:@typescript-eslint/recommended", "prettier"],
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "ecmaVersion": 12,
    "sourceType": "module"
  },
  "plugins": ["@typescript-eslint"],
  "rules": {}
}
```

#### jest.config.js

```js
/** @type {import('ts-jest').JestConfigWithTsJest} */
export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testPathIgnorePatterns: ['dist'],
  resolver: 'jest-ts-webcompat-resolver',
  collectCoverageFrom: ['src/**/*.ts'],
  coveragePathIgnorePatterns: ['index.ts', 'app.ts', 'routers'],
};
```

#### tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ESNext",
    "module": "ESNext",
    "rootDir": "./src",
    "moduleResolution": "node",
    "outDir": "./dist",
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "strict": true,
    "skipLibCheck": true,
  }
}

```

#### package.json

```json
  "scrits" {},
  "prettier": {}
```

#### folders

/src - index.ts (con contenido)

```ts
  console.log('Sample')
```

/dist

### /app (frontend)

package.json

```json
"scripts": {
    "test:prod": "echo \"No test specified\" && exit 0"
  },
```

#### folders

/src - index.ts (con contenido)

```ts
  console.log('Sample')
```

## Add CI/CD

Nueva rama feature/config

- Husky hooks
- Sonar bind de los 2 proyectos
- GitHub Actions with Audit & SonarCloud

Conexión de los 2 proyectos del repo a SonarCloud

- Action específica en cada proyecto
- Fichero de configuración de Sonar

Creación de la PR

### Acciones

```yml
name: Testing Analysis

on:
  push:
    branches: ['main']
  pull_request:
    types: [opened, synchronize, reopened]
  workflow_dispatch:

jobs:
  Test_api:
    name: Tests API
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
        with:
          fetch-depth: 0 # Shallow clones should be disabled for a better relevancy of analysis
      - name: Install modules
        run: npm ci
      - name: Testing coverage
        run: npm run test:prod #Change for a valid npm script
        working-directory: api
  Test_app:
    name: Tests APP
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
        with:
          fetch-depth: 0 # Shallow clones should be disabled for a better relevancy of analysis
      - name: Install modules
        run: npm ci
      - name: Testing coverage
        run: npm run test:prod #Change for a valid npm script
        working-directory: app
```

```yml

name: SonarCloud Analysis
on:
  push:
    branches:
      - main
  pull_request:
    types: [opened, synchronize, reopened]

permissions:
  pull-requests: read # allows SonarCloud to decorate PRs with analysis results

jobs:
  SonarCloud_api:
    name: SonarCloud API
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
        with:
          fetch-depth: 0 # Shallow clones should be disabled for a better relevancy of analysis
      - name: Install modules
        run: npm ci
      - name: Testing coverage
        run: npm run test:prod #Change for a valid npm script
      - name: SonarCloud Scan
        uses: SonarSource/sonarcloud-github-action@master
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }} # Needed to get PR information, if any
          SONAR_TOKEN: ${{ secrets.SONAR_TOKEN_API }}
        with:
          projectBaseDir: api/
  SonarCloud_app:
    name: SonarCloud APP
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
        with:
          fetch-depth: 0 # Shallow clones should be disabled for a better relevancy of analysis
      - name: Install modules
        run: npm ci
      - name: Testing coverage
        run: npm run test:prod #Change for a valid npm script
        working-directory: app/
      - name: SonarCloud Scan
        uses: SonarSource/sonarcloud-github-action@master
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }} # Needed to get PR information, if any
          SONAR_TOKEN: ${{ secrets.SONAR_TOKEN_APP }}
        with:
          projectBaseDir: app/
```

### /api (backend) - Sonar

```properties
sonar.projectKey=alce65Codersbase_02-social-api
sonar.organization=alce65codersbase

sonar.sources=./src
sonar.test.inclusions=./src/**/*.test.*
sonar.javascript.lcov.reportPaths=coverage/lcov.info
sonar.coverage.exclusions=src/**/*.test.*, src/**/index.*, src/**/main*.*, src/**/__mocks__/**
```



### /app (frontend) - Sonar

```properties
sonar.projectKey=alce65Codersbase_02-social-app
sonar.organization=alce65codersbase

sonar.sources=./src
sonar.test.inclusions=./src/**/*.test.*
sonar.javascript.lcov.reportPaths=coverage/lcov.info
sonar.coverage.exclusions=src/**/*.test.*, src/**/index.*, src/**/main*.*, src/**/__mocks__/**
```
