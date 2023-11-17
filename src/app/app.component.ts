import { Component, ViewEncapsulation } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterOutlet } from '@angular/router'
import { DatabaseService } from './core/database/database.service'

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.component.html',
})
export class AppComponent {
  constructor(private databaseService: DatabaseService) {
    /* Initializing Database */
    this.databaseService.initializeDatabase()
  }
}
