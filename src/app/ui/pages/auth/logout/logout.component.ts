import { Component, inject } from '@angular/core'
import { AuthService } from '../../../../core/auth/auth.service'
import { MatButtonModule } from '@angular/material/button'
import { MatIconModule } from '@angular/material/icon'
import { ToasterService } from '../../../../core/toast/toast.service'

/**
 * Component responsible for handling user logout.
 */
@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.css'],
  standalone: true,
  imports: [MatButtonModule, MatIconModule],
})
export class LogoutComponent {
  private authService = inject(AuthService)
  private toaster = inject(ToasterService)

  /**
   * Handle the logout process.
   * If successful, navigates to the login page. Otherwise, displays an error message.
   */
  async onLogout() {
    try {
      this.authService.logout()
      this.toaster.open('You have been logged out successfully')
    } catch (error) {
      this.toaster.open('Logout failed. Please try again.')
    }
  }
}
