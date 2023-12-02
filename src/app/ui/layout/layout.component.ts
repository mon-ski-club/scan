import { Component, ViewEncapsulation, effect, inject } from '@angular/core'
import { MatToolbarModule } from '@angular/material/toolbar'
import { MatButtonModule } from '@angular/material/button'
import { MatSidenavModule } from '@angular/material/sidenav'
import { MatListModule } from '@angular/material/list'
import { MatIconModule, MatIconRegistry } from '@angular/material/icon'
import { RouterModule } from '@angular/router'
import { DomSanitizer } from '@angular/platform-browser'
import { LogoutComponent } from '../pages/auth/logout/logout.component'
import { User } from '../../core/auth/auth.type'
import { AuthService } from '../../core/auth/auth.service'
import { CommonModule } from '@angular/common'

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'app-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    LogoutComponent,
  ],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css',
})
export class LayoutComponent {
  isLoggedIn = false
  currentUser: User | null = null

  private authService = inject(AuthService)

  constructor(
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
  ) {
    this.matIconRegistry.addSvgIcon(
      'scan',
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        '../assets/logos/iso-scan.svg',
      ),
    )

    /**
     * Listing for userContext changes
     */
    effect(() => {
      this.currentUser = this.authService.userContext()
      this.isLoggedIn = Boolean(this.currentUser)
    })
  }
}
