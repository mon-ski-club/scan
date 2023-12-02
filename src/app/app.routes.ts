import { Routes } from '@angular/router'
import { LayoutComponent } from './ui/layout/layout.component'
import { HomeComponent } from './ui/pages/home/home.component'
import { EventListComponent } from './ui/pages/events/event-list/event-list.component'
import { EventDetailsComponent } from './ui/pages/events/event-details/event-details.component'
import { NotFoundComponent } from './ui/pages/not-found/not-found.component'
import { LoginComponent } from './ui/pages/auth/login/login.component'
import { inject } from '@angular/core'
import { AuthService } from './core/auth/auth.service'

/**
 * Ensures that the userContext is in sync on init
 */
const userStateResolver = async () => {
  const authService = inject(AuthService)

  return await authService.verifyUser()
}

export const routes: Routes = [
  {
    path: '',
    resolve: [userStateResolver],
    component: LayoutComponent,
    /* Routes must be wrapped inside the LayoutComponent */
    children: [
      // Default redirect to Home
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
      },

      /* Home */
      {
        path: 'home',
        component: HomeComponent,
      },

      /* Events */
      {
        path: 'events',
        children: [
          // Event List
          {
            path: '',
            component: EventListComponent,
          },
          // Event Details
          {
            path: ':id',
            component: EventDetailsComponent,
          },
        ],
      },

      /* Auth */
      {
        path: 'login',
        component: LoginComponent,
      },

      /* Catch all */
      {
        path: '404',
        component: NotFoundComponent,
      },
      {
        path: '**',
        redirectTo: '404',
        pathMatch: 'full',
      },
    ],
  },
]
