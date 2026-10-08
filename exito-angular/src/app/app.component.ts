import { Component } from '@angular/core'
import { StorageService } from './auth/components/services/storage/storage.service'
import { Router } from '@angular/router'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'exito-angular'

  isAdminLoggedIn: boolean = StorageService.isAdminLoggedIn()

  constructor(private router: Router) {}

  ngOnInit() {
    this.router.events.subscribe(event => {
      if (event.constructor.name === 'NavigationEnd') {
        this.isAdminLoggedIn = StorageService.isAdminLoggedIn()
      }
    })
  }

  logout() {
    StorageService.logout()
    this.router.navigateByUrl('/login')
  }
}
