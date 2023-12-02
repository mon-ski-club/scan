import { Component, OnInit, inject } from '@angular/core'
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms'
import { Router } from '@angular/router'
import { MatSnackBar } from '@angular/material/snack-bar'
import { AuthService } from '../../../../core/auth/auth.service'
import { MatCardModule } from '@angular/material/card'
import { MatInputModule } from '@angular/material/input'
import { LoginRequest } from '../../../../core/auth/auth.type'
import { MatButtonModule } from '@angular/material/button'

/**
 * Component responsible for user login.
 */
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
  ],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup

  private fb = inject(FormBuilder)
  private authService = inject(AuthService)
  private snackBar = inject(MatSnackBar)
  private router = inject(Router)

  constructor() {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
    })
  }

  /**
   * Performs initialization logic when the component is created.
   * Checks if the user is already logged in and redirects accordingly.
   */
  async ngOnInit(): Promise<void> {
    const isUserAuthenticated = await this.authService.verifyUser()

    if (isUserAuthenticated) {
      this.router.navigate(['home'])
      this.showSuccessToast('Already Logged In.')
    }
  }

  /**
   * Handles the login process when the login form is submitted.
   * If successful, navigates to the logout page. Otherwise, displays an error message.
   */
  async onLogin() {
    if (this.loginForm.valid) {
      const loginRequest: LoginRequest = this.loginForm.value
      try {
        const user = await this.authService.login(loginRequest)

        if (user) {
          this.router.navigate(['home'])
          this.showSuccessToast(
            `Logged in successfully ! (${user.name.toUpperCase()} - ${
              user.roles[0] ? user.roles[0].toUpperCase() : null
            })`,
          )
        } else {
          this.handleLoginError(
            'Incorrect login credentials. Please try again.',
          )
        }
      } catch (error) {
        this.handleLoginError('Login failed. Please try again.')
      }
    } else {
      this.showErrorToast('Please fill in all required fields.')
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

  /**
   * Handles the actions to be taken on login failure.
   */
  handleLoginError(message: string) {
    this.showErrorToast(message)
  }
}
