import { APP_INITIALIZER, ApplicationConfig } from '@angular/core'
import { provideRouter } from '@angular/router'

import { routes } from './app.routes'
import { provideDatabase } from './database/database.service'
import { HttpClient, provideHttpClient } from '@angular/common/http'
import { SettingsService } from './settings/settings.service'
import { provideAnimations } from '@angular/platform-browser/animations'

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimations(),
    provideHttpClient(),
    provideDatabase(),
  ],
}
