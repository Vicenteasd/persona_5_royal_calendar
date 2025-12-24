# Chronos Calendar - Local Setup

You have switched from Vite to the standard Angular CLI.

## 1. Clean Installation
1.  Delete the `node_modules` folder.
2.  Delete `package-lock.json`.
3.  Delete `vite.config.ts`.
4.  Delete `index.tsx`.

## 2. Create Configuration File (CRITICAL)
Create a new file named `angular.json` in the root folder with the following content:

```json
{
  "$schema": "./node_modules/@angular/cli/lib/config/schema.json",
  "version": 1,
  "newProjectRoot": "projects",
  "projects": {
    "chronos-calendar": {
      "projectType": "application",
      "schematics": {
        "@angular/core:component": {
          "style": "css"
        }
      },
      "root": "",
      "sourceRoot": "src",
      "prefix": "app",
      "architect": {
        "build": {
          "builder": "@angular-devkit/build-angular:application",
          "options": {
            "outputPath": "dist/chronos-calendar",
            "index": "src/index.html",
            "browser": "src/main.ts",
            "polyfills": [
              "zone.js"
            ],
            "tsConfig": "tsconfig.json",
            "assets": [
              {
                "glob": "**/*",
                "input": "public"
              },
              "src/favicon.ico",
              "src/assets",
              "sw.js",
              "manifest.json"
            ],
            "styles": [
              "src/styles.css"
            ],
            "scripts": []
          },
          "configurations": {
            "production": {
              "budgets": [
                {
                  "type": "initial",
                  "maximumWarning": "500kB",
                  "maximumError": "1MB"
                },
                {
                  "type": "anyComponentStyle",
                  "maximumWarning": "2kB",
                  "maximumError": "4kB"
                }
              ],
              "outputHashing": "all"
            },
            "development": {
              "optimization": false,
              "extractLicenses": false,
              "sourceMap": true
            }
          },
          "defaultConfiguration": "production"
        },
        "serve": {
          "builder": "@angular-devkit/build-angular:dev-server",
          "configurations": {
            "production": {
              "buildTarget": "chronos-calendar:build:production"
            },
            "development": {
              "buildTarget": "chronos-calendar:build:development"
            }
          },
          "defaultConfiguration": "development"
        }
      }
    }
  }
}
```

## 3. Create Styles File
Create a file named `src/styles.css` (it can be empty).

## 4. Install Dependencies
Run:
```bash
npm install
```

## 5. Run the App
Run:
```bash
npm start
```

Access the app at `http://localhost:4200`.
