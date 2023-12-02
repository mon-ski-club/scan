import { Component, OnInit, inject } from '@angular/core'
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms'
import { Router } from '@angular/router'
import { AuthService } from '../../../../core/auth/auth.service'
import { MatCardModule } from '@angular/material/card'
import { MatInputModule } from '@angular/material/input'
import { LoginRequest } from '../../../../core/auth/auth.type'
import { MatButtonModule } from '@angular/material/button'
import { ToasterService } from '../../../../core/toast/toast.service'

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
  private toasterService = inject(ToasterService)
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
      this.toasterService.open('Already Logged In.')
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
          this.toasterService.open(
            `Logged in successfully ! (${user.name.toUpperCase()} - ${
              user.roles[0] ? user.roles[0].toUpperCase() : null
            })`,
          )
        } else {
          this.toasterService.open(
            'Incorrect login credentials. Please try again.',
          )
        }
      } catch (error) {
        this.toasterService.open('Login failed. Please try again.')
      }
    } else {
      this.toasterService.open('Please fill in all required fields.')
    }
  }
}
