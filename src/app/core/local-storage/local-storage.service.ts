import { Injectable } from '@angular/core'

type LocalStorageKeys = 'user'

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  /**
   * Convert an unknown value into a string
   */
  private safeStringify = (value: unknown): string => {
    try {
      const safeValue =
        typeof value === 'string' ? value : JSON.stringify(value)

      return safeValue
    } catch (error) {
      throw new Error('ERROR_WHILE_STRINGIFY')
    }
  }

  /**
   * Returns a typed JSON
   */
  private safeParse = <T>(value: unknown): T => {
    try {
      const typedJson: T = JSON.parse(this.safeStringify(value))

      return typedJson
    } catch (error) {
      throw new Error('ERROR_WHILE_PARSING')
    }
  }

  /**
   * Safely set a localStorage key/value pair from localStorage
   */
  set<T>(key: LocalStorageKeys, value: T): void {
    try {
      if (!value) {
        throw new Error('INCORRECT_VALUE')
      }
      const stringValue =
        typeof value === 'string' ? value : JSON.stringify(value)

      localStorage.setItem(key, stringValue)
    } catch (error) {
      throw new Error('ERROR_WHILE_SETTING_LOCAL_STORAGE_VALUE')
    }
  }

  /**
   * Safely get a value from localStorage
   */
  get<T>(key: LocalStorageKeys): T | null {
    try {
      const value = localStorage.getItem(key)

      if (!value) {
        return null
      }

      return this.safeParse(value)
    } catch (error) {
      throw new Error('ERROR_WHILE_GETTING_LOCAL_STORAGE_VALUE')
    }
  }

  /**
   * Remove a key/value pair from localStorage
   */
  remove(key: LocalStorageKeys): void {
    localStorage.removeItem(key)
  }

  /**
   * Clear localStorage
   */
  clear(): void {
    localStorage.clear()
  }
}
