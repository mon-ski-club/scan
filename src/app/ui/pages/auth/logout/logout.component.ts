import { Component, inject } from '@angular/core'
import { MatSnackBar } from '@angular/material/snack-bar'
import { AuthService } from '../../../../core/auth/auth.service'
import { MatButtonModule } from '@angular/material/button'
import { MatIconModule } from '@angular/material/icon'

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
  private snackBar = inject(MatSnackBar)

  /**
   * Handle the logout process.
   * If successful, navigates to the login page. Otherwise, displays an error message.
   */
  async onLogout() {
    try {
      this.authService.logout()
      this.showSuccessToast('You have been logged out successfully')
    } catch (error) {
      this.showErrorToast('Logout failed. Please try again.')
    }
  }

  /**
   * Displays a success toast message.
   */
  showSuccessToast(message: string) {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
    })
  }

  /**
   * Displays an error toast message.
   */
  showErrorToast(message: string) {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
    })
  }
}
