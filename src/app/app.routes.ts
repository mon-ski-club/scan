import { Routes } from '@angular/router'
import { LayoutComponent } from './components/shared/layout/layout.component'
import { HomeComponent } from './components/pages/home/home.component'

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    // All the routes must be wrapped inside the LayoutComponent
    children: [
      // Default to home
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
      },
      {
        path: 'home',
        component: HomeComponent,
      },
    ],
  },
]
