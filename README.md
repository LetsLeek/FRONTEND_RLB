
# Project Overview

Dieses Projekt besteht aus einem Angular-Frontend und einem Node.js-Express-Backend.

## Backend

Das Backend ist ein Node.js-Express-Server, der verschiedene APIs bereitstellt.

### Installation

Stelle sicher, dass du die Abhängigkeiten installiert hast:

```bash
cd backend
npm install
```

### Development Server

Starte den Backend-Server mit `nodemon`, um automatisch neu zu laden, wenn sich Dateien ändern:

```bash
npm run dev
```

Der Server läuft auf `http://localhost:8080`.

### API Endpoints

- **Keywords**
  - `GET /api/keywords`: Alle Keywords abrufen
  - `POST /api/keywords`: Ein neues Keyword erstellen

- **Persons**
  - `GET /api/persons`: Alle Personen abrufen

- **Checks**
  - `GET /api/checks`: Alle Checks abrufen
  - `POST /api/checks`: Einen neuen Check erstellen

### Error Handling

Aktiviere das Error Handling, indem du die Middleware einkommentierst:

```javascript
// app.use(errorHandler);
```

## Frontend

Dieses Projekt wurde mit [Angular CLI](https://github.com/angular/angular-cli) Version 18.0.6 generiert.

### Installation

Stelle sicher, dass du die Abhängigkeiten installiert hast:

```bash
cd frontend
npm install
```

### Development Server

Starte den Angular Entwicklungsserver:

```bash
npm start
```

Navigiere zu `http://localhost:4200/`. Die Anwendung wird automatisch neu geladen, wenn du eine der Quelldateien änderst.

### Proxy-Konfiguration

Um sicherzustellen, dass das Angular-Frontend mit dem Node.js-Backend kommunizieren kann, ohne CORS-Probleme zu haben, wird eine Proxy-Konfiguration verwendet. Die Proxy-Einstellungen befinden sich in der Datei `proxy.conf.json`.

### Code Scaffolding

Führe `ng generate component component-name` aus, um eine neue Komponente zu generieren. Du kannst auch `ng generate directive|pipe|service|class|guard|interface|enum|module` verwenden.

### Build

Führe `ng build` aus, um das Projekt zu bauen. Die Build-Artefakte werden im `dist/` Verzeichnis gespeichert. Für den Produktions-Build:

```bash
npm run build:prod
```

### Running Unit Tests

Führe `ng test` aus, um die Unit-Tests über [Karma](https://karma-runner.github.io) auszuführen.

### Running End-to-End Tests

Führe `ng e2e` aus, um die End-to-End Tests über eine Plattform deiner Wahl auszuführen. Um diesen Befehl zu verwenden, musst du zuerst ein Paket hinzufügen, das End-to-End-Testfunktionen implementiert.

### Further Help

Um mehr Hilfe zur Angular CLI zu erhalten, verwende `ng help` oder schaue die [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) Seite an.