import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import routes from './app.routes';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideToastr, ToastrModule } from 'ngx-toastr';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(withFetch()),
    provideAnimationsAsync(),
    provideToastr(),
    importProvidersFrom(ToastrModule.forRoot({
      // Optionale Konfigurationen für Toastr
      progressBar: true,
      timeOut: 3000,
      positionClass: 'toast-top-right',
      preventDuplicates: true,
    })),
    // Falls erforderlich: weitere Provider hinzufügen
  ]
};
