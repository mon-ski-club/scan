import { APP_INITIALIZER, ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { createDatabase } from './database/database.service';
import { HttpClient, provideHttpClient } from '@angular/common/http';
import { SettingsService } from './settings/settings.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    {
      provide: APP_INITIALIZER,
      useFactory:
        (settingsService: SettingsService, httpClient: HttpClient) => () =>
          createDatabase(settingsService, httpClient),
      multi: true,
      deps: [SettingsService, HttpClient],
    },
  ],
};
