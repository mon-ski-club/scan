import { Component, ViewEncapsulation } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterOutlet } from '@angular/router'
import { HttpClientModule } from '@angular/common/http'
import { MatIconModule, MatIconRegistry } from '@angular/material/icon'
import { DomSanitizer } from '@angular/platform-browser'
import { DatabaseService } from './core/database/database.service'

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HttpClientModule, MatIconModule],
  templateUrl: './app.component.html',
})
export class AppComponent {
  constructor(
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
    private databaseService: DatabaseService,
  ) {
    this.matIconRegistry.addSvgIcon(
      'scan',
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        '../assets/logos/iso-scan.svg',
      ),
    )

    /* Initializing Database */
    this.databaseService.initializeDatabase()
  }
}
