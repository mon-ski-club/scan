import { Component, ViewEncapsulation } from '@angular/core'
import { MatToolbarModule } from '@angular/material/toolbar'
import { MatButtonModule } from '@angular/material/button'
import { MatSidenavModule } from '@angular/material/sidenav'
import { MatListModule } from '@angular/material/list'
import { MatIconModule, MatIconRegistry } from '@angular/material/icon'
import { RouterModule } from '@angular/router'
import { DomSanitizer } from '@angular/platform-browser'

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'app-layout',
  standalone: true,
  imports: [
    RouterModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
  ],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css',
  providers: [],
})
export class LayoutComponent {
  constructor(
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
  ) {
    /* Allow for svg icons from local path */
    this.matIconRegistry.addSvgIcon(
      'scan',
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        '../assets/logos/iso-scan.svg',
      ),
    )
  }
}
