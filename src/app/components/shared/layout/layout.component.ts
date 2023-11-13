import { Component } from '@angular/core'
import { RouterOutlet } from '@angular/router'
import { MatToolbarModule } from '@angular/material/toolbar'
import { NavBarComponent } from '../nav-bar/navbar.component'

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, MatToolbarModule, NavBarComponent],
  templateUrl: './layout.component.html',
})
export class LayoutComponent {}
