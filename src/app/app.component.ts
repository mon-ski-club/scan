import { CommonModule } from '@angular/common'
import { Component, ViewEncapsulation } from '@angular/core'
import { RouterOutlet } from '@angular/router'
import { DatabaseService } from './core/database.service'

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.component.html',
})
export class AppComponent {
  constructor(private databaseService: DatabaseService) {
    this.databaseService.initialize()
  }
}
