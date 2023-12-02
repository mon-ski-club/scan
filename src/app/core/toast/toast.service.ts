import { Injectable, inject } from '@angular/core'
import { MatSnackBar } from '@angular/material/snack-bar'

@Injectable({
  providedIn: 'root',
})
export class ToasterService {
  private snackBar = inject(MatSnackBar)

  open(message: string) {
    this.snackBar.open(message, '❌', { duration: 3000 })
  }
}
