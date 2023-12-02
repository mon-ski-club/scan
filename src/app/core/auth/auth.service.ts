import { HttpClient } from '@angular/common/http'
import {
  Injectable,
  WritableSignal,
  inject /* signal */,
  signal,
} from '@angular/core'
import { Router } from '@angular/router'
import { LoginRequest, LoginResponse, User, VerifySession } from './auth.type'
import { firstValueFrom } from 'rxjs'
import { environment } from '../../../environments/environment'

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient)
  private router = inject(Router)

  /**
   * UserContext
   * Shared throughout the application
   */
  userContext: WritableSignal<User | null> = signal(null)

  /**
   * Logs in a user and store the authenticated httpOnly cookie
   * Store its informations in localStorage
   * Throw an error if login fails
   */
  async login({ password, username }: LoginRequest): Promise<User | null> {
    try {
      const response = await firstValueFrom(
        this.http.post<LoginResponse>(
          `${environment.DATABASE.rxdbSyncUrl}/_session`,
          `name=${username}&password=${password}`,
          {
            withCredentials: true,
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/x-www-form-urlencoded',
            },
          },
        ),
      )

      if (response.ok) {
        const { ok, ...user } = response
        if (user.name) {
          localStorage.setItem('user', JSON.stringify(user))
          this.setUserSignal(user)
          return user
        } else {
          this.resetUserSignal()
          return null
        }
      } else {
        throw 'CouchDB operation failed'
      }
    } catch (error) {
      throw 'An error has occurred during login. Please try again.'
    }
  }

  /**
   * Logs out a user, remove the authenticated httpOnly cookie
   * Removes its informations from localStorage
   * Redirects to the login page
   * Resets the user roles signals
   * Throws an error if logout fail
   */
  async logout(): Promise<void> {
    try {
      const response = await firstValueFrom(
        this.http.delete<{ ok: boolean }>(
          `${environment.DATABASE.rxdbSyncUrl}/_session`,
          {
            withCredentials: true,
            headers: {
              Accept: 'application/json',
            },
          },
        ),
      )

      if (response.ok) {
        localStorage.removeItem('user')
        this.resetUserSignal()
        this.router.navigate(['/login'])
      } else {
        throw 'CouchDB operation failed'
      }
    } catch (error) {
      throw 'An error has occurred during logout. Please try again.'
    }
  }

  /**
   * Verifies if the user is authenticated
   * Sets the user role based on it's informations
   * Throws an error if verification fails
   */
  async verifyUser(): Promise<boolean> {
    try {
      const response = await firstValueFrom(
        this.http.get<VerifySession>(
          `${environment.DATABASE.rxdbSyncUrl}/_session`,
          {
            withCredentials: true,
            headers: {
              Accept: 'application/json',
            },
          },
        ),
      )

      if (response.ok) {
        const { userCtx: user } = response

        if (user.name) {
          this.setUserSignal(user)
          return true // User is authenticated
        } else {
          localStorage.removeItem('user')
          this.resetUserSignal()
          return false // User is not authenticated
        }
      } else {
        localStorage.removeItem('user')
        this.resetUserSignal()
        throw 'CouchDB operation failed'
      }
    } catch (error) {
      localStorage.removeItem('user')
      this.resetUserSignal()
      return false
    }
  }

  /**
   * Sets the user state
   */
  private setUserSignal(user: User | null): void {
    this.userContext.set(user)
  }

  /**
   * Resets the user state
   */
  private resetUserSignal(): void {
    this.userContext.set(null)
  }
}
